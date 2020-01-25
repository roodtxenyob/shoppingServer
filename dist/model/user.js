"use strict";
var mysql = require('mysql');
var connection = mysql.createConnection({
    user: 'root',
    password: 'root',
    database: 'gw_shopping'
});
connection.connect();
module.exports = connection;
