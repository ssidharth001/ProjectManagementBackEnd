const { SERVFAIL } = require('dns')
const express = require('express')
const dbConnection = require('../dbConnection')

// Create route
const router = express.Router()

/* ---------------------------- Route handlers -------------------------------- */
// List of all projects in db
router.get('/projects', (req, res) => {
  const query = `SELECT Projects.id AS projectId, projectName , clientName , projectManager, projectStatus, 
  startDate, endDate, progress, description, JSON_ARRAYAGG(Technologies.name) as technologies FROM Projects 
  JOIN Project_tech_map ON Projects.id = Project_tech_map.project_id JOIN Technologies ON 
  Project_tech_map.tech_id = Technologies.id 
  GROUP BY Projects.id;`

  dbConnection.query(query, (err, rows, fields) => {
    if (!err) { res.send(rows) }
    else console.log(err)
  })

})

router.get('/technologies', (req, res) => {
  const query = `SELECT JSON_ARRAYAGG(name) AS technologies FROM Technologies`

  dbConnection.query(query, (err, rows, fields) => {
    if (!err) { res.send(rows) }
    else console.log(err)
  })

})

// Add a new project to the db
router.post('/projects', (req, res) => {
  const query = `INSERT INTO Projects SET ?`

  let { technologies, ...other } = req.body

  dbConnection.query(query, other, (err, rows, fields) => {
    if (!err) {
      console.log('Data added successfully')
      console.log(rows.insertId)
      addTech(technologies, rows.insertId)
    }
    else console.log(err)
  })

})

// Edit or update an existing project in db
router.put('/projects/:id', (req, res) => {
  const query = `UPDATE Projects SET projectName = ?, clientName = ?, projectManager = ?, projectStatus = ?, startDate = ?, endDate = ?, progress= ?, description = ? Where id = ?`

  const dataToPut = [`${req.body.projectName}`, `${req.body.clientName}`, `${req.body.projectManager}`, `${req.body.projectStatus}`, `${req.body.startDate}`, `${req.body.endDate}`, `${req.body.progress}`, `${req.body.description}`, parseInt(req.params.id)]

  dbConnection.query(query, dataToPut, (err, rows, fields) => {
    if (!err) {
      addTech(req.body.technologies, parseInt(req.params.id));
      res.send('Data updated successfully')
    }
    else console.log(err)

  })

})

// Delete an existing project from db
router.delete('/projects/:id', (req, res) => {
  const query = `DELETE FROM Projects WHERE id = ?`

  dbConnection.query(query, [parseInt(req.params.id)], (err, rows, fields) => {
    if (!err) res.send('Data deleted successfully')
    else console.log(err)
  })

})


// Function to add to technologies

function addTech(technologies, projectId) {
  const query1 = 'DELETE FROM Project_tech_map WHERE project_id = ?';
  dbConnection.query(query1, [projectId], (err, rows, fields) => {
    if (!err) {
      technologies.forEach((tech) => {
        const query = `SELECT id FROM Technologies WHERE name = ?`

        dbConnection.query(query, tech, (err, rows, fields) => {
          if (!err) {
            if (rows.length == 0) {
              let techId
              dbConnection.query(`INSERT INTO Technologies SET name = ?`, tech, (err, res, fields) => {
                if (!err) {
                  techId = res.insertId
                  console.log('Tech added successfully');
                  techMap(projectId, techId)
                }
                else console.log(err)
              })


            }
            else {
              techMap(projectId, rows[0].id)
            }
          }
          else console.log(err)
        })

      })

    }
    else console.log(err);
  })

}

function techMap(projectId, techId) {

  const query = `INSERT INTO Project_tech_map SET ?`;
  const techMapObj = {
    project_id: projectId,
    tech_id: techId
  }
  dbConnection.query(query, techMapObj, (err, rows, fields) => {
    if (!err) console.log("inserted techid and projectid")
    else console.log(err)
  })

}




module.exports = router