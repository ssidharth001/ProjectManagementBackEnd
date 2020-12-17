const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const projectRoute = require('./routes/projects')
const resourceRoutes = require('./routes/resources')
const statusRoutes = require('./routes/status')
const authenticationRoutes = require('./routes/authentication')

require('dotenv').config()
// Setup express server
const server = express()

server.use(cors());
server.use(bodyParser.json())

server.use(projectRoute)
server.use(resourceRoutes)
server.use(statusRoutes)
server.use(authenticationRoutes)



server.listen(process.env.port, () => {
  console.log('Listening to requests.....')
})