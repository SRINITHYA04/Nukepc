const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const port = 5500;

const app = express();
app.use(cors());
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/srinithya');
const db = mongoose.connection;
db.once('open', () => {
    console.log("Mongodb connection successful");
});

// Define Schema
const userSchema = new mongoose.Schema({
    name: String,
    age: String,
    whatsapp: String,
    location: String,
    occupation: String,
    purpose: String,
    investment: String,
    income:String,
    Delivery:String,
    suggestions:String,
});

// Create Model
const Users = mongoose.model("User", userSchema);

// Route to serve the form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

// Route to handle form submission
app.post('/post', async (req, res) => {
    const { name, age, whatsapp, location, occupation, purpose, investment,income, Delivery,  suggestions, } = req.body;

    try {
        const user = new Users({
            name,
            age,
            whatsapp,
            location,
            occupation,
            purpose,
            investment,
            income,
            Delivery,
            suggestions,
           
        });

        await user.save();
        console.log(user);
        res.send("Form Submission successful");
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).send("Error saving data");
    }
});

app.listen(port, '127.0.0.1', () => {
    console.log("Server started");
});



// Route to serve the retrieval page
app.get('/retrieve-page', (req, res) => {
    res.sendFile(path.join(__dirname, 'retrieve.html'));
});

// Route to retrieve data from MongoDB
app.get('/retrieve', async (req, res) => {
    const { name, limit, skip } = req.query;
    let query = {};

    if (name) {
        query.name = new RegExp(name, 'i');
    }

    try {
        // Skip the first 'skip' documents and limit the number of results to 'limit'
        const users = await Users.find(query)
            .skip(parseInt(skip) || 0)
            .limit(parseInt(limit) || 10);

        res.json(users); // Send the data as JSON
    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).send('Error retrieving data');
    }
});

