const express = require("express");
const cors = require("cors");
const db = require("./db");


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

function parseImagesField(imagesValue) {
  try {
    const parsed = imagesValue ? JSON.parse(imagesValue) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function formatProduct(product) {
  return {
    ...product,
    images: parseImagesField(product.images),
  };
}

app.get("/", (req, res) => {
  res.send("MySQL backend is running");
});

/* ===================== PRODUCTS ===================== */

app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products WHERE is_approved = 1 ORDER BY id DESC";

  db.query(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch products" });
    res.json(rows.map(formatProduct));
  });
});

app.get("/my-products/:userId", (req, res) => {
  const { userId } = req.params;
  const sql = "SELECT * FROM products WHERE user_id = ? ORDER BY id DESC";

  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch my products" });
    res.json(rows.map(formatProduct));
  });
});

app.get("/product/:id", (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT products.*, users.first_name, users.last_name
    FROM products
    JOIN users ON products.user_id = users.id
    WHERE products.id = ?
  `;

  db.query(sql, [id], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch product" });

    const row = rows[0];
    if (!row) return res.status(404).json({ error: "Product not found" });

    res.json({
      ...row,
      images: parseImagesField(row.images),
      seller_name: `${row.first_name} ${row.last_name}`,
    });
  });
});

app.post("/products", (req, res) => {
  const { name, price, category, description, type, phone, images, user_id } = req.body;

  const validImages = Array.isArray(images)
    ? images.filter((img) => img && img.trim() !== "")
    : [];

  const mainImage =
    validImages.length > 0
      ? validImages[0]
      : "https://via.placeholder.com/400x300?text=No+Image";

  const sql = `
    INSERT INTO products
    (name, price, category, description, type, phone, image, images, user_id, is_approved)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
  `;

  db.query(
    sql,
    [
      name,
      Number(price),
      category,
      description,
      type,
      phone,
      mainImage,
      JSON.stringify(validImages),
      Number(user_id),
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to add product" });

      res.json({
        message: "Product added successfully",
        id: result.insertId,
      });
    }
  );
});

app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, category, description, type, phone, images } = req.body;

  const validImages = Array.isArray(images)
    ? images.filter((img) => img && img.trim() !== "")
    : [];

  const mainImage =
    validImages.length > 0
      ? validImages[0]
      : "https://via.placeholder.com/400x300?text=No+Image";

  const sql = `
    UPDATE products
    SET name = ?, price = ?, category = ?, description = ?, type = ?, phone = ?, image = ?, images = ?, is_approved = 1
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      name,
      Number(price),
      category,
      description,
      type,
      phone,
      mainImage,
      JSON.stringify(validImages),
      id,
    ],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to update product" });

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.json({
        message: "Product updated successfully",
        changes: result.affectedRows,
      });
    }
  );
});

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM products WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to delete product" });

    res.json({
      message: "Product deleted successfully",
      changes: result.affectedRows,
    });
  });
});

/* ===================== AUTH ===================== */

app.post("/register", (req, res) => {
  const { firstName, lastName, studentId, password, university, faculty } = req.body;

  const sql = `
    INSERT INTO users
    (first_name, last_name, student_id, password, university, faculty, role, is_approved)
    VALUES (?, ?, ?, ?, ?, ?, 'student', 0)
  `;

  db.query(
    sql,
    [firstName, lastName, studentId, password, university, faculty],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to register user" });

      res.json({
        message: "Registration submitted. Waiting for admin approval.",
        id: result.insertId,
      });
    }
  );
});

app.post("/login", (req, res) => {
  const { studentId, password } = req.body;

  const sql = "SELECT * FROM users WHERE student_id = ? AND password = ?";

  db.query(sql, [studentId, password], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to login" });

    const row = rows[0];

    if (!row) {
      return res.status(401).json({ message: "Invalid Student ID or password" });
    }

    if (Number(row.is_approved) !== 1) {
      return res.status(403).json({
        message: "Your account is waiting for admin approval",
      });
    }

    res.json({
      message: "Login successful",
      user: row,
    });
  });
});

/* ===================== ADMIN ===================== */

app.get("/admin/pending-users", (req, res) => {
  const sql =
    "SELECT * FROM users WHERE role = 'student' AND is_approved = 0 ORDER BY id DESC";

  db.query(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch pending users" });
    res.json(rows);
  });
});

app.put("/admin/approve-user/:id", (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE users SET is_approved = 1 WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to approve user" });
    res.json({ message: "User approved successfully" });
  });
});

app.delete("/admin/delete-user/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM users WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to delete user" });

    res.json({
      message: "User deleted successfully",
      changes: result.affectedRows,
    });
  });
});

app.delete("/admin/delete-product/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM products WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Failed to delete product" });

    res.json({
      message: "Product deleted successfully",
      changes: result.affectedRows,
    });
  });
});

app.get("/admin/all-products", (req, res) => {
  const sql = "SELECT * FROM products ORDER BY id DESC";

  db.query(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch products" });
    res.json(rows.map(formatProduct));
  });
});

app.get("/admin/all-users", (req, res) => {
  const sql = "SELECT * FROM users ORDER BY id DESC";

  db.query(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch users" });
    res.json(rows);
  });
});

app.get("/admin/pending-products", (req, res) => {
  const sql = "SELECT * FROM products WHERE is_approved = 0 ORDER BY id DESC";

  db.query(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch pending products" });
    res.json(rows.map(formatProduct));
  });
});

app.put("/admin/approve-product/:id", (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE products SET is_approved = 1 WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: "Failed to approve product" });
    res.json({ message: "Product approved successfully" });
  });
});

/* ===================== CHAT ===================== */

app.get("/chat/:productId/:userId", (req, res) => {
  const { productId } = req.params;

  const sql = `
    SELECT * FROM messages
    WHERE product_id = ?
    ORDER BY id ASC
  `;
  

  db.query(sql, [productId], (err, rows) => {
    if (err) {
      console.error("Error fetching messages:", err.message);
      return res.status(500).json({ error: "Failed to fetch messages" });
    }

    res.json(rows);
  });
});


app.post("/chat", (req, res) => {
  const { product_id, sender_id, sender_name, receiver_id, message } = req.body;

  if (!product_id || !sender_id || !sender_name || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const sql = `
    INSERT INTO messages (product_id, sender_id, sender_name, receiver_id, message)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [product_id, sender_id, sender_name, receiver_id || null, message],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Failed to send message" });

      res.json({
        message: "Message sent successfully",
        id: result.insertId,
      });
    }
  );
});

app.get("/conversations/:userId", (req, res) => {
  const { userId } = req.params;

  const sql = `
    SELECT
      m.product_id,
      p.name AS product_name,
      p.image AS product_image,
      MAX(m.id) AS last_message_id,
      MAX(m.created_at) AS last_time
    FROM messages m
    LEFT JOIN products p ON p.id = m.product_id
    WHERE m.sender_id = ? OR m.receiver_id = ?
    GROUP BY m.product_id, p.name, p.image
    ORDER BY last_message_id DESC
  `;

  db.query(sql, [userId, userId], (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch conversations" });

    if (!rows.length) return res.json([]);

    const productIds = rows.map((r) => r.product_id);
    const placeholders = productIds.map(() => "?").join(",");

    const sqlLastMessages = `
      SELECT m.*
      FROM messages m
      INNER JOIN (
        SELECT product_id, MAX(id) AS max_id
        FROM messages
        WHERE product_id IN (${placeholders})
        GROUP BY product_id
      ) grouped
      ON m.product_id = grouped.product_id AND m.id = grouped.max_id
      ORDER BY m.id DESC
    `;

    db.query(sqlLastMessages, productIds, (err2, lastMessages) => {
      if (err2) return res.status(500).json({ error: "Failed to fetch conversations" });

      const finalRows = rows.map((conv) => {
        const lastMsg = lastMessages.find((m) => m.product_id === conv.product_id);
        return {
          ...conv,
          last_message: lastMsg ? lastMsg.message : "",
          sender_name: lastMsg ? lastMsg.sender_name : "",
        };
      });

      res.json(finalRows);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
