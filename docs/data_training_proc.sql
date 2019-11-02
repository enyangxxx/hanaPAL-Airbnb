CREATE PROCEDURE data_training_proc (in iteration INTEGER) LANGUAGE SQLSCRIPT AS
BEGIN
	DECLARE rowNumber integer;
	DECLARE modelExists integer;
	SELECT COUNT(*) INTO rowNumber FROM TABLES WHERE TABLE_NAME = 'TRAIN_AIRBNB';
	SELECT COUNT(*) INTO modelExists FROM TABLES WHERE TABLE_NAME = 'PAL_MLP_CLS_MODEL_TBL';
	IF (:rowNumber = 0 ) THEN
		EXEC 'ALTER TABLE airbnb ADD (GROUNDTRUTHPRICEVARCHAR VARCHAR(100))';
		EXEC 'UPDATE airbnb SET groundtruthPrice = 10 WHERE groundtruthPrice > 10';
		EXEC 'UPDATE airbnb SET GROUNDTRUTHPRICEVARCHAR = TO_VARCHAR(groundtruthPrice)';
		EXEC 'ALTER TABLE airbnb DROP (groundtruthPrice)';
		
		EXEC 'CREATE TABLE train_AIRBNB as (select * from AIRBNB)';
		EXEC 'alter table train_airbnb drop (minimum_nights)';
		EXEC 'alter table train_airbnb drop (maximum_nights)';
	ELSE
		EXEC 'DROP TABLE TRAIN_AIRBNB';
		BEGIN
			CREATE TABLE TRAIN_AIRBNB as (select * from AIRBNB);
		END;
		EXEC 'alter table train_airbnb drop (minimum_nights)';
		EXEC 'alter table train_airbnb drop (maximum_nights)';
	END IF;
	
	IF(:modelExists = 1) THEN
		EXEC 'DROP TABLE PAL_MLP_CLS_MODEL_TBL';
	END IF;
	
	CREATE COLUMN TABLE PAL_MLP_CLS_MODEL_TBL(
		"ROW_INDEX" INTEGER,
		"MODEL_CONTENT" NVARCHAR(5000)
	);
	
	CREATE LOCAL TEMPORARY COLUMN TABLE #PAL_PARAMETER_TBL(
		"PARAM_NAME" NVARCHAR(256),
		"INT_VALUE" INTEGER,
		"DOUBLE_VALUE" DOUBLE,
		"STRING_VALUE" NVARCHAR(1000)
	);
	
	CREATE LOCAL TEMPORARY COLUMN TABLE #PAL_LEARNING_CURVE(
		"ITERATION" INTEGER,
		"ERROR" DOUBLE
	);
	
	CREATE LOCAL TEMPORARY COLUMN TABLE #STATS(
		"STAT_NAME" VARCHAR(1000),
		"STAT_VALUE" VARCHAR(1000)
	);
	
	CREATE LOCAL TEMPORARY COLUMN TABLE #OPTIMAL_PARAM(
		"PARAM_NAME" NVARCHAR(256),
		"INT_VALUE" INTEGER,
		"DOUBLE_VALUE" DOUBLE,
		"STRING_VALUE" NVARCHAR(1000)
	);
	
	INSERT INTO #PAL_PARAMETER_TBL VALUES ('HAS_ID', 1, NULL, NULL);
	INSERT INTO #PAL_PARAMETER_TBL VALUES ('HIDDEN_LAYER_SIZE', NULL, NULL, '50, 20, 10');
	INSERT INTO #PAL_PARAMETER_TBL VALUES ('HIDDEN_LAYER_ACTIVE_FUNC', 13, NULL, NULL); -- 1 for tanh
	INSERT INTO #PAL_PARAMETER_TBL VALUES ('OUTPUT_LAYER_ACTIVE_FUNC', 4, NULL, NULL); -- 4 for symmetric sigmoid
	--INSERT INTO #PAL_PARAMETER_TBL VALUES ('LEARNING_RATE', NULL, 0.001, NULL);
	--INSERT INTO #PAL_PARAMETER_TBL VALUES ('MOMENTUM_FACTOR', NULL, 0.0001, NULL);
	INSERT INTO #PAL_PARAMETER_TBL VALUES ('FUNCTIONALITY', 0, NULL, NULL); -- 0 for classification
	INSERT INTO #PAL_PARAMETER_TBL VALUES ('TRAINING_STYLE', 0, NULL, NULL); -- 1 for SGD
	--INSERT INTO #PAL_PARAMETER_TBL VALUES ('MINI_BATCH_SIZE', 1, NULL, NULL);
	INSERT INTO #PAL_PARAMETER_TBL VALUES ('DEPENDENT_VARIABLE', NULL, NULL, 'GROUNDTRUTHPRICEVARCHAR');
	INSERT INTO #PAL_PARAMETER_TBL VALUES ('MAX_ITERATION', :iteration, NULL, NULL);
	INSERT INTO #PAL_PARAMETER_TBL VALUES ('NORMALIZATION', 2, NULL, NULL); -- 2 for scalar normalization
	INSERT INTO #PAL_PARAMETER_TBL VALUES ('WEIGHT_INIT', 1, NULL, NULL); --1 for normal distribution
	INSERT INTO #PAL_PARAMETER_TBL VALUES ('THREAD_RATIO', NULL, 0.8, NULL); -- using 50% of currently available threads

	BEGIN
		DECLARE train_tbl TRAINING_AIRBNB_TYPE DEFAULT SELECT * FROM TRAIN_AIRBNB;
	    DECLARE tmp_param_tbl PARAM_T DEFAULT SELECT * FROM #PAL_PARAMETER_TBL;
	    DECLARE placeholder_tbl TABLE LIKE #OPTIMAL_PARAM;
	    DECLARE learning_curve_tbl TABLE LIKE #PAL_LEARNING_CURVE;
	    DECLARE cls_model_tbl TABLE LIKE PAL_MLP_CLS_MODEL_TBL;
	    DECLARE stats TABLE LIKE #STATS;
		CALL _SYS_AFL.PAL_MULTILAYER_PERCEPTRON(:train_tbl, :tmp_param_tbl, :cls_model_tbl, :learning_curve_tbl, :stats, :placeholder_tbl);
		INSERT INTO PAL_MLP_CLS_MODEL_TBL SELECT * FROM :cls_model_tbl;
		INSERT INTO #PAL_LEARNING_CURVE SELECT * FROM :learning_curve_tbl;
		INSERT INTO #PAL_PARAMETER_TBL SELECT * FROM :tmp_param_tbl;
		INSERT INTO #OPTIMAL_PARAM SELECT * FROM :placeholder_tbl;
		INSERT INTO #STATS SELECT * FROM :stats;
	END;
	
	DROP TABLE #PAL_PARAMETER_TBL;
	--DROP TABLE #PAL_LEARNING_CURVE;
	DROP TABLE #STATS;
	DROP TABLE #OPTIMAL_PARAM;
END;