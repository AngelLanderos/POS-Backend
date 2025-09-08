import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "./product";

@Entity({ name: "product_variants" })
export class ProductVariant {
  @PrimaryGeneratedColumn({ name: "product_variant_id" })
  id: number;

  @Column()
  name: string; // Ej: "500ml", "1L"

  @Column("numeric", { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  volume_ml: number;

  @Column({ default: true })
  is_active: boolean;

//   @ManyToOne(() => Product, (product) => product.variants, {
//     onDelete: "CASCADE",
//   })
//   @JoinColumn({ name: "product_id" })
//   product: Product;
}
