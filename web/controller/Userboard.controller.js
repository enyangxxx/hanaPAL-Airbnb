sap.ui.define([
	"de/htwberlin/adbkt/basic1/controller/BaseController",
	"de/htwberlin/adbkt/basic1/Cred"
], function (BaseController, Cred) {
	"use strict";

	function validateData(){}

	function checkDigitUnderThreshold(digitInput, threshold){
		if(threshold < 100 ){
			/*if(!/^\d{1,2}(?:[.,]\d{1,2})?$/.test(digitInput)){
				sap.m.MessageToast.show(digitInput + " is not a valid number");
				return false;
			}*/
			if(threshold == null){
				return true;
			}else if(Number(digitInput) > threshold){
				return false;
			}
		}else if(threshold >= 100){
			/*if(!/^\d{1,3}(?:[.,]\d{1,2})?$/.test(digitInput)){
				sap.m.MessageToast.show(digitInput + " is not a valid number");
				return false;
			}*/
			if(threshold == null){
				return true;
			}else if(Number(digitInput) > threshold){
				return false;
			}
		}
		return true;
	}

	function addressInputIsCorrect(addressInput){
		if(!addressInput.endsWith(', Berlin')){
			sap.m.MessageToast.show("Address should end with [, Berlin]");
			return false;
		}else if(!/\d/.test(addressInput)){
			sap.m.MessageToast.show("Address should contain a house number!");
			return false;
		}else if(!/[a-zA-ZÀ-ž\-]{5,100}\s\d{1,3}[a-zA-Z]?,\sBerlin$/.test(addressInput)){
			sap.m.MessageToast.show("Please enter a valid address in Berlin: [street_name house_number, Berlin], especially the street name has to be between 5 and 100 characters.");
			return false;
		}
		return true;
	}

	return BaseController.extend("de.htwberlin.adbkt.basic1.controller.Userboard", {
		
		onInit: function () {
			sap.m.MessageToast.show("Welcome to the User Board!");
		},

		onEvaluate: function () {
			self = this;
			var dataIncomplete = false;
			var digitInvalid = false;

			var hostResponseTimeSelect = this.getView().byId('hostResponseTimeSelect');
			var hostIsSuperHostSelect = this.getView().byId('hostIsSuperHostSelect');
			var hostNeighbourhoodSelect = this.getView().byId('hostNeighbourhoodSelect');
			var hostHasProfilePicSelect = this.getView().byId('hostHasProfilePicSelect');
			var hostIdentityVerifiedSelect = this.getView().byId('hostIdentityVerifiedSelect');
			var addressInput = this.getView().byId('addressInput');
			var locationExactSelect = this.getView().byId('locationExactSelect');
			var propertyTypeSelect = this.getView().byId('propertyTypeSelect');
			var roomTypeSelect = this.getView().byId('roomTypeSelect');
			var accommodatesInput = this.getView().byId('accommodatesInput');
			var bedTypeSelect = this.getView().byId('bedTypeSelect');
			var guestsIncludedInput = this.getView().byId('guestsIncludedInput');
			var availabilitySelect = this.getView().byId('availabilitySelect');
			var numberOfReviewsInput = this.getView().byId('numberOfReviewsInput');
			var instantBookableSelect = this.getView().byId('instantBookableSelect');
			var businesTravelReadySelect = this.getView().byId('businesTravelReadySelect');
			var cancellationPolicySelect = this.getView().byId('cancellationPolicySelect');
			var guestProfilePictureSelect = this.getView().byId('guestProfilePictureSelect');
			var guestPhoneSelect = this.getView().byId('guestPhoneSelect');
			var responseRateInput = this.getView().byId('responseRateInput');
			var hostListingInput = this.getView().byId('hostListingInput');
			var bathroomsInput = this.getView().byId('bathroomsInput');
			var bedroomsInput = this.getView().byId('bedroomsInput');
			var bedsInput = this.getView().byId('bedsInput');
			var securityDepoInput = this.getView().byId('securityDepoInput');
			var cleaningFeeInput = this.getView().byId('cleaningFeeInput');
			var costPerExtraGuestInput = this.getView().byId('costPerExtraGuestInput');
			var reviewScoreInput = this.getView().byId('reviewScoreInput');
			var reviewPerMonthInput = this.getView().byId('reviewPerMonthInput');

			var evaluationText = this.getView().byId('evaluationText');

			if(hostResponseTimeSelect.getSelectedItem() == null ||
			   hostIsSuperHostSelect.getSelectedItem() == null ||
			   hostNeighbourhoodSelect.getSelectedItem() == null ||
			   hostHasProfilePicSelect.getSelectedItem() == null ||
			   hostIdentityVerifiedSelect.getSelectedItem() == null ||
			   addressInput.getValue() == '' ||
			   locationExactSelect.getSelectedItem() == null ||
			   propertyTypeSelect.getSelectedItem() == null ||
			   roomTypeSelect.getSelectedItem() == null ||
			   accommodatesInput.getValue() == '' ||
			   bedTypeSelect.getSelectedItem() == null ||
			   guestsIncludedInput.getValue() == '' ||
			   availabilitySelect.getSelectedItem() == null ||
			   numberOfReviewsInput.getValue() == ''||
			   instantBookableSelect.getSelectedItem() == null ||
			   businesTravelReadySelect.getSelectedItem() == null ||
			   cancellationPolicySelect.getSelectedItem() == null ||
			   guestProfilePictureSelect.getSelectedItem() == null ||
			   guestPhoneSelect.getSelectedItem() == null ||
			   responseRateInput.getValue() == '' ||
			   hostListingInput.getValue() == '' ||
			   bathroomsInput.getValue() == '' ||
			   bedroomsInput.getValue() == '' ||
			   bedsInput.getValue() == '' ||
			   securityDepoInput.getValue() == '' ||
			   cleaningFeeInput.getValue() == '' ||
			   costPerExtraGuestInput.getValue() == '' ||
			   reviewScoreInput.getValue() == '' ||
			   reviewPerMonthInput.getValue() == ''
			   ){
				dataIncomplete = true;
				sap.m.MessageToast.show("There are still data missing or invalid digit input!");
			}else{
				dataIncomplete = false;
				if( !checkDigitUnderThreshold(accommodatesInput.getValue(), 10) ||
					!checkDigitUnderThreshold(guestsIncludedInput.getValue(), 10) ||
					!checkDigitUnderThreshold(numberOfReviewsInput.getValue(), null) ||
					!checkDigitUnderThreshold(responseRateInput.getValue(), 100) ||
					!checkDigitUnderThreshold(hostListingInput.getValue(), 10) ||
					!checkDigitUnderThreshold(bathroomsInput.getValue(), 10) ||
					!checkDigitUnderThreshold(bedroomsInput.getValue(), 10) ||
					!checkDigitUnderThreshold(bedsInput.getValue(), 10) ||
					!checkDigitUnderThreshold(securityDepoInput.getValue(), 500) ||
					!checkDigitUnderThreshold(cleaningFeeInput.getValue(), 100) ||
					!checkDigitUnderThreshold(costPerExtraGuestInput.getValue(), 100) ||
					!checkDigitUnderThreshold(reviewScoreInput.getValue(), 100) ||
					!checkDigitUnderThreshold(reviewPerMonthInput.getValue(), 30)
				){
					digitInvalid = true;
					sap.m.MessageToast.show("Some digits are over the allowed threshold!");
				}else{
					digitInvalid = false;
				}
			}

			if(!dataIncomplete && !digitInvalid){
				var address = addressInput.getValue();
				var userData = {
					'HOST_RESPONSE_TIME' : hostResponseTimeSelect.getSelectedItem().getText(),
					'HOST_IS_SUPERHOST' : hostIsSuperHostSelect.getSelectedItem().getText(),
					'HOST_NEIGHBOURHOOD' : hostNeighbourhoodSelect.getSelectedItem().getText(),
					'HOST_HAS_PROFILE_PIC' : hostHasProfilePicSelect.getSelectedItem().getText(),
					'HOST_IDENTITY_VERIFIED' : hostIdentityVerifiedSelect.getSelectedItem().getText(),
					'LONGITUDE' : null,
					'LATITUDE' : null,
					'IS_LOCATION_EXACT' : locationExactSelect.getSelectedItem().getText(),
					'PROPERTY_TYPE' : propertyTypeSelect.getSelectedItem().getText(),
					'ROOM_TYPE' : roomTypeSelect.getSelectedItem().getText(),
					'ACCOMMODATES' : accommodatesInput.getValue(),
					'BED_TYPE' : bedTypeSelect.getSelectedItem().getText(),
					'GUESTS_INCLUDED' : guestsIncludedInput.getValue(),
					'HAS_AVAILABILITY' : availabilitySelect.getSelectedItem().getText(),
					'NUMBER_OF_REVIEWS' : numberOfReviewsInput.getValue(),
					'INSTANT_BOOKABLE' : instantBookableSelect.getSelectedItem().getText(),
					'IS_BUSINESS_TRAVEL_READY' : businesTravelReadySelect.getSelectedItem().getText(),
					'CANCELLATION_POLICY' : cancellationPolicySelect.getSelectedItem().getText(),
					'REQUIRE_GUEST_PROFILE_PICTURE' : guestProfilePictureSelect.getSelectedItem().getText(),
					'REQUIRE_GUEST_PHONE_VERIFICATION' : guestPhoneSelect.getSelectedItem().getText(),
					'RESPONSE_RATE' : responseRateInput.getValue(),
					'COUNT_HOST_LISTINGS' : hostListingInput.getValue(),
					'NR_BATHROOMS' : bathroomsInput.getValue(),
					'NR_BEDROOMS' : bedroomsInput.getValue(),
					'NR_BEDS' : bedsInput.getValue(),
					'SECURITY_DEPO' : securityDepoInput.getValue(),
					'CLEANING_COST' : cleaningFeeInput.getValue(),
					'COST_PER_EXTRA_GUEST' : costPerExtraGuestInput.getValue(),
					'REVIEW_SCORE' : reviewScoreInput.getValue(),
					'NR_REVIEWS_PER_MONTH' : reviewPerMonthInput.getValue()
				};

				if(addressInputIsCorrect(address)){
					$.ajax({
						url: 'https://geocoder.api.here.com/6.2/geocode.json',
						type: 'GET',
						dataType: 'jsonp',
						jsonp: 'jsoncallback',
						data: {
							searchtext: address,
							app_id: Cred.getHereAppId(),
							app_code: Cred.getHereAppCode(),
							gen: '9'
						},
						success: function (data) {
							if(typeof(data.Response.View["0"]) != 'undefined'){
								userData['LATITUDE'] = data.Response.View["0"].Result["0"].Location.DisplayPosition.Latitude;
								userData['LONGITUDE'] = data.Response.View["0"].Result["0"].Location.DisplayPosition.Longitude;
								$.ajax({
									url: `http://localhost:3000/evaluateUserInput`,
									type: 'GET',
									data: {
										inputData: userData
									},
									success: function (data) {
										sap.m.MessageToast.show(data);
										evaluationText.setText(data)
									},
									error: function (jqXHR, textStatus, errorThrown) {
										sap.m.MessageToast.show(textStatus + '\n' + jqXHR + '\n' + errorThrown);
										evaluationText.setText("Error occurred: " + textStatus + '\n' + jqXHR + '\n' + errorThrown);
									}
								});
							}else{
								sap.m.MessageToast.show('It seems like your address could not be found');
							}
						},
						error: function (jqXHR, textStatus, errorThrown) {
							sap.m.MessageToast.show(textStatus + '\n' + jqXHR + '\n' + errorThrown);
						}
					});
				}
				
			}
		},

	});

});

