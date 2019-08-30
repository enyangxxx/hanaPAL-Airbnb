-- replace '' by NULL
UPDATE airbnb SET host_response_time = NULL WHERE host_response_time = '' OR host_response_time = 'N/A';

-- transform host_response_rate into integer column
ALTER TABLE airbnb ADD (response_rate INT);
UPDATE airbnb SET host_response_rate = NULL WHERE host_response_rate = '' OR host_response_rate = 'N/A';
UPDATE airbnb SET host_response_rate = REPLACE(host_response_rate, '%','');
UPDATE airbnb SET response_rate = TO_INT(host_response_rate);
ALTER TABLE airbnb DROP (host_response_rate);

-- set host_is_superhost to NULL if not declared
UPDATE airbnb SET host_is_superhost = NULL WHERE host_is_superhost = '';

-- set host_neighbourhood to NULL if not declared
UPDATE airbnb SET host_neighbourhood = NULL WHERE host_neighbourhood = '';

-- transform host_total_listings_count into integer column
ALTER TABLE airbnb ADD (count_host_listings INT);
UPDATE airbnb SET host_total_listings_count = NULL WHERE host_total_listings_count = '';
UPDATE airbnb SET count_host_listings = TO_INT(host_total_listings_count);
ALTER TABLE airbnb DROP (host_total_listings_count);

-- set host_has_profile_pic to false if not true
UPDATE airbnb SET host_has_profile_pic = NULL WHERE host_has_profile_pic = '';

-- set host_identity_verified to NULL if not declared
UPDATE airbnb SET host_identity_verified = NULL WHERE host_identity_verified = '';

-- transform bathrooms into double column
ALTER TABLE airbnb ADD (nr_bathrooms DOUBLE);
UPDATE airbnb SET bathrooms = NULL WHERE bathrooms = '';
UPDATE airbnb SET nr_bathrooms = TO_DOUBLE(bathrooms);
ALTER TABLE airbnb DROP (bathrooms);

-- transform bedrooms into integer column
ALTER TABLE airbnb ADD (nr_bedrooms INT);
UPDATE airbnb SET bedrooms = NULL WHERE bedrooms = '';
UPDATE airbnb SET nr_bedrooms = TO_INT(bedrooms);
ALTER TABLE airbnb DROP (bedrooms);

-- transform beds into integer column
ALTER TABLE airbnb ADD (nr_beds INT);
UPDATE airbnb SET beds = NULL WHERE beds = '';
UPDATE airbnb SET nr_beds = TO_INT(beds);
ALTER TABLE airbnb DROP (beds);

-- delete records where price = 0 & transform price into double column
DELETE FROM airbnb WHERE price = '$0.00';
Update airbnb set price = TRIM (LEADING '$' FROM price);
UPDATE airbnb SET price = REPLACE(price, ',','');
UPDATE airbnb SET price = REPLACE(price,'.00','');
ALTER TABLE airbnb ADD (groundTruthPrice DOUBLE);
UPDATE airbnb SET groundTruthPrice = TO_DOUBLE(price);
ALTER TABLE airbnb DROP (price);

-- transform security_deposit into double column
ALTER TABLE airbnb ADD (security_depo DOUBLE);
UPDATE airbnb SET security_deposit = NULL WHERE security_deposit = '' OR security_deposit = '$0.00';
Update airbnb set security_deposit = TRIM (LEADING '$' FROM security_deposit);
UPDATE airbnb SET security_deposit = REPLACE(security_deposit, ',','');
UPDATE airbnb SET security_deposit = REPLACE(security_deposit,'.00','');
UPDATE airbnb SET security_depo = TO_DOUBLE(security_deposit);
ALTER TABLE airbnb DROP (security_deposit);

-- transform cleaning_cost into double column
ALTER TABLE airbnb ADD (cleaning_cost DOUBLE);
UPDATE airbnb SET cleaning_fee = NULL WHERE cleaning_fee = '' OR cleaning_fee = '$0.00';
Update airbnb set cleaning_fee = TRIM (LEADING '$' FROM cleaning_fee);
UPDATE airbnb SET cleaning_fee = REPLACE(cleaning_fee, ',','');
UPDATE airbnb SET cleaning_fee = REPLACE(cleaning_fee,'.00','');
UPDATE airbnb SET cleaning_cost = TO_DOUBLE(cleaning_fee);
ALTER TABLE airbnb DROP (cleaning_fee);

-- transform extra_people into double column
ALTER TABLE airbnb ADD (cost_per_extra_guest DOUBLE);
UPDATE airbnb SET extra_people = NULL WHERE extra_people = '$0.00';
Update airbnb set extra_people = TRIM (LEADING '$' FROM extra_people);
UPDATE airbnb SET extra_people = REPLACE(extra_people, ',','');
UPDATE airbnb SET extra_people = REPLACE(extra_people,'.00','');
UPDATE airbnb SET cost_per_extra_guest = TO_DOUBLE(extra_people);
ALTER TABLE airbnb DROP (extra_people);

-- transform review_scores_rating into integer column
ALTER TABLE airbnb ADD (review_score INT);
UPDATE airbnb SET review_scores_rating = NULL WHERE review_scores_rating = '';
UPDATE airbnb SET review_score = TO_INT(review_scores_rating);
ALTER TABLE airbnb DROP (review_scores_rating);

-- transform reviews_per_month into double column
ALTER TABLE airbnb ADD (nr_reviews_per_month DOUBLE);
UPDATE airbnb SET reviews_per_month = NULL WHERE reviews_per_month = '';
UPDATE airbnb SET nr_reviews_per_month = TO_DOUBLE(reviews_per_month);
ALTER TABLE airbnb DROP (reviews_per_month);