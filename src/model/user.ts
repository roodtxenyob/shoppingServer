let mysql: any = require('mysql');
let connection: any = mysql.createConnection({
    user: 'root',
    password: 'root',
    database: 'gw_shopping'
});

connection.connect();

module.exports = connection;
 