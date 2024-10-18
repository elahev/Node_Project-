const express = require('express'); 
const path = require('path');
const randomGreeting = require('./randomGreeting'); // this returns a random greeting.
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Set up Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', //  MySQL username
  password: '136428Elahe!', //  MySQL password
  database: 'CPRG212'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// Routes
app.get('/', (req, res) => {
  const greeting = randomGreeting();
  res.render('index', { title: 'Home', greeting });
});

// Contact form route (displays only 4 fields in form)
app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us' });
});

// About route
app.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

// Handle contact form submission with server-side validation
app.post('/submit-form', (req, res) => {
  const { first_name, last_name, email, feedback_message } = req.body;

  // Server-side validation
  if (!first_name || !last_name || !email || !feedback_message) {
    return res.status(400).send('All fields are required.');
  }

  // Email validation using regex
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailPattern.test(email)) {
    return res.status(400).send('Invalid email address.');
  }

  // Dummy values for fields not shown in the form
  const phone_number = 'N/A';
  const city = 'N/A';
  const province = 'N/A';
  const postal_code = 'N/A';

  // Insert the form data into the database
  const sql = `INSERT INTO contact (first_name, last_name, email, phone_number, city, province, postal_code, feedback_message)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [first_name, last_name, email, phone_number, city, province, postal_code, feedback_message], (err, result) => {
    if (err) {
      console.error('Error inserting data into the database:', err);
      return res.status(500).send('Database error');
    }

    // Redirect to a thank you page after successful form submission
    res.render('thankyou', { title: 'Thank You', first_name, email });
  });
});

// Catch-all route for undefined routes (404 error)
app.use((req, res, next) => {
  res.status(404).render('404', { title: 'Page Not Found', error: req.url });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
