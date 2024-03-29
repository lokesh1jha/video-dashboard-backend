require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const auth = require("./v1/routes/authentication")
const route = require("./v1/routes/route")

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Route for authenticaion Login and Registration
app.use("/auth", auth)

// Route for features that required to be authorized
app.use(route)

// MongoDB connection
mongoose.connect(process.env.MONGODB_STRING || 'mongodb://localhost:27017/video-dashboard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
