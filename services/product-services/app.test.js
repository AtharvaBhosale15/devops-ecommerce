
const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("./api");
const pool = require("./db");

test("GET /health confirms database connection", async () => {
  const response = await request(app).get("/health");

  assert.equal(response.status, 200);
  assert.equal(response.body.status, "healthy");
  assert.equal(response.body.database, "connected");
});

test("GET /products returns products from PostgreSQL", async () => {
  const response = await request(app).get("/products");

  assert.equal(response.status, 200);
  assert.equal(response.body.length, 3);
  assert.equal(response.body[0].name, "Laptop");
  assert.equal(Number(response.body[0].price), 55000);
});

test("GET /products/1 returns the Laptop", async () => {
  const response = await request(app).get("/products/1");

  assert.equal(response.status, 200);
  assert.equal(response.body.name, "Laptop");
  assert.equal(Number(response.body.price), 55000);
});

test("GET /products/999 returns 404", async () => {
  const response = await request(app).get("/products/999");

  assert.equal(response.status, 404);
  assert.equal(response.body.error, "Product not found");
});

test("GET /products/abc returns 400", async () => {
  const response = await request(app).get("/products/abc");

  assert.equal(response.status, 400);
  assert.equal(response.body.error, "Invalid product ID");
});

test.after(async () => {
  await pool.end();
});

