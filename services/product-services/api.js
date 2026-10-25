
const express = require("express");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Check that the API and database are responding.
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).json({
      status: "healthy",
      database: "connected",
    });
  } catch (error) {
    console.error("Health check failed:", error.message);
    res.status(503).json({
      status: "unhealthy",
      database: "disconnected",
    });
  }
});

// Retrieve all products from PostgreSQL.
app.get("/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, price FROM products ORDER BY id"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Failed to fetch products:", error.message);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Retrieve one product by its ID.
app.get("/products/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  try {
    const result = await pool.query(
      "SELECT id, name, price FROM products WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to fetch product:", error.message);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

if (require.main === module) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Product service listening on port ${PORT}`);
  });
}

module.exports = app;

