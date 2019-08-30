const express = require('express')
const parse = require('csv-parse/lib/sync')
var request = require('request');
const app = express()
var fast_csv = require('fast-csv');
const port = 3000
var fs = require('fs');

const config = require('./config');
const db = require('./db');

const insertDataStatement = `INSERT INTO AIRBNB 
(id, host_response_time, host_response_rate, host_is_superhost, host_neighbourhood, host_total_listings_count, host_has_profile_pic, host_identity_verified, latitude, longitude, is_location_exact, property_type,
room_type, accommodates, bathrooms, bedrooms, beds, bed_type, price, security_deposit, cleaning_fee, guests_included, extra_people, minimum_nights, maximum_nights, has_availability, number_of_reviews, review_scores_rating, 
instant_bookable, is_business_travel_ready, cancellation_policy, require_guest_profile_picture, require_guest_phone_verification, reviews_per_month)
VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
const sizeQuery = `SELECT COUNT(*) AS SIZE FROM AIRBNB`;
const tableCheckStatement = `SELECT COUNT(*) AS TABLE_EXISTS FROM TABLES WHERE table_name = 'AIRBNB'`;
const createTableStatement = `CALL createAirbnbTable`;
const preProcessingStatement = `CALL datapreprocessing`;
const binningStatement = `CALL binninggroundtruthprice`;
const checkDataSetSizeProcedure = `CALL CHECKAIRBNBDATASETSIZE(?);`;
const mostFrequentGTQuery = `SELECT DISTINCT groundtruthprice FROM airbnb GROUP BY groundtruthprice ORDER BY COUNT(*) DESC LIMIT 1`;
const deleteTableStatement = `DROP TABLE airbnb`;
const substitutingMissingValuesStatement = `Call substitutemissingvalues`;
const checkNullExistsInColumnStatement = `SELECT COUNT(*) AS NULL_EXISTS FROM AIRBNB WHERE HOST_RESPONSE_TIME IS NULL`;
const checkNAExistsInColumnStatement = `SELECT COUNT(*) AS NA_EXISTS FROM AIRBNB WHERE HOST_RESPONSE_TIME = 'N/A'`;
const checkSuperhostEmptyStringStatement = `SELECT COUNT(*) AS EMPTY_STRING_EXISTS FROM AIRBNB WHERE host_is_superhost = ''`;
const trainModelProcedure = `CALL data_training_proc(1)`;
const dummyParams = [];

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.get('/checkAirbnbDataSetSize', (req, res, next) => {
    db.readFromHdb(
        config.hdb,
        tableCheckStatement,
        dummyParams,
        rows => {
            if(rows[0]['TABLE_EXISTS'] == 0){
                console.log('INFO: Table AIRBNB not existing.')
                res.type('plain/text').send("Table AIRBNB not existing. Create table first!");
            }else{
                console.log('INFO: Table AIRBNB existing.')
                db.readFromHdb(
                    config.hdb,
                    sizeQuery,
                    dummyParams,
                    rows => res.type('plain/text').send("Your dataset has " + String(rows[0]['SIZE']) + " records."),
                    info => console.log(info)
                );
            }
        },
        info => console.log(info)
    );
});

app.get('/deleteTable', (req, res, next) => {
    db.readFromHdb(
        config.hdb,
        tableCheckStatement,
        dummyParams,
        rows => {
            if(rows[0]['TABLE_EXISTS'] == 0){
                console.log('INFO: Table AIRBNB not existing. Nothing will be deleted')
                res.type('plain/text').send("Table AIRBNB not existing. Nothing will be deleted!");
            }else{
                db.writeIntoHdb(
                    config.hdb,
                    deleteTableStatement,
                    dummyParams
                );
                res.type('plain/text').send("Deleted table successfully!");
            }
        },
        info => console.log(info)
    );
});

app.get('/importAirbnb', function (req, res, next) {
    db.readFromHdb(
        config.hdb,
        tableCheckStatement,
        dummyParams,
        rows => {
            if(rows[0]['TABLE_EXISTS'] == 0){
                console.log('INFO: Table AIRBNB not existing.')
                res.type('plain/text').send("Table AIRBNB not existing. Create table first!");
            }else{
                db.readFromHdb(
                    config.hdb,
                    sizeQuery,
                    dummyParams,
                    rows => {
                        if(rows[0]['SIZE'] > 0){
                            console.log('INFO: A lot of data already in the pool!')
                            res.type('plain/text').send("Dataset is already loaded");
                        }else{
                            console.log('INFO: No data, no fun')
                            var filePath = __dirname + '/files/listings_summary.csv';
                            var fileContent = [];
                            var contentLength;
                            fs.createReadStream(filePath)
                            .pipe(
                                fast_csv.parse({ headers: true })
                            .on('data', function(data) {
                                fileContent.push(data);
                                })
                            .on("end", function(){
                                contentLength = fileContent.length;
                                console.log(contentLength)
                                var params = new Array(fileContent.length);
                                for (var i = 0; i < fileContent.length; i++){ 
                                    params[i] = [fileContent[i]['id'],fileContent[i]['host_response_time'],fileContent[i]['host_response_rate'],fileContent[i]['host_is_superhost'],fileContent[i]['host_neighbourhood'],fileContent[i]['host_total_listings_count'],
                                                fileContent[i]['host_has_profile_pic'],fileContent[i]['host_identity_verified'],fileContent[i]['latitude'],fileContent[i]['longitude'],fileContent[i]['is_location_exact'],fileContent[i]['property_type'],
                                                fileContent[i]['room_type'],fileContent[i]['accommodates'],fileContent[i]['bathrooms'],fileContent[i]['bedrooms'],fileContent[i]['beds'],fileContent[i]['bed_type'],fileContent[i]['price'],
                                                fileContent[i]['security_deposit'],fileContent[i]['cleaning_fee'],fileContent[i]['guests_included'],fileContent[i]['extra_people'],fileContent[i]['minimum_nights'],fileContent[i]['maximum_nights'],fileContent[i]['has_availability'],
                                                fileContent[i]['number_of_reviews'],fileContent[i]['review_scores_rating'],fileContent[i]['instant_bookable'],fileContent[i]['is_business_travel_ready'],fileContent[i]['cancellation_policy'],
                                                fileContent[i]['require_guest_profile_picture'],fileContent[i]['require_guest_phone_verification'],fileContent[i]['reviews_per_month']]; 
                                }
                                db.writeIntoHdb(
                                    config.hdb,
                                    insertDataStatement,
                                    params
                                );
                                res.type('plain/text').send("Imported successfully!");
                                })
                            );
                        }
                    },
                    info => console.log(info)
                );
            }
        },
        info => console.log(info)
    );
    
});

app.get('/createAirbnbTable', function (req, res, next) {
    db.readFromHdb(
        config.hdb,
        tableCheckStatement,
        dummyParams,
        rows => {
            if(rows[0]['TABLE_EXISTS'] == 1){
                console.log('INFO: Table AIRBNB already existing.')
                res.type('plain/text').send("Table AIRBNB already existing");
            }else{
                console.log('INFO: Table AIRBNB will be created')
                db.writeIntoHdb(
                    config.hdb,
                    createTableStatement,
                    dummyParams
                );
                res.type('plain/text').send("Success: Table AIRBNB created!");
            }
        },
        info => console.log(info)
    );
});

app.get('/dataTransformation', function (req, res, next) {
    db.readFromHdb(
        config.hdb,
        tableCheckStatement,
        dummyParams,
        rows => {
            if(rows[0]['TABLE_EXISTS'] == 0){
                console.log('INFO: Table AIRBNB not existing.')
                res.type('plain/text').send("Table AIRBNB not existing. Create table first!");
            }else{
                db.readFromHdb(
                    config.hdb,
                    checkNAExistsInColumnStatement,
                    dummyParams,
                    rows => {
                        if(rows[0]['NA_EXISTS'] == 0){
                            console.log('INFO: HOST_RESPONSE_TIME does not have any NA results')
                            res.type('plain/text').send("'N/A' and empty strings already removed. Please continue with missing value substitution.");
                        }
                        else{
                            console.log('INFO: HOST_RESPONSE_TIME has NA results, cleaning started!')
                            db.writeIntoHdb(
                                config.hdb,
                                preProcessingStatement,
                                dummyParams
                            );
                            res.type('plain/text').send("Success: Data transformation done!");
                        }
                    },
                    info => console.log(info)
                );
            }
        },
        info => console.log(info)
    );
});

app.get('/evaluateUserInput', function (req, res, next) {
    var inputData = req.query.inputData;
    var superhost = convertYesNoToTF(inputData['HOST_IS_SUPERHOST']);
    var hostPic = convertYesNoToTF(inputData['HOST_HAS_PROFILE_PIC']);
    var hostIdentity = convertYesNoToTF(inputData['HOST_IDENTITY_VERIFIED']);
    var locationExact = convertYesNoToTF(inputData['IS_LOCATION_EXACT']);
    var availability = convertYesNoToTF(inputData['HAS_AVAILABILITY']);
    var bookable = convertYesNoToTF(inputData['INSTANT_BOOKABLE']);
    var businessTravel = convertYesNoToTF(inputData['IS_BUSINESS_TRAVEL_READY']);
    var guestPic = convertYesNoToTF(inputData['REQUIRE_GUEST_PROFILE_PICTURE']);
    var guestPhone = convertYesNoToTF(inputData['REQUIRE_GUEST_PHONE_VERIFICATION']);
    
    var predictStatement = `CALL predict_price('` + inputData['HOST_RESPONSE_TIME'] + `','`
                         + superhost + `','` + inputData['HOST_NEIGHBOURHOOD'] + `','`
                         + hostPic + `','` + hostIdentity + `',`
                         + inputData['LATITUDE'] + `,` + inputData['LONGITUDE'] + `,'`
                         + locationExact + `','` + inputData['PROPERTY_TYPE'] + `','`
                         + inputData['ROOM_TYPE'] + `',` + inputData['ACCOMMODATES'] + `,'`
                         + inputData['BED_TYPE'] + `',` + inputData['GUESTS_INCLUDED'] + `,'`
                         + availability + `',` + inputData['NUMBER_OF_REVIEWS'] + `,'`
                         + bookable + `','` + businessTravel + `','`
                         + inputData['CANCELLATION_POLICY'] + `','` + guestPic + `','`
                         + guestPhone + `',` + inputData['RESPONSE_RATE'] + `,`
                         + inputData['COUNT_HOST_LISTINGS'] + `,` + inputData['NR_BATHROOMS'] + `,`
                         + inputData['NR_BEDROOMS'] + `,` + inputData['NR_BEDS'] + `,`
                         + inputData['SECURITY_DEPO'] + `,` + inputData['CLEANING_COST'] + `,`
                         + inputData['COST_PER_EXTRA_GUEST'] + `,` + inputData['REVIEW_SCORE'] + `,`
                         + inputData['NR_REVIEWS_PER_MONTH'] + `, ?)`;
    console.log(predictStatement)
    db.readFromHdb(
        config.hdb,
        predictStatement,
        dummyParams,
        rows => res.type('plain/text').send(rows[0]['TARGET']),
        info => console.log(info)
    );
});

function convertYesNoToTF(boolInput){
    var bool_tf;
    if(boolInput == 'Yes'){
        bool_tf = 't';
    }else{
        bool_tf = 'f';
    }
    return bool_tf;
}

app.get('/substitutingMissingValues', function (req, res, next) {
    db.readFromHdb(
        config.hdb,
        tableCheckStatement,
        dummyParams,
        rows => {
            if(rows[0]['TABLE_EXISTS'] == 0){
                console.log('INFO: Table AIRBNB not existing.')
                res.type('plain/text').send("Table AIRBNB not existing. Create table first!");
            }else{
                db.readFromHdb(
                    config.hdb,
                    checkSuperhostEmptyStringStatement,
                    dummyParams,
                    rows => {
                        if(rows[0]['EMPTY_STRING_EXISTS'] > 0){
                            console.log('INFO: host_is_superhost still has empty strings')
                            res.type('plain/text').send("Empty strings are still existing. Please transform data first.");
                        }
                        else{
                            db.readFromHdb(
                                config.hdb,
                                checkNullExistsInColumnStatement,
                                dummyParams,
                                rows => {
                                    if(rows[0]['NULL_EXISTS'] == 0){
                                        console.log('INFO: HOST_RESPONSE_TIME does not have any NULL results')
                                        res.type('plain/text').send("NULL values already substituted. Feel free to start binning!");
                                    }else{
                                        db.writeIntoHdb(
                                            config.hdb,
                                            substitutingMissingValuesStatement,
                                            dummyParams
                                        );
                                        res.type('plain/text').send("Success: NULL values substituted!");
                                    }
                                },
                                info => console.log(info)
                            );
                        }
                    },
                    info => console.log(info)
                );
            }
        },
        info => console.log(info)
    );
});

app.get('/binningGroundtruthLabel', function (req, res, next) {
    db.readFromHdb(
        config.hdb,
        tableCheckStatement,
        dummyParams,
        rows => {
            if(rows[0]['TABLE_EXISTS'] == 0){
                console.log('INFO: Table AIRBNB not existing.')
                res.type('plain/text').send("Table AIRBNB not existing. Create table first!");
            }else{
                db.readFromHdb(
                    config.hdb,
                    sizeQuery,
                    dummyParams,
                    rows => {
                        if(rows[0]['SIZE'] == 0){
                            console.log('INFO: Table AIRBNB empty, import first!')
                            res.type('plain/text').send("Table AIRBNB empty, import first!");
                        }else{
                            db.readFromHdb(
                                config.hdb,
                                checkSuperhostEmptyStringStatement,
                                dummyParams,
                                rows => {
                                    if(rows[0]['EMPTY_STRING_EXISTS'] > 0){
                                        console.log('INFO: host_is_superhost still has empty strings')
                                        res.type('plain/text').send("Empty strings are still existing. Please transform data first.");
                                    }
                                    else{
                                        db.readFromHdb(
                                            config.hdb,
                                            checkNullExistsInColumnStatement,
                                            dummyParams,
                                            rows => {
                                                if(rows[0]['NULL_EXISTS'] == 0){
                                                    db.readFromHdb(
                                                        config.hdb,
                                                        mostFrequentGTQuery,
                                                        dummyParams,
                                                        rows => {
                                                            if(rows[0]['GROUNDTRUTHPRICE'] != 3){
                                                                db.writeIntoHdb(
                                                                    config.hdb,
                                                                    binningStatement,
                                                                    dummyParams
                                                                );
                                                                res.type('plain/text').send("Success: Groundtruth labels binned! Now you can train the model or use the pre-trained model!");
                                                            }else{
                                                                console.log('INFO: Groundtruth price labels are very likely already binned')
                                                                res.type('plain/text').send("Groundtruth price labels are very likely already binned.");
                                                            }
                                                        },
                                                        info => console.log(info)
                                                    );
                                                }else{
                                                    console.log('INFO: HOST_RESPONSE_TIME stil has NULL results')
                                                    res.type('plain/text').send("NULL values not yet substituted. Substitute NULL values first!");
                                                }
                                            },
                                            info => console.log(info)
                                        );
                                    }
                                },
                                info => console.log(info)
                            );
                        }
                    },
                    info => console.log(info)
                );

            }
        },
        info => console.log(info)
    );
});

app.get('/trainModel', function (req, res, next) {
    db.readFromHdb(
        config.hdb,
        tableCheckStatement,
        dummyParams,
        rows => {
            if(rows[0]['TABLE_EXISTS'] == 0){
                console.log('INFO: Table AIRBNB not existing.')
                res.type('plain/text').send("Table AIRBNB not existing. Create table first!");
            }else{
                db.readFromHdb(
                    config.hdb,
                    sizeQuery,
                    dummyParams,
                    rows => {
                        if(rows[0]['SIZE'] == 0){
                            console.log('INFO: Table AIRBNB empty, import first!')
                            res.type('plain/text').send("Table AIRBNB empty, import first!");
                        }else{
                            db.readFromHdb(
                                config.hdb,
                                checkSuperhostEmptyStringStatement,
                                dummyParams,
                                rows => {
                                    if(rows[0]['EMPTY_STRING_EXISTS'] > 0){
                                        console.log('INFO: host_is_superhost still has empty strings')
                                        res.type('plain/text').send("Empty strings are still existing. Please transform data first.");
                                    }
                                    else{
                                        db.readFromHdb(
                                            config.hdb,
                                            checkNullExistsInColumnStatement,
                                            dummyParams,
                                            rows => {
                                                if(rows[0]['NULL_EXISTS'] == 0){
                                                    db.readFromHdb(
                                                        config.hdb,
                                                        mostFrequentGTQuery,
                                                        dummyParams,
                                                        rows => {
                                                            if(rows[0]['GROUNDTRUTHPRICE'] != 3){
                                                                console.log("INFO: Groundtruth very likely not binned yet!!")
                                                                res.type('plain/text').send("The groundtruth is not binned yet!");
                                                            }else{
                                                                console.log("INFO: start to train now!")
                                                                db.writeIntoHdb(
                                                                    config.hdb,
                                                                    trainModelProcedure,
                                                                    dummyParams
                                                                );
                                                                res.type('plain/text').send("Success: Shallow model trained, but it might be very dumb!");
                                                            }
                                                        },
                                                        info => console.log(info)
                                                    );
                                                }else{
                                                    console.log('INFO: HOST_RESPONSE_TIME stil has NULL results')
                                                    res.type('plain/text').send("NULL values not yet substituted. Substitute NULL values first!");
                                                }
                                            },
                                            info => console.log(info)
                                        );
                                    }
                                },
                                info => console.log(info)
                            );
                        }
                    },
                    info => console.log(info)
                );
            }
        },
        info => console.log(info)
    );
});