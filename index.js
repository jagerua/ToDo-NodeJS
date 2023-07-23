const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authUser = require('./router/authUser');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 3000;
const app = express();

// CORS
app.use(cors());
// Body parcer
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// Mongoose connect
mongoose.connect(
    process.env.MONGODB_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
)
.then(() => console.log('Connected to MongoDB!'))
// .catch((e) => {
//     console.log('Error: ', e);
// });
mongoose.connection.on('error', (err) => console.log(`Mongoose error: ${err.massage}!`)); //or like this

// Middleware
app.use('/ToDo', authUser);





app.listen(PORT, () => {
    console.log('Server is running!');
})