const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

mongoose.connect('');

// Define a schema for messages
const messageSchema = new mongoose.Schema({
    key: String,
    messages: [
        {
            you: Object,
            bot: Object,
        },
    ],
});

// Create a Message model
const Message = mongoose.model('Message', messageSchema);

// Middleware to parse JSON
app.use(bodyParser.json());

// API endpoint to save a message
app.post('/api/messages', async (req, res) => {
    const { you, bot } = req.body;
    try {
        // Assuming "ifjalsdkf" is the key for your messages
        const key = 'ifjalsdkf';

        // Find the document by key
        let document = await Message.findOne({ key });

        // If the document doesn't exist, create a new one
        if (!document) {
            document = { key, messages: [] };
        }

        // Append the new message to the list
        document.messages.push({ you, bot });

        // Update or create the document in MongoDB
        await Message.findOneAndUpdate({ key }, document, {
            upsert: true,
        });

        res.status(201).json(document);
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).send('Internal Server Error');
    }
});

// API endpoint to get all messages
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
