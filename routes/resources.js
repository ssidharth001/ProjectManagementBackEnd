const express = require('express')
const dbConnection = require('../dbConnection')

// Create route
const router = express.Router()

/* ---------------------------- Route handlers -------------------------------- */
// List of all resources available
router.get('/resources', (req, res) => {

  const query = `SELECT Resources.id,name,role,email,project_id,billable,ratePerHour FROM Resources 
                  LEFT JOIN Project_resource_map ON Resources.id = Project_resource_map.resource_id`

  dbConnection.query(query, (err, rows, fields) => {
    if (!err) res.send(rows)
    else console.log(err)
  })

})

// Add a resource to a project
router.post('/resources/allocate', (req, res) => {
  dbConnection.query('SELECT id FROM Resources WHERE email = ?', req.body.email, (err, rows, fields) => { // Check if already present
    if (!err) {
      if (rows.length == 0) {
        const query = `INSERT INTO Resources SET ?`
        let responseBody = { name: req.body.name, email: req.body.email, role: req.body.role };
        dbConnection.query(query, responseBody, (err, rows, fields) => {
          if (!err) {
            res.send(rows);
            addMapping(req.body)
          }
          else console.log(err)
        })

      }
      else {
        addMapping(req.body)
        res.send("resource already exist");
      }
    }
    else console.log(err);
  });

})

// Function to map added resource to its corresponding project
function addMapping(response) {
  console.log("inside map", response);
  dbConnection.query('SELECT id FROM Resources WHERE email = ?', response.email, (err, rows, fields) => {
    if (!err) {
      console.log("id =", rows[0].id);
      const query = `INSERT INTO Project_resource_map SET ?`;
      let resourceMapObject = { project_id: response.project_id, resource_id: rows[0].id, billable: response.billable, ratePerHour: response.ratePerHour }
      console.log(resourceMapObject);
      dbConnection.query(query, resourceMapObject, (error, row, fields) => {
        if (!error) console.log('Mapped data added successfully')
        else console.log(error)
      })
    }
    else console.log(err)
  })
}

//Edit a resource

router.put('/resources/:id', (req, res) => {
  const query = `UPDATE Resources SET name = ?, email = ?, role = ? Where id = ?`

  const dataToPut = [`${req.body.name}`, `${req.body.email}`, `${req.body.role}`, parseInt(req.params.id)]

  dbConnection.query(query, dataToPut, (err, rows, fields) => {
    if (!err) {
      EditResourceProjectMap(req.body, parseInt(req.params.id));
      res.send('Data updated successfully')
    }
    else console.log(err)
    
  })

})

function EditResourceProjectMap(response, id){
  console.log(response);
  const query = `UPDATE Project_resource_map SET billable = ?, ratePerHour = ? Where project_id = ? AND resource_id = ?`
  const dataToPut = [`${response.billable}`, `${response.ratePerHour}`, `${response.project_id}`, id]

  dbConnection.query(query, dataToPut, (err, rows, fields) => {
    if (!err) console.log('Data updated successfully')
    else console.log(err)
  })
}



// delete resources
router.delete('/resources/:id', (req, res) => {
  const query = `DELETE FROM Project_resource_map WHERE project_id = ? AND resource_id =?`
  console.log(parseInt(req.params.id));
  dbConnection.query(query, [req.body.project_id,parseInt(req.params.id)], (err, rows, fields) => {
    if (!err) res.send('Data deleted successfully')
    else console.log(err)
  })

})

module.exports = router