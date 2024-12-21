const mysql = require('mysql2');

const connectDatabase = () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Oracle@12345',
        database: 'my_database'
    });

    connection.connect((err) => {
        if (err) {
            console.error("Error connecting to MySQL database:", err);
            return;
        }
        console.log("MySQL database connected");
    });

    return connection;
};

module.exports = connectDatabase;
