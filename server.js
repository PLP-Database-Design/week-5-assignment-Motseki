const express = require('express')
const app = express()

const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

app.use(express.json());
app.use(cors());
dotenv.config();


// CONNECT TO THE DATABASE ***
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Check if db connection works
db.connect((err) => {
	// Coonection not successfully
	if(err) return console.log("Error connecting to the mysql db");
	
	// Connection successfully
	console.log("Connected to mysql successfully as id: ", db.threadId);

// Question 1 goes here
  app.get('/patients', (req, res) => {
		// Retrieve data from the database
    const getPateints = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients"
		db.query(getPateints, (err, data) => {
			if(err) {
				console.log(err);
				res.statusMessage(500).send('Error retrieving data');
			} else {
				// Display the
				// res.render('data', {results: results});
        res.status(200).send(data)
      }
    })
	})

// Question 2 goes here
app.get('/providers', (req, res) => {
  // Retrieve data from the database
  const getPateints = "SELECT first_name, last_name, provider_specialty FROM providers"
  db.query(getPateints, (err, data) => {
    if(err) {
      console.log(err);
      res.statusMessage(500).send('Error retrieving data');
    } else {
      // Display the
      // res.render('data', {results: results});
      res.status(200).send(data)
    }
  })
})

// Question 3 goes here

app.get('/filteredPatients', (req, res) => {
  const firstName = req.query.first_name;

  if (!firstName) {
    return res.status(400).send('First name is required');
  }

  const getFilteredPatients = "SELECT * FROM patients WHERE first_name = ?";
  db.query(getFilteredPatients, [firstName], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error retrieving data');
    }

    if (data.length === 0) {
      return res.status(404).send('No patients found with that first name');
    }

    res.json(data);
  });
});


// Question 4 goes here


app.get('/filteredProviders', (req, res) => {
  const specialty = req.query.provider_specialty;

  if (!specialty) {
    return res.status(400).send('Provider Specialty is required');
  }

  const getFilteredProviders = "SELECT * FROM providers WHERE provider_specialty = ?";
  db.query(getFilteredProviders, [specialty], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Error retrieving data');
    }

    if (data.length === 0) {
      return res.status(404).send('No providers found with that provider_specialty');
    }

    res.json(data);
  });
});



// listen to the server
const PORT = 3000
  app.listen(PORT, () => {
    console.log(`server is runnig on http://localhost:${PORT}`)
  });

});
