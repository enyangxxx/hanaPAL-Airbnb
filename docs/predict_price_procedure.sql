CREATE PROCEDURE predict_price (
	IN host_response VARCHAR(40),
	IN host_is_superhost VARCHAR(5),
	IN host_neighbourhood VARCHAR(30),
	IN host_has_profile_pic VARCHAR(5),
	IN host_identity VARCHAR(5),
	IN latitude DOUBLE,
	IN longitude DOUBLE,
	IN is_location_exact VARCHAR(5),
	IN property_type VARCHAR(30),
	IN room_type VARCHAR(30),
	IN accommodates INTEGER,
	IN bed_type VARCHAR(30),
	IN guests_included INTEGER,
	IN has_availability VARCHAR(2),
	IN number_of_reviews INTEGER,
	IN instant_bookable VARCHAR(5),
	IN is_business_travel_ready VARCHAR(5),
	IN cancellation_policy VARCHAR(50),
	IN requires_guest_profile_picture VARCHAR(5),
	IN requires_guest_verification VARCHAR(5),
	IN response_rate INTEGER,
	IN count_host_listings INTEGER,
	IN nr_bathrooms DOUBLE,
	IN nr_bedrooms INTEGER,
	IN nr_beds INTEGER,
	IN security_depo DOUBLE,
	IN cleaning_cost DOUBLE,
	IN cost_per_extra_guest DOUBLE,
	IN review_score INTEGER,
	IN nr_reviews_per_month DOUBLE,
	OUT OUT_RESULT_TABLE RESULT_TABLE_TYPE
) LANGUAGE SQLSCRIPT AS
BEGIN
	DECLARE resultTableExists integer;
	DECLARE predictTableExists integer;
	
	SELECT COUNT(*) INTO resultTableExists FROM TABLES WHERE TABLE_NAME = 'RESULT_TABLE';
	IF (:resultTableExists = 0 ) THEN
		CREATE TABLE RESULT_TABLE(
			"ID" INTEGER,
			"TARGET" NVARCHAR(5000),
			"VALUE" DOUBLE
		);
	ELSE
		DROP TABLE RESULT_TABLE;
		CREATE TABLE RESULT_TABLE(
			"ID" INTEGER,
			"TARGET" NVARCHAR(5000),
			"VALUE" DOUBLE
		);
	END IF;
	
	SELECT COUNT(*) INTO predictTableExists FROM TABLES WHERE TABLE_NAME = 'PREDICT_AIRBNB_DATA_TBL';
	IF (:predictTableExists = 0 ) THEN
		CREATE TABLE PREDICT_AIRBNB_DATA_TBL LIKE TRAIN_AIRBNB;
	ELSE
		DROP TABLE PREDICT_AIRBNB_DATA_TBL;
		CREATE TABLE PREDICT_AIRBNB_DATA_TBL LIKE TRAIN_AIRBNB;
	END IF;
	
	EXEC 'ALTER TABLE PREDICT_AIRBNB_DATA_TBL DROP (GROUNDTRUTHPRICEVARCHAR)';
	INSERT INTO PREDICT_AIRBNB_DATA_TBL VALUES (1, :host_response,:host_is_superhost,:host_neighbourhood,:host_has_profile_pic,:host_identity, :latitude, :longitude, :is_location_exact, :property_type, :room_type, :accommodates, :bed_type, :guests_included, :has_availability, :number_of_reviews, :instant_bookable, :is_business_travel_ready,:cancellation_policy, :requires_guest_profile_picture, :requires_guest_verification, :response_rate, :count_host_listings, :nr_bathrooms, :nr_bedrooms, :nr_beds, :security_depo, :cleaning_cost, :cost_per_extra_guest, :review_score, :nr_reviews_per_month);
	CREATE LOCAL TEMPORARY COLUMN TABLE #PAL_PARAMETER_TBL(
		"PARAM_NAME" NVARCHAR(256),
		"INT_VALUE" INTEGER,
		"DOUBLE_VALUE" DOUBLE,
		"STRING_VALUE" NVARCHAR(1000)
	);
	CREATE LOCAL TEMPORARY COLUMN TABLE #SOFTMAX_TABLE(
		"ID" INTEGER,
		"CLASS" NVARCHAR(5000),
		"SOFTMAX_VALUE" DOUBLE
	);
	
	INSERT INTO #PAL_PARAMETER_TBL VALUES ('THREAD_RATIO', NULL, 0.2, NULL);
	BEGIN
		DECLARE predict_tbl PREDICT_AIRBNB_TYPE DEFAULT SELECT * FROM PREDICT_AIRBNB_DATA_TBL;
		DECLARE model_tbl MODEL_TYPE DEFAULT SELECT * FROM PAL_MLP_CLS_MODEL_TBL;
		DECLARE tmp_param_tbl PARAM_T DEFAULT SELECT * FROM #PAL_PARAMETER_TBL;
		DECLARE softmax_tbl TABLE LIKE #SOFTMAX_TABLE;
		DECLARE result_tbl TABLE LIKE RESULT_TABLE;
		CALL _SYS_AFL.PAL_MULTILAYER_PERCEPTRON_PREDICT(:predict_tbl, :model_tbl, :tmp_param_tbl, :result_tbl, :softmax_tbl);
		INSERT INTO RESULT_TABLE SELECT * FROM :result_tbl;
	END;
	OUT_RESULT_TABLE = SELECT ID, TARGET, VALUE FROM RESULT_TABLE;
	--DROP TABLE PREDICT_AIRBNB_DATA_TBL;
	DROP TABLE #PAL_PARAMETER_TBL;
	DROP TABLE #SOFTMAX_TABLE;
END;