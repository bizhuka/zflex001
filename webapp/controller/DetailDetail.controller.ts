import Controller from "sap/ui/core/mvc/Controller";
import Component from "zflex001/Component";
import Router from "sap/ui/core/routing/Router";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import { AppParams } from "./App.controller";

/**
 * @namespace zflex001.controller
*/


export default class DetailDetail extends Controller {
    private oOwnerComponent: Component
    private oRouter: Router
    private _supplier: string
    private _product: string

    public onInit() {
        this.oOwnerComponent = this.getOwnerComponent() as Component;

        this.oRouter = this.oOwnerComponent.getRouter();
        this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onPatternMatch.bind(this));
    }

    public handleAboutPress() {
        // this.oRouter.navTo("page2", { layout: LayoutType.EndColumnFullScreen });
        void this.oOwnerComponent.getHelper().then((oHelper) => {
            const oNextUIState = oHelper.getNextUIState(3);
            this.oRouter.navTo("page2", { layout: oNextUIState.layout });
        })
    }

    private _onPatternMatch(oEvent: Route$PatternMatchedEvent) {
        const appParams = oEvent.getParameter("arguments") as AppParams

        this._supplier = appParams.supplier || this._supplier || "0";
        this._product = appParams.product || this._product || "0";

        this.getView().bindElement({
            path: "/ProductCollectionStats/Filters/1/values/" + this._supplier,
            model: "products"
        });
    }

    public handleFullScreen() {
        const sNextLayout = Component.UI_State.actionButtonsInfo.endColumn.fullScreen;
        this.oRouter.navTo("detailDetail", { layout: sNextLayout, product: this._product, supplier: this._supplier });
    }

    public handleExitFullScreen() {
        const sNextLayout = Component.UI_State.actionButtonsInfo.endColumn.exitFullScreen
        this.oRouter.navTo("detailDetail", { layout: sNextLayout, product: this._product, supplier: this._supplier });
    }

    public handleClose() {
        const sNextLayout = Component.UI_State.actionButtonsInfo.endColumn.closeColumn
        this.oRouter.navTo("detail", { layout: sNextLayout, product: this._product });
    }

    public onExit() {
        this.oRouter.getRoute("detailDetail").detachPatternMatched(this._onPatternMatch.bind(this), this);
    }
}

