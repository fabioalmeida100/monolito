import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ClientOrderModel } from "../../modules/checkout/repository/client-order.model";
import { OrderModel } from "../../modules/checkout/repository/order.model";
import { ProductOrderModel } from "../../modules/checkout/repository/product-order.model";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import { InvoiceItemsModel } from "../../modules/invoice/repository/invoice-items.model";
import { TransactionModel } from "../../modules/payment/repository/transaction.model";
import { ProductModelAdm } from "../../modules/product-adm/repository/product.model";
import { ProductModelCatalog } from "../../modules/store-catalog/repository/product.model";
import { checkoutRoute } from "./routes/checkout.route";


export const app: Express = express();
app.use(express.json());

app.use("/checkout", checkoutRoute);


export let sequelize: Sequelize;

async function setupDb() {
  try {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
    
    await sequelize.addModels([ClientOrderModel, 
      OrderModel, 
      ProductOrderModel, 
      ClientModel, 
      InvoiceModel, 
      InvoiceItemsModel, 
      TransactionModel, 
      ProductModelAdm, 
      ProductModelCatalog]);
      
    await sequelize.sync();
    console.log('Database connection established successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
}

setupDb().catch(console.error);
