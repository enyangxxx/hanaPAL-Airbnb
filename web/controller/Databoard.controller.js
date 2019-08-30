sap.ui.define(["de/htwberlin/adbkt/basic1/controller/BaseController"], function (BaseController) {
	"use strict";

	return BaseController.extend("de.htwberlin.adbkt.basic1.controller.Databoard", {
		onInit: function () {
			sap.m.MessageToast.show("Welcome to the databoard!");
		},

		onCreateTable: function () {
			sap.m.MessageToast.show("Create table if not already done: Maybe have a coffee?");
			self = this;
			var createTableText = this.getView().byId('createTableText');
			
			$.ajax({
                url: `http://localhost:3000/createAirbnbTable`,
                type: 'GET',
                success: function (data) {
					sap.m.MessageToast.show(data);
					createTableText.setText(data)
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageToast.show(textStatus + '\n' + jqXHR + '\n' + errorThrown);
					createTableText.setText("Error occurred: " + textStatus + '\n' + jqXHR + '\n' + errorThrown);
				}
            });
		},

		onImportDataButtonPress: function () {
			sap.m.MessageToast.show("Import data if not already done: Maybe have a donut?");
			self = this;
			var importStatusText = this.getView().byId('importStatusText');
			
			$.ajax({
                url: `http://localhost:3000/importAirbnb`,
                type: 'GET',
                success: function (data) {
					sap.m.MessageToast.show(data);
					importStatusText.setText(data)
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageToast.show(textStatus + '\n' + jqXHR + '\n' + errorThrown);
					importStatusText.setText("Error occurred: " + textStatus + '\n' + jqXHR + '\n' + errorThrown);
				}
            });
		},

		onTransformData: function () {
			sap.m.MessageToast.show("Transform data if not already done: Maybe have a burger?");
			self = this;
			var transformText = this.getView().byId('transformText');
			
			$.ajax({
                url: `http://localhost:3000/dataTransformation`,
                type: 'GET',
                success: function (data) {
					sap.m.MessageToast.show(data);
					transformText.setText(data)
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageToast.show(textStatus + '\n' + jqXHR + '\n' + errorThrown);
					transformText.setText("Error occurred: " + textStatus + '\n' + jqXHR + '\n' + errorThrown);
				}
            });
		},

		onBinningGroundTruth: function () {
			sap.m.MessageToast.show("Binning Groundtruth if not done: Maybe have a banh mi?");
			self = this;
			var binningText = this.getView().byId('binningText');
			
			$.ajax({
                url: `http://localhost:3000/binningGroundtruthLabel`,
                type: 'GET',
                success: function (data) {
					sap.m.MessageToast.show(data);
					binningText.setText(data)
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageToast.show(textStatus + '\n' + jqXHR + '\n' + errorThrown);
					binningText.setText("Error occurred: " + textStatus + '\n' + jqXHR + '\n' + errorThrown);
				}
            });
		},

		onDeleteTable: function () {
			sap.m.MessageToast.show("Delete the table, bad boy: Maybe eat an apple?");
			self = this;
			var deleteText = this.getView().byId('deleteText');
			if(confirm('Are you sure, you want to delete the table?')){
				$.ajax({
					url: `http://localhost:3000/deleteTable`,
					type: 'GET',
					success: function (data) {
						sap.m.MessageToast.show(data);
						deleteText.setText(data)
					},
					error: function (jqXHR, textStatus, errorThrown) {
						sap.m.MessageToast.show(textStatus + '\n' + jqXHR + '\n' + errorThrown);
						deleteText.setText("Error occurred: " + textStatus + '\n' + jqXHR + '\n' + errorThrown);
					}
				});
			}	
		},

		onSubstitutingMissingData: function () {
			sap.m.MessageToast.show("Transform data if not already done: Maybe have a burger?");
			self = this;
			var substituteText = this.getView().byId('substituteText');
			
			$.ajax({
                url: `http://localhost:3000/substitutingMissingValues`,
                type: 'GET',
                success: function (data) {
					sap.m.MessageToast.show(data);
					substituteText.setText(data)
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageToast.show(textStatus + '\n' + jqXHR + '\n' + errorThrown);
					substituteText.setText("Error occurred: " + textStatus + '\n' + jqXHR + '\n' + errorThrown);
				}
            });
		},

		onCheckDataSetSize: function () {
			self = this;
			var datasetSizeText = this.getView().byId('datasetSizeText');
			$.ajax({
                url: `http://localhost:3000/checkAirbnbDataSetSize`,
                type: 'GET',
                success: function (data) {
					sap.m.MessageToast.show(data);
					datasetSizeText.setText(data);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					sap.m.MessageToast.show(textStatus + '\n' + jqXHR + '\n' + errorThrown);
					datasetSizeText.setText("Error occurred: " + textStatus + '\n' + jqXHR + '\n' + errorThrown);
				}
            });
		},

		onTrainModel: function () {
			self = this;
			var trainModelText = this.getView().byId('trainModelText');
			if(confirm('There is already a very well pre-trained model. Are you sure, you want to destroy & retrain it for few seconds only?')){
				$.ajax({
					url: `http://localhost:3000/trainModel`,
					type: 'GET',
					success: function (data) {
						sap.m.MessageToast.show(data);
						trainModelText.setText(data);
					},
					error: function (jqXHR, textStatus, errorThrown) {
						sap.m.MessageToast.show(textStatus + '\n' + jqXHR + '\n' + errorThrown);
						trainModelText.setText("Error occurred: " + textStatus + '\n' + jqXHR + '\n' + errorThrown);
					}
				});
			}
		},
	});

});