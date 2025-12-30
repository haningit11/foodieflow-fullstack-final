const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

/* =========================
   MYSQL CONNECTION
========================= */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",          // your MySQL password
  database: "foodieflow" // your database name
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection error:", err.message);
  } else {
    console.log("✅ MySQL connected");
  }
});

// No local image serving; menu.image must be full online URLs


/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "foodieflow-backend" });
});

/* =========================
   USERS (SIGNUP / LOGIN)
========================= */

// SIGNUP
app.post("/signup", async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const q = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(q, [username, email, hashedPassword, role || "user"], (err, result) => {
      if (err) {
        console.error("❌ Signup error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      // Return the new user object (without password)
      return res.json({
        id: result.insertId,
        username,
        email,
        role: role || "user",
      });
    });
  } catch (e) {
    return res.status(500).json({ error: "Server error" });
  }
});

// LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  const q = "SELECT * FROM users WHERE username = ?";
  db.query(q, [username], async (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    // Return user info (without password)
    return res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  });
});

/* =========================
   ADMIN: USERS
========================= */
// List users
app.get("/users", (req, res) => {
  const q = "SELECT id, username, email, role FROM users ORDER BY id DESC";
  db.query(q, (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    return res.json(rows);
  });
});

// Update user role
app.put("/users/:id/role", (req, res) => {
  const { role } = req.body;
  if (!role) return res.status(400).json({ error: "Missing role" });
  const q = "UPDATE users SET role = ? WHERE id = ?";
  db.query(q, [role, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
    return res.json({ message: "Role updated" });
  });
});

// Delete user
app.delete("/users/:id", (req, res) => {
  const q = "DELETE FROM users WHERE id = ?";
  db.query(q, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "User not found" });
    return res.json({ message: "User deleted" });
  });
});

/* =========================
   MENU (CRUD)
========================= */

// GET all menu items
app.get("/menu", (req, res) => {
  const q = "SELECT * FROM menu";
  db.query(q, (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    return res.json(rows);
  });
});

// GET single item
app.get("/menu/:id", (req, res) => {
  const q = "SELECT * FROM menu WHERE id = ?";
  db.query(q, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (rows.length === 0) return res.status(404).json({ error: "Item not found" });
    return res.json(rows[0]);
  });
});

// CREATE item
app.post("/menu/create", (req, res) => {
  const { name, category, price, description, image } = req.body;

  if (!name || !category || !price) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (image && !(typeof image === "string" && /^https?:\/\//.test(image))) {
    return res.status(400).json({ error: "image must be a full online URL (http/https)" });
  }

  const q = "INSERT INTO menu (name, category, price, description, image) VALUES (?, ?, ?, ?, ?)";
  db.query(q, [name, category, price, description || "", image || ""], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    return res.json({ message: "Menu item created successfully", id: result.insertId });
  });
});

// UPDATE item
app.put("/menu/update/:id", (req, res) => {
  const { name, category, price, description, image } = req.body;
  const q = "UPDATE menu SET name=?, category=?, price=?, description=?, image=? WHERE id=?";

  if (image && !(typeof image === "string" && /^https?:\/\//.test(image))) {
    return res.status(400).json({ error: "image must be a full online URL (http/https)" });
  }

  db.query(q, [name, category, price, description || "", image || "", req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Item not found" });
    return res.json({ message: "Menu item updated successfully" });
  });
});

// DELETE item
app.delete("/menu/delete/:id", (req, res) => {
  const q = "DELETE FROM menu WHERE id = ?";
  db.query(q, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Item not found" });
    return res.json({ message: "Menu item deleted successfully" });
  });
});

/* =========================
   FAVORITES
========================= */
// Add favorite (enforce unique by user_id + menu_id)
app.post("/favorites", (req, res) => {
  const { user_id, menu_id } = req.body;
  if (!user_id || !menu_id) return res.status(400).json({ error: "Missing user_id or menu_id" });
  const checkQ = "SELECT id FROM favorites WHERE user_id = ? AND menu_id = ? LIMIT 1";
  db.query(checkQ, [user_id, menu_id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (rows.length > 0) return res.status(409).json({ error: "Already favorited" });
    const insQ = "INSERT INTO favorites (user_id, menu_id, created_at) VALUES (?, ?, NOW())";
    db.query(insQ, [user_id, menu_id], (err2) => {
      if (err2) return res.status(500).json({ error: "Database error" });
      return res.json({ message: "Favorite added" });
    });
  });
});

// Admin: list all favorites with user and menu details
app.get("/favorites/all", (req, res) => {
  const q =
    "SELECT f.id, f.user_id, u.username, u.email, f.menu_id, m.name AS menu_name, m.image, f.created_at " +
    "FROM favorites f " +
    "LEFT JOIN users u ON u.id = f.user_id " +
    "LEFT JOIN menu m ON m.id = f.menu_id " +
    "ORDER BY f.created_at DESC";
  db.query(q, (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    return res.json(rows);
  });
});

// Get favorites for user
app.get("/favorites/:userId", (req, res) => {
  const q = "SELECT id, user_id, menu_id, created_at FROM favorites WHERE user_id = ? ORDER BY created_at DESC";
  db.query(q, [req.params.userId], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    return res.json(rows);
  });
});

// Admin: favorites stats (most favorited items)
app.get("/favorites/stats", (req, res) => {
  const q =
    "SELECT f.menu_id, COUNT(*) AS count, m.name AS menu_name " +
    "FROM favorites f LEFT JOIN menu m ON m.id = f.menu_id " +
    "GROUP BY f.menu_id ORDER BY count DESC";
  db.query(q, (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    return res.json(rows);
  });
});

// Admin: list all favorites with user and menu details
app.get("/favorites/all", (req, res) => {
  const q =
    "SELECT f.id, f.user_id, u.username, u.email, f.menu_id, m.name AS menu_name, m.image, f.created_at " +
    "FROM favorites f " +
    "LEFT JOIN users u ON u.id = f.user_id " +
    "LEFT JOIN menu m ON m.id = f.menu_id " +
    "ORDER BY f.created_at DESC";
  db.query(q, (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    return res.json(rows);
  });
});
// Remove favorite
app.delete("/favorites", (req, res) => {
  const { user_id, menu_id } = req.body;
  if (!user_id || !menu_id) return res.status(400).json({ error: "Missing user_id or menu_id" });
  const delQ = "DELETE FROM favorites WHERE user_id = ? AND menu_id = ?";
  db.query(delQ, [user_id, menu_id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Favorite not found" });
    return res.json({ message: "Favorite removed" });
  });
});

/* =========================
   ORDERS & ORDER ITEMS
========================= */
// Create order (used for cart persistence)
app.post("/orders", (req, res) => {
  const { user_id, status, payment_method } = req.body;
  if (!user_id) return res.status(400).json({ error: "Missing user_id" });
  const q =
    "INSERT INTO orders (user_id, order_date, status, total_price, payment_method) VALUES (?, NOW(), ?, ?, ?)";
  db.query(q, [user_id, status || "pending", 0, payment_method || "none"], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    return res.json({ id: result.insertId, message: "Order created" });
  });
});

// Add item to order
app.post("/order_items", (req, res) => {
  const { order_id, menu_id, quantity, price } = req.body;
  if (!order_id || !menu_id || !quantity) {
    return res.status(400).json({ error: "Missing order_id, menu_id, or quantity" });
  }
  const insQ = "INSERT INTO order_items (order_id, menu_id, quantity, price) VALUES (?, ?, ?, ?)";
  db.query(insQ, [order_id, menu_id, quantity, price || 0], (err) => {
    if (err) return res.status(500).json({ error: "Database error" });
    const updQ =
      "UPDATE orders o SET total_price = (SELECT COALESCE(SUM(quantity * price), 0) FROM order_items WHERE order_id = o.id) WHERE o.id = ?";
    db.query(updQ, [order_id], (err2) => {
      if (err2) return res.status(500).json({ error: "Database error" });
      return res.json({ message: "Item added to order" });
    });
  });
});

// Get orders for user (with items nested)
app.get("/orders/:userId", (req, res) => {
  const ordersQ =
    "SELECT id, user_id, order_date, status, total_price, payment_method FROM orders WHERE user_id = ? ORDER BY order_date DESC";
  db.query(ordersQ, [req.params.userId], (err, orders) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!orders || orders.length === 0) return res.json([]);
    const ids = orders.map((o) => o.id);
    const itemsQ =
      "SELECT oi.id, oi.order_id, oi.menu_id, oi.quantity, oi.price, m.name AS menu_name, m.image AS menu_image FROM order_items oi LEFT JOIN menu m ON m.id = oi.menu_id WHERE oi.order_id IN (" +
      ids.map(() => "?").join(",") +
      ")";
    db.query(itemsQ, ids, (err2, items) => {
      if (err2) return res.status(500).json({ error: "Database error" });
      const byOrder = {};
      (items || []).forEach((it) => {
        byOrder[it.order_id] = byOrder[it.order_id] || [];
        byOrder[it.order_id].push({
          id: it.id,
          order_id: it.order_id,
          menu_id: it.menu_id,
          quantity: it.quantity,
          price: it.price,
          menu_name: it.menu_name || null,
          menu_image: it.menu_image || null,
        });
      });
      const enriched = orders.map((o) => ({ ...o, items: byOrder[o.id] || [] }));
      return res.json(enriched);
    });
  });
});

// Admin: Get all orders with items
app.get("/orders", (req, res) => {
  const ordersQ =
    "SELECT id, user_id, order_date, status, total_price, payment_method FROM orders ORDER BY order_date DESC";
  db.query(ordersQ, (err, orders) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!orders || orders.length === 0) return res.json([]);
    const ids = orders.map((o) => o.id);
    const itemsQ =
      "SELECT oi.id, oi.order_id, oi.menu_id, oi.quantity, oi.price, m.name AS menu_name, m.image AS menu_image FROM order_items oi LEFT JOIN menu m ON m.id = oi.menu_id WHERE oi.order_id IN (" +
      ids.map(() => "?").join(",") +
      ")";
    db.query(itemsQ, ids, (err2, items) => {
      if (err2) return res.status(500).json({ error: "Database error" });
      const byOrder = {};
      (items || []).forEach((it) => {
        byOrder[it.order_id] = byOrder[it.order_id] || [];
        byOrder[it.order_id].push({
          id: it.id,
          order_id: it.order_id,
          menu_id: it.menu_id,
          quantity: it.quantity,
          price: it.price,
          menu_name: it.menu_name || null,
          menu_image: it.menu_image || null,
        });
      });
      const enriched = orders.map((o) => ({ ...o, items: byOrder[o.id] || [] }));
      return res.json(enriched);
    });
  });
});

// Update order status
app.put("/orders/:id/status", (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: "Missing status" });
  const q = "UPDATE orders SET status = ? WHERE id = ?";
  db.query(q, [status, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Order not found" });
    return res.json({ message: "Order status updated" });
  });
});

/* =========================
   CART
========================= */
app.get("/cart/:userId", (req, res) => {
  const userId = req.params.userId;
  const q =
    "SELECT c.user_id, c.menu_id, c.quantity, m.name AS menu_name, m.price AS menu_price " +
    "FROM cart c LEFT JOIN menu m ON m.id = c.menu_id WHERE c.user_id = ? ORDER BY c.created_at DESC";
  db.query(q, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    return res.json(rows || []);
  });
});

app.post("/cart/:userId", (req, res) => {
  const userId = req.params.userId;
  const { menu_id, quantity } = req.body;
  if (!menu_id || !quantity) return res.status(400).json({ error: "Missing menu_id or quantity" });
  const checkQ = "SELECT id, quantity FROM cart WHERE user_id = ? AND menu_id = ? LIMIT 1";
  db.query(checkQ, [userId, menu_id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (rows.length > 0) {
      const updQ = "UPDATE cart SET quantity = quantity + ? WHERE id = ?";
      db.query(updQ, [quantity, rows[0].id], (err2) => {
        if (err2) return res.status(500).json({ error: "Database error" });
        return res.json({ message: "Cart item updated" });
      });
    } else {
      const insQ = "INSERT INTO cart (user_id, menu_id, quantity, created_at) VALUES (?, ?, ?, NOW())";
      db.query(insQ, [userId, menu_id, quantity], (err3) => {
        if (err3) return res.status(500).json({ error: "Database error" });
        return res.json({ message: "Cart item added" });
      });
    }
  });
});

app.delete("/cart/:userId/item/:itemId", (req, res) => {
  const userId = req.params.userId;
  const itemId = req.params.itemId;
  const delQ = "DELETE FROM cart WHERE user_id = ? AND menu_id = ?";
  db.query(delQ, [userId, itemId], (err) => {
    if (err) return res.status(500).json({ error: "Database error" });
    return res.json({ message: "Item removed" });
  });
});

app.put("/cart/:userId/item/:itemId", (req, res) => {
  const userId = req.params.userId;
  const itemId = req.params.itemId;
  const { quantity } = req.body;
  if (typeof quantity !== "number") return res.status(400).json({ error: "Missing quantity" });
  if (quantity <= 0) {
    const delQ = "DELETE FROM cart WHERE user_id = ? AND menu_id = ?";
    db.query(delQ, [userId, itemId], (err) => {
      if (err) return res.status(500).json({ error: "Database error" });
      return res.json({ message: "Item removed" });
    });
  } else {
    const updQ = "UPDATE cart SET quantity = ? WHERE user_id = ? AND menu_id = ?";
    db.query(updQ, [quantity, userId, itemId], (err) => {
      if (err) return res.status(500).json({ error: "Database error" });
      return res.json({ message: "Item quantity updated" });
    });
  }
});

app.delete("/cart/:userId", (req, res) => {
  const userId = req.params.userId;
  const delQ = "DELETE FROM cart WHERE user_id = ?";
  db.query(delQ, [userId], (err) => {
    if (err) return res.status(500).json({ error: "Database error" });
    return res.json({ message: "Cart cleared" });
  });
});

/* =========================
   CART: GUEST SUPPORT
========================= */
function ensureGuestUser(token, cb) {
  const username = `guest:${token}`;
  const findQ = "SELECT id FROM users WHERE username = ? LIMIT 1";
  db.query(findQ, [username], async (err, rows) => {
    if (err) return cb(err);
    if (rows && rows.length > 0) return cb(null, rows[0].id);
    try {
      const hashed = await bcrypt.hash("guest", 10);
      const email = `${token}@guest.local`;
      const insQ = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)";
      db.query(insQ, [username, email, hashed, "guest"], (err2, result) => {
        if (err2) return cb(err2);
        return cb(null, result.insertId);
      });
    } catch (e) {
      return cb(e);
    }
  });
}

app.get("/cart/guest/:token", (req, res) => {
  const token = req.params.token;
  ensureGuestUser(token, (err, guestId) => {
    if (err) return res.status(500).json({ error: "Database error" });
    const q =
      "SELECT c.user_id, c.menu_id, c.quantity, m.name AS menu_name, m.price AS menu_price " +
      "FROM cart c LEFT JOIN menu m ON m.id = c.menu_id WHERE c.user_id = ? ORDER BY c.created_at DESC";
    db.query(q, [guestId], (err2, rows) => {
      if (err2) return res.status(500).json({ error: "Database error" });
      return res.json(rows || []);
    });
  });
});

app.post("/cart/guest/:token", (req, res) => {
  const token = req.params.token;
  const { menu_id, quantity } = req.body;
  if (!menu_id || !quantity) return res.status(400).json({ error: "Missing menu_id or quantity" });
  ensureGuestUser(token, (err, guestId) => {
    if (err) return res.status(500).json({ error: "Database error" });
    const checkQ = "SELECT id, quantity FROM cart WHERE user_id = ? AND menu_id = ? LIMIT 1";
    db.query(checkQ, [guestId, menu_id], (err2, rows) => {
      if (err2) return res.status(500).json({ error: "Database error" });
      if (rows && rows.length > 0) {
        const updQ = "UPDATE cart SET quantity = quantity + ? WHERE id = ?";
        db.query(updQ, [quantity, rows[0].id], (err3) => {
          if (err3) return res.status(500).json({ error: "Database error" });
          return res.json({ message: "Cart item updated" });
        });
      } else {
        const insQ = "INSERT INTO cart (user_id, menu_id, quantity, created_at) VALUES (?, ?, ?, NOW())";
        db.query(insQ, [guestId, menu_id, quantity], (err4) => {
          if (err4) return res.status(500).json({ error: "Database error" });
          return res.json({ message: "Cart item added" });
        });
      }
    });
  });
});

app.put("/cart/guest/:token/item/:itemId", (req, res) => {
  const token = req.params.token;
  const itemId = req.params.itemId;
  const { quantity } = req.body;
  if (typeof quantity !== "number") return res.status(400).json({ error: "Missing quantity" });
  ensureGuestUser(token, (err, guestId) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (quantity <= 0) {
      const delQ = "DELETE FROM cart WHERE user_id = ? AND menu_id = ?";
      db.query(delQ, [guestId, itemId], (err2) => {
        if (err2) return res.status(500).json({ error: "Database error" });
        return res.json({ message: "Item removed" });
      });
    } else {
      const updQ = "UPDATE cart SET quantity = ? WHERE user_id = ? AND menu_id = ?";
      db.query(updQ, [quantity, guestId, itemId], (err3) => {
        if (err3) return res.status(500).json({ error: "Database error" });
        return res.json({ message: "Item quantity updated" });
      });
    }
  });
});

app.delete("/cart/guest/:token/item/:itemId", (req, res) => {
  const token = req.params.token;
  const itemId = req.params.itemId;
  ensureGuestUser(token, (err, guestId) => {
    if (err) return res.status(500).json({ error: "Database error" });
    const delQ = "DELETE FROM cart WHERE user_id = ? AND menu_id = ?";
    db.query(delQ, [guestId, itemId], (err2) => {
      if (err2) return res.status(500).json({ error: "Database error" });
      return res.json({ message: "Item removed" });
    });
  });
});

app.delete("/cart/guest/:token", (req, res) => {
  const token = req.params.token;
  ensureGuestUser(token, (err, guestId) => {
    if (err) return res.status(500).json({ error: "Database error" });
    const delQ = "DELETE FROM cart WHERE user_id = ?";
    db.query(delQ, [guestId], (err2) => {
      if (err2) return res.status(500).json({ error: "Database error" });
      return res.json({ message: "Cart cleared" });
    });
  });
});
/* =========================
   REVIEWS
========================= */
// Submit review (optionally enforce that user has ordered the item)
app.post("/reviews", (req, res) => {
  const { user_id, menu_id, rating, comment } = req.body;
  if (!user_id || !menu_id || !rating || !comment) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const checkQ =
    "SELECT oi.id FROM orders o JOIN order_items oi ON oi.order_id = o.id WHERE o.user_id = ? AND oi.menu_id = ? LIMIT 1";
  db.query(checkQ, [user_id, menu_id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (rows.length === 0) {
      // Frontend already checks, but we enforce server-side too
      return res.status(403).json({ error: "You can only review items you have ordered" });
    }
    const insQ =
      "INSERT INTO reviews (user_id, menu_id, rating, comment, created_at) VALUES (?, ?, ?, ?, NOW())";
    db.query(insQ, [user_id, menu_id, rating, comment], (err2, result) => {
      if (err2) return res.status(500).json({ error: "Database error" });
      return res.json({ id: result.insertId, message: "Review submitted" });
    });
  });
});

// Fetch reviews for a menu item
app.get("/reviews/:menuId", (req, res) => {
  const q =
    "SELECT user_id, menu_id, rating, comment, created_at FROM reviews WHERE menu_id = ? ORDER BY created_at DESC";
  db.query(q, [req.params.menuId], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    return res.json(rows);
  });
});

// Admin: list all reviews
app.get("/reviews", (req, res) => {
  const q =
    "SELECT r.id, r.user_id, r.menu_id, r.rating, r.comment, r.created_at, u.username, m.name AS menu_name " +
    "FROM reviews r " +
    "LEFT JOIN users u ON u.id = r.user_id " +
    "LEFT JOIN menu m ON m.id = r.menu_id " +
    "ORDER BY r.created_at DESC";
  db.query(q, (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    return res.json(rows);
  });
});

// Admin: delete review
app.delete("/reviews/:id", (req, res) => {
  const q = "DELETE FROM reviews WHERE id = ?";
  db.query(q, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Review not found" });
    return res.json({ message: "Review deleted" });
  });
});

/* =========================
   SERVER START
========================= */
const PORT = 5000; // fixed to 5000 for consistency
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
