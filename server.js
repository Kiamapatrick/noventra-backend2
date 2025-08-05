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

app.use(express.static(path.join(__dirname, "public"))); 


app.use('/api/messages', messagesRoute);
app.use('/api/clients', clientsRoute);
app.use('/api/users', usersRoute);
app.use('/api/analytics', analyticsRoutes);

// Serve frontend if needed later (optional)
app.use(express.static(path.join(__dirname, 'public')));

// Root endpoint
app.get('/', (req, res) => {
  res.send('Noventra API is running');
});

// MongoDB connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'your-mongodb-uri';

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
