# Cambios en la base de datos
## Se agrego un campo para la imagen a cada producto
ALTER TABLE products
ADD COLUMN image_url varchar;

## Se agrego una tabla de imagenes para los productos
CREATE TABLE product_images (
  product_image_id serial PRIMARY KEY,
  product_id integer REFERENCES products(product_id) ON DELETE CASCADE,
  url varchar NOT NULL,
  width int,
  height int,
  size_bytes int,
  mime varchar,
  role varchar DEFAULT 'primary', -- 'primary', 'gallery', 'thumb'
  created_at timestamp DEFAULT now()
);

