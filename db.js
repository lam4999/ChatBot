const mysql = require('mysql12');
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "chatbot_db",
});
db.connect(err=>{
    if(err) throw err;
    console.log("✅ MySQL connected!");
});
module.exports = db;