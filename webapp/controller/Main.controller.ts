import MessageBox from "sap/m/MessageBox";
import BaseController from "./BaseController";

/**
 * @namespace zflex001.controller
 */
export default class Main extends BaseController {
	public sayHello(): void {
		MessageBox.show("Hello World!");
	}
}
