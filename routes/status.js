const express = require('express')
const dbConnection = require('../dbConnection')
const { route } = require('./projects')

// Create route
const router = express.Router()

/* ---------------------------- Route handlers -------------------------------- */
// Get all status reports
router.get('/status',(req,res)=>{
  const query = `SELECT Status_reports.*, Resources.name FROM Status_reports JOIN Resources ON Status_reports.resource_id = Resources.id`

  dbConnection.query(query, (err, rows, fields) => {
    if (!err) res.send(rows)
    else console.log(err)
  })
})

// Add a new report 
router.post('/status',(req,res)=>{
  const query = `INSERT INTO Status_reports SET ?`
  var {name, ...others} = req.body
  dbConnection.query(query,others, (err, rows, fields) => {
    if (!err) res.send('Status added successfully')
    else console.log(err)
  })
})


module.exports = router