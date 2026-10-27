LỤA. — DRAFT WEBSITE / NHÓM 7
Website bán quần áo nữ, làm theo mockup và style guide Lụa. trong Figma.
Link: https://hoanglinh1038.github.io/luashop/

CÁC TRANG (13 trang)
Trang mua sắm (việc 9, 10 – Ngọc Giáp)
- index.html: Home (banner, 3 danh mục, Hàng mới về, ưu đãi, Về chúng tôi, hỗ trợ chọn size)
- all-products.html, top.html, bottom.html, dress.html: danh mục, lọc size/màu/giá, sắp xếp
- Tìm kiếm: all-products.html?q=từ-khoá (ô tìm kiếm trên header)
- Quick add: bấm "+ Thêm vào giỏ" hoặc ảnh sản phẩm để chọn size, màu, số lượng

Giỏ hàng, thanh toán, thông tin, tài khoản (việc 11, 12 – Anh Tú)
- cart.html: Giỏ hàng. Đổi số lượng, xoá, thanh tiến độ miễn phí giao hàng, mã giảm giá, gợi ý khi giỏ trống
- checkout.html: Thanh toán 4 bước (liên hệ, địa chỉ, vận chuyển, thanh toán), báo lỗi từng ô, màn Đặt hàng thành công
- about.html: About Us (giới thiệu, giá trị, Lookbook Thu 2026)
- contact.html: Liên hệ (thông tin cửa hàng, bản đồ minh hoạ, form gửi tin nhắn)
- faq.html: Câu hỏi thường gặp, có ô tìm câu hỏi
- profile.html: Hồ sơ cá nhân, số đo và gợi ý size theo bảng size
- orders.html: Đơn hàng của tôi, lọc theo trạng thái, theo dõi tiến trình, xem chi tiết, Mua lại
- address.html: Sổ địa chỉ: thêm, sửa, xoá, đặt mặc định

FILE
- style.css: màu, chữ, nút theo style guide (nền #FFFBFA, chữ #3A2430, nút #C2456E, viền #E2C8C3, Playfair Display + Be Vietnam Pro)
- app.js: phần dùng chung mọi trang: 12 sản phẩm, header, Quick add, xem nhanh giỏ hàng, yêu thích
- pages.js: 8 trang của Anh Tú (chỉ chạy trên các trang đó)
- images/: ảnh chụp quần áo (p01–p12 là ảnh sản phẩm, hero/about/cat-*/promo là ảnh trang chủ)

DỮ LIỆU (lưu trong localStorage của trình duyệt, chưa có máy chủ)
- lua_cart_v1: giỏ hàng, mảng [{id, name, category, price, image, sizes, colors, size, color, quantity}]. Một dòng = id + size + màu.
- lua_wish_v1: danh sách yêu thích (mảng id sản phẩm)
- lua_coupon_v1: mã giảm giá đang áp dụng. Mã dùng được: LUA10 (giảm 10%)
- lua_profile_v1, lua_addr_v1, lua_orders_v1: hồ sơ, sổ địa chỉ, đơn hàng
- Lần đầu mở web sẽ có tài khoản mẫu "Trần Mai Anh" với 2 địa chỉ và 2 đơn hàng cũ (giống mockup).
  Trước khi thuyết trình, vào Profile/Orders/Address bấm "Đặt lại dữ liệu mẫu" (bấm 2 lần) để về dữ liệu mẫu.

QUY TẮC TÍNH TIỀN
- Giao tiêu chuẩn: miễn phí cho đơn từ 499.000đ (tính trên tạm tính), dưới mức này 30.000đ, nhận sau 2–3 ngày
- Giao hoả tốc: 35.000đ, nhận trong ngày, chỉ cho địa chỉ ở TP. Hồ Chí Minh
- Mã LUA10 giảm 10% tạm tính
- Thanh toán: COD, chuyển khoản, ví điện tử, thẻ. Đây là bản nháp nên không nhập số thẻ và không thu tiền thật.

CHẠY THỬ
- Mở bằng VS Code Live Server, hoặc xem trên link GitHub Pages.
- Mở file trực tiếp (file://) vẫn chạy được; một số trình duyệt có thể không lưu giỏ hàng khi mở kiểu này.
- Font Google cần Internet; khi offline tự dùng Georgia/Arial.
- Ô đăng ký email, hộp nhận mã và form Liên hệ là bản demo, chưa gửi email thật.

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
