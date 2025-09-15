const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

// MongoDB Atlas Connection String
const mongoDbUri = 'mongodb+srv://webtempdb:Puttharasu24@webtemp.zsolxoc.mongodb.net/?retryWrites=true&w=majority&appName=webtemp';

app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(mongoDbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ Connected to MongoDB Atlas');
}).catch(err => {
    console.error('❌ Could not connect to MongoDB Atlas', err);
});

// Schema
const sensorDataSchema = new mongoose.Schema({
    temperature: Number,
    humidity: Number,
    timestamp: { type: Date, default: Date.now }
});
const SensorData = mongoose.model('SensorData', sensorDataSchema);

// รับข้อมูลจาก ESP32
app.post('/api/sensor-data', async (req, res) => {
    try {
        const { temperature, humidity } = req.body;
        const newSensorData = new SensorData({ temperature, humidity });
        await newSensorData.save();
        res.status(201).send('Data saved successfully');
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).send('Error saving data');
    }
});

// ✅ Route: หลายค่า (ล่าสุด 10 ค่า) ที่ /api/sensor-data
app.get('/api/sensor-data', async (req, res) => {
    try {
        const data = await SensorData.find().sort({ timestamp: -1 }).limit(10);
        res.status(200).json(data);
    } catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).send('Error retrieving data');
    }
});

app.listen(port, () => {
    console.log(`🚀 Backend listening at http://localhost:${port}`);
});
