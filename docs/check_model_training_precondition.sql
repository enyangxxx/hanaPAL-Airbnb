CREATE PROCEDURE CHECK_MODEL_TRAINING_PRECONDITION (out precondition_check PRECONDITON_RESULT_TYPE) LANGUAGE SQLSCRIPT AS
BEGIN
	DECLARE all_good INTEGER;
	DECLARE table_exists INTEGER;
	DECLARE empty_string_exists INTEGER;
	DECLARE null_exists INTEGER;
	DECLARE binning_done INTEGER;
	DECLARE message VARCHAR(70);
    --SELECT COUNT(*) FROM TABLES WHERE table_name = 'AIRBNB';
	SELECT COUNT(*) INTO table_exists FROM TABLES WHERE table_name = 'AIRBNB';
	IF (:table_exists = 0 ) THEN
		all_good = 0;
		message = 'Table airbnb does not exist: Create table!';
	ELSE
		--SELECT COUNT(*) FROM AIRBNB WHERE host_is_superhost = '';
		SELECT COUNT(*) INTO empty_string_exists FROM AIRBNB WHERE host_is_superhost = '';
		IF (:empty_string_exists > 0 ) THEN
			all_good = 0;
			message = 'Empty strings still exist: Transform data!.';
		ELSE
			-- SELECT COUNT(*) FROM AIRBNB WHERE HOST_RESPONSE_TIME IS NULL;
			SELECT COUNT(*) INTO null_exists FROM AIRBNB WHERE HOST_RESPONSE_TIME IS NULL;
			IF (:null_exists > 0 ) THEN
				all_good = 0;
				message = 'NULL values still exist: Substitute them!';
			ELSE
				SELECT DISTINCT groundtruthpricevarchar INTO binning_done FROM airbnb GROUP BY groundtruthpricevarchar ORDER BY COUNT(*) DESC LIMIT 1;
				IF (:binning_done != '3' ) THEN
					all_good = 0;
					message = 'Groundtruth not binned yet!';
				ELSE
					all_good = 1;
					message = 'All good!';
				END IF;
			END IF;
		END IF;
	END IF;
	
	CREATE TABLE SHORT_MEMORY_CELL (
		id integer primary key,
		result integer,
		msg varchar(70)
	);
	insert into short_memory_cell values (1, :all_good, :message);
	precondition_check = select id, result, msg from short_memory_cell;
	drop table short_memory_cell;
END