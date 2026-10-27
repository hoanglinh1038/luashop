LỤA. — TRANG MUA SẮM (VIỆC 10, NGỌC GIÁP) / NHÓM 7
Bản sửa theo mockup và style guide Lụa. trong Figma.

CÁC TRANG
- index.html: Home (banner, 3 danh mục, Hàng mới về, ưu đãi, Về chúng tôi, hỗ trợ chọn size)
- all-products.html, top.html, bottom.html, dress.html: danh mục sản phẩm
- Tìm kiếm: all-products.html?q=từ-khoá (ô tìm kiếm trên header)
- Quick add: bấm "+ Thêm vào giỏ" hoặc bấm vào ảnh sản phẩm để chọn size, màu, số lượng

FILE
- style.css: màu, chữ, nút theo style guide (nền #FFFBFA, chữ #3A2430, nút #C2456E, viền #E2C8C3, Playfair Display + Be Vietnam Pro)
- app.js: dữ liệu 12 sản phẩm theo mockup, lọc size/màu/giá, sắp xếp, tìm kiếm, Quick add, xem nhanh giỏ hàng, yêu thích
- images/: hình minh hoạ quần áo dạng SVG giống mockup (p01–p12 là ảnh sản phẩm)

GHÉP VỚI PHẦN CỦA ANH TÚ (VIỆC 11, 12)
- Giỏ hàng vẫn lưu ở localStorage, key "lua_cart_v1", mảng JSON:
  [{id, name, category, price, image, sizes, colors, size, color, quantity}]
  Giá là số VND. Một dòng = id + size + color. Cấu trúc giữ nguyên như bản trước.
- Danh sách yêu thích: key "lua_wish_v1", mảng id sản phẩm.
- Đặt tên file trang của Anh Tú như sau thì link trên menu, footer, giỏ hàng tự hiện ra (chưa có file thì link tự ẩn):
  cart.html, checkout.html, about.html, contact.html, faq.html, profile.html, orders.html, address.html
  Muốn đổi tên file thì sửa mục PAGES ở đầu app.js.
- Mã giảm giá hiện trong hộp "Thành viên mới": LUA10 (giảm 10%). Trang Checkout cần nhận mã này.
- Miễn phí giao hàng cho đơn từ 499.000đ (FREE_SHIP trong app.js).

CHẠY THỬ
- Mở bằng VS Code Live Server, hoặc xem trên link GitHub Pages.
- Mở file trực tiếp (file://) vẫn xem được, nhưng link tới trang của Anh Tú sẽ ẩn và trình duyệt có thể không lưu giỏ hàng.
- Font Google cần Internet; khi offline tự dùng Georgia/Arial.
- Ô đăng ký email và hộp nhận mã là bản demo, chưa gửi email thật.

ĐƯA LÊN GITHUB PAGES
- Chép toàn bộ thư mục này đè lên repo lua-shop, xoá 4 ảnh cũ images/0.jpg, 1.jpg, 2.jpg, 3.jpg, rồi commit và push.
- Settings > Pages chọn nhánh chứa index.html.
