import { Model } from "sequelize-typescript";
import { Table, Column, HasMany, HasOne, PrimaryKey } from "sequelize-typescript";
import { ClientOrderModel } from "./client-order.model";
import { ProductOrderModel } from "./product-order.model";

@Table({
    tableName: 'order',
    timestamps: false
})
export class OrderModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string

    @HasOne(() => ClientOrderModel, { foreignKey: 'orderId' })
    client: ClientOrderModel

    @HasMany(() => ProductOrderModel, { foreignKey: 'orderId' })
    products: ProductOrderModel[]

    @Column({ allowNull: false })
    status: string

    @Column({ allowNull: false })
    createdAt: Date

    @Column({ allowNull: false })
    updatedAt: Date
}
