const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();
const app = express();// redeploy test

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const messagesRoute = require('./routes/messages');
const clientsRoute = require('./routes/clients');
const usersRoute = require('./routes/users'); 
const analyticsRoutes = require('./routes/analytics');
const activityRoutes = require("./routes/activity");

app.use(express.static(path.join(__dirname, "public"))); 


app.use('/api/messages', messagesRoute);
app.use('/api/clients', clientsRoute);
app.use('/api/users', usersRoute);
app.use('/api/analytics', analyticsRoutes);
app.use("/api/activity", activityRoutes);


// Root endpoint
app.get('/', (req, res) => {
  res.send('Noventra API is running');
});

// MongoDB connection
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  throw new Error("MONGO_URI not found in environment variables");
}
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
  });
