require('dotenv').config();
const mongoose = require('mongoose');
const Position = require('./models/Position');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      const positions = await Position.find().populate('creator', 'name');
      console.log('Total positions:', positions.length);
      console.log('Positions:', JSON.stringify(positions, null, 2));
    } catch (error) {
      console.error('Error fetching positions:', error);
    }
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }); 