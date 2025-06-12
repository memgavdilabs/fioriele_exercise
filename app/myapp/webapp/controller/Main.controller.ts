import MessageBox from "sap/m/MessageBox";
import BaseController from "./BaseController";
import { Button$PressEvent } from "sap/m/Button";
import Popover from "sap/m/Popover";
import Context from "sap/ui/model/odata/v4/Context";
import { SearchField$ChangeEvent } from "sap/m/SearchField";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import GridList from "sap/f/GridList";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import JSONModel from "sap/ui/model/json/JSONModel";

enum StockStatus {
	InStock = "Available",
	OutOfStock = "Out of Stock !!!",
	NotInStore = "Product not in store"	
}

type cartObject = {
	productId: string,
	productTitle: string,
	quatity: int,
	price: float,
	totalPrice: float
}

/**
 * @namespace com.myorg.myapp.controller
 */
export default class Main extends BaseController {

	private oDialog: Popover;
	public onInit(): void {
		
	}

	/**
	 * onPressRating
	 */
	public async onPressRating(oEvent: Button$PressEvent) {
		const oButton = oEvent.getSource();
		const oContext = oButton.getBindingContext() as Context;
		//sId = oContext.getProperty("productId");
		this.oDialog ??= await this.loadFragment({ name: "com.myorg.myapp.view.fragments.RatingPopover" }) as Popover;
		this.oDialog.openBy(oButton);
		
		this.oDialog.setBindingContext(oContext);
	}

	/**
	 * onSearchProducts
	 */
	public onSearchProducts(oEvent: SearchField$ChangeEvent) {
		const aFilters: Filter[] = [];
		const sValue = oEvent.getParameter("value");
		aFilters.push(new Filter({path: "title", operator: FilterOperator.Contains, value1: sValue, caseSensitive: false}));
		aFilters.push(new Filter({path: "description", operator: FilterOperator.Contains, value1: sValue, caseSensitive: false}));
		//aFilters.push(new Filter("description", FilterOperator.Contains, sValue));

		const oFilter = new Filter({ filters: aFilters, and: false });
		//const oFilter = new Filter(aFilters, false );
		const oGridList = this.getView().byId("idProductGridList") as GridList;
		const oListBinding = oGridList.getBinding("items") as ODataListBinding;
		oListBinding.filter(oFilter);
	}

	/**
	 * onShowCart
	 */
	public onShowCart() {
		const oRouter = this.getRouter();        
		oRouter.navTo("cart");
	}

	/**
	 * onPressCart
	 */
	public async onPressCart(oEvent: Button$PressEvent) {
		
		const oContext = oEvent.getSource().getBindingContext() as Context;
		const sStoreId = oContext.getProperty("store_storeId") as string;
		const sProductId = oContext.getProperty("productId") as string;
		const fPrice = oContext.getProperty("price") as float;
		const sProductTitle = oContext.getProperty("title") as string;
		const oModel = this.getView().getModel() as ODataModel;

		const oContextBinding = oModel.bindContext("/checkStockInStore(...)");
		oContextBinding.setParameter("storeId", sStoreId);
		oContextBinding.setParameter("productId", sProductId);
		oContextBinding.setParameter("appliedQty", 1);			

		await oContextBinding.invoke().then( () => {
			const sInStock = oContextBinding.getBoundContext().getProperty("value") as StockStatus;
			if(sInStock === StockStatus.InStock) {
				const oCartModel = this.getView().getModel("cartModel") as JSONModel;
				const aItems = oCartModel.getProperty("/Products") as cartObject[] || [];

				const obj = aItems.find((oItem, i) => {
					if (oItem.productId === sProductId) {
						oItem.quatity = oItem.quatity + 1;
						oItem.totalPrice = fPrice * oItem.quatity;
						aItems[i] = oItem;
						return true; // stop searching
					}
				});
				//const oItem = { productId: sProductId } as cartObject;
				if(!obj) {
					aItems.push({ productId: sProductId, productTitle: sProductTitle, price: fPrice, quatity: 1, totalPrice: fPrice});
				}
				oCartModel.setProperty("/Products", aItems);
				oCartModel.setProperty("/TotalPrice", fPrice);

				MessageBox.information("Item added");
			} else {
				MessageBox.error(sInStock);
			}
		}).catch(() => {
			
		});
	}

}
