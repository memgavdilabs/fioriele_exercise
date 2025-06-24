import { Input$ChangeEvent } from "sap/ui/webc/main/Input";
import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";
import ODataModel from "sap/ui/model/odata/v4/ODataModel";
import ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";
import MessageBox from "sap/m/MessageBox";

type cartObject = {
	productId: string,
	productTitle: string,
	quantity: int,
	price: float,
	totalPrice: float
}

type salesItems = {
	product_productId: string,
	quantity: number
}

/**
 * @namespace com.myorg.myapp.controller
 */
export default class Cart extends BaseController {

	public onInit(): void {
		
	}

	public onContShopping() {
		const oRouter = this.getRouter();        
		oRouter.navTo("main");
	}

	public onQuatityStepInputChange(oEvent: Input$ChangeEvent) {
		const iValue = oEvent.getParameter("value") as number;
		const oContext = oEvent.getSource().getBindingContext("cartModel");
		const fPrice = oContext.getProperty("price") as float;
		const sProductId = oContext.getProperty("productId") as string;
		const fNewPrice = iValue * fPrice;

		const oCartModel = this.getView().getModel("cartModel") as JSONModel;
		const aItems = oCartModel.getProperty("/Products") as cartObject[];
		let iTotalPrice: float = 0;

		aItems.forEach(oItem => {
			if(oItem.productId === sProductId) {
				oItem.totalPrice = fNewPrice;
			}
			iTotalPrice = iTotalPrice + oItem.totalPrice;
		});
		oCartModel.setProperty("/Products", aItems);
		oCartModel.setProperty("/TotalPrice", iTotalPrice);
	}

	/**
	 * onCheckout
	 */
	public onCheckout() {
		const oCartModel = this.getView().getModel("cartModel") as JSONModel;
		const aItems = oCartModel.getProperty("/Products") as cartObject[];		
		const sUserId = oCartModel.getProperty("/User") as string;
		const sStoreId = oCartModel.getProperty("/Store") as string;
		const sVendorId = oCartModel.getProperty("/Vendor") as string;
		const aSalesItems: salesItems[] = [];
		aItems.forEach(oItem => {
			aSalesItems.push( { product_productId: oItem.productId, quantity: oItem.quantity } );
		});

		const oModel = this.getView().getModel() as ODataModel;
		const oBinding = oModel.bindList("/Sales");

        const oContext = oBinding.create({
			store_storeId: sStoreId,
			user_userId: sUserId,
			vendor_ID: sVendorId,
			salesItems: aSalesItems
		});

		oContext.created().then( () => {
			MessageBox.information("Items ordered");
			},() => {
				
			}
		);
	}
}
