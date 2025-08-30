import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  tableName: "products_catalog",
  timestamps: false,
})
export class ProductModelCatalog extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  description: string;

  @Column({ allowNull: false })
  salesPrice: number;
}
