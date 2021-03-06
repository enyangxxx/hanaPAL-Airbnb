CREATE TYPE PREDICT_AIRBNB_TYPE AS TABLE(
	id VARCHAR(50) PRIMARY KEY,
	HOST_RESPONSE_TIME VARCHAR(40),
	HOST_IS_SUPERHOST VARCHAR(5),
	HOST_NEIGHBOURHOOD VARCHAR(30),
	HOST_HAS_PROFILE_PIC VARCHAR(5),
	HOST_IDENTITY_VERIFIED VARCHAR(5),
	LATITUDE DOUBLE,
	LONGITUDE DOUBLE,
	IS_LOCATION_EXACT VARCHAR(5),
	PROPERTY_TYPE VARCHAR(30),
	ROOM_TYPE VARCHAR(30),
	ACCOMMODATES INTEGER,
	BED_TYPE VARCHAR(30),
	GUESTS_INCLUDED INTEGER,
	HAS_AVAILABILITY VARCHAR(2),
	NUMBER_OF_REVIEWS INTEGER,
	INSTANT_BOOKABLE VARCHAR(5),
	IS_BUSINESS_TRAVEL_READY VARCHAR(5),
	CANCELLATION_POLICY VARCHAR(50),
	REQUIRE_GUEST_PROFILE_PICTURE VARCHAR(5),
	REQUIRE_GUEST_PHONE_VERIFICATION VARCHAR(5),
	RESPONSE_RATE INTEGER,
	COUNT_HOST_LISTINGS INTEGER,
	NR_BATHROOMS DOUBLE,
	NR_BEDROOMS INTEGER,
	NR_BEDS INTEGER,
	SECURITY_DEPO DOUBLE,
	CLEANING_COST DOUBLE,
	COST_PER_EXTRA_GUEST DOUBLE,
	REVIEW_SCORE INTEGER,
	NR_REVIEWS_PER_MONTH DOUBLE
);