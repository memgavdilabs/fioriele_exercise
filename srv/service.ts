import { Products, Sales } from "#cds-models/WarehouseManagementService";
import cds from "@sap/cds";
import { UUID } from "crypto";

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

    this.on("startWf", async (req) => {

      this.initWf(req.data.basketId);

     /*  const salesOrder = await SELECT.one.from(Sales).where({
        basketId : req.data.basketId
      }).columns((order: any) => {
        order.basketId
        order.store
        order.user     
        order.salesItems((item: any) => {
          item.product_productId,
          item.quantity
        });
      })
      
      const msgPayload = {"definitionId":"us10.2c7e6271trial.orderproject.orderProcess","context":{"salesOrder":salesOrder}};
      try {
        const wf = await cds.connect.to("bpa");
        
        const result = await wf.send("POST", '/public/workflow/rest/v1/workflow-instances', msgPayload);
      } catch (error) {        
        throw new Error("Error starting WF");
      }	 */

    });

    this.after("CREATE",Sales, async (data) => {
      //console.log(`Created Sale: ${JSON.stringify(data)}`);
      if(data && data.salesItems) {
        for(let saleItem of data.salesItems) {
          //here we reduce the availableQuantity of each product
          const productId = saleItem.product_productId;
          const quantity = saleItem.quantity;

          await UPDATE `Products` .set `availableQuantity = availableQuantity - ${quantity}` .where `productId = ${productId}`;
        }
      }
      if(data?.basketId) {
        this.initWf(data.basketId as UUID);
      }
    })

    return super.init();
  }

  private async initWf(basketId:UUID) {
    
    const salesOrder = await SELECT.one.from(Sales).where({
        basketId : basketId
      }).columns((order: any) => {
        order.basketId
        order.store
        order.user     
        order.salesItems((item: any) => {
          item.product_productId,
          item.quantity
        });
      })
      
    const msgPayload = {"definitionId":"us10.2c7e6271trial.orderproject.orderProcess","context":{"salesOrder":salesOrder}};
    try {
      const wf = await cds.connect.to("bpa");      
      const result = await wf.send("POST", '/public/workflow/rest/v1/workflow-instances', msgPayload);
    } catch (error) {        
      throw new Error("Error starting WF");
    }	
  }
}
