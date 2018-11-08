const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'myblog',
    multipleStatements: true
});
module.exports = connection;