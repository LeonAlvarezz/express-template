CREATE SEQUENCE IF NOT EXISTS product_id_seq;

ALTER TABLE "product" 
  ALTER COLUMN "id" TYPE integer USING (CASE WHEN "id" ~ '^[0-9]+$' THEN "id"::integer ELSE nextval('product_id_seq') END),
  ALTER COLUMN "id" SET DEFAULT nextval('product_id_seq');

ALTER SEQUENCE product_id_seq OWNED BY "product"."id";
