import Controller from "sap/ui/core/mvc/Controller";
import ObjectPageLayout from "sap/uxap/ObjectPageLayout";
import Component from "zflex001/Component";
import Router from "sap/ui/core/routing/Router";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import { AppParams } from "./App.controller";
import { ListItemBase$PressEvent } from "sap/m/ListItemBase";

/**
 * @namespace zflex001.controller
*/


export default class Detail extends Controller {
    private oOwnerComponent: Component
    private oRouter: Router
    private _product: string

    public onInit() {
        this.oOwnerComponent = this.getOwnerComponent() as Component;

        this.oRouter = this.oOwnerComponent.getRouter();

        this.oRouter.getRoute("list").attachPatternMatched(this._onProductMatched.bind(this));
        this.oRouter.getRoute("detail").attachPatternMatched(this._onProductMatched.bind(this));
        this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onProductMatched.bind(this));
    }

    private _onProductMatched(oEvent: Route$PatternMatchedEvent) {
        this._product = (oEvent.getParameter("arguments") as AppParams).product || this._product || "0";

        this.getView().bindElement({
            path: "/ProductCollection/" + this._product,
            model: "products"
        });
    }

    public onSupplierPress(oEvent: ListItemBase$PressEvent) {
        const supplierPath = oEvent.getSource().getBindingContext("products").getPath()
        const supplier = supplierPath.split("/").slice(-1).pop();

        // this.oRouter.navTo("detailDetail", { layout: LayoutType.ThreeColumnsMidExpanded, supplier: supplier, product: this._product });

        void this.oOwnerComponent.getHelper().then((oHelper) => {
            const oNextUIState = oHelper.getNextUIState(2);
            this.oRouter.navTo("detailDetail", {
                layout: oNextUIState.layout,
                supplier: supplier,
                product: this._product
            });
        });
    }

    public onEditToggleButtonPress() {
        const oObjectPage = this.getView().byId("ObjectPageLayout") as ObjectPageLayout

        const bCurrentShowFooterState = oObjectPage.getShowFooter();
        oObjectPage.setShowFooter(!bCurrentShowFooterState);
    }

    public handleFullScreen() {
        const sNextLayout = Component.UI_State.actionButtonsInfo.midColumn.fullScreen;
        this.oRouter.navTo("detail", { layout: sNextLayout, product: this._product });
    }

    public handleExitFullScreen() {
        const sNextLayout = Component.UI_State.actionButtonsInfo.midColumn.exitFullScreen
        this.oRouter.navTo("detail", { layout: sNextLayout, product: this._product });
    }

    public handleClose() {
        const sNextLayout = Component.UI_State.actionButtonsInfo.midColumn.closeColumn
        this.oRouter.navTo("list", { layout: sNextLayout });
    }

    public onExit() {
        this.oRouter.getRoute("list").detachPatternMatched(this._onProductMatched.bind(this), this);
        this.oRouter.getRoute("detail").detachPatternMatched(this._onProductMatched.bind(this), this);
    }
}