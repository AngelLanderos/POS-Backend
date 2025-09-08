--CREATE TYPE user_role AS ENUM ('waiter','bartender','cashier','admin');
--CREATE TYPE table_status AS ENUM ('free','occupied','reserved','maintenance');
--CREATE TYPE order_status AS ENUM ('open','closed','cancelled');
--CREATE TYPE account_status AS ENUM ('pending','paid','refunded');
--CREATE TYPE modifier_type AS ENUM ('extra','substitution','discount','preparation');
--CREATE TYPE payment_method AS ENUM ('cash','card','transfer','other');

CREATE TABLE product_categories (
  product_category_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

-- 2) Usuarios
CREATE TABLE users (
  user_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(150),
  role user_role NOT NULL DEFAULT 'waiter',
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3) Mesas
CREATE TABLE tables (
  table_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  table_number INTEGER NOT NULL UNIQUE,
  status table_status NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4) Productos (base)
CREATE TABLE products (
  product_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  category_id INTEGER REFERENCES product_categories(product_category_id) ON DELETE SET NULL,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  base_price NUMERIC(10,2),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- 5) Variantes (tamaños, por ejemplo 500ml / 1L)
CREATE TABLE product_variants (
  product_variant_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
  name VARCHAR(80) NOT NULL,        -- ej: "500 ml", "1 L"
  price NUMERIC(10,2) NOT NULL,
  volume_ml INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- 6) Modificadores (poco hielo, extra limón, descuentos)
CREATE TABLE modifiers (
  modifier_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type modifier_type NOT NULL DEFAULT 'preparation',
  price_adjustment NUMERIC(10,2) DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- 7) Pedidos (order)
CREATE TABLE orders (
  order_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  table_id INTEGER NOT NULL REFERENCES tables(table_id) ON DELETE RESTRICT,
  status order_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  closed_at TIMESTAMPTZ
);

-- 8) Cuentas dentro de un pedido (split bills)
CREATE TABLE order_accounts (
  order_account_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  customer_name VARCHAR(150),
  status account_status NOT NULL DEFAULT 'pending',
  total NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9) Items (líneas de pedido). Guardamos snapshot y unit_price
CREATE TABLE order_items (
  order_item_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_account_id INTEGER NOT NULL REFERENCES order_accounts(order_account_id) ON DELETE CASCADE,
  product_variant_id INTEGER NOT NULL REFERENCES product_variants(product_variant_id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,         -- precio al momento de venta
  discount NUMERIC(10,2) DEFAULT 0,          -- monto fijo de descuento en la línea
  notes TEXT,
  product_snapshot JSONB,                    -- opcional: {product_name, variant_name, extras...}
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10) Relación entre items y modificadores (guardando ajuste aplicado)
CREATE TABLE order_item_modifiers (
  order_item_modifier_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_item_id INTEGER NOT NULL REFERENCES order_items(order_item_id) ON DELETE CASCADE,
  modifier_id INTEGER NOT NULL REFERENCES modifiers(modifier_id),
  price_adjustment NUMERIC(10,2) NOT NULL DEFAULT 0
);

-- 11) Asignaciones de mesera <-> mesa (historial)
CREATE TABLE waiter_tables (
  waitress_table_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  waitress_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE SET NULL,
  table_id INTEGER NOT NULL REFERENCES tables(table_id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  released_at TIMESTAMPTZ
);

-- 12) Pagos aplicados a una cuenta
CREATE TABLE payments (
  payment_id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_account_id INTEGER NOT NULL REFERENCES order_accounts(order_account_id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  method payment_method NOT NULL,
  reference VARCHAR(255),
  paid_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
