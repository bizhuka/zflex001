import UIComponent from "sap/ui/core/UIComponent";
import { LayoutType } from "sap/f/library";
import JSONModel from "sap/ui/model/json/JSONModel";
import FlexibleColumnLayoutSemanticHelper, { UIState } from "sap/f/FlexibleColumnLayoutSemanticHelper";
import FlexibleColumnLayout from "sap/f/FlexibleColumnLayout";
import XMLView from "sap/ui/core/mvc/XMLView";


/**
 * @namespace zflex001
*/


export default class Component extends UIComponent {
	public static metadata = {
		manifest: "json",
	};

	public static UI_State: UIState 

	public init() {
		super.init();
		// UIComponent.prototype.init.apply(this, arguments);

		// set products demo model on this sample
		const oProductsModel = new JSONModel(sap.ui.require.toUrl('sap/ui/demo/mock') + '/products.json');
		oProductsModel.setSizeLimit(1000);
		this.setModel(oProductsModel, 'products');		
	}

	public async getHelper(): Promise<FlexibleColumnLayoutSemanticHelper> {
		const oFCL = await this._getFcl();
		// if (!oFCL){
		// 	return null;
		// }

		const oSettings = {
			defaultTwoColumnLayoutType: LayoutType.TwoColumnsMidExpanded,
			defaultThreeColumnLayoutType: LayoutType.ThreeColumnsMidExpanded,
			initialColumnsCount: 2, // do not work             mode: "MasterDetail"
			// maxColumnsCount: 2
		};
		return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
	}

	private _getFcl(): Promise<FlexibleColumnLayout> {
		return new Promise((resolve) => { // , reject

			const root = this.getRootControl() as XMLView
			const oFCL = root.byId('flexibleColumnLayout') as FlexibleColumnLayout;

			if (!oFCL) {
				root.attachAfterInit(() => {
					resolve(oFCL);
				});
				return;
			}

			resolve(oFCL); // resolve with null     reject ??
		});
	}
}