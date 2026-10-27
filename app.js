/* Lụa. – Nhóm 7 · Phần dùng chung cho mọi trang (việc 9, 10: header, Quick add, giỏ hàng nhanh, yêu thích)
   Giỏ hàng lưu trong localStorage, key "lua_cart_v1". pages.js (việc 11, 12) đọc cùng key cho Shopping Cart và Checkout. */
'use strict';

const CART_KEY = 'lua_cart_v1';
const WISH_KEY = 'lua_wish_v1';
const FREE_SHIP = 499000;

const COLORS = { 'Đen': '#231A1F', 'Trắng kem': '#F3ECE2', 'Be': '#D8C3A1', 'Xanh rêu': '#5E6B3C', 'Hồng': '#E4A3B4', 'Xanh jean': '#8EAAC4', 'Vàng': '#E3B23C', 'Cam đất': '#C4664C' };
const CATEGORY_WORDS = { top: 'áo top', bottom: 'bottom', dress: 'đầm váy dress' };
const PRICE_RANGES = { lt300: [0, 299999], mid: [300000, 500000], gt500: [500001, Infinity] };
const PRICE_LABELS = { lt300: 'Dưới 300.000đ', mid: '300.000đ – 500.000đ', gt500: 'Trên 500.000đ' };
const ALL_SIZES = ['S', 'M', 'L', 'XL'];

/* 12 sản phẩm theo mockup, xếp theo thứ tự "Mới nhất". Giá là số VND. */
const PRODUCTS = [
  { id: 'lua-1', name: 'Áo thun cotton basic', category: 'top', price: 249000, image: 'images/p01.jpg', sizes: ALL_SIZES, colors: ['Hồng', 'Trắng kem', 'Đen'], badge: 'Mới' },
  { id: 'lua-9', name: 'Đầm maxi cổ bèo', category: 'dress', price: 559000, image: 'images/p09.jpg', sizes: ALL_SIZES, colors: ['Hồng', 'Be', 'Đen'] },
  { id: 'lua-5', name: 'Quần tây ống suông', category: 'bottom', price: 489000, image: 'images/p05.jpg', sizes: ALL_SIZES, colors: ['Xanh rêu', 'Đen', 'Be'] },
  { id: 'lua-2', name: 'Sơ mi linen tay dài', category: 'top', price: 459000, image: 'images/p02.jpg', sizes: ALL_SIZES, colors: ['Trắng kem', 'Be', 'Xanh rêu'] },
  { id: 'lua-6', name: 'Chân váy midi xếp ly', category: 'bottom', price: 399000, image: 'images/p06.jpg', sizes: ALL_SIZES, colors: ['Trắng kem', 'Đen', 'Be'], badge: 'Mới' },
  { id: 'lua-10', name: 'Đầm hoa nhí xếp tầng', category: 'dress', price: 599000, oldPrice: 699000, image: 'images/p10.jpg', sizes: ALL_SIZES, colors: ['Trắng kem', 'Hồng', 'Be'] },
  { id: 'lua-3', name: 'Áo khoác denim', category: 'top', price: 690000, oldPrice: 790000, image: 'images/p03.jpg', sizes: ALL_SIZES, colors: ['Xanh jean', 'Đen', 'Be'] },
  { id: 'lua-7', name: 'Quần jean ống rộng', category: 'bottom', price: 529000, image: 'images/p07.jpg', sizes: ALL_SIZES, colors: ['Xanh jean', 'Đen', 'Be'] },
  { id: 'lua-11', name: 'Đầm lụa hai dây', category: 'dress', price: 649000, image: 'images/p11.jpg', sizes: ALL_SIZES, colors: ['Trắng kem', 'Đen', 'Hồng'], badge: 'Mới' },
  { id: 'lua-4', name: 'Áo polo dệt kim', category: 'top', price: 329000, image: 'images/p04.jpg', sizes: ['S', 'M', 'L'], colors: ['Vàng', 'Be', 'Đen'] },
  { id: 'lua-8', name: 'Chân váy chữ A', category: 'bottom', price: 349000, image: 'images/p08.jpg', sizes: ['S', 'M', 'L'], colors: ['Đen', 'Be', 'Xanh rêu'] },
  { id: 'lua-12', name: 'Đầm sơ mi thắt eo', category: 'dress', price: 579000, image: 'images/p12.jpg', sizes: ALL_SIZES, colors: ['Cam đất', 'Be', 'Đen'] }
];
const NEW_ARRIVALS = ['lua-11', 'lua-2', 'lua-6', 'lua-3'];

const HEART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/></svg>';

/* ---------- Tiện ích ---------- */
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const money = n => n.toLocaleString('vi-VN') + 'đ';
const byId = id => PRODUCTS.find(p => p.id === id);
const plain = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase();
const clampQty = v => Math.min(99, Math.max(1, parseInt(v, 10) || 1));
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const write = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };
const page = document.body.dataset.page;

/* ---------- Giỏ hàng ---------- */
/* Một dòng giỏ hàng: {id, name, category, price, image, sizes, colors, size, color, quantity} */
function cartItem(p, size, color, quantity) {
  return { id: p.id, name: p.name, category: p.category, price: p.price, image: p.image, sizes: p.sizes, colors: p.colors, size, color, quantity };
}

function loadCart() {
  const saved = read(CART_KEY, []);
  if (!Array.isArray(saved)) return [];
  return saved.flatMap(x => {
    const p = x && byId(x.id);
    const ok = p && Number.isInteger(x.quantity) && x.quantity >= 1 && x.quantity <= 99 && p.sizes.includes(x.size) && p.colors.includes(x.color);
    return ok ? [cartItem(p, x.size, x.color, x.quantity)] : [];
  });
}

let cart = loadCart();
const cartCount = () => cart.reduce((n, x) => n + x.quantity, 0);
const cartTotal = () => cart.reduce((n, x) => n + x.price * x.quantity, 0);

function showCount() {
  const n = cartCount();
  $$('[data-cart-count]').forEach(el => { el.textContent = n; el.classList.toggle('zero', n === 0); });
}

function saveCart() {
  const ok = write(CART_KEY, cart);
  showCount();
  document.dispatchEvent(new CustomEvent('lua:cart')); // trang Giỏ hàng, Thanh toán vẽ lại khi giỏ thay đổi
  return ok;
}

/* ---------- Yêu thích ---------- */
let wish = read(WISH_KEY, []);
if (!Array.isArray(wish)) wish = [];
wish = wish.filter(id => byId(id));

function toggleWish(id) {
  wish = wish.includes(id) ? wish.filter(x => x !== id) : [...wish, id];
  write(WISH_KEY, wish);
  const on = wish.includes(id);
  $$(`.heart[data-wish="${id}"]`).forEach(b => { b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
  if ($('#wish').open) renderWish();
}

/* ---------- Thẻ sản phẩm ---------- */
function priceHTML(p) {
  return p.oldPrice ? `<span class="sale">${money(p.price)}</span> <del>${money(p.oldPrice)}</del>` : money(p.price);
}

function card(p) {
  const on = wish.includes(p.id);
  const badge = p.oldPrice
    ? `<span class="badge sale">-${Math.round((1 - p.price / p.oldPrice) * 100)}%</span>`
    : p.badge ? `<span class="badge">${p.badge}</span>` : '';
  return `<article class="card">
    <div class="card-media">
      <button type="button" class="card-img" data-quick="${p.id}" aria-label="Chọn size cho ${p.name}"><img src="${p.image}" alt="${p.name}" width="720" height="960" loading="lazy"></button>
      ${badge}
      <button type="button" class="heart${on ? ' on' : ''}" data-wish="${p.id}" aria-pressed="${on}" aria-label="Yêu thích ${p.name}">${HEART}</button>
    </div>
    <p class="card-cat">${p.category}</p>
    <h3 class="card-name">${p.name}</h3>
    <p class="card-price">${priceHTML(p)}</p>
    <div class="dots" aria-label="Màu: ${p.colors.join(', ')}">${p.colors.map(c => `<span style="--c:${COLORS[c]}" title="${c}"></span>`).join('')}</div>
    <button type="button" class="btn btn-line" data-quick="${p.id}">+ Thêm vào giỏ</button>
  </article>`;
}

/* ---------- Trang chủ: Hàng mới về ---------- */
const newGrid = $('#newGrid');
if (newGrid) newGrid.innerHTML = NEW_ARRIVALS.map(id => card(byId(id))).join('');

/* ---------- Trang danh mục: lọc, sắp xếp, tìm kiếm ---------- */
const listEl = $('#listing');
if (listEl) setupListing();

function setupListing() {
  const category = page === 'all-products' ? '' : page;
  const state = { size: '', color: '', price: '', sort: 'new', q: (new URLSearchParams(location.search).get('q') || '').trim().slice(0, 60) };
  const step = () => (matchMedia('(max-width: 900px)').matches ? 8 : 9);
  let limit = step();

  if (state.q) {
    $('#pageTitle').textContent = 'Tìm kiếm';
    $('#pageEyebrow').textContent = 'Shop · Tìm kiếm';
    $('#crumbLast').textContent = 'Tìm kiếm';
    $('#subTitle').textContent = 'Tìm kiếm';
    $('#searchTerm').textContent = state.q;
    $('#searchNote').hidden = false;
    document.title = `Tìm “${state.q}” · Lụa.`;
  }

  function filtered() {
    const range = PRICE_RANGES[state.price];
    const q = plain(state.q);
    const list = PRODUCTS.filter(p =>
      (!category || p.category === category) &&
      (!state.size || p.sizes.includes(state.size)) &&
      (!state.color || p.colors.includes(state.color)) &&
      (!range || (p.price >= range[0] && p.price <= range[1])) &&
      (!q || plain(`${p.name} ${CATEGORY_WORDS[p.category]}`).includes(q)));
    if (state.sort === 'asc') list.sort((a, b) => a.price - b.price);
    if (state.sort === 'desc') list.sort((a, b) => b.price - a.price);
    return list;
  }

  function render() {
    const list = filtered();
    listEl.innerHTML = list.length
      ? list.slice(0, limit).map(card).join('')
      : '<div class="empty"><p>Không có sản phẩm phù hợp.</p><button type="button" class="btn btn-line btn-sm" data-clear>Xoá bộ lọc</button></div>';
    $('#resultCount').textContent = `${list.length} sản phẩm`;
    $('#more').hidden = limit >= list.length;
    const parts = [];
    if (state.size) parts.push(`Size ${state.size}`);
    if (state.color) parts.push(`Màu ${state.color}`);
    if (state.price) parts.push(PRICE_LABELS[state.price]);
    $('#activeFilters').textContent = parts.length ? `Đang lọc: ${parts.join(' · ')}` : `Hiển thị ${Math.min(limit, list.length)} / ${list.length} sản phẩm`;
    $$('[data-size]').forEach(b => b.setAttribute('aria-pressed', b.dataset.size === state.size));
    $$('[data-color]').forEach(b => b.setAttribute('aria-pressed', b.dataset.color === state.color));
    $$('input[name="price"]').forEach(r => { r.checked = r.value === state.price; });
  }

  const refilter = () => { limit = step(); render(); };

  document.addEventListener('click', e => {
    const size = e.target.closest('[data-size]');
    if (size) { state.size = state.size === size.dataset.size ? '' : size.dataset.size; refilter(); }
    const color = e.target.closest('[data-color]');
    if (color) { state.color = state.color === color.dataset.color ? '' : color.dataset.color; refilter(); }
    if (e.target.closest('[data-clear]')) { state.size = state.color = state.price = ''; refilter(); }
  });
  $$('input[name="price"]').forEach(r => {
    // Bấm lại vào mức giá đang chọn thì bỏ chọn
    r.addEventListener('click', () => { if (state.price === r.value) { state.price = ''; refilter(); } });
    r.addEventListener('change', () => { state.price = r.value; refilter(); });
  });
  $('#sort').addEventListener('change', e => { state.sort = e.target.value; render(); });
  $('#more').addEventListener('click', () => { limit += step(); render(); });
  render();
}

$$('input[name="q"]').forEach(input => { input.value = new URLSearchParams(location.search).get('q') || ''; });

/* ---------- Hộp thoại ---------- */
const STACKED = ['sizeGuide']; // mở chồng lên hộp đang mở (ví dụ bảng size trên Quick add)

function openDialog(id) {
  const d = document.getElementById(id);
  if (!d) return;
  if (!STACKED.includes(id)) $$('dialog[open]').forEach(x => { if (x !== d) x.close(); });
  if (id === 'bag') renderBag();
  if (id === 'wish') renderWish();
  if (!d.open) d.showModal();
  if (id === 'search') $('input', d).focus();
}

$$('dialog').forEach(d => d.addEventListener('click', e => {
  if (e.target !== d) return;
  const r = d.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) d.close();
}));

/* ---------- Quick add: chọn size, màu, số lượng ---------- */
let current = null;

function openQuick(id) {
  current = byId(id);
  if (!current) return;
  const img = $('#quickImg');
  img.src = current.image;
  img.alt = current.name;
  $('#quickCat').textContent = current.category;
  $('#quickName').textContent = current.name;
  $('#quickPrice').innerHTML = priceHTML(current);
  const size = current.sizes.includes('M') ? 'M' : current.sizes[0];
  $('#quickSizes').innerHTML = current.sizes.map(s =>
    `<label><input type="radio" name="size" value="${s}"${s === size ? ' checked' : ''}><span class="size">${s}</span></label>`).join('');
  $('#quickColors').innerHTML = current.colors.map((c, i) =>
    `<label title="${c}"><input type="radio" name="color" value="${c}" aria-label="${c}"${i === 0 ? ' checked' : ''}><span class="swatch" style="--c:${COLORS[c]}"></span></label>`).join('');
  $('#quickQty').value = 1;
  syncQuick();
  openDialog('quick');
}

function syncQuick() {
  const f = new FormData($('#quickForm'));
  const qty = clampQty($('#quickQty').value);
  $('#quickSizeLabel').textContent = f.get('size');
  $('#quickColorLabel').textContent = f.get('color');
  $('#quickSubmit').textContent = `Thêm vào giỏ · ${money(current.price * qty)}`;
}

$('#quickForm').addEventListener('change', syncQuick);
$('#quickQty').addEventListener('input', syncQuick);
$('#quickQty').addEventListener('blur', () => { $('#quickQty').value = clampQty($('#quickQty').value); syncQuick(); });

$('#quickForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target);
  const size = f.get('size');
  const color = f.get('color');
  const qty = clampQty($('#quickQty').value);
  const line = cart.find(x => x.id === current.id && x.size === size && x.color === color);
  if (line) line.quantity = Math.min(99, line.quantity + qty);
  else cart.push(cartItem(current, size, color, qty));
  const saved = saveCart();
  $('#quick').close();
  showToast('Đã thêm vào giỏ hàng',
    saved ? `Giỏ hàng của bạn có ${cartCount()} sản phẩm` : 'Trình duyệt không cho lưu, giỏ hàng sẽ mất khi tải lại trang', true);
});

/* ---------- Thông báo ---------- */
let toastTimer;
function showToast(title, text, withActions = false) {
  $('#toastTitle').textContent = title;
  $('#toastText').textContent = text;
  $('#toastActions').hidden = !withActions;
  $('#toast').hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 5000);
}

/* ---------- Xem nhanh giỏ hàng ---------- */
function renderBag() {
  const n = cartCount();
  const total = cartTotal();
  $('#bagTitle').textContent = `Giỏ hàng (${n})`;
  $('#bagRows').innerHTML = cart.length
    ? cart.map((x, i) => `<div class="row">
        <img src="${x.image}" alt="">
        <div>
          <b>${x.name}</b>
          <small>Size ${x.size} · Màu ${x.color}</small>
          <div class="row-foot">
            <div class="qty sm"><button type="button" data-line="${i}" data-delta="-1" aria-label="Bớt 1">−</button><input value="${x.quantity}" readonly aria-label="Số lượng"><button type="button" data-line="${i}" data-delta="1" aria-label="Thêm 1">+</button></div>
            <b>${money(x.price * x.quantity)}</b>
          </div>
          <button type="button" class="remove" data-remove="${i}">Xoá</button>
        </div>
      </div>`).join('')
    : '<p class="bag-empty">Giỏ hàng đang trống.<br>Chọn một thiết kế bạn thích nhé.</p>';
  const note = $('#shipNote');
  note.hidden = !n;
  const left = FREE_SHIP - total;
  $('#shipText').textContent = left > 0 ? `Mua thêm ${money(left)} để được miễn phí giao hàng` : 'Đơn của bạn được miễn phí giao hàng';
  $('#shipBar').style.width = `${Math.min(100, (total / FREE_SHIP) * 100)}%`;
  $('#bagTotal').textContent = money(total);
  $('#bagFoot').hidden = !n;
}

/* ---------- Danh sách yêu thích ---------- */
function renderWish() {
  $('#wishTitle').textContent = `Yêu thích (${wish.length})`;
  $('#wishRows').innerHTML = wish.length
    ? wish.map(byId).map(p => `<div class="row">
        <img src="${p.image}" alt="">
        <div>
          <b>${p.name}</b>
          <small>${priceHTML(p)}</small>
          <div class="row-foot">
            <button type="button" class="btn btn-line btn-sm" data-quick="${p.id}">+ Thêm vào giỏ</button>
            <button type="button" class="remove" data-wish="${p.id}">Bỏ thích</button>
          </div>
        </div>
      </div>`).join('')
    : '<p class="bag-empty">Chưa có sản phẩm nào.<br>Bấm vào hình trái tim trên sản phẩm để lưu lại.</p>';
}

/* ---------- Bấm chuột trên toàn trang ---------- */
document.addEventListener('click', e => {
  const t = e.target;
  const opener = t.closest('[data-open]');
  if (opener) { e.preventDefault(); $('#toast').hidden = true; openDialog(opener.dataset.open); return; }
  const quickBtn = t.closest('[data-quick]');
  if (quickBtn) { openQuick(quickBtn.dataset.quick); return; }
  const wishBtn = t.closest('[data-wish]');
  if (wishBtn) { toggleWish(wishBtn.dataset.wish); return; }
  if (t.closest('[data-close]')) { t.closest('dialog').close(); return; }
  if (t.closest('[data-toast-close]')) { $('#toast').hidden = true; return; }
  const stepBtn = t.closest('[data-step]');
  if (stepBtn) {
    const input = $('#quickQty');
    input.value = clampQty(clampQty(input.value) + Number(stepBtn.dataset.step));
    syncQuick();
    return;
  }
  const lineBtn = t.closest('[data-line]');
  if (lineBtn) {
    const line = cart[Number(lineBtn.dataset.line)];
    if (line) { line.quantity = clampQty(line.quantity + Number(lineBtn.dataset.delta)); saveCart(); renderBag(); }
    return;
  }
  const removeBtn = t.closest('[data-remove]');
  if (removeBtn) { cart.splice(Number(removeBtn.dataset.remove), 1); saveCart(); renderBag(); }
});

/* ---------- Mã giảm giá và đăng ký nhận tin (bản demo, chưa gửi email thật) ---------- */
$('#promoForm').addEventListener('submit', e => {
  e.preventDefault();
  $('#promoForm').hidden = true;
  $('#promoDone').hidden = false;
});
$('#newsForm').addEventListener('submit', e => {
  e.preventDefault();
  e.target.reset();
  showToast('Đã ghi nhận email của bạn', 'Lụa. sẽ báo khi có bộ sưu tập mới.');
});

showCount();
