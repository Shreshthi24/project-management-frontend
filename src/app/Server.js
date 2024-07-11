const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 8082;

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'techprime'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

// API endpoint to fetch project counters
app.get('/counters', (req, res) => {
  const query = `
    SELECT 
      (SELECT COUNT(*) FROM projects) AS totalProjects,
      (SELECT COUNT(*) FROM projects WHERE status = 'Closed') AS closedProjects,
      (SELECT COUNT(*) FROM projects WHERE status = 'Running') AS runningProjects,
      (SELECT COUNT(*) FROM projects WHERE status = 'Closure Delay') AS closureDelay,
      (SELECT COUNT(*) FROM projects WHERE status = 'Cancelled') AS cancelledProjects
  `;

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).send('Server error');
      return;
    }
    res.json(results[0]);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
