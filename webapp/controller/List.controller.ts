import MessageBox from "sap/m/MessageBox";
import Table from "sap/m/Table";
import { SearchField$SearchEvent } from "sap/ui/commons/SearchField";
import Controller from "sap/ui/core/mvc/Controller";
import View from "sap/ui/core/mvc/View";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ListBinding from "sap/ui/model/ListBinding";
import Sorter from "sap/ui/model/Sorter";
// import { LayoutType } from "sap/f/library";
// import FlexibleColumnLayout from "sap/f/FlexibleColumnLayout";
import Router from "sap/ui/core/routing/Router";
import Component from "zflex001/Component";
import { ListItemBase$PressEvent } from "sap/m/ListItemBase";

/**
 * @namespace zflex001.controller
*/


export default class List extends Controller {
    private oView: View;
    private _bDescendingSort: boolean;
    private oProductsTable: Table;
    private oRouter: Router;

    public onInit() {
        this.oView = this.getView();
        this._bDescendingSort = false;
        this.oProductsTable = this.oView.byId("productsTable") as Table;
        this.oRouter = (this.getOwnerComponent() as Component).getRouter();
    }

    public onSearch(oEvent: SearchField$SearchEvent) {
        const oTableSearchState: Filter[] = []
        const sQuery = oEvent.getParameter("query");

        if (sQuery && sQuery.length > 0) {
            oTableSearchState.push(new Filter("Name", FilterOperator.Contains, sQuery));
        }

        (this.oProductsTable.getBinding("items") as ListBinding).filter(oTableSearchState, "Application");
    }

    public onAdd() {
        MessageBox.information("This functionality is not ready yet.", { title: "Aw, Snap!" });
    }

    public onSort() {
        this._bDescendingSort = !this._bDescendingSort;
        const oBinding = this.oProductsTable.getBinding("items") as ListBinding
        const oSorter = new Sorter("Name", this._bDescendingSort);

        oBinding.sort(oSorter);
    }

    public onListItemPress(oEvent: ListItemBase$PressEvent) {
        // const oFCL = this.oView.getParent().getParent() as FlexibleColumnLayout;
        // oFCL.setLayout(LayoutType.TwoColumnsMidExpanded);

        const productPath = oEvent.getSource().getBindingContext("products").getPath()
        console.log('#########################################################')
        console.log(productPath)
        const product = productPath.split("/").slice(-1).pop();

        // this.oRouter.navTo("detail", { layout: LayoutType.TwoColumnsMidExpanded, product: product });
        void (this.getOwnerComponent() as Component).getHelper().then((oHelper) => {
            const oNextUIState = oHelper.getNextUIState(1);
            this.oRouter.navTo("detail", {
                layout: oNextUIState.layout,
                product: product
            });
        });
    }
}