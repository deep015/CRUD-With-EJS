// Importing required modules
const express = require('express'); // Express framework for handling routes and middleware
const app = express(); // Creating an instance of an Express application
const path = require('path'); // Path module for working with file and directory paths

// Importing the User model
const userModel = require('./models/user'); // Importing the Mongoose model for the 'user' collection

// Setting up the view engine
app.set("view engine", "ejs"); // Setting EJS as the templating engine

// Middleware to parse incoming JSON data
app.use(express.json()); // Parses incoming requests with JSON payloads

// Middleware to parse incoming URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true })); // Parses application/x-www-form-urlencoded

// Middleware to serve static files (like CSS, images, etc.) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Root route to render the home page
app.get('/', (req, res) => {
    res.render("index"); // Renders the 'index.ejs' template
});

// Route to read all users from the database
app.get('/read', async(req, res) => {
    let users = await userModel.find(); // Fetches all users from the 'user' collection
    res.render("read", { users }); // Passes the users to the 'read.ejs' template for rendering
});

// Route to delete a user by ID
app.get('/delete/:id', async(req, res) => {
    let users = await userModel.findOneAndDelete({ _id: req.params.id }); // Deletes the user with the specified ID
    res.redirect("/read"); // Redirects back to the 'read' route after deletion
});

// Route to fetch a single user for editing
app.get('/edit/:userid', async(req, res) => {
    let user = await userModel.findOne({ _id: req.params.userid }); // Finds a user by ID
    res.render("edit", { user }); // Passes the user data to the 'edit.ejs' template for rendering
});

// Route to update a user's information
app.post('/update/:userid', async(req, res) => {
    let { image, name, email } = req.body; // Extracts updated user data from the request body
    let user = await userModel.findOneAndUpdate({ _id: req.params.userid }, // Finds the user by ID
        { image, email, name }, // Updates the user's information
        { new: true } // Ensures the updated document is returned
    );
    res.redirect("/read"); // Redirects back to the 'read' route after updating
});

// Route to create a new user
app.post('/create', async(req, res) => {
    let { name, email, image } = req.body; // Extracts user data from the request body
    let createuser = await userModel.create({
        name, // Creates a new user with the provided name
        email, // Creates a new user with the provided email
        image // Creates a new user with the provided image
    });
    res.redirect("/read"); // Redirects to the 'read' route after creation
});

// Starts the server and listens on port 3000
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000"); // Logs a message when the server starts
});