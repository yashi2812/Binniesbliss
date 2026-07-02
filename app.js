/* =========================================================
   BINNIES BLISS — storefront logic
   ========================================================= */
(function(){
  "use strict";

  /* ---------------- PRODUCT DATA ---------------- */
  const PRODUCTS = [
    { id:"p01", name:"Cloud Nine Tee", cat:"tee", catLabel:"Oversized Tee", price:1290, old:null, color:"#EFE2FB", tee:"#B98CE0", accent:"#FF5FA2", shape:"tee-shape", badge:"New", sizes:["S","M","L","XL"], desc:"Our softest oversized tee, brushed cotton with a boxy drop-shoulder fit. Cloud print wraps from chest to back." },
    { id:"p02", name:"Sunday Soft Tee", cat:"tee", catLabel:"Oversized Tee", price:1290, old:null, color:"#FFF3DA", tee:"#FFC24B", accent:"#E23F86", shape:"tee-shape", badge:null, sizes:["S","M","L","XL"], desc:"Butter-yellow oversized tee for slow mornings, iced coffee, and nowhere to be." },
    { id:"p03", name:"Good Vibes Crop", cat:"crop", catLabel:"Crop Top", price:990, old:null, color:"#FFE3EC", tee:"#FF7FA8", accent:"#3D1F4D", shape:"crop-shape", badge:"New", sizes:["S","M","L"], desc:"A cropped, relaxed fit crop tee with ribbed hem. Pairs perfectly with the Bliss co-ord bottoms." },
    { id:"p04", name:"Slow Mornings Tee", cat:"tee", catLabel:"Oversized Tee", price:1290, old:null, color:"#DEF6FB", tee:"#7FD8E8", accent:"#FFC24B", shape:"tee-shape", badge:"Bestseller", sizes:["S","M","L","XL"], desc:"Sky-blue oversized tee, brushed inside for extra softness. Our #1 seller, three drops running." },
    { id:"p05", name:"Petal Drop Crop", cat:"crop", catLabel:"Crop Top", price:990, old:1190, color:"#FDE3EA", tee:"#E75A82", accent:"#4FBE8C", shape:"crop-shape", badge:"Sale", sizes:["S","M","L"], desc:"Rose-pink cropped tee with a soft petal graphic. Limited restock — almost gone." },
    { id:"p06", name:"Bliss Co-ord Set", cat:"set", catLabel:"Co-ord Set", price:2190, old:null, color:"#EFE2FB", tee:"#B98CE0", accent:"#FFC24B", shape:"tee-shape", badge:"New", sizes:["S","M","L","XL"], desc:"Oversized tee + matching shorts, cut from the same lilac cotton. One order, one whole vibe." },
    { id:"p07", name:"Sweet Nothing Tee", cat:"tee", catLabel:"Oversized Tee", price:1190, old:null, color:"#F6EFE2", tee:"#E9D3AE", accent:"#FF5FA2", shape:"tee-shape", badge:null, sizes:["S","M","L","XL"], desc:"Barely-there cream tee with a tonal chest print. Goes with everything, clashes with nothing." },
    { id:"p08", name:"Golden Hour Crop", cat:"crop", catLabel:"Crop Top", price:990, old:null, color:"#FFEADA", tee:"#FFAE6B", accent:"#3D1F4D", shape:"crop-shape", badge:null, sizes:["S","M","L"], desc:"Peachy crop tee that photographs best at 6pm. Coincidence? We think not." },
    { id:"p09", name:"Dreamy Days Set", cat:"set", catLabel:"Co-ord Set", price:2190, old:null, color:"#DFF6EC", tee:"#4FBE8C", accent:"#FF5FA2", shape:"tee-shape", badge:"Sold out", soldOut:true, sizes:["S","M","L","XL"], desc:"Mint co-ord set, oversized top with wide-leg pants. Back in stock next Friday." },
    { id:"p10", name:"Honey Glow Tote", cat:"accessory", catLabel:"Accessory", price:690, old:null, color:"#FFF1D6", tee:"#F2A93B", accent:"#FF5FA2", shape:"tote-shape", badge:null, sizes:["One Size"], desc:"Heavy canvas tote, hand-finished straps. Fits a laptop, a water bottle, and every impulse buy." },
    { id:"p11", name:"Bliss Bucket Hat", cat:"accessory", catLabel:"Accessory", price:590, old:null, color:"#FFE0EC", tee:"#FF5FA2", accent:"#FFC24B", shape:"hat-shape", badge:null, sizes:["One Size"], desc:"Reversible bucket hat, two prints in one. Sun protection that still looks cute indoors." },
    { id:"p12", name:"Cloud Scrunchie Trio", cat:"accessory", catLabel:"Accessory", price:390, old:null, color:"#DEF6FB", tee:"#7FD8E8", accent:"#B98CE0", shape:"hat-shape", badge:null, sizes:["One Size"], desc:"Three oversized scrunchies in coordinating Bliss shades. Gentle on hair, loud on shelfies." },
  ];

  const REVIEWS = [
    { name:"Ananya R.", meta:"Cloud Nine Tee · Verified", text:"Genuinely feels like wearing a cloud. Ordered a second one before the first even arrived." },
    { name:"Kabir M.", meta:"Slow Mornings Tee · Verified", text:"Sizing runs true to oversized. The fabric held up after 10+ washes, still soft." },
    { name:"Ishita P.", meta:"Bliss Co-ord Set · Verified", text:"Wore this to a brunch and got stopped twice for the brand name. Worth every rupee." },
    { name:"Devansh K.", meta:"Honey Glow Tote · Verified", text:"Sturdy, roomy, and the color is even better in person. My go-to bag now." },
    { name:"Meher S.", meta:"Petal Drop Crop · Verified", text:"Shipping was quick and the packaging alone made me smile. Bliss really is the word." },
    { name:"Rohan T.", meta:"Bliss Bucket Hat · Verified", text:"Reversible feature is such a nice touch, two hats for the price of one basically." },
  ];

  /* ---------------- STATE ---------------- */
  let cart = JSON.parse(localStorage.getItem("bb_cart") || "[]");
  let wishlist = JSON.parse(localStorage.getItem("bb_wishlist") || "[]");
  let activeFilter = "all";
  let qvProduct = null;
  let qvSize = null;
  let qvQty = 1;

  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
  const money = n => "₹" + n.toLocaleString("en-IN");

  /* ---------------- SVG HELPERS ---------------- */
  function teeSVG(product, variant){
    const isBack = variant === "back";
    const color = isBack ? product.accent : product.tee;
    return `<svg viewBox="0 0 240 280" class="tee-illustration ${variant}" style="--tee:${color}"><use href="#${product.shape}"/></svg>`;
  }

  /* ---------------- RENDER: PRODUCT GRID ---------------- */
  function renderGrid(){
    const grid = $("#productGrid");
    const items = PRODUCTS.filter(p => activeFilter === "all" || p.cat === activeFilter);
    grid.innerHTML = items.map(p => `
      <article class="product-card reveal" data-id="${p.id}">
        <div class="product-card__art" style="--pc:${p.color}" data-qv="${p.id}">
          ${p.badge ? `<span class="product-card__badge ${p.badge==='Sale'?'sale':''} ${p.soldOut?'sold':''}">${p.badge}</span>` : ""}
          ${teeSVG(p,"front")}
          ${teeSVG(p,"back")}
          <span class="product-card__quick">Quick view</span>
        </div>
        <div class="product-card__body">
          <p class="product-card__cat">${p.catLabel}</p>
          <h3 class="product-card__name">${p.name}</h3>
          <div class="product-card__price-row">
            <span class="product-card__price">${money(p.price)}</span>
            ${p.old ? `<span class="product-card__price--old">${money(p.old)}</span>` : ""}
          </div>
          <button class="product-card__add" data-add="${p.id}" ${p.soldOut ? "disabled" : ""}>
            ${p.soldOut ? "Sold out" : "Add to bag"}
          </button>
        </div>
      </article>
    `).join("");

    observeReveals();

    $$("[data-qv]", grid).forEach(el => el.addEventListener("click", () => openQuickView(el.dataset.qv)));
    $$("[data-add]", grid).forEach(el => el.addEventListener("click", (e) => {
      e.stopPropagation();
      const p = PRODUCTS.find(x => x.id === el.dataset.add);
      if(!p || p.soldOut) return;
      addToCart(p, p.sizes[0], 1);
      pulseAdd(el);
    }));
  }

  function pulseAdd(btn){
    const original = btn.textContent;
    btn.textContent = "Added ✓";
    btn.style.background = "var(--ink)";
    btn.style.color = "#fff";
    setTimeout(() => { btn.textContent = original; btn.style.background=""; btn.style.color=""; }, 900);
  }

  /* ---------------- FILTERS ---------------- */
  $("#shopFilters").addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if(!chip) return;
    activeFilter = chip.dataset.filter;
    $$(".chip", $("#shopFilters")).forEach(c => c.classList.toggle("is-active", c === chip));
    renderGrid();
  });

  $$(".vibe-card").forEach(card => card.addEventListener("click", () => {
    activeFilter = card.dataset.filter;
    $$(".chip", $("#shopFilters")).forEach(c => c.classList.toggle("is-active", c.dataset.filter === activeFilter));
    renderGrid();
    $("#shop").scrollIntoView({ behavior:"smooth", block:"start" });
  }));

  /* ---------------- CART ---------------- */
  function saveCart(){ localStorage.setItem("bb_cart", JSON.stringify(cart)); }

  function addToCart(product, size, qty){
    const existing = cart.find(i => i.id === product.id && i.size === size);
    if(existing){ existing.qty += qty; }
    else{
      cart.push({ id:product.id, name:product.name, price:product.price, color:product.color,
                  tee:product.tee, shape:product.shape, catLabel:product.catLabel, size, qty });
    }
    saveCart();
    renderCart();
    showToast(`${product.name} added to your bag ✿`);
    openCart();
  }

  function updateQty(id, size, delta){
    const item = cart.find(i => i.id === id && i.size === size);
    if(!item) return;
    item.qty += delta;
    if(item.qty <= 0){ cart = cart.filter(i => !(i.id === id && i.size === size)); }
    saveCart();
    renderCart();
  }

  function removeItem(id, size){
    cart = cart.filter(i => !(i.id === id && i.size === size));
    saveCart();
    renderCart();
  }

  function cartCount(){ return cart.reduce((n,i) => n + i.qty, 0); }
  function cartSubtotal(){ return cart.reduce((n,i) => n + i.qty * i.price, 0); }

  function renderCart(){
    $("#cartCount").textContent = cartCount();
    $("#cartSubtotal").textContent = money(cartSubtotal());
    const wrap = $("#cartItems");

    if(cart.length === 0){
      wrap.innerHTML = `
        <div class="cart-drawer__empty">
          <svg viewBox="0 0 24 24"><path d="M4 6h16l-1.5 11a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8L4 6z"/><path d="M8 6a4 4 0 0 1 8 0"/></svg>
          <p>Your bag is feeling a little empty.</p>
        </div>`;
      return;
    }

    wrap.innerHTML = cart.map(i => `
      <div class="cart-item" data-id="${i.id}" data-size="${i.size}">
        <div class="cart-item__art" style="--pc:${i.color}">
          <svg viewBox="0 0 240 280" style="--tee:${i.tee}" class="tee-illustration"><use href="#${i.shape}"/></svg>
        </div>
        <div class="cart-item__info">
          <div>
            <div class="cart-item__name">${i.name}</div>
            <div class="cart-item__meta">${i.catLabel} · Size ${i.size}</div>
          </div>
          <div class="cart-item__row">
            <div class="qty-row">
              <button data-minus>−</button>
              <span>${i.qty}</span>
              <button data-plus>+</button>
            </div>
            <span class="cart-item__price">${money(i.price * i.qty)}</span>
          </div>
          <span class="cart-item__remove" data-remove>Remove</span>
        </div>
      </div>
    `).join("");

    $$(".cart-item", wrap).forEach(row => {
      const id = row.dataset.id, size = row.dataset.size;
      row.querySelector("[data-plus]").addEventListener("click", () => updateQty(id, size, 1));
      row.querySelector("[data-minus]").addEventListener("click", () => updateQty(id, size, -1));
      row.querySelector("[data-remove]").addEventListener("click", () => removeItem(id, size));
    });
  }

  function openCart(){ $("#cartDrawer").classList.add("is-open"); $("#overlay").classList.add("is-open"); document.body.style.overflow="hidden"; }
  function closeCart(){ $("#cartDrawer").classList.remove("is-open"); $("#overlay").classList.remove("is-open"); document.body.style.overflow=""; }

  $("#cartToggle").addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  $("#overlay").addEventListener("click", () => { closeCart(); closeQuickView(); });
  $("#continueShopping").addEventListener("click", closeCart);

  $("#checkoutBtn").addEventListener("click", () => {
    if(cart.length === 0){ showToast("Your bag is empty — add something soft first ✿"); return; }
    showToast("Demo store — checkout isn't wired up yet, but your cart is saved!");
  });

  /* ---------------- QUICK VIEW MODAL ---------------- */
  function openQuickView(id){
    const p = PRODUCTS.find(x => x.id === id);
    if(!p) return;
    qvProduct = p; qvSize = p.sizes[0]; qvQty = 1;

    $("#qvArt").style.setProperty("--pc", p.color);
    $("#qvArt").innerHTML = teeSVG(p, "front");
    $("#qvCat").textContent = p.catLabel;
    $("#qvName").textContent = p.name;
    $("#qvPrice").innerHTML = money(p.price) + (p.old ? ` <span class="product-card__price--old">${money(p.old)}</span>` : "");
    $("#qvDesc").textContent = p.desc;
    $("#qvQty").textContent = qvQty;

    $("#qvSizes").innerHTML = p.sizes.map(s => `<button data-size="${s}" class="${s===qvSize?'is-active':''}">${s}</button>`).join("");
    $$("#qvSizes button").forEach(b => b.addEventListener("click", () => {
      qvSize = b.dataset.size;
      $$("#qvSizes button").forEach(x => x.classList.toggle("is-active", x === b));
    }));

    $("#qvAddToCart").disabled = !!p.soldOut;
    $("#qvAddToCart").textContent = p.soldOut ? "Sold out" : "Add to bag";

    $("#qvOverlay").classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeQuickView(){
    $("#qvOverlay").classList.remove("is-open");
    if(!$("#cartDrawer").classList.contains("is-open")) document.body.style.overflow = "";
  }

  $("#qvClose").addEventListener("click", closeQuickView);
  $("#qvOverlay").addEventListener("click", (e) => { if(e.target.id === "qvOverlay") closeQuickView(); });
  $("#qvQtyMinus").addEventListener("click", () => { qvQty = Math.max(1, qvQty - 1); $("#qvQty").textContent = qvQty; });
  $("#qvQtyPlus").addEventListener("click", () => { qvQty += 1; $("#qvQty").textContent = qvQty; });
  $("#qvAddToCart").addEventListener("click", () => {
    if(!qvProduct || qvProduct.soldOut) return;
    addToCart(qvProduct, qvSize, qvQty);
    closeQuickView();
  });

  /* ---------------- TOAST ---------------- */
  let toastTimer;
  function showToast(msg){
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("is-open");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-open"), 2800);
  }

  /* ---------------- REVIEWS ---------------- */
  function renderReviews(){
    $("#reviewsTrack").innerHTML = REVIEWS.map(r => `
      <div class="review-card">
        <div class="review-card__stars">★★★★★</div>
        <p class="review-card__text">"${r.text}"</p>
        <div class="review-card__name">${r.name}</div>
        <div class="review-card__meta">${r.meta}</div>
      </div>
    `).join("");
  }

  /* ---------------- SEARCH ---------------- */
  $("#searchToggle").addEventListener("click", () => {
    $("#searchPanel").classList.toggle("is-open");
    if($("#searchPanel").classList.contains("is-open")) $("#searchInput").focus();
  });
  $("#searchClose").addEventListener("click", () => $("#searchPanel").classList.remove("is-open"));
  $("#searchInput").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    if(!q){ activeFilter = "all"; renderGrid(); return; }
    const grid = $("#productGrid");
    const matches = PRODUCTS.filter(p => p.name.toLowerCase().includes(q) || p.catLabel.toLowerCase().includes(q));
    grid.innerHTML = matches.length ? matches.map(p => `
      <article class="product-card is-visible" data-id="${p.id}">
        <div class="product-card__art" style="--pc:${p.color}" data-qv="${p.id}">
          ${teeSVG(p,"front")}${teeSVG(p,"back")}
          <span class="product-card__quick">Quick view</span>
        </div>
        <div class="product-card__body">
          <p class="product-card__cat">${p.catLabel}</p>
          <h3 class="product-card__name">${p.name}</h3>
          <div class="product-card__price-row"><span class="product-card__price">${money(p.price)}</span></div>
          <button class="product-card__add" data-add="${p.id}">Add to bag</button>
        </div>
      </article>
    `).join("") : `<p style="grid-column:1/-1;text-align:center;color:var(--ink-soft);padding:40px 0">No bliss found for &ldquo;${q}&rdquo; — try &ldquo;tee&rdquo; or &ldquo;tote&rdquo;.</p>`;
    $$("[data-qv]", grid).forEach(el => el.addEventListener("click", () => openQuickView(el.dataset.qv)));
    $$("[data-add]", grid).forEach(el => el.addEventListener("click", () => {
      const p = PRODUCTS.find(x => x.id === el.dataset.add);
      addToCart(p, p.sizes[0], 1);
      pulseAdd(el);
    }));
  });

  /* ---------------- WISHLIST (lightweight demo) ---------------- */
  $("#wishlistBtn").addEventListener("click", () => {
    showToast(wishlist.length ? "Your saved items are waiting for you ✿" : "Tap the heart on a product's quick view to save it here soon ✿");
  });

  /* ---------------- MOBILE MENU ---------------- */
  $("#menuToggle").addEventListener("click", () => {
    $("#mainNav").classList.toggle("is-open");
    $("#menuToggle").classList.toggle("is-active");
  });
  $$("#mainNav a").forEach(a => a.addEventListener("click", () => {
    $("#mainNav").classList.remove("is-open");
    $("#menuToggle").classList.remove("is-active");
  }));

  /* ---------------- NEWSLETTER ---------------- */
  $("#newsletterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    showToast("You're on the list — welcome to the bliss ✿");
    e.target.reset();
  });

  /* ---------------- CURSOR GLOW ---------------- */
  const hero = $(".hero");
  const glow = $("#cursorGlow");
  if(hero && glow){
    hero.addEventListener("mousemove", (e) => {
      const rect = hero.getBoundingClientRect();
      glow.style.setProperty("--x", (e.clientX - rect.left) + "px");
      glow.style.setProperty("--y", (e.clientY - rect.top) + "px");
    });
  }

  /* ---------------- SCROLL REVEAL ---------------- */
  let revealObserver;
  function observeReveals(){
    if(!revealObserver){
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting){
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold:.15 });
    }
    $$(".reveal:not(.is-visible), .product-card:not(.is-visible)").forEach(el => revealObserver.observe(el));
  }

  /* ---------------- HEADER SHRINK ---------------- */
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const header = $("#siteHeader");
    header.style.boxShadow = window.scrollY > 10 ? "0 6px 18px rgba(36,27,46,.08)" : "none";
    lastScroll = window.scrollY;
  });

  /* ---------------- INIT ---------------- */
  renderGrid();
  renderCart();
  renderReviews();
  observeReveals();
})();
