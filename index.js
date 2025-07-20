const express = require('express');
const { PubSub } = require('@google-cloud/pubsub');

const app = express();
app.use(express.json());

const pubsub = new PubSub();
const topicName = 'sm_vita_assignment_1';

app.post('/', async (req, res) => {
  try {
    const event = req.body;

    const fileName = event.name;
    const fileSize = event.size;
    const contentType = event.contentType || '';
    const fileFormat = contentType.split('/').pop();

    const message = {
      file_name: fileName,
      size: fileSize,
      format: fileFormat
    };

    const dataBuffer = Buffer.from(JSON.stringify(message));
    await pubsub.topic(topicName).publish(dataBuffer);

    console.log('Published:', message);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error');
  }
});

// ✅ Cloud Run needs the app to listen on the correct port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});