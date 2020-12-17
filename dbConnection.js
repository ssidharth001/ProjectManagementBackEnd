const mysql = require('mysql')
require('dotenv').config()

const mysqlConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.mysql_password,
  database: 'Project_management_dashboard',
  multipleStatements: true
})

mysqlConnection.connect((err) => {
  if (!err) console.log('Connected to database')
  else console.log('Cannot connect', err)
})

module.exports = mysqlConnection