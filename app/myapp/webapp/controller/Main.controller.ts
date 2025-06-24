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
import { Select$ChangeEvent } from "sap/m/Select";

enum StockStatus {
	InStock = "Available",
	OutOfStock = "Out of Stock !!!"
}

type cartObject = {
	productId: string,
	productTitle: string,
	quantity: int,
	price: float,
	totalPrice: float
}

/**
 * @namespace com.myorg.myapp.controller
 */
export default class Main extends BaseController {

	private oDialog: Popover;
	public onInit(): void {
		this.bindUser();
	}

	public bindUser() {
		const sUserId = 'd5bf6df2-e200-4f6b-a6d9-d7401bcb2210';
		this.getView().bindElement({ 
			path: `/Users(${sUserId})`, 
			events: { 
				dataReceived: () => {                  
					const oCartModel = this.getView().getModel("cartModel") as JSONModel;
					oCartModel.setProperty("/User", sUserId);	
					oCartModel.setProperty("/Store", '9ded5cf0-8f13-4220-a9ea-bfe00c3b6368');					
				}         
        	}      
		});	
		
	}

	/**
	 * onVendorSelectChange
	 */
	public onVendorSelectChange(oEvent: Select$ChangeEvent) {
		const sKey = oEvent.getParameter("selectedItem").getKey();
		const oCartModel = this.getView().getModel("cartModel") as JSONModel;					
		oCartModel.setProperty("/Vendor", sKey);
	}

	public async onPressProduct(oEvent: Button$PressEvent) {
		const oContext = oEvent.getSource().getBindingContext();
		const sStoreId = oContext.getProperty("store_storeId") as string;
		const sProductId = oContext.getProperty("productId") as string;
		const sProductTitle = oContext.getProperty("title") as string;
		const fPrice = oContext.getProperty("price") as float;

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
				aItems.push({ price: fPrice, productId: sProductId, productTitle: sProductTitle, quantity: 1, totalPrice: fPrice});
				oCartModel.setProperty("/Products", aItems);
				const totalPrice = oCartModel.getProperty("/TotalPrice") as float || 0;
				oCartModel.setProperty("/TotalPrice", totalPrice + fPrice);
				MessageBox.information("Item added");
			}
		}).catch( ()=> {

		});
	}

	/**
	 * onPressCart
	 */
	public onPressCart() {
		const oRouter = this.getRouter();
		oRouter.navTo("cart");
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
	 * onPressProduct
	 */
	

}
