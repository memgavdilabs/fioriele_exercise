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

}
