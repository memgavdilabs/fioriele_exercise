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
	OutOfStock = "Out of Stock !!!"
}

type cartObject = {
	productId: string,
	productTitle: string,
	quantity: int,
	price: float
}

/**
 * @namespace com.myorg.myapp.controller
 */
export default class Main extends BaseController {

	private oDialog: Popover;
	public onInit(): void {
		
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
				const cartModel = this.getView().getModel("cartModel") as JSONModel;
				const aItems = cartModel.getProperty("/Products") as cartObject[] || [];
				aItems.push({ price: fPrice, productId: sProductId, productTitle: sProductTitle, quantity: 1});
				cartModel.setProperty("/Products", aItems);
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
