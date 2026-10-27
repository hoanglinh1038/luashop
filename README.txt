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
- images/: ảnh chụp quần áo (p01–p12 là ảnh sản phẩm, hero/about/cat-*/promo là ảnh trang chủ)

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
- Chép toàn bộ thư mục này đè lên repo rồi commit và push.
- Settings > Pages chọn nhánh chứa index.html.

ẢNH
Toàn bộ ảnh lấy từ Unsplash (unsplash.com), giấy phép Unsplash: dùng miễn phí, không bắt buộc ghi nguồn.
Ảnh đã được cắt lại theo tỉ lệ khung trên web. Ảnh gốc:
p01 photo-1775234576198-a1c680241c07 · p02 photo-1776633733518-d81137214dc9 · p03 photo-1577660002965-04865592fc60
p04 photo-1785354985994-ca7f1e3f316b · p05 photo-1687825515654-23620796760c · p06 photo-1762343041573-aa2827852bc9
p07 photo-1683126257977-5142e52acc7e · p08 photo-1789110853398-539d78dd63bc · p09 photo-1473286835901-04adb1afab03
p10 photo-1762154057377-cc9d3dd6900c · p11 photo-1777713272516-e7b2216fe15e · p12 photo-1789110853872-f416085557fa
hero photo-1664333570948-cb94f2985827 · about photo-1490481651871-ab68de25d43d · promo photo-1529635457390-aa69ba54d77d
cat-top photo-1764271692129-767f58952c26 · cat-bottom photo-1789110520410-4fce7246f844 · cat-dress photo-1640923160720-35dddb6348ab
(mở bằng https://images.unsplash.com/<mã ảnh>)
