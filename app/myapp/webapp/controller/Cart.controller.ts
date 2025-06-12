import { Input$ChangeEvent } from "sap/ui/webc/main/Input";
import BaseController from "./BaseController";
import JSONModel from "sap/ui/model/json/JSONModel";

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
export default class Cart extends BaseController {

	public onInit(): void {
		
	}	

	/**
	 * onQuatityInputChange
	 */
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
}
