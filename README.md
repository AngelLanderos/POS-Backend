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

## Se agrego el campo de image_url
ALTER TABLE products 
add COLUmn image_url varchar;

UPDATE "public"."products" SET "image_url" = './assets/drinks/Mojito_clasico.png' WHERE "product_id" = 24;

UPDATE "public"."products" SET "image_url" = './assets/drinks/Mojito_mango.png' WHERE "product_id" = 25;

UPDATE "public"."products" SET "image_url" = './assets/drinks/Cubanito.png' WHERE "product_id" = 26;

UPDATE "public"."products" SET "image_url" = './assets/drinks/Piña_colada.png' WHERE "product_id" = 30;

UPDATE "public"."products" SET "image_url" = './assets/drinks/Paloma.png' WHERE "product_id" = 32;

UPDATE "public"."products" SET "image_url" = './assets/drinks/Vampiro.png' WHERE "product_id" = 31;

UPDATE "public"."products" SET "image_url" = './assets/drinks/Perla_negra.png' WHERE "product_id" = 33;

UPDATE "public"."products" SET "image_url" = './assets/drinks/1800.png' WHERE "product_id" = 9;
UPDATE "public"."products" SET "image_url" = './assets/drinks/1800.png' WHERE "product_id" = 20;
UPDATE "public"."products" SET "image_url" = './assets/drinks/1800.png' WHERE "product_id" = 62;
UPDATE "public"."products" SET "image_url" = './assets/drinks/DonJulio.png' WHERE "product_id" = 63;
UPDATE "public"."products" SET "image_url" = './assets/drinks/DonJulio.png' WHERE "product_id" = 21;
UPDATE "public"."products" SET "image_url" = './assets/drinks/DonJulio.png' WHERE "product_id" = 10;
UPDATE "public"."products" SET "image_url" = './assets/drinks/CentenarioPlata.png' WHERE "product_id" = 1;
UPDATE "public"."products" SET "image_url" = './assets/drinks/CentenarioPlata.png' WHERE "product_id" = 12;
UPDATE "public"."products" SET "image_url" = './assets/drinks/CentenarioPlata.png' WHERE "product_id" = 54;
UPDATE "public"."products" SET "image_url" = './assets/drinks/CentenarioReposado.png' WHERE "product_id" = 55;
UPDATE "public"."products" SET "image_url" = './assets/drinks/CentenarioReposado.png' WHERE "product_id" = 13;
UPDATE "public"."products" SET "image_url" = './assets/drinks/CentenarioReposado.png' WHERE "product_id" = 2;
UPDATE "public"."products" SET "image_url" = './assets/drinks/Sauza.png' WHERE "product_id" = 3;
UPDATE "public"."products" SET "image_url" = './assets/drinks/Sauza.png' WHERE "product_id" = 14;
UPDATE "public"."products" SET "image_url" = './assets/drinks/Sauza.png' WHERE "product_id" = 56;
UPDATE "public"."products" SET "image_url" = './assets/drinks/Hornitos.png' WHERE "product_id" = 57;
UPDATE "public"."products" SET "image_url" = './assets/drinks/Hornitos.png' WHERE "product_id" = 15;
UPDATE "public"."products" SET "image_url" = './assets/drinks/Hornitos.png' WHERE "product_id" = 4;
UPDATE "public"."products" SET "image_url" = './assets/drinks/MaestroDobel.png' WHERE "product_id" = 8;
UPDATE "public"."products" SET "image_url" = './assets/drinks/MaestroDobel.png' WHERE "product_id" = 61;
UPDATE "public"."products" SET "image_url" = './assets/drinks/MaestroDobel.png' WHERE "product_id" = 19;
UPDATE "public"."products" SET "image_url" = './assets/drinks/Mojito_frutos_rojos.jpg' WHERE "product_id" = 23;
UPDATE "public"."products" SET "image_url" = './assets/drinks/HaciendaTepa.png' WHERE "product_id" = 58;
UPDATE "public"."products" SET "image_url" = './assets/drinks/HerraduraPlata.png' WHERE "product_id" = 59;
UPDATE "public"."products" SET "image_url" = './assets/drinks/HerraduraReposado.png' WHERE "product_id" = 60;
UPDATE "public"."products" SET "image_url" = './assets/drinks/HerraduraReposado.png' WHERE "product_id" = 18;
UPDATE "public"."products" SET "image_url" = './assets/drinks/HerraduraReposado.png' WHERE "product_id" = 7;
UPDATE "public"."products" SET "image_url" = './assets/drinks/HerraduraPlata.png' WHERE "product_id" = 6;
UPDATE "public"."products" SET "image_url" = './assets/drinks/HerraduraPlata.png' WHERE "product_id" = 17;
UPDATE "public"."products" SET "image_url" = './assets/drinks/HaciendaTepa.png' WHERE "product_id" = 16;
UPDATE "public"."products" SET "image_url" = './assets/drinks/HaciendaTepa.png' WHERE "product_id" = 5;
UPDATE "public"."products" SET "image_url" = './assets/drinks/HerraduraUltra.png' WHERE "product_id" = 22;
UPDATE "public"."products" SET "image_url" = './assets/drinks/HerraduraUltra.png' WHERE "product_id" = 11;
UPDATE "public"."products" SET "image_url" = './assets/drinks/HerraduraUltra.png' WHERE "product_id" = 64;
UPDATE "public"."products" SET "image_url" = './assets/drinks/Victoria.png' WHERE "product_id" = 35;
UPDATE "public"."products" SET "image_url" = './assets/drinks/Corona.png' WHERE "product_id" = 34;
UPDATE "public"."products" SET "image_url" = './assets/drinks/Cubeta.png' WHERE "product_id" = 36;
UPDATE "public"."products" SET "image_url" = './assets/drinks/Litro.png' WHERE "product_id" = 37;
UPDATE "public"."products" SET "image_url" = './assets/drinks/Buchanas.png' WHERE "product_id" = 74;
UPDATE "public"."products" SET "image_url" = './assets/drinks/RedLabel.png' WHERE "product_id" = 73;
UPDATE "public"."products" SET "image_url" = './assets/drinks/BlackLabel.png' WHERE "product_id" = 72;
UPDATE "public"."products" SET "image_url" = './assets/drinks/Absolut.png' WHERE "product_id" = 71;
UPDATE "public"."products" SET "image_url" = './assets/drinks/AguaNatural.png' WHERE "product_id" = 68;
UPDATE "public"."products" SET "image_url" = './assets/drinks/Limonada.png' WHERE "product_id" = 66;
UPDATE "public"."products" SET "image_url" = './assets/drinks/Naranja.png' WHERE "product_id" = 67;
