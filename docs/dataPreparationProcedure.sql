--CALL DATAPREPROCESSING;

CREATE PROCEDURE dataPreprocessing LANGUAGE SQLSCRIPT AS
BEGIN
	-- replace '' by NULL
	EXEC 'UPDATE airbnb SET host_response_time = NULL WHERE host_response_time = '''||''''||' OR host_response_time = '''||'N/A'''||' ';
	
	-- transform host_response_rate into integer column
	EXEC 'ALTER TABLE airbnb ADD (RESPONSE_RATE INT)';
	EXEC 'UPDATE airbnb SET HOST_RESPONSE_RATE = NULL WHERE HOST_RESPONSE_RATE = '''||''''||' OR HOST_RESPONSE_RATE = '''||'N/A'''||' ';
	EXEC 'UPDATE airbnb SET HOST_RESPONSE_RATE = REPLACE(HOST_RESPONSE_RATE, '''||'%'''||','''||''''||') ';
	EXEC 'UPDATE airbnb SET RESPONSE_RATE = TO_INT(HOST_RESPONSE_RATE)';
    EXEC 'ALTER TABLE airbnb DROP (HOST_RESPONSE_RATE)';
	
	-- set host_is_superhost to NULL if not declared
	EXEC 'UPDATE airbnb SET host_is_superhost = NULL WHERE host_is_superhost = '''||''''||' ';
	
	-- set host_neighbourhood to NULL if not declared
	EXEC 'UPDATE airbnb SET host_neighbourhood = NULL WHERE host_neighbourhood = '''||''''||' ';
	
	-- transform host_total_listings_count into integer column
	EXEC 'ALTER TABLE airbnb ADD (count_host_listings INT)';
	EXEC 'UPDATE airbnb SET host_total_listings_count = NULL WHERE host_total_listings_count = '''||''''||' ';
	EXEC 'UPDATE airbnb SET count_host_listings = TO_INT(host_total_listings_count)';
	EXEC 'ALTER TABLE airbnb DROP (host_total_listings_count)';
	
	-- set host_has_profile_pic to false if not true
	EXEC 'UPDATE airbnb SET host_has_profile_pic = NULL WHERE host_has_profile_pic = '''||''''||' ';
	
	-- set host_identity_verified to NULL if not declared
	EXEC 'UPDATE airbnb SET host_identity_verified = NULL WHERE host_identity_verified = '''||''''||' ';
	
	-- transform bathrooms into double column
	EXEC 'ALTER TABLE airbnb ADD (nr_bathrooms DOUBLE)';
	EXEC 'UPDATE airbnb SET bathrooms = NULL WHERE bathrooms = '''||''''||' ';
	EXEC 'UPDATE airbnb SET nr_bathrooms = TO_DOUBLE(bathrooms)';
	EXEC 'ALTER TABLE airbnb DROP (bathrooms)';
	
	-- transform bedrooms into integer column
	EXEC 'ALTER TABLE airbnb ADD (nr_bedrooms INT)';
	EXEC 'UPDATE airbnb SET bedrooms = NULL WHERE bedrooms = '''||''''||' ';
	EXEC 'UPDATE airbnb SET nr_bedrooms = TO_INT(bedrooms)';
	EXEC 'ALTER TABLE airbnb DROP (bedrooms)';
	
	-- transform beds into integer column
	EXEC 'ALTER TABLE airbnb ADD (nr_beds INT)';
	EXEC 'UPDATE airbnb SET beds = NULL WHERE beds = '''||''''||' ';
	EXEC 'UPDATE airbnb SET nr_beds = TO_INT(beds)';
	EXEC 'ALTER TABLE airbnb DROP (beds)';
	
	-- delete records where price = 0 & transform price into double column
	EXEC 'DELETE FROM airbnb WHERE price = '''||'$0.00'''||' ';
	EXEC 'UPDATE airbnb set price = TRIM (LEADING '''||'$'''||' FROM price) ';
	EXEC 'UPDATE airbnb SET price = REPLACE(price, '''||','''||','''||''''||') ';
	EXEC 'UPDATE airbnb SET price = REPLACE(price,'''||'.00'''||','''||''''||') ';
	EXEC 'ALTER TABLE airbnb ADD (groundTruthPrice DOUBLE)';
	EXEC 'UPDATE airbnb SET groundTruthPrice = TO_DOUBLE(price)';
	EXEC 'ALTER TABLE airbnb DROP (price)';
	
	-- transform security_deposit into double column
	EXEC 'ALTER TABLE airbnb ADD (security_depo DOUBLE)';
	EXEC 'UPDATE airbnb SET security_deposit = NULL WHERE security_deposit = '''||''''||' OR security_deposit = '''||'$0.00'''||' ';
	EXEC 'UPDATE airbnb set security_deposit = TRIM (LEADING '''||'$'''||' FROM security_deposit) ';
	EXEC 'UPDATE airbnb SET security_deposit = REPLACE(security_deposit, '''||','''||','''||''''||') ';
	EXEC 'UPDATE airbnb SET security_deposit = REPLACE(security_deposit,'''||'.00'''||','''||''''||') ';
	EXEC 'UPDATE airbnb SET security_depo = TO_DOUBLE(security_deposit)';
	EXEC 'ALTER TABLE airbnb DROP (security_deposit)';
	
	-- transform cleaning_cost into double column
	EXEC 'ALTER TABLE airbnb ADD (cleaning_cost DOUBLE)';
	EXEC 'UPDATE airbnb SET cleaning_fee = NULL WHERE cleaning_fee = '''||''''||' OR cleaning_fee = '''||'$0.00'''||' ';
	EXEC 'Update airbnb set cleaning_fee = TRIM (LEADING '''||'$'''||' FROM cleaning_fee) ';
	EXEC 'UPDATE airbnb SET cleaning_fee = REPLACE(cleaning_fee, '''||','''||','''||''''||') ';
	EXEC 'UPDATE airbnb SET cleaning_fee = REPLACE(cleaning_fee,'''||'.00'''||','''||''''||') ';
	EXEC 'UPDATE airbnb SET cleaning_cost = TO_DOUBLE(cleaning_fee)';
	EXEC 'ALTER TABLE airbnb DROP (cleaning_fee)';
	
	-- transform extra_people into double column
	EXEC 'ALTER TABLE airbnb ADD (cost_per_extra_guest DOUBLE)';
	EXEC 'UPDATE airbnb SET extra_people = NULL WHERE extra_people = '''||'$0.00'''||' ';
	EXEC 'UPDATE airbnb set extra_people = TRIM (LEADING '''||'$'''||' FROM extra_people) ';
	EXEC 'UPDATE airbnb SET extra_people = REPLACE(extra_people, '''||','''||','''||''''||') ';
	EXEC 'UPDATE airbnb SET extra_people = REPLACE(extra_people,'''||'.00'''||','''||''''||') ';
	EXEC 'UPDATE airbnb SET cost_per_extra_guest = TO_DOUBLE(extra_people)';
	EXEC 'ALTER TABLE airbnb DROP (extra_people)';
	
	-- transform review_scores_rating into integer column
	EXEC 'ALTER TABLE airbnb ADD (review_score INT)';
	EXEC 'UPDATE airbnb SET review_scores_rating = NULL WHERE review_scores_rating = '''||''''||' ';
	EXEC 'UPDATE airbnb SET review_score = TO_INT(review_scores_rating)';
	EXEC 'ALTER TABLE airbnb DROP (review_scores_rating)';
	
	-- transform reviews_per_month into double column
	EXEC 'ALTER TABLE airbnb ADD (nr_reviews_per_month DOUBLE)';
	EXEC 'UPDATE airbnb SET reviews_per_month = NULL WHERE reviews_per_month = '''||''''||' ';
	EXEC 'UPDATE airbnb SET nr_reviews_per_month = TO_DOUBLE(reviews_per_month)';
	EXEC 'ALTER TABLE airbnb DROP (reviews_per_month)';
END;