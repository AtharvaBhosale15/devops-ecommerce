
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0)
);

INSERT INTO products (id, name, price)
VALUES
    (1, 'Laptop', 55000),
    (2, 'Keyboard', 1500),
    (3, 'Mouse', 700)
ON CONFLICT (id) DO NOTHING;

SELECT setval(
    pg_get_serial_sequence('products', 'id'),
    (SELECT MAX(id) FROM products)
);

