# YLE Video Words — hướng dẫn cho giáo viên

App học từ vựng Cambridge YLE cho học sinh tiểu học:
- Starters 9 chủ đề, Movers 10 chủ đề, Flyers 9 chủ đề, mỗi chủ đề có từ vựng, câu ví dụ và mẫu câu ngữ pháp.
- Thẻ từ lật, rồi luyện Nghe – Đọc – Nói – Viết; Sổ Từ Vựng ôn theo lịch.
- Trò chuyện với Pip: học sinh **nói** câu trả lời bằng micro.
- Giao bài tập về nhà bằng link, xem ai đã làm, đúng/sai từng câu, xếp hạng.
- Meme động viên, thú cưng Pip, huy hiệu.

---

## 0. Cập nhật kho GitHub đã có (nếu bạn đã làm các bước 1–4 trước đây)

1. Vào kho `YLE-words` trên GitHub → **Add file → Upload files**.
2. Kéo thả **index.html** (bắt buộc) và **README.md** vào → **Commit changes**.
3. **Không** tải đè `config.js`, để giữ mã PIN bạn đã đổi. Khi làm mục 6, bạn sẽ sửa trực tiếp `config.js` trên GitHub.
4. Đợi 1–2 phút rồi mở lại app. Nếu vẫn thấy bản cũ, bấm Ctrl + F5 (máy tính) hoặc đóng hẳn trình duyệt rồi mở lại (điện thoại).

---

## 1. Đưa app lên mạng lần đầu

1. Vào https://github.com, đăng ký tài khoản.
2. **+ → New repository**, đặt tên (ví dụ `YLE-words`), chọn **Public** → **Create repository**.
3. Bấm **uploading an existing file**, kéo thả tất cả tệp trong thư mục này → **Commit changes**.
4. **Settings → Pages**: Source **Deploy from a branch**, Branch **main**, **/ (root)** → **Save**.
5. Nếu tab **Actions** chưa có dòng "pages build and deployment", sửa nhẹ một tệp bất kỳ (ví dụ `config.js`) và **Commit** để GitHub bắt đầu dựng trang.
6. Link app có dạng `https://TÊN-TÀI-KHOẢN.github.io/YLE-words/` (phân biệt chữ hoa/thường).

## 2. Đổi mã PIN khu Giáo viên

Trên GitHub mở `config.js` → ✏️ → sửa số trong `teacherPin` → **Commit changes**. Mã mặc định là 2468.
Mã PIN chỉ để học sinh không vào nhầm khu Giáo viên; người rành máy tính vẫn đọc được mã trong `config.js`.

## 3. Thêm từ vựng của bạn

Tab **Giáo viên → 📚 Nội dung**: tạo chủ đề, dán từ vựng (mỗi dòng `từ | nghĩa | emoji | câu ví dụ | link YouTube`), gắn video nếu muốn.
Sau đó vào **⚙️ Dữ liệu → Tải file content.json**, rồi tải file này lên GitHub (thay file cũ) để mọi học sinh nhận được.

## 4. Học sinh dùng app

- Mở link bằng **Chrome** (Android, máy tính) hoặc **Safari** (iPhone, iPad). Không mở trong Zalo/Facebook vì các app này thường chặn micro.
- Nên bấm **Thêm vào màn hình chính** để mở như một app.
- Lần đầu bấm 🎤, chọn **Cho phép** micro.

## 5. Điều cần biết

- **Nhận giọng nói cần internet.** Chrome gửi giọng đọc tới Google, Safari gửi tới Apple để nhận dạng. App không lưu giọng nói. Nên báo cho phụ huynh.
- **Firefox chưa hỗ trợ nhận giọng nói**: phần Nói chuyển sang chế độ bố mẹ/thầy cô chấm, phần Trò chuyện chuyển sang chạm câu trả lời.
- **Điểm phát âm là gần đúng** (so khớp chữ máy nghe được), chưa phải chấm từng âm vị.
- **Tiến độ, sao, sổ từ lưu trên từng máy.** Đổi máy hoặc xóa dữ liệu trình duyệt thì bắt đầu lại.

---

## 6. Kết nối Google Sheet để nhận bài tập (làm một lần, khoảng 10 phút)

GitHub Pages chỉ chứa trang web, không tự lưu được bài làm. App gửi bài làm của học sinh vào **một Google Sheet của chính bạn**.

**Bước 6.1 – Tạo Google Sheet**
1. Vào https://sheets.google.com → tạo bảng tính trống, đặt tên ví dụ `YLE - Bài tập`.
2. Menu **Tiện ích mở rộng (Extensions) → Apps Script**.

**Bước 6.2 – Dán mã**
1. Xóa hết nội dung có sẵn trong ô soạn mã.
2. Mở tệp `google-apps-script.gs` trong thư mục này bằng Notepad, chép toàn bộ và dán vào.
3. Ở dòng `const TEACHER_KEY = 'doi-ma-nay-thanh-ma-rieng';` đổi phần trong dấu nháy thành **mã xem kết quả** của bạn (ví dụ `coLan-2026`). Ghi nhớ mã này, đừng đưa cho học sinh.
4. Bấm biểu tượng 💾 **Lưu**.

**Bước 6.3 – Triển khai (Deploy)**
1. Bấm **Triển khai (Deploy) → Tùy chọn triển khai mới (New deployment)**.
2. Bấm biểu tượng bánh răng cạnh "Chọn loại" → chọn **Ứng dụng web (Web app)**.
3. **Thực thi dưới dạng (Execute as)**: **Tôi (Me)**.
4. **Ai có quyền truy cập (Who has access)**: **Bất kỳ ai (Anyone)**. Học sinh không có tài khoản Google vẫn nộp được bài.
5. Bấm **Triển khai**, rồi **Cấp quyền truy cập (Authorize access)** → chọn tài khoản Google của bạn.
   Nếu thấy "Google chưa xác minh ứng dụng này": bấm **Nâng cao (Advanced)** → **Đi tới … (không an toàn)**. Đây là đoạn mã của chính bạn, chỉ ghi vào bảng tính của bạn.
6. Sao chép **URL ứng dụng web** (dạng `https://script.google.com/macros/s/…/exec`).

**Bước 6.4 – Dán link vào app**
1. Trên GitHub mở `config.js` → ✏️.
2. Dán link vào giữa hai dấu ngoặc kép ở dòng `resultsUrl: ""`. Nếu `config.js` của bạn chưa có dòng này, thêm dòng sau vào trước dấu `};` (nhớ dấu phẩy ở cuối dòng `teacherPin`):
   ```
   resultsUrl: "https://script.google.com/macros/s/…/exec"
   ```
3. **Commit changes**, đợi 1–2 phút.
4. Mở app → **Giáo viên → 📮 Bài tập**. Nếu không còn dòng cảnh báo "Chưa kết nối Google Sheet" là xong.

Lưu ý: nếu sau này bạn sửa đoạn mã Apps Script, phải **Triển khai → Quản lý bản triển khai → ✏️ → Phiên bản mới** thì thay đổi mới có hiệu lực, và link giữ nguyên.

## 7. Giao bài tập về nhà

1. **Giáo viên → 📮 Bài tập → Giao bài mới**: chọn trình độ, chủ đề, số từ, các phần (Thẻ, Nghe, Đọc, Nói, Viết), tên bài, hạn nộp.
   Với Starters, phần Viết mặc định bỏ chọn vì nhiều bạn chưa viết được.
2. Bấm **Tạo link bài tập** → **Sao chép link** → gửi vào nhóm lớp (Zalo…). Nhắc học sinh mở link bằng Chrome hoặc Safari.
3. Học sinh mở link, nhập tên gọi và lớp, làm bài. Khi xong, app tự nộp. Nếu mất mạng, bài sẽ tự gửi lại khi có mạng.
4. Xem kết quả: **📮 Bài tập → 📊 Kết quả** (lần đầu nhập **mã xem kết quả** ở bước 6.2):
   - Số bạn đã vào, đã nộp, tỉ lệ đúng trung bình.
   - Mỗi bạn: thứ tự vào làm bài, hạng, số câu đúng, thời gian làm. Chạm vào tên để xem từng câu đúng ✓ / sai ✗.
   - Danh sách câu nhiều bạn sai nhất để ôn lại trên lớp.
5. Toàn bộ dữ liệu cũng nằm trong Google Sheet của bạn (trang tính **BaiTap** và **KetQua**), có thể lọc, sắp xếp hoặc in.

Về dữ liệu học sinh: app chỉ thu **tên gọi, lớp và kết quả bài làm**, lưu trong Google Sheet của bạn. Không cần và không nên nhập họ tên đầy đủ, địa chỉ hay số điện thoại của học sinh.
