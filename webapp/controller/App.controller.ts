import Router, { Router$BeforeRouteMatchedEvent, Router$RouteMatchedEvent } from "sap/ui/core/routing/Router";
import Controller from "sap/ui/core/mvc/Controller";
import Component from "zflex001/Component";
import { FlexibleColumnLayout$StateChangeEvent } from "sap/f/FlexibleColumnLayout";
import JSONModel from "sap/ui/model/json/JSONModel";
import { LayoutType } from "sap/f/library";

/**
 * @namespace zflex001.controller
*/

export type AppParams = {
    product: string;
    supplier: string;
}

export default class App extends Controller {
    private oOwnerComponent: Component
    private oRouter: Router
    private currentRouteName: string
    private currentProduct: string
    private currentSupplier: string

    public onInit() {
        this.oOwnerComponent = this.getOwnerComponent() as Component;
        this.oRouter = this.oOwnerComponent.getRouter();
        this.oRouter.attachRouteMatched(this.onRouteMatched.bind(this));
        this.oRouter.attachBeforeRouteMatched(this._onBeforeRouteMatched.bind(this));
        this.oRouter.initialize();
    }

    private _onBeforeRouteMatched(oEvent: Router$BeforeRouteMatchedEvent) {
        type RouterEventParams = {
            layout: LayoutType
        }
        const sLayout = (oEvent.getParameters().arguments as RouterEventParams).layout;
        this._updateUIElements(sLayout);
    }

    public onRouteMatched(oEvent: Router$RouteMatchedEvent) {
        const sRouteName = oEvent.getParameter("name")
        const oArguments = oEvent.getParameter("arguments") as AppParams;

        this._updateUIElements();

        // Save the current route name
        this.currentRouteName = sRouteName;
        this.currentProduct = oArguments.product;
        this.currentSupplier = oArguments.supplier;
    }

    // Update the close/fullscreen buttons visibility
    private _updateUIElements(slayout?: LayoutType) {
        void this.oOwnerComponent.getHelper().then((oHelper) => {
            const oUIState = oHelper.getCurrentUIState();

            if (!Component.UI_State) {
                Component.UI_State = oUIState
                Component.UI_State.layout = slayout ? slayout : oUIState.layout
                this.oOwnerComponent.setModel(new JSONModel(Component.UI_State, true), "ui_state")
                return
            }

            // Update just 2 fields
            Component.UI_State.layout = slayout ? slayout : oUIState.layout
            Component.UI_State.actionButtonsInfo = oUIState.actionButtonsInfo
        });
    }

    public onStateChanged(oEvent: FlexibleColumnLayout$StateChangeEvent) {
        const bIsNavigationArrow = oEvent.getParameter("isNavigationArrow")

        // Replace the URL with the new layout if a navigation arrow was used
        if (bIsNavigationArrow) {
            const sLayout = oEvent.getParameter("layout");
            this.oRouter.navTo(this.currentRouteName, { layout: sLayout, product: this.currentProduct, supplier: this.currentSupplier }, true);
        }
    }

    public onExit() {
        this.oRouter.detachRouteMatched(this.onRouteMatched.bind(this), this);
        //no such method this.oRouter.detachBeforeRouteMatched(this.onBeforeRouteMatched.bind(this), this);
    }
}