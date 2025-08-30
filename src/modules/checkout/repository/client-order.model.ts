import { Column, ForeignKey, Model, PrimaryKey, Table, BelongsTo } from "sequelize-typescript"
import { OrderModel } from "./order.model"

@Table({
    tableName: 'client_order',
    timestamps: false
})
export class ClientOrderModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    id: string

    @Column({ allowNull: false })
    name: string
    
    @Column({ allowNull: false })
    email: string

    @Column({ allowNull: false })
    address: string
    
    @Column({ allowNull: false })
    createdAt: Date

    @Column({ allowNull: false })
    updatedAt: Date
    
    @BelongsTo(() => OrderModel, { foreignKey: 'orderId' })
    order: OrderModel

    @ForeignKey(() => OrderModel)
    @Column({ allowNull: true })
    orderId: string;
}
