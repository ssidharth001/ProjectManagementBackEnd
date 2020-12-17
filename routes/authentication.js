const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const express = require('express')
const dbConnection = require('../dbConnection')
require('dotenv').config()

// Create route
const router = express.Router()


router.post('/user/register', async (req, res) => {
    const pswrd = req.body.password;
    const hashedPassword = await bcrypt.hash(pswrd, 10);
    console.log(hashedPassword)
    const user = {name: req.body.name, email: req.body.email, password: hashedPassword}

    const query = `INSERT INTO User SET ?`
    dbConnection.query(query, user, (err, rows, fields) => {
      if (!err) {
        res.status(201).send("data added")
      }
      else res.sendStatus(503)
    })
  
  })
  
  router.get('/user', authentication, (req, res) => {
    const query = `SELECT * FROM User`
    console.log(req.user);
    dbConnection.query(query, (err, rows, fields) => {
      if (!err) { res.send(rows) }
      else res.send(err)
    })
  
  })

  router.post('/user/login', (req, res) => {

    const query = `SELECT password FROM User WHERE name=? AND email=?`
    dbConnection.query(query, [req.body.name,req.body.email], async (err, rows, fields) => {
      if (!err) {
          if(rows.length!=0) {
            if(await bcrypt.compare(req.body.password, rows[0].password)) {
                  try {
                    const accessToken = jwt.sign(req.body, process.env.access_token)
                    res.send({accesstoken: accessToken})
                    console.log('User logged in successfully')
                  }
                  catch {
                      res.send("no token")
                  }
              }
              else res.send(err)
            }
            else res.send("user does not exist")

       
      }
      else res.send(err)
    })
  
  })

function authentication(req, res, next) {
    const token = req.headers['authorization'].split(' ')[1];
    if(token == null) res.sendStatus(401)
    jwt.verify(token, process.env.access_token, (err, user) => {
        if(!err) {
            req.user = user;
            next();
        }
        else res.sendStatus(403)
    })

}



  module.exports = router

