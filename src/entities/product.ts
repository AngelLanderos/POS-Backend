import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from "typeorm";
import { ProductCategory } from "./productCategory";
import { ProductVariant } from "./product_variant";
// import { ProductVariant } from "./ProductVariant";

@Entity({ name: "products" })
export class Product {
  @PrimaryGeneratedColumn({ name: "product_id" })
  id: number;

  @Column()
  name: string;

  @Column("numeric", { precision: 10, scale: 2, nullable: true })
  base_price: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  image_url: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => ProductCategory, (category) => category.products, {
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "category_id" })
  category: ProductCategory;

//   @OneToMany(() => ProductVariant, (variant) => variant.product)
//   variants: ProductVariant[];
}
