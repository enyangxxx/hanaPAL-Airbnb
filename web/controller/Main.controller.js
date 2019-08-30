sap.ui.define(["de/htwberlin/adbkt/basic1/controller/BaseController"], function (BaseController) {
	"use strict";

	return BaseController.extend("de.htwberlin.adbkt.basic1.controller.Main", {
		onInit: function () {},

		onPressDataboard: function (oEvent) {
			this.getRouter().navTo("databoard");
		},

		onPressUserBoard: function (oEvent) {
			this.getRouter().navTo("userboard");
		}
	});

});