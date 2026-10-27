/* Lụa. – Nhóm 7 · Trang của Anh Tú (việc 11, 12)
   Shopping Cart, Checkout, About Us, Contact, FAQ, Profile, Orders, Address.
   Chạy sau app.js nên dùng chung: $, $$, money, byId, read, write, cart, saveCart, cartCount, card, showToast...
   Dữ liệu lưu trong localStorage của trình duyệt:
   - "lua_cart_v1"    giỏ hàng (dùng chung với app.js)
   - "lua_coupon_v1"  mã giảm giá đang áp dụng, ví dụ "LUA10"
   - "lua_profile_v1" hồ sơ tài khoản
   - "lua_addr_v1"    sổ địa chỉ
   - "lua_orders_v1"  đơn hàng đã đặt
   Chưa có dữ liệu thì dùng tài khoản mẫu Trần Mai Anh (giống mockup). */
'use strict';

const COUPON_KEY = 'lua_coupon_v1';
const PROFILE_KEY = 'lua_profile_v1';
const ADDR_KEY = 'lua_addr_v1';
const ORDERS_KEY = 'lua_orders_v1';

const COUPONS = { LUA10: { rate: 0.1, label: 'Giảm 10% cho thành viên mới' } };
const SHIP_STANDARD = 30000;
const SHIP_EXPRESS = 35000;
const HCM = 'TP. Hồ Chí Minh';
/* 34 tỉnh, thành phố sau sắp xếp đơn vị hành chính năm 2025 */
const CITIES = ['TP. Hồ Chí Minh', 'TP. Hà Nội', 'TP. Đà Nẵng', 'TP. Hải Phòng', 'TP. Cần Thơ', 'TP. Huế',
  'An Giang', 'Bắc Ninh', 'Cà Mau', 'Cao Bằng', 'Đắk Lắk', 'Điện Biên', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai',
  'Hà Tĩnh', 'Hưng Yên', 'Khánh Hoà', 'Lai Châu', 'Lâm Đồng', 'Lạng Sơn', 'Lào Cai', 'Nghệ An', 'Ninh Bình',
  'Phú Thọ', 'Quảng Ngãi', 'Quảng Ninh', 'Quảng Trị', 'Sơn La', 'Tây Ninh', 'Thái Nguyên', 'Thanh Hoá',
  'Tuyên Quang', 'Vĩnh Long'];
const SHIPPING = {
  standard: { label: 'Giao tiêu chuẩn', note: 'Nhận hàng sau 2–3 ngày' },
  express: { label: 'Giao hoả tốc', note: 'Nhận trong ngày, nội thành TP. Hồ Chí Minh' }
};
const PAYMENTS = {
  cod: 'Thanh toán khi nhận hàng (COD)',
  bank: 'Chuyển khoản ngân hàng',
  wallet: 'Ví điện tử',
  card: 'Thẻ ngân hàng'
};
const STATUSES = ['Chờ xác nhận', 'Đang giao', 'Đã giao'];
const TRACK = ['Đã đặt', 'Đã xác nhận', 'Đang giao', 'Đã nhận'];
const TRACK_STEP = { 'Chờ xác nhận': 1, 'Đang giao': 3, 'Đã giao': 4 };
const STATUS_CLASS = { 'Chờ xác nhận': 'wait', 'Đang giao': 'ship', 'Đã giao': 'done' };

const ICON = {
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 8h13l-1 12h-11l-1-12z"/><path d="M9 8V7a3 3 0 0 1 6 0v1"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="9" width="16" height="11" rx="1.5"/><path d="M3 9h18M12 9v11M12 9c-1.2-3-5-4.2-5-1.6C7 9 10 9 12 9zm0 0c1.2-3 5-4.2 5-1.6C17 9 14 9 12 9z"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 7.5 12 3.5l8.5 4v9L12 20.5l-8.5-4z"/><path d="m3.5 7.5 8.5 4 8.5-4M12 11.5v9"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5v5.5M12 16.3v.2"/></svg>'
};

/* ---------- Tiện ích ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const normPhone = s => String(s || '').replace(/[\s.()-]/g, '');
const fmtPhone = s => { const p = normPhone(s); return /^\d{10}$/.test(p) ? `${p.slice(0, 4)} ${p.slice(4, 7)} ${p.slice(7)}` : p; };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^0\d{9}$/;
const pad = n => String(n).padStart(2, '0');
const fmtDate = d => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const initials = name => (String(name).trim().split(/\s+/).slice(-2).map(w => w[0] || '').join('') || 'L').toUpperCase();
const uid = () => Math.random().toString(36).slice(2, 9);

function setErr(input, msg) {
  const box = input.closest('.field');
  if (!box) return;
  box.classList.toggle('bad', !!msg);
  input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  const err = $('.err', box);
  if (err) err.textContent = msg || '';
}
function clearErrs(form) { $$('input, select, textarea', form).forEach(el => setErr(el, '')); }
$$('form[novalidate]').forEach(f => f.addEventListener('input', e => { if (e.target.closest('.field.bad')) setErr(e.target, ''); }));

/* Bấm 2 lần mới thực hiện (thay cho hộp confirm của trình duyệt) */
function confirmTwice(btn, label, action) {
  if (btn.dataset.armed) { delete btn.dataset.armed; clearTimeout(btn._t); action(); return; }
  btn.dataset.armed = '1';
  btn._label = btn._label || btn.innerHTML;
  btn.textContent = label;
  btn._t = setTimeout(() => { delete btn.dataset.armed; btn.innerHTML = btn._label; }, 4000);
}

/* ---------- Dữ liệu mẫu (giống mockup) ---------- */
const SAMPLE_PROFILE = {
  name: 'Trần Mai Anh', email: 'maianh@email.com', phone: '0901234567', birthday: '1998-02-14',
  height: 160, weight: 50, topSize: 'S', bottomSize: 'M', tier: 'Thành viên Bạc', since: '2024'
};
const SAMPLE_ADDR = [
  { id: 'a1', name: 'Trần Mai Anh', phone: '0901234567', city: HCM, detail: '12 Đường số 3, Phường 5, Quận 3', label: 'Nhà riêng', isDefault: true },
  { id: 'a2', name: 'Trần Mai Anh', phone: '0901234567', city: HCM, detail: 'Tầng 8, 45 Nguyễn Thị Minh Khai, Quận 1', label: 'Văn phòng', isDefault: false }
];

function orderLine(id, size, color, quantity) {
  const p = byId(id);
  return { id, name: p.name, image: p.image, price: p.price, size, color, quantity };
}

function pricing(items, code, ship) {
  const subtotal = items.reduce((n, x) => n + x.price * x.quantity, 0);
  const c = COUPONS[code];
  const discount = c ? Math.round(subtotal * c.rate) : 0;
  const shipFee = ship === 'express' ? SHIP_EXPRESS : (subtotal >= FREE_SHIP ? 0 : SHIP_STANDARD);
  return { subtotal, discount, shipFee, total: subtotal - discount + shipFee };
}

function sampleOrders() {
  const make = (id, date, items, ship, pay, status) => ({
    id, date, items, address: SAMPLE_ADDR[0], ship, pay, note: '', coupon: '', status, ...pricing(items, '', ship)
  });
  return [
    make('CS-1024', '2026-10-22T10:15:00+07:00', [orderLine('lua-5', 'M', 'Đen', 1), orderLine('lua-1', 'L', 'Trắng kem', 2)], 'standard', 'cod', 'Đang giao'),
    make('CS-1019', '2026-10-05T19:40:00+07:00', [orderLine('lua-6', 'S', 'Be', 1)], 'standard', 'bank', 'Đã giao')
  ];
}

const getProfile = () => { const p = read(PROFILE_KEY, null); return { ...SAMPLE_PROFILE, ...(p && typeof p === 'object' ? p : {}) }; };
const validAddr = a => a && a.id && a.name && a.phone && a.city && a.detail;
function getAddrs() {
  const a = read(ADDR_KEY, null);
  const list = Array.isArray(a) ? a.filter(validAddr) : SAMPLE_ADDR.map(x => ({ ...x }));
  if (list.length && !list.some(x => x.isDefault)) list[0].isDefault = true;
  return list;
}
const saveAddrs = list => write(ADDR_KEY, list);
function getOrders() {
  const o = read(ORDERS_KEY, null);
  return Array.isArray(o) ? o.filter(x => x && x.id && Array.isArray(x.items) && x.address) : sampleOrders();
}
const getCoupon = () => { const c = read(COUPON_KEY, ''); return COUPONS[c] ? c : ''; };
const addrText = a => `${a.detail}, ${a.city}`;

/* ---------- Mã giảm giá (dùng ở Giỏ hàng và Thanh toán) ---------- */
function couponHTML() {
  const code = getCoupon();
  if (code) {
    return `<div class="coupon-on">${ICON.gift}<span><b>${code}</b> · ${COUPONS[code].label}</span><button type="button" class="link" data-coupon-off>Bỏ mã</button></div>`;
  }
  // Không dùng thẻ <form> vì ô mã nằm bên trong form Thanh toán
  return `<div class="coupon" data-coupon>
      <label class="sr" for="couponInput">Mã giảm giá</label>
      <input id="couponInput" placeholder="Nhập mã giảm giá" maxlength="20" autocomplete="off" enterkeyhint="done">
      <button type="button" class="btn btn-line btn-sm" data-coupon-apply>Áp dụng</button>
    </div><small class="err block" data-coupon-err aria-live="polite"></small>`;
}

function rowsHTML(pr, opts = {}) {
  const ship = pr.shipFee ? money(pr.shipFee) : '<span class="free">Miễn phí</span>';
  return `<div class="sum-row"><span>Tạm tính${opts.count ? ` (${opts.count} sản phẩm)` : ''}</span><span>${money(pr.subtotal)}</span></div>
    ${pr.discount ? `<div class="sum-row"><span>Giảm giá</span><span class="minus">−${money(pr.discount)}</span></div>` : ''}
    <div class="sum-row"><span>${opts.shipLabel || 'Phí giao hàng'}</span><span>${ship}</span></div>
    <div class="sum-row total"><span>Tổng cộng</span><b>${money(pr.total)}</b></div>`;
}

let onCouponChange = () => {};
function applyCoupon(box) {
  const input = $('input', box);
  const code = input.value.trim().toUpperCase();
  const err = box.nextElementSibling;
  if (!code) { err.textContent = 'Bạn chưa nhập mã.'; input.focus(); return; }
  if (!COUPONS[code]) { err.textContent = `Mã “${code}” không đúng hoặc đã hết hạn.`; input.focus(); return; }
  write(COUPON_KEY, code);
  showToast('Đã áp dụng mã giảm giá', `${code} · ${COUPONS[code].label}`);
  onCouponChange();
}
document.addEventListener('click', e => {
  const apply = e.target.closest('[data-coupon-apply]');
  if (apply) { applyCoupon(apply.closest('[data-coupon]')); return; }
  if (e.target.closest('[data-coupon-off]')) { write(COUPON_KEY, ''); onCouponChange(); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.id === 'couponInput') { e.preventDefault(); applyCoupon(e.target.closest('[data-coupon]')); }
});
document.addEventListener('input', e => {
  if (e.target.id === 'couponInput') e.target.closest('[data-coupon]').nextElementSibling.textContent = '';
});

/* ---------- Ô chọn tỉnh, thành phố ---------- */
$$('select[data-cities]').forEach(sel => {
  sel.insertAdjacentHTML('beforeend', CITIES.map(c => `<option>${c}</option>`).join(''));
});

/* ---------- Form địa chỉ: đọc và kiểm tra ---------- */
function fillAddrForm(form, a = {}) {
  form.elements.aName.value = a.name || '';
  form.elements.aPhone.value = a.phone ? fmtPhone(a.phone) : '';
  form.elements.aCity.value = a.city || '';
  form.elements.aDetail.value = a.detail || '';
  const label = a.label || 'Nhà riêng';
  $$('input[name="aLabel"]', form).forEach(r => { r.checked = r.value === label; });
  form.elements.aDefault.checked = !!a.isDefault;
}

function readAddrForm(form) {
  const el = form.elements;
  const data = {
    name: el.aName.value.trim(), phone: normPhone(el.aPhone.value), city: el.aCity.value,
    detail: el.aDetail.value.trim(), label: ($('input[name="aLabel"]:checked', form) || {}).value || 'Nhà riêng',
    isDefault: el.aDefault.checked
  };
  const bad = [];
  const check = (input, msg) => { setErr(input, msg); if (msg) bad.push(input); };
  check(el.aName, data.name.length < 2 ? 'Vui lòng nhập họ tên người nhận' : '');
  check(el.aPhone, !PHONE_RE.test(data.phone) ? 'Số điện thoại cần đủ 10 số, bắt đầu bằng 0' : '');
  check(el.aCity, !data.city ? 'Vui lòng chọn tỉnh / thành phố' : '');
  check(el.aDetail, data.detail.length < 6 ? 'Vui lòng nhập số nhà, tên đường, phường/xã' : '');
  return { data, bad };
}

/* Thêm mới (không có id) hoặc sửa địa chỉ. Luôn giữ đúng một địa chỉ mặc định. */
function upsertAddr(list, data, id) {
  let out = list.map(x => ({ ...x }));
  const target = id || 'a' + uid();
  if (id) out = out.map(x => (x.id === id ? { ...x, ...data, id } : x));
  else out.push({ ...data, id: target });
  if (data.isDefault) out.forEach(x => { x.isDefault = x.id === target; });
  if (out.length && !out.some(x => x.isDefault)) out[0].isDefault = true;
  return out;
}

/* ---------- Tài khoản: tên, email trên thanh bên ---------- */
function paintProfile() {
  const p = getProfile();
  $$('[data-profile-name]').forEach(el => { el.textContent = p.name; });
  $$('[data-profile-email]').forEach(el => { el.textContent = p.email; });
  $$('[data-initials]').forEach(el => { el.textContent = initials(p.name); });
}

document.addEventListener('click', e => {
  const btn = e.target.closest('[data-reset-demo]');
  if (!btn) return;
  confirmTwice(btn, 'Bấm lần nữa để đặt lại', () => {
    [PROFILE_KEY, ADDR_KEY, ORDERS_KEY, COUPON_KEY].forEach(k => { try { localStorage.removeItem(k); } catch { /* bỏ qua */ } });
    location.reload();
  });
});

/* =====================================================================
   SHOPPING CART
   ===================================================================== */
function renderCartPage() {
  const view = $('#cartView');
  $('#cartTitle').textContent = `Giỏ hàng (${cartCount()})`;
  if (!cart.length) {
    view.innerHTML = `<div class="empty-state">
        <span class="empty-ic">${ICON.bag}</span>
        <h2>Giỏ hàng của bạn đang trống</h2>
        <p>Thêm vài món bạn thích, Lụa. giữ giúp bạn ở đây.</p>
        <a class="btn btn-pink" href="all-products.html">Mua sắm ngay</a>
      </div>
      <section class="block">
        <div class="block-head"><h2>Gợi ý cho bạn</h2><a class="link-under" href="all-products.html">Xem tất cả</a></div>
        <div class="grid grid-4">${NEW_ARRIVALS.map(id => card(byId(id))).join('')}</div>
      </section>`;
    return;
  }
  const pr = pricing(cart, getCoupon(), 'standard');
  const left = FREE_SHIP - pr.subtotal;
  view.innerHTML = `
    <div class="ship-band">
      ${ICON.truck}
      <div><p>${left > 0 ? `Mua thêm <b>${money(left)}</b> để được miễn phí giao hàng` : 'Đơn của bạn được <b>miễn phí giao hàng</b>'}</p>
      <div class="ship-bar"><span style="width:${Math.min(100, (pr.subtotal / FREE_SHIP) * 100)}%"></span></div></div>
    </div>
    <div class="cart-grid">
      <section aria-label="Sản phẩm trong giỏ">
        <ul class="cart-lines">${cart.map((x, i) => {
          const p = byId(x.id);
          return `<li class="cart-line">
            <img src="${x.image}" alt="${esc(x.name)}" width="720" height="960">
            <div class="cl-info">
              <b>${esc(x.name)}</b>
              <small>Size ${x.size} · ${x.color}</small>
              <div class="qty sm"><button type="button" data-line="${i}" data-delta="-1" aria-label="Bớt 1 ${esc(x.name)}">−</button><input value="${x.quantity}" readonly aria-label="Số lượng"><button type="button" data-line="${i}" data-delta="1" aria-label="Thêm 1 ${esc(x.name)}">+</button></div>
            </div>
            <div class="cl-price"><b${p.oldPrice ? ' class="sale"' : ''}>${money(x.price * x.quantity)}</b>${p.oldPrice ? `<del>${money(p.oldPrice * x.quantity)}</del>` : ''}${x.quantity > 1 ? `<small>${money(x.price)} / cái</small>` : ''}</div>
            <button type="button" class="x" data-remove="${i}" aria-label="Xoá ${esc(x.name)} khỏi giỏ">${ICON.close}</button>
          </li>`;
        }).join('')}
        </ul>
        <a class="btn btn-line btn-sm" href="all-products.html">Tiếp tục mua sắm</a>
      </section>
      <aside class="summary" aria-labelledby="sumH">
        <h2 id="sumH">Tóm tắt</h2>
        ${couponHTML()}
        <div class="sum-rows">${rowsHTML(pr, { count: cartCount(), shipLabel: 'Giao tiêu chuẩn' })}</div>
        <a class="btn btn-pink btn-block" href="checkout.html">Thanh toán</a>
        <p class="note">Chọn giao hoả tốc ở bước thanh toán · COD · Chuyển khoản · Ví · Thẻ</p>
      </aside>
    </div>`;
}

if (page === 'cart') {
  onCouponChange = renderCartPage;
  document.addEventListener('lua:cart', renderCartPage);
  renderCartPage();
}

/* =====================================================================
   CHECKOUT
   ===================================================================== */
function setupCheckout() {
  const form = $('#coForm');
  const el = form.elements;
  const profile = getProfile();
  let addrs = getAddrs();

  el.email.value = profile.email || '';
  el.phone.value = profile.phone ? fmtPhone(profile.phone) : '';

  function paintAddrs(selected) {
    const sel = selected || (addrs.find(a => a.isDefault) || {}).id || 'new';
    $('#addrChoices').innerHTML = addrs.map(a => `
      <label class="opt"><input type="radio" name="addr" value="${a.id}"${a.id === sel ? ' checked' : ''}>
        <span class="opt-ic">${ICON.pin}</span>
        <span class="opt-txt"><b>${esc(a.name)} · ${fmtPhone(a.phone)} ${a.isDefault ? '<span class="tag pink">Mặc định</span>' : `<span class="tag">${esc(a.label)}</span>`}</b><small>${esc(addrText(a))}</small></span>
      </label>`).join('') + `
      <label class="opt"><input type="radio" name="addr" value="new"${sel === 'new' ? ' checked' : ''}>
        <span class="opt-ic">+</span><span class="opt-txt"><b>Giao tới địa chỉ khác</b><small>Nhập địa chỉ mới</small></span>
      </label>`;
    syncAddr();
  }

  function chosenCity() {
    const v = ($('input[name="addr"]:checked', form) || {}).value;
    if (v === 'new') return el.aCity.value;
    return (addrs.find(a => a.id === v) || {}).city || '';
  }

  function syncAddr() {
    const v = ($('input[name="addr"]:checked', form) || {}).value;
    $('#addrNew').hidden = v !== 'new';
    $('#addrErr').textContent = '';
    if (v === 'new' && !el.aName.value) {
      el.aName.value = profile.name || '';
      el.aPhone.value = profile.phone ? fmtPhone(profile.phone) : '';
    }
    // Giao hoả tốc chỉ cho nội thành TP. Hồ Chí Minh
    const city = chosenCity();
    const express = $('input[name="ship"][value="express"]', form);
    const ok = !city || city === HCM;
    express.disabled = !ok;
    express.closest('.opt').classList.toggle('off', !ok);
    $('[data-right="express"]', form).textContent = ok ? money(SHIP_EXPRESS) : 'Không hỗ trợ';
    if (!ok && express.checked) $('input[name="ship"][value="standard"]', form).checked = true;
    paintSummary();
  }

  function paintSummary() {
    const ship = ($('input[name="ship"]:checked', form) || {}).value || 'standard';
    const pr = pricing(cart, getCoupon(), ship);
    $('#sumTitle').textContent = `Đơn hàng (${cartCount()})`;
    $('#sumItems').innerHTML = cart.map(x => `<div class="sum-item">
        <span class="thumb"><img src="${x.image}" alt="" width="720" height="960"><i>${x.quantity}</i></span>
        <span><b>${esc(x.name)}</b><small>Size ${x.size} · ${x.color} · x${x.quantity}</small></span>
        <b>${money(x.price * x.quantity)}</b></div>`).join('');
    $('#sumCoupon').innerHTML = couponHTML();
    $('#sumRows').innerHTML = rowsHTML(pr, { shipLabel: SHIPPING[ship].label });
    const std = $('[data-right="standard"]', form);
    const stdFree = pr.subtotal >= FREE_SHIP;
    std.innerHTML = stdFree ? '<span class="free">Miễn phí</span>' : money(SHIP_STANDARD);
  }

  function show() {
    const empty = !cart.length;
    $('#coEmpty').hidden = !empty;
    form.hidden = empty;
    if (!empty) paintSummary();
  }

  form.addEventListener('change', e => {
    if (e.target.name === 'addr' || e.target.name === 'aCity') syncAddr();
    if (e.target.name === 'ship') paintSummary();
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrs(form);
    const bad = [];
    const check = (input, msg) => { setErr(input, msg); if (msg) bad.push(input); };
    const email = el.email.value.trim();
    const phone = normPhone(el.phone.value);
    check(el.email, !EMAIL_RE.test(email) ? 'Vui lòng nhập email đúng dạng, ví dụ ban@email.com' : '');
    check(el.phone, !PHONE_RE.test(phone) ? 'Số điện thoại cần đủ 10 số, bắt đầu bằng 0' : '');

    const choice = ($('input[name="addr"]:checked', form) || {}).value;
    let address = null;
    let newAddr = null;
    if (!choice) {
      $('#addrErr').textContent = 'Bạn chưa chọn địa chỉ giao hàng';
      bad.push($('#addrChoices'));
    } else if (choice === 'new') {
      const r = readAddrForm(form);
      bad.push(...r.bad);
      if (!r.bad.length) { newAddr = r.data; address = { ...r.data, id: 'new' }; }
    } else {
      address = addrs.find(a => a.id === choice);
    }

    const alertBox = $('#coAlert');
    if (bad.length) {
      alertBox.innerHTML = `${ICON.alert}<span>Còn ${bad.length} mục chưa đúng. Bạn kiểm tra lại các ô viền đỏ bên dưới nhé.</span>`;
      alertBox.hidden = false;
      alertBox.focus({ preventScroll: true });
      alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    alertBox.hidden = true;

    if (newAddr && el.aSave.checked) {
      addrs = upsertAddr(addrs, newAddr);
      saveAddrs(addrs);
      address = addrs[addrs.length - 1];
    }

    const ship = $('input[name="ship"]:checked', form).value;
    const pay = $('input[name="pay"]:checked', form).value;
    const coupon = getCoupon();
    const orders = getOrders();
    const nextNo = Math.max(1024, ...orders.map(o => parseInt(String(o.id).replace(/\D/g, ''), 10) || 0)) + 1;
    const order = {
      id: `CS-${nextNo}`, date: new Date().toISOString(),
      items: cart.map(x => ({ id: x.id, name: x.name, image: x.image, price: x.price, size: x.size, color: x.color, quantity: x.quantity })),
      address: { name: address.name, phone: address.phone, city: address.city, detail: address.detail, label: address.label },
      contact: { email, phone }, ship, pay, note: el.note.value.trim(), coupon, status: 'Chờ xác nhận',
      ...pricing(cart, coupon, ship)
    };
    const savedOk = write(ORDERS_KEY, [order, ...orders]);
    if (!read(PROFILE_KEY, null)) write(PROFILE_KEY, { ...profile, email, phone });
    write(COUPON_KEY, '');
    cart.length = 0;
    saveCart();
    renderDone(order, savedOk);
  });

  function renderDone(o, savedOk) {
    form.hidden = true;
    $('#coEmpty').hidden = true;
    $('#coTitle').hidden = true;
    const now = new Date(o.date);
    const eta = o.ship === 'express' ? `Trong ngày ${fmtDate(now)}` : `${fmtDate(addDays(now, 2))} – ${fmtDate(addDays(now, 3))}`;
    const done = $('#coDone');
    done.innerHTML = `
      <span class="done-ic">${ICON.check}</span>
      <h1>Đặt hàng thành công!</h1>
      <p class="lead">Cảm ơn ${esc(o.address.name)}! Lụa. đã nhận đơn <b>#${o.id}</b>.</p>
      <div class="done-card">
        <div class="sum-row"><span>Mã đơn hàng</span><b>#${o.id}</b></div>
        <div class="sum-row"><span>Dự kiến nhận</span><span>${eta}</span></div>
        <div class="sum-row"><span>Giao đến</span><span>${esc(addrText(o.address))}</span></div>
        <div class="sum-row"><span>Thanh toán</span><span>${PAYMENTS[o.pay]}</span></div>
        <div class="sum-items">${o.items.map(x => `<div class="sum-item">
          <span class="thumb"><img src="${x.image}" alt="" width="720" height="960"><i>${x.quantity}</i></span>
          <span><b>${esc(x.name)}</b><small>Size ${x.size} · ${x.color} · x${x.quantity}</small></span><b>${money(x.price * x.quantity)}</b></div>`).join('')}</div>
        <div class="sum-rows">${rowsHTML(o, { shipLabel: SHIPPING[o.ship].label })}</div>
      </div>
      ${savedOk ? '' : '<p class="note">Trình duyệt không cho lưu dữ liệu nên đơn này sẽ không hiện trong trang Đơn hàng.</p>'}
      <div class="btn-row center">
        <a class="btn btn-pink" href="orders.html?new=${o.id}">Xem đơn hàng</a>
        <a class="btn btn-line" href="all-products.html">Tiếp tục mua sắm</a>
      </div>`;
    done.hidden = false;
    const crumb = $('.crumbs b');
    if (crumb) crumb.textContent = 'Đặt hàng thành công';
    document.title = `Đặt hàng thành công #${o.id} · Lụa.`;
    window.scrollTo({ top: 0 });
  }

  onCouponChange = paintSummary;
  document.addEventListener('lua:cart', () => { if ($('#coDone').hidden) show(); });
  paintAddrs();
  show();
}

if (page === 'checkout') setupCheckout();

/* =====================================================================
   CONTACT
   ===================================================================== */
if (page === 'contact') {
  const form = $('#contactForm');
  const profile = getProfile();
  form.elements.cName.value = profile.name;
  form.elements.cEmail.value = profile.email;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const el = form.elements;
    setErr(el.cName, el.cName.value.trim().length < 2 ? 'Vui lòng nhập họ tên' : '');
    setErr(el.cEmail, !EMAIL_RE.test(el.cEmail.value.trim()) ? 'Vui lòng nhập email đúng dạng' : '');
    setErr(el.cMsg, el.cMsg.value.trim().length < 10 ? 'Nội dung cần ít nhất 10 ký tự' : '');
    const first = $('[aria-invalid="true"]', form);
    if (first) { first.focus(); return; }
    el.cMsg.value = '';
    showToast('Đã ghi nhận tin nhắn', `Chủ đề: ${el.cTopic.value}. Đây là bản nháp nên tin nhắn chưa được gửi đi.`);
  });
}

/* =====================================================================
   FAQ: tìm câu hỏi
   ===================================================================== */
if (page === 'faq') {
  const input = $('#faqSearch');
  input.addEventListener('input', () => {
    const q = plain(input.value.trim());
    let shown = 0;
    $$('.faq-group').forEach(g => {
      let any = false;
      $$('.qa', g).forEach(d => {
        const hit = !q || plain(d.textContent).includes(q);
        d.hidden = !hit;
        if (hit) { any = true; shown += 1; if (q) d.open = true; }
      });
      g.hidden = !any;
    });
    $('#faqEmpty').hidden = shown > 0;
  });
}

/* =====================================================================
   PROFILE
   ===================================================================== */
function suggestSize(h, w) {
  const order = ['S', 'M', 'L', 'XL'];
  // Theo bảng size: S đến 1m55 / 45kg, M đến 1m60 / 50kg, L đến 1m65 / 55kg, lớn hơn là XL
  const byH = h ? (h <= 155 ? 0 : h <= 160 ? 1 : h <= 165 ? 2 : 3) : -1;
  const byW = w ? (w <= 45 ? 0 : w <= 50 ? 1 : w <= 55 ? 2 : 3) : -1;
  const i = Math.max(byH, byW);
  return i < 0 ? '' : order[i];
}

if (page === 'profile') {
  const form = $('#profileForm');
  const el = form.elements;
  const p = getProfile();
  el.name.value = p.name;
  el.email.value = p.email;
  el.phone.value = fmtPhone(p.phone);
  el.birthday.value = p.birthday || '';
  el.height.value = p.height || '';
  el.weight.value = p.weight || '';
  el.topSize.value = p.topSize || 'M';
  el.bottomSize.value = p.bottomSize || 'M';
  $('#tier').textContent = p.tier;
  $('#since').textContent = `Từ ${p.since}`;

  const hint = () => {
    const s = suggestSize(Number(el.height.value), Number(el.weight.value));
    $('#sizeHint').innerHTML = s ? `Theo bảng size, số đo của bạn hợp với <b>size ${s}</b>.` : '';
  };
  el.height.addEventListener('input', hint);
  el.weight.addEventListener('input', hint);
  hint();

  form.addEventListener('submit', e => {
    e.preventDefault();
    const h = Number(el.height.value);
    const w = Number(el.weight.value);
    setErr(el.name, el.name.value.trim().length < 2 ? 'Vui lòng nhập họ tên' : '');
    setErr(el.email, !EMAIL_RE.test(el.email.value.trim()) ? 'Vui lòng nhập email đúng dạng' : '');
    setErr(el.phone, !PHONE_RE.test(normPhone(el.phone.value)) ? 'Số điện thoại cần đủ 10 số, bắt đầu bằng 0' : '');
    setErr(el.height, el.height.value && (h < 130 || h > 200) ? 'Chiều cao từ 130 đến 200 cm' : '');
    setErr(el.weight, el.weight.value && (w < 30 || w > 120) ? 'Cân nặng từ 30 đến 120 kg' : '');
    const first = $('[aria-invalid="true"]', form);
    if (first) { first.focus(); return; }
    const next = {
      ...p, name: el.name.value.trim(), email: el.email.value.trim(), phone: normPhone(el.phone.value),
      birthday: el.birthday.value, height: h || '', weight: w || '', topSize: el.topSize.value, bottomSize: el.bottomSize.value
    };
    const ok = write(PROFILE_KEY, next);
    paintProfile();
    showToast(ok ? 'Đã lưu thay đổi' : 'Chưa lưu được', ok ? 'Thông tin cá nhân đã được cập nhật.' : 'Trình duyệt đang chặn lưu dữ liệu.');
  });
}

/* =====================================================================
   ORDERS
   ===================================================================== */
if (page === 'orders') {
  const newId = new URLSearchParams(location.search).get('new');
  let filter = '';

  function renderOrders() {
    const orders = getOrders();
    const tabs = [['', 'Tất cả', orders.length], ...STATUSES.map(s => [s, s, orders.filter(o => o.status === s).length])];
    $('#orderTabs').innerHTML = tabs.map(([v, t, n]) =>
      `<button type="button" data-status="${v}" aria-pressed="${v === filter}"${v === filter ? ' class="on"' : ''}>${t} <span>${n}</span></button>`).join('');
    const list = orders.filter(o => !filter || o.status === filter);
    if (!list.length) {
      $('#orderList').innerHTML = `<div class="empty-state small"><span class="empty-ic">${ICON.box}</span>
        <h2>${filter ? `Chưa có đơn “${filter}”` : 'Bạn chưa có đơn hàng nào'}</h2>
        <a class="btn btn-pink btn-sm" href="all-products.html">Mua sắm ngay</a></div>`;
      return;
    }
    $('#orderList').innerHTML = list.map(o => {
      const d = new Date(o.date);
      const n = o.items.reduce((s, x) => s + x.quantity, 0);
      const step = TRACK_STEP[o.status] || 1;
      return `<article class="order${o.id === newId ? ' is-new' : ''}" id="o-${o.id}">
        <div class="order-head">
          <div><b>Đơn #${o.id}</b>${o.id === newId ? ' <span class="tag pink">Vừa đặt</span>' : ''}<small>Đặt ngày ${fmtDate(d)} · ${n} sản phẩm</small></div>
          <span class="status ${STATUS_CLASS[o.status] || 'wait'}">${o.status}</span>
        </div>
        <ol class="track" aria-label="Tiến trình đơn hàng">${TRACK.map((t, i) => `<li class="${i < step ? 'done' : ''}${i === step - 1 ? ' now' : ''}">${t}</li>`).join('')}</ol>
        <div class="order-items">${o.items.map(x => `<div class="sum-item">
          <span class="thumb"><img src="${x.image}" alt="" width="720" height="960"></span>
          <span><b>${esc(x.name)}</b><small>Size ${x.size} · ${x.color} · x${x.quantity}</small></span><b>${money(x.price * x.quantity)}</b></div>`).join('')}</div>
        <details class="order-more"><summary>Xem chi tiết đơn</summary>
          <div class="sum-row"><span>Giao đến</span><span>${esc(o.address.name)} · ${fmtPhone(o.address.phone)}<br>${esc(addrText(o.address))}</span></div>
          <div class="sum-row"><span>Vận chuyển</span><span>${SHIPPING[o.ship] ? SHIPPING[o.ship].label : ''}</span></div>
          <div class="sum-row"><span>Thanh toán</span><span>${PAYMENTS[o.pay] || ''}</span></div>
          ${o.coupon ? `<div class="sum-row"><span>Mã giảm giá</span><span>${esc(o.coupon)}</span></div>` : ''}
          ${o.note ? `<div class="sum-row"><span>Ghi chú</span><span>${esc(o.note)}</span></div>` : ''}
          <div class="sum-rows">${rowsHTML(o, { shipLabel: 'Phí giao hàng' })}</div>
        </details>
        <div class="order-foot"><span>Tổng: <b>${money(o.total)}</b></span><button type="button" class="btn btn-pink btn-sm" data-reorder="${o.id}">Mua lại</button></div>
      </article>`;
    }).join('');
  }

  document.addEventListener('click', e => {
    const tab = e.target.closest('[data-status]');
    if (tab) { filter = tab.dataset.status; renderOrders(); return; }
    const re = e.target.closest('[data-reorder]');
    if (re) {
      const o = getOrders().find(x => x.id === re.dataset.reorder);
      if (!o) return;
      o.items.forEach(x => {
        const p = byId(x.id);
        if (!p || !p.sizes.includes(x.size) || !p.colors.includes(x.color)) return;
        const line = cart.find(c => c.id === x.id && c.size === x.size && c.color === x.color);
        if (line) line.quantity = Math.min(99, line.quantity + x.quantity);
        else cart.push(cartItem(p, x.size, x.color, x.quantity));
      });
      saveCart();
      location.href = 'cart.html';
    }
  });

  renderOrders();
  if (newId) { const el = document.getElementById(`o-${newId}`); if (el) el.scrollIntoView({ block: 'center' }); }
}

/* =====================================================================
   ADDRESS
   ===================================================================== */
if (page === 'address') {
  const form = $('#addrForm');
  let editing = '';

  function renderAddrs() {
    const list = getAddrs();
    $('#addrList').innerHTML = list.length ? list.map(a => `
      <article class="addr-card${a.isDefault ? ' is-default' : ''}">
        <div class="addr-top"><b>${esc(a.name)} · ${fmtPhone(a.phone)}</b>
          <span><span class="tag">${esc(a.label)}</span>${a.isDefault ? ' <span class="tag pink">Mặc định</span>' : ''}</span></div>
        <p>${esc(addrText(a))}</p>
        <div class="btn-row">
          <button type="button" class="btn btn-line btn-xs" data-edit="${a.id}">Sửa</button>
          ${a.isDefault ? '' : `<button type="button" class="btn btn-line btn-xs" data-default="${a.id}">Đặt mặc định</button>`}
          <button type="button" class="btn btn-line btn-xs" data-del="${a.id}">Xoá</button>
        </div>
      </article>`).join('')
      : `<div class="empty-state small"><span class="empty-ic">${ICON.pin}</span><h2>Chưa có địa chỉ nào</h2><p>Thêm địa chỉ để thanh toán nhanh hơn.</p></div>`;
  }

  function openForm(a) {
    editing = a ? a.id : '';
    clearErrs(form);
    fillAddrForm(form, a || { name: getProfile().name, phone: getProfile().phone, isDefault: !getAddrs().length });
    $('#addrFormTitle').textContent = a ? 'Sửa địa chỉ' : 'Thêm địa chỉ mới';
    form.hidden = false;
    form.elements.aName.focus();
    form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  const closeForm = () => { form.hidden = true; editing = ''; };

  $('#addrAdd').addEventListener('click', () => openForm(null));
  $('#addrCancel').addEventListener('click', closeForm);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const { data, bad } = readAddrForm(form);
    if (bad.length) { bad[0].focus(); return; }
    saveAddrs(upsertAddr(getAddrs(), data, editing));
    showToast(editing ? 'Đã cập nhật địa chỉ' : 'Đã thêm địa chỉ', `${data.detail}, ${data.city}`);
    closeForm();
    renderAddrs();
  });

  $('#addrList').addEventListener('click', e => {
    const list = getAddrs();
    const ed = e.target.closest('[data-edit]');
    if (ed) { openForm(list.find(a => a.id === ed.dataset.edit)); return; }
    const df = e.target.closest('[data-default]');
    if (df) { saveAddrs(list.map(a => ({ ...a, isDefault: a.id === df.dataset.default }))); renderAddrs(); return; }
    const del = e.target.closest('[data-del]');
    if (del) {
      confirmTwice(del, 'Xác nhận xoá', () => {
        const rest = list.filter(a => a.id !== del.dataset.del);
        if (rest.length && !rest.some(a => a.isDefault)) rest[0].isDefault = true;
        saveAddrs(rest);
        if (editing === del.dataset.del) closeForm();
        renderAddrs();
      });
    }
  });

  renderAddrs();
}

if ($('.acc-side')) paintProfile();
