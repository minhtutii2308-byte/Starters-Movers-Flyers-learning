/**
 * YLE Video Words – nơi nhận bài tập của học sinh.
 * Dán toàn bộ đoạn mã này vào Google Apps Script của một Google Sheet (xem README.md, mục 6).
 *
 * BƯỚC BẮT BUỘC: đổi mã bên dưới thành mã của riêng bạn.
 * Đây là mã giáo viên nhập trong app để XEM kết quả. Đừng chia sẻ mã này với học sinh.
 */
const TEACHER_KEY = 'doi-ma-nay-thanh-ma-rieng';

const SHEET_HW = 'BaiTap';
const SHEET_RESULTS = 'KetQua';
const SHEET_USERS = 'HocSinh';   // mỗi máy học sinh một dòng: sao, chuỗi ngày học, lượt mở app
const SHEET_VISITS = 'TruyCap';  // mỗi máy mỗi ngày một dòng, để đếm lượt truy cập theo ngày

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (d.type === 'assign') {
      sheet_(ss, SHEET_HW, ['Tạo lúc', 'Mã bài', 'Tên bài', 'Trình độ', 'Chủ đề', 'Số từ', 'Các phần', 'Hạn nộp', 'Link'])
        .appendRow([new Date(), text_(d.id), text_(d.title), text_(d.lv), text_(d.tp), Number(d.n) || 0, text_(d.g), text_(d.due), text_(d.link, 500)]);
    } else if (d.type === 'ping') {
      ping_(ss, d);
    } else if (d.type === 'attempt') {
      const items = Array.isArray(d.items) ? d.items.slice(0, 200) : [];
      const wrong = items.filter(function (x) { return !x.ok; }).map(function (x) { return (x.nles > 1 ? 'Bài ' + x.les + ' ' : '') + 'câu ' + x.n + ': ' + x.w; }).join(', ');
      sheet_(ss, SHEET_RESULTS, ['Thời gian', 'Mã bài', 'Mã lượt', 'Tên', 'Lớp', 'Trạng thái', 'Đúng', 'Tổng', 'Số giây', 'Câu sai', 'Chi tiết'])
        .appendRow([new Date(Number(d.ts) || Date.now()), text_(d.hw), text_(d.sid), text_(d.name, 40), text_(d.cls, 20), d.status === 'done' ? 'done' : 'start',
          Number(d.score) || 0, Number(d.total) || 0, Number(d.seconds) || 0, text_(wrong, 2000), JSON.stringify(items)]);
    }
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: 'bad_request' });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  const p = e.parameter || {};
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  // Bảng vàng: ai cũng xem được, chỉ trả về tên gọi và số sao.
  if (p.action === 'top') {
    const all = users_(ss).filter(function (u) { return u.name; }).sort(function (a, b) { return b.stars - a.stars; });
    let yourRank = 0;
    all.forEach(function (u, i) { if (p.dev && u.dev === p.dev) yourRank = i + 1; });
    return out_({ ok: true, yourRank: yourRank, items: all.slice(0, 6).map(function (u) {
      return { name: String(u.name).slice(0, 20), stars: u.stars, you: !!p.dev && u.dev === p.dev };
    }) });
  }
  if (p.key !== TEACHER_KEY) return out_({ ok: false, error: 'key' });
  if (p.action === 'list') {
    const sh = ss.getSheetByName(SHEET_HW);
    const v = sh ? sh.getDataRange().getValues().slice(1) : [];
    return out_({ ok: true, items: v.map(function (r) {
      return { created: +new Date(r[0]), id: String(r[1]), title: r[2], lv: r[3], tp: r[4], n: r[5], g: r[6], due: String(r[7]), link: r[8] };
    }) });
  }
  if (p.action === 'results') {
    const sh = ss.getSheetByName(SHEET_RESULTS);
    const v = sh ? sh.getDataRange().getValues().slice(1) : [];
    return out_({ ok: true, rows: v.filter(function (r) { return String(r[1]) === String(p.hw); }).map(function (r) {
      return { ts: +new Date(r[0]), hw: String(r[1]), sid: String(r[2]), name: String(r[3]).replace(/^'/, ''), cls: String(r[4]).replace(/^'/, ''),
        status: r[5], score: r[6], total: r[7], seconds: r[8], items: json_(r[10]) };
    }) });
  }
  if (p.action === 'students') {
    const daily = {};
    const vs = ss.getSheetByName(SHEET_VISITS);
    if (vs) vs.getDataRange().getValues().slice(1).forEach(function (r) { const k = String(r[0]); daily[k] = (daily[k] || 0) + 1; });
    return out_({ ok: true, daily: daily, students: users_(ss).map(function (u) {
      return { name: u.name, cls: u.cls, stars: u.stars, streak: u.streak, best: u.best, freeze: u.freeze, first: u.first, last: u.last,
        lastDay: u.lastDay, streakDay: u.streakDay, opens: u.opens, days: u.days };
    }) });
  }
  return out_({ ok: true });
}

// Ghi nhận một máy học sinh: cập nhật sao, chuỗi ngày học; đếm lượt mở và số ngày vào app.
function ping_(ss, d) {
  const dev = String(d.dev || '').replace(/[^a-z0-9]/gi, '').slice(0, 24);
  if (!dev) return;
  const sh = sheet_(ss, SHEET_USERS, ['Mã máy', 'Tên', 'Lớp', 'Sao', 'Chuỗi', 'Kỷ lục', 'Đóng băng', 'Lần đầu', 'Lần cuối', 'Ngày cuối', 'Ngày học cuối', 'Số lượt mở', 'Số ngày vào']);
  const day = dayNum_(d.day), sday = dayNum_(d.last), now = new Date();
  const ids = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues() : [];
  let row = -1;
  for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === dev) { row = i + 2; break; }
  if (row < 0) {
    sh.appendRow([dev, text_(d.name, 40), text_(d.cls, 20), Number(d.stars) || 0, Number(d.streak) || 0, Number(d.best) || 0, Number(d.freeze) || 0, now, now, day, sday, d.open ? 1 : 0, 1]);
    if (day) sheet_(ss, SHEET_VISITS, ['Ngày', 'Mã máy']).appendRow([day, dev]);
    return;
  }
  const r = sh.getRange(row, 1, 1, 13).getValues()[0];
  const newDay = day && Number(r[9]) !== day;
  sh.getRange(row, 2, 1, 12).setValues([[text_(d.name, 40) || r[1], text_(d.cls, 20), Number(d.stars) || 0, Number(d.streak) || 0,
    Math.max(Number(d.best) || 0, Number(r[5]) || 0), Number(d.freeze) || 0, r[7], now, day || r[9], sday || r[10],
    (Number(r[11]) || 0) + (d.open ? 1 : 0), (Number(r[12]) || 0) + (newDay ? 1 : 0)]]);
  if (newDay) sheet_(ss, SHEET_VISITS, ['Ngày', 'Mã máy']).appendRow([day, dev]);
}
function users_(ss) {
  const sh = ss.getSheetByName(SHEET_USERS);
  if (!sh || sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, 13).getValues().map(function (r) {
    return { dev: String(r[0]), name: String(r[1]).replace(/^'/, ''), cls: String(r[2]).replace(/^'/, ''), stars: Number(r[3]) || 0, streak: Number(r[4]) || 0,
      best: Number(r[5]) || 0, freeze: Number(r[6]) || 0, first: +new Date(r[7]), last: +new Date(r[8]), lastDay: Number(r[9]) || 0, streakDay: Number(r[10]) || 0,
      opens: Number(r[11]) || 0, days: Number(r[12]) || 0 };
  });
}
// '2026-11-09' -> 20261109 (lưu dạng số để Google Sheet không tự đổi thành ngày tháng)
function dayNum_(s) { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '')); return m ? Number(m[1] + m[2] + m[3]) : 0; }

function sheet_(ss, name, head) {
  let sh = ss.getSheetByName(name);
  if (!sh) { sh = ss.insertSheet(name); sh.appendRow(head); sh.setFrozenRows(1); }
  return sh;
}
// Cắt độ dài và chặn chữ bắt đầu bằng = + - @ để Google Sheet không hiểu nhầm thành công thức.
function text_(s, max) {
  s = String(s == null ? '' : s).slice(0, max || 100);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
function json_(s) { try { return JSON.parse(s); } catch (e) { return []; } }
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
