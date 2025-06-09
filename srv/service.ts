import { Products, Sales } from "#cds-models/WarehouseManagementService";
import cds from "@sap/cds";

export class WarehouseManagementService extends cds.ApplicationService {
  init() {
    this.on("checkStockInStore", async (req) => {
      console.log("On checkStockInStore", req.data);
      if (!req.data.storeId || !req.data.productId || !req.data.appliedQty) {
        req.reject(400, "Missing Input");
      }

      const result = await SELECT.one.from(Products).where({
        productId : req.data.productId,
        store_storeId: req.data.storeId
      }).columns('availableQuantity');

      if (result?.availableQuantity) {
        const message : string = result.availableQuantity > req.data.appliedQty ? "Available" : "Out of Stock !!!";
        return message;
      } else {
        req.error(500, "Product not in store");
      }
    });

    this.after("CREATE",Sales, async (data) => {
      console.log(`Created Sale: ${JSON.stringify(data)}`);
      if(data && data.salesItems) {
        for(let saleItem of data.salesItems) {
          //here we reduce the availableQuantity of each product
          const productId = saleItem.product_productId;
          const quantity = saleItem.quantity;

          await UPDATE `Products` .set `availableQuantity = availableQuantity - ${quantity}` .where `productId = ${productId}`;
        }
      }
    })

    return super.init();
  }
}
