const hanaClient = require("@sap/hana-client");
const connection = hanaClient.createConnection();
var async = require("async");

module.exports = {
    readFromHdb: function (hdb, sql, params, handleRows, infoHandler) {
        connection.connect(hdb, (err) => {
            if (err) {
                return console.error("Connection error", err);
            }

            var stmt = connection.prepare(sql);
            stmt.exec(params, (err, rows) => {
                console.log("INFO: to disconnect")
                connection.disconnect();
                console.log("INFO: should be disconnected!")
                if (err) {
                    return console.error('SQL execute error:', err);
                }

                handleRows(rows);
                infoHandler(`Query '${sql}' returned ${rows.length} items`);
            });
        });
    },

    writeIntoHdb: function (hdb, sql, params) {
        connection.connect(hdb, (err) => {
            if (err) {
                return console.error("Connection error", err);
            }

            var stmt = connection.prepare(sql);
            stmt.exec(params, (err, rows) => {
                console.log("INFO: to disconnect")
                connection.disconnect();
                console.log("INFO: should be disconnected!")
                if (err) {
                    return console.error('SQL execute error:', err);
                }
            });
        });
    },

};