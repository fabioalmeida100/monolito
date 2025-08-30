import { Column, ForeignKey, PrimaryKey, Table, BelongsTo, Model } from "sequelize-typescript"
import { OrderModel } from "./order.model"

@Table({
    tableName: 'product_order',
    timestamps: false
})
export class ProductOrderModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string

    @Column({ allowNull: false })
    name: string
    
    @Column({ allowNull: false })
    description: string
    
    @Column({ allowNull: false })
    salesPrice: number

    @Column({ allowNull: false })
    createdAt: Date

    @Column({ allowNull: false })
    updatedAt: Date
    
    @BelongsTo(() => OrderModel, { foreignKey: 'orderId' })
    order: OrderModel

    @ForeignKey(() => OrderModel)
    @Column({ allowNull: false })
    orderId: string
}
