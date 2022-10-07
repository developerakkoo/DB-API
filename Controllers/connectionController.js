const mysql = require("mysql");
const fastcsv = require("fast-csv");
const fs = require("fs");
const ws = fs.createWriteStream("mydb.csv");
// include node fs module







exports.connectionU = async (req, res, next) => {
    const host = req.body.host;
    const user = req.body.user;
    const password = req.body.password;


    console.log(host)
    const connection = mysql.createConnection({
        host: host,
        user: user,
        password: password,
    });



    // writeFile function with filename, content and callback function
    fs.writeFile('connection.js', `const mysql = require("mysql");

    const connection = mysql.createConnection({
        host: "${host}",
        user: "${user}",
        password: "${password}",
        });
                                        
    module.exports= { connection: connection }`, function (err) {
        if (err) throw err;
        ws.on('finish', 
            res.status(200)
                .json({

                    message: "Server setup!",
                })

        );
        console.log('File is created successfully.');
    })
    // fs.writeFileSync('./data.json', JSON.stringify(connection, null, 2) , 'utf-8');
    //console.log(connection)
    /* if (connection) {
        res.status(200).json({ connection, message: "Data Found!" });
        //console.log(result);
    } */
    /*  const jsonData = JSON.parse(JSON.stringify(connection));
 
     console.log("jsonData", jsonData);
     if (jsonData) {
         res.status(200).json({ jsonData, message: "Data Found!" });
         //console.log(result);
     } */
    /* fastcsv
        .write(connection, { headers: true })
        .on("finish", function () {
            console.log("Write to mydb.csv successfully!");
        })
        .pipe(ws); */

};