/**
 * YLE Video Words – nơi nhận bài tập của học sinh.
 * Dán toàn bộ đoạn mã này vào Google Apps Script của một Google Sheet (xem README.md, mục 6).
 *
 * BƯỚC BẮT BUỘC: đổi mã bên dưới thành mã của riêng bạn.
 * Đây là mã giáo viên nhập trong app để XEM kết quả. Đừng chia sẻ mã này với học sinh.
 */
const TEACHER_KEY = 'Mrs Tee';

const SHEET_HW = 'BaiTap';
const SHEET_RESULTS = 'KetQua';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (d.type === 'assign') {
      sheet_(ss, SHEET_HW, ['Tạo lúc', 'Mã bài', 'Tên bài', 'Trình độ', 'Chủ đề', 'Số từ', 'Các phần', 'Hạn nộp', 'Link'])
        .appendRow([new Date(), text_(d.id), text_(d.title), text_(d.lv), text_(d.tp), Number(d.n) || 0, text_(d.g), text_(d.due), text_(d.link, 500)]);
    } else if (d.type === 'attempt') {
      const items = Array.isArray(d.items) ? d.items.slice(0, 200) : [];
      const wrong = items.filter(function (x) { return !x.ok; }).map(function (x) { return 'Câu ' + x.n + ': ' + x.w; }).join(', ');
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
  if (p.key !== TEACHER_KEY) return out_({ ok: false, error: 'key' });
  const ss = SpreadsheetApp.getActiveSpreadsheet();
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
  return out_({ ok: true });
}

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
