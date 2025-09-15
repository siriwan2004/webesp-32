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

        // แสดงค่าที่รับเข้ามาใน backend ก่อนบันทึก
        console.log('Received sensor data:', { temperature, humidity });

        const newSensorData = new SensorData({ temperature, humidity });
        await newSensorData.save();

        // ส่งค่าที่บันทึกกลับไปให้ client
        res.status(201).json({
            message: 'Data saved successfully',
            data: { temperature, humidity, timestamp: newSensorData.timestamp }
        });
    } catch (err) {
        console.error('Error saving data:', err);
        res.status(500).json({ message: 'Error saving data', error: err });
    }
});

app.use((req, res, next) => {
    console.log(`Incoming ${req.method} request to ${req.url}`);
    next();
});


// Route: ดึงหลายค่า (ล่าสุด 10 ค่า) ที่ /api/sensor-data
app.get('/api/sensor-data', async (req, res) => {
    try {
        const data = await SensorData.find().sort({ timestamp: -1 }).limit(10);
        res.status(200).json(data);
    } catch (err) {
        console.error('Error retrieving data:', err);
        res.status(500).json({ message: 'Error retrieving data', error: err });
    }
});

app.listen(port, () => {
    console.log(`🚀 Backend listening at http://localhost:${port}`);
});
