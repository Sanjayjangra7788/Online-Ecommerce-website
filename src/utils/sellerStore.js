// src/utils/sellerStore.js
// ──────────────────────────────────────────────────────────────────
// TEMPORARY session-based store (localStorage) for:
//   1. User roles (buyer / seller / admin)
//   2. Seller-added products
//
// ⚠️ BACKEND INTEGRATION NOTE:
// Jab apna backend ready ho, sirf is file ke andar ke functions ka
// implementation badalna hai (fetch calls lagane hain) — baaki poora
// app (components, redux) inhi function names ko call karta rahega,
// kahin aur kuch change nahi karna padega. Function signatures wahi
// rakhna jo yahan hain.
// ──────────────────────────────────────────────────────────────────

import { ADMIN_EMAILS } from "../config/roles";

const ROLES_KEY    = "sanvora_user_roles";      // { [email]: { role, name, joinedAt } }
const PRODUCTS_KEY = "sanvora_seller_products"; // [ product, product, ... ]
const SELLER_ID_BASE = 900000; // dummyjson ids are small numbers, sellers ids start way above

// ── Roles ────────────────────────────────────────────────────────

function readRoles() {
  try {
    return JSON.parse(localStorage.getItem(ROLES_KEY)) || {};
  } catch {
    return {};
  }
}

function writeRoles(map) {
  localStorage.setItem(ROLES_KEY, JSON.stringify(map));
}

/** Returns 'admin' | 'seller' | 'buyer' for a given email. */
export function getRole(email) {
  if (!email) return "buyer";
  if (ADMIN_EMAILS.includes(email.toLowerCase())) return "admin";
  const roles = readRoles();
  return roles[email]?.role || "buyer";
}

/** Sets/updates a user's role. Used at registration time. */
export function setRole(email, role, name = "") {
  if (!email) return;
  const roles = readRoles();
  roles[email] = {
    role,
    name: name || roles[email]?.name || "",
    joinedAt: roles[email]?.joinedAt || new Date().toISOString(),
  };
  writeRoles(roles);
}

/** All registered sellers — used by the Admin panel. */
export function getAllSellers() {
  const roles = readRoles();
  return Object.entries(roles)
    .filter(([, v]) => v.role === "seller")
    .map(([email, v]) => ({ email, ...v }));
}

// ── Seller Products ─────────────────────────────────────────────

function readProducts() {
  try {
    return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
  } catch {
    return [];
  }
}

function writeProducts(list) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
}

/** All seller-added products (across all sellers) — newest first. */
export function getSellerProducts() {
  return readProducts();
}

/** Products belonging to one seller. */
export function getProductsBySeller(email) {
  return readProducts().filter((p) => p.sellerEmail === email);
}

/** Adds a new seller product, generates a unique numeric id, returns it. */
export function addSellerProduct(product) {
  const list = readProducts();
  const nextId = SELLER_ID_BASE + list.length + Math.floor(Math.random() * 1000);
  const newProduct = {
    ...product,
    id: nextId,
    isSellerProduct: true,
    createdAt: new Date().toISOString(),
  };
  list.unshift(newProduct); // newest first so it shows up front on listing pages
  writeProducts(list);
  return newProduct;
}

/** Updates an existing seller product by id (only its own fields). */
export function updateSellerProduct(id, patch) {
  const list = readProducts();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...patch };
  writeProducts(list);
  return list[idx];
}

/** Removes a seller product by id. Admin or the owning seller can call this. */
export function deleteSellerProduct(id) {
  const list = readProducts().filter((p) => p.id !== id);
  writeProducts(list);
}

/** Fetches a single seller product by id (used to prefill the Edit form). */
export function getSellerProductById(id) {
  return readProducts().find((p) => p.id === Number(id)) || null;
}

/**
 * Order place hone par stock kam karta hai. Stock 0 se neeche nahi jaata.
 * Returns updated product (ya null agar product hi na mila — dummy API
 * catalog products ke liye ye normal hai, unka stock yahan track nahi hota).
 */
export function decrementStock(id, qty) {
  const list = readProducts();
  const idx = list.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const newStock = Math.max(0, (list[idx].stock || 0) - qty);
  list[idx] = { ...list[idx], stock: newStock };
  writeProducts(list);
  return list[idx];
}

// ── Sales (derived from orders) ─────────────────────────────────────────
// Orders khud order slice/localStorage me store hote hain — ye function
// sirf un orders ko ek seller ke liye "sale line items" me todta hai.
// Koi alag storage nahi, taaki ek hi source of truth rahe.

/**
 * `allOrders` (redux order slice se) ko liya aur ek seller ke bikey hue
 * items nikaal ke flat list banayi — naya (latest order) sabse upar.
 */
export function getSalesForSeller(sellerEmail, allOrders = []) {
  if (!sellerEmail) return [];
  const sales = [];
  allOrders.forEach((order) => {
    (order.orderItems || []).forEach((item) => {
      if (item.sellerEmail === sellerEmail) {
        sales.push({
          orderId: order.id,
          orderDate: order.orderDate,
          status: order.status,
          buyerName: order.buyerName || order.shippingAddress?.fullName || "Customer",
          buyerEmail: order.buyerEmail || "",
          productId: item.id,
          title: item.title,
          thumbnail: item.thumbnail,
          quantity: item.quantity,
          price: item.price,
          lineTotal: item.price * item.quantity,
        });
      }
    });
  });
  return sales;
}

export { SELLER_ID_BASE };
