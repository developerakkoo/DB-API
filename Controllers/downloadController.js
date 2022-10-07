const mysql = require("mysql");
const fs = require("fs");
const { connection } = require('../connection');
const path = require("path")
var zipdir = require('zip-dir');
const converter = require('json-2-csv')

exports.database = async (req, res, next) => {
    connection.connect(function (err) {

        connection.query("show databases", function (err, result, fields) {
            if (err) throw err;
            const results = result.map((r) => r["Database"]);
            if (results) {
                res
                    .status(200)
                    .json({
                        "Total-Databases": result.length,
                        result,
                        message: "Databases Found!",
                    });
                //console.log(results);
            }
        });
    });
};

exports.table = async (req, res, next) => {
    try {
        connection.connect(function (err) {

            let query = "select table_schema, table_name from information_schema.tables WHERE table_schema NOT IN ( 'information_schema', 'performance_schema', 'mysql','phpmyadmin' )"
            connection.query(query, function (err, tables, fields) {
                if (err) throw err;
                const result = tables.map((table) => table["table_name"]);
                if (result) {
                    res
                        .status(200)
                        .json({
                            "Total-Tables": result.length,
                            result,
                            message: "Tables Found!",
                        });
                    //console.log(result);
                }
            }
            );
        });
    } catch (error) {
        res.status(500).json({ error, message: "Something went wrong!" });
    }
};

exports.tableByDb = async (req, res, next) => {
    try {

        let dbname = req.body.dbname;

        connection.connect(function (err) {
            let query1 = "SHOW TABLES FROM " + dbname;

            connection.query(query1, function (err, tables, fields) {
                if (err) throw err;
                //console.log(table)
                const result = tables.map((table) => table["Tables_in_" + dbname]);

                if (result) {
                    res.status(200).json({ result, message: "Tables Found!" });
                    //console.log(result);
                }
            });
        });
        //})
    } catch (error) {
        res.status(500).json({ error, message: "Something went wrong!" });
    }
};

exports.viewByDb = async (req, res, next) => {
    try {

        let dbname = req.body.dbname;

        connection.connect(function (err) {
            let query2 = "SHOW FULL TABLES IN " + dbname + " WHERE TABLE_TYPE LIKE 'VIEW';"

            connection.query(query2, function (err, tables, fields) {
                if (err) throw err;
                //console.log(table)
                const result = tables.map((table) => table["Tables_in_" + dbname]);

                if (result) {
                    res.status(200).json({ result, message: "Tables Found!" });
                    //console.log(result);
                }
            });
        });
        //})
    } catch (error) {
        res.status(500).json({ error, message: "Something went wrong!" });
    }
};

exports.downloadCsv = async (req, res, next) => {
    try {
        let dbname = req.body.dbname;
        let tablename = req.body.tablename;
        tablename = tablename.split(",")
        let separator = req.body.separator;


        connection.connect(function (err) {
            let query1 = "USE " + dbname;

            connection.query(query1, function (err, result, fields) {
                if (err) throw err;
                //console.log(tables)
                for (i = 0; i < tablename.length; i++) {
                    if (tablename.length >= 1) {

                        let q = [];
                        //if(tablename.length=1)
                        let query = "SELECT * FROM " + tablename[i];

                        if (result) {
                            connection.query(query, function (err, table, fields) {
                                if (err) throw err;
                                //console.log(table.length)
                                let data = JSON.stringify(table);
                                const jsonData = JSON.parse(data);

                                let date = Date.now()
                                let file = `files/csv/${tablename}${date}.csv`
                                let options = {
                                    delimiter: {
                                        field: separator,
                                    },

                                };
                                let json2csvCallback = function (err, csv) {
                                    if (err) throw err;
                                    fs.writeFile(file, csv, 'utf8', function (err) {
                                        if (err) throw err;
                                        console.log('complete');
                                    });
                                };
                                converter.json2csv(table, json2csvCallback, options)
                                /* converter.json2csv(table, (err, csv) => {
                                    if (err) {
                                        throw err
                                    } */

                            });
                        }
                    }
                }

                var buffer = zipdir('C:/Users/Raj Gupta/DATABASE-API/files/csv');//change file location for live server

                res.set('Content-Type', 'application/octet-stream');
                res.set('Content-Disposition', `attachment; filename=files.zip`);
                //res.set('Content-Length', folder.length);
                res.send(buffer);
            });


        });
    } catch (error) {
        res.status(500).json({ error, message: "Something went wrong!" });
    }
};


exports.downloadPdf = async (req, res, next) => {
    try {
        let dbname = req.body.dbname;
        let tablename = req.body.tablename;
        tablename = tablename.split(",")
        console.log("data")

        connection.connect(function (err) {
            let query1 = "USE " + dbname;

            connection.query(query1, function (err, result, fields) {
                if (err) throw err;

                for (i = 0; i < tablename.length; i++) {
                    if (tablename.length >= 1) {

                        let query = "SELECT * FROM " + tablename[i];

                        if (result) {
                            connection.query(query, function (err, table, fields) {
                                if (err) throw err;

                                let data = JSON.stringify(table);
                                const jsonData = JSON.parse(data);
                                let date = Date.now()
                                let file = `files/pdf/${tablename}${date}.pdf`
                                doc.addPage()
                                var pdfDoc = printer.createPdfKitDocument(jsonData);
                                console.log(pdfDoc)
                                pdfDoc.pipe(fs.createWriteStream(file));
                                pdfDoc.end();
                                fs.writeFile(file, data, 'utf8', function (err) {
                                    if (err) throw err;
                                    console.log('complete');
                                });
                            });
                        }
                    }
                }
                var buffer = zipdir('C:/Users/Raj Gupta/DATABASE-API/files/pdf');//change file location for live server

                res.set('Content-Type', 'application/octet-stream');
                res.set('Content-Disposition', `attachment; filename=files.zip`);
                //res.set('Content-Length', folder.length);
                res.send(buffer);
            });
        });
    } catch (error) {
        res.status(500).json({ error, message: "Something went wrong!" });
    }
};

exports.downloadJson = async (req, res, next) => {
    try {
        let dbname = req.body.dbname;
        let tablename = req.body.tablename;
        let separator = req.body.separator;
        tablename = tablename.split(",")

        connection.connect(function (err) {
            let query1 = "USE " + dbname;

            connection.query(query1, function (err, result, fields) {
                if (err) throw err;

                for (i = 0; i < tablename.length; i++) {
                    if (tablename.length >= 1) {

                        let query = "SELECT * FROM " + tablename[i];

                        if (result) {
                            connection.query(query, function (err, table, fields) {
                                if (err) throw err;

                                let data = JSON.stringify(table);
                                const jsonData = JSON.parse(data);
                                let data1 = JSON.stringify(jsonData, null, separator);
                                let date = Date.now()
                                let file = `files/json/${tablename}${date}.json`
                                fs.writeFile(file, data1, 'utf8', function (err) {
                                    if (err) throw err;
                                    console.log('complete');
                                });
                            });
                        }
                    }
                }
                var buffer = zipdir('C:/Users/Raj Gupta/DATABASE-API/files/json');//change file location for live server

                res.set('Content-Type', 'application/octet-stream');
                res.set('Content-Disposition', `attachment; filename=files.zip`);
                //res.set('Content-Length', folder.length);
                res.send(buffer);
            });
        });
    } catch (error) {
        res.status(500).json({ error, message: "Something went wrong!" });
    }
};


exports.downloadTsv = async (req, res, next) => {
    try {
        let dbname = req.body.dbname;
        let tablename = req.body.tablename;
        tablename = tablename.split(",")
        let separator = req.body.separator;

        connection.connect(function (err) {
            let query1 = "USE " + dbname;

            connection.query(query1, function (err, result, fields) {
                if (err) throw err;

                for (i = 0; i < tablename.length; i++) {
                    if (tablename.length >= 1) {

                        let query = "SELECT * FROM " + tablename[i];
                        if (result) {
                            connection.query(query, function (err, table, fields) {
                                if (err) throw err;

                                let data = JSON.stringify(table);
                                const jsonData = JSON.parse(data);
                                let date = Date.now()
                                let file = `files/tsv/${tablename}${date}.tsv`
                                let options = {
                                    delimiter: {
                                        field: "    " + separator,
                                    },

                                };
                                let json2csvCallback = function (err, csv) {
                                    if (err) throw err;
                                    fs.writeFile(file, csv, 'utf8', function (err) {
                                        if (err) throw err;
                                        console.log('complete');
                                    });
                                };
                                converter.json2csv(table, json2csvCallback, options)

                                /* converter.json2csv(table, (err, csv) => {
                                    if (err) {
                                        throw err
                                    }

                                    fs.writeFile(file, csv, 'utf8', function (err) {
                                        if (err) throw err;
                                        console.log('complete');
                                    });
                                }) */
                            });
                        }
                    }
                }

                var buffer = zipdir('C:/Users/Raj Gupta/DATABASE-API/files/tsv');//change file location for live server

                res.set('Content-Type', 'application/octet-stream');
                res.set('Content-Disposition', `attachment; filename=files.zip`);
                //res.set('Content-Length', folder.length);
                res.send(buffer);
            });


        });
    } catch (error) {
        res.status(500).json({ error, message: "Something went wrong!" });
    }
};


/* 
exports.downloadPdf = async (req, res, next) => {
    try {

        const filePath = path.resolve("./mydb.csv")

        const destinationPath = path.resolve("./mydb")

        converter.HTMLAndPDFConverter(filePath, destinationPath)

        res.send("C:/Users/Raj Gupta/DATABASE-API/mydb.pdf")

    } catch (error) {
        res.status(500).json({ error, message: "Something went wrong!" });
    }
}; */

/* exports.downloadTsv = async (req, res, next) => {
    try {    
        var tsv = aoot.tsv("C:/Users/Raj Gupta/DATABASE-API/mydb.csv")
        console.log(aoot.tsv("C:/Users/Raj Gupta/DATABASE-API/mydb.csv"))
        res.send("C:/Users/Raj Gupta/DATABASE-API/mydb.tsv")
    } catch (error) {
        res.status(500).json({ error, message: "Something went wrong!" });
    }
}; */