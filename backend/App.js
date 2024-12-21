const express = require('express');
const path = require('path');
const cookieParser = require("cookie-parser");
const uploadRoutes = require('./routes/upload');
const blogRoutes = require('./routes/blogRoute'); // Make sure to import your blog routes
const user =require('./routes/userRoutes');
const jobs =require('./routes/jobRoute');
const roles= require('./routes/roleRoutes')
const media= require('./routes/mediaRoutes')
const DonateType= require('./routes/donateRoute')
const Payments= require('./routes/paymentRoute')
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config({ path: './config/config.env' });
// Load environment variables

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

app.use(cors({
    origin: 'http://localhost:3000', // Allow only this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods if needed
    credentials: true, // Enable cookies if needed
}));



// Use the upload and blog routes
app.use("/api/v1", uploadRoutes);
app.use("/api/v1", blogRoutes); // Ensure blog routes are mounted
app.use("/api/v1",user)
app.use("/api/v1",jobs)
app.use("/api/v1",roles)
app.use("/api/v1",media)
app.use("/api/v1",DonateType)
app.use("/api/v1",Payments)
// Serve the upload HTML file (if needed)
app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'upload.html')); // Adjust the path as necessary
});

/*// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});*/
module.exports = app;

