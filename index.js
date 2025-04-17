const express = require('express');
const net = require('net');
const app = express();
const port = 3000;

app.get('/print', (req, res) => {
    const jsonEncoded = req.query.json;
  
    if (!jsonEncoded) {
      return res.status(400).send('Missing JSON data');
    }
  
    let jsonData;
    try {
      jsonData = JSON.parse(decodeURIComponent(jsonEncoded));
    } catch (e) {
      return res.status(400).send('Invalid JSON data');
    }
  
    const printData = Buffer.from(JSON.stringify(jsonData, null, 2) + '\n');
  
    const client = new net.Socket();
  
    client.connect(9100, '192.168.1.22', () => {
      console.log('✅ Connected to printer');
      client.write(printData, (err) => {
        if (err) {
          console.error('❌ Error sending print data:', err.message);
          res.status(500).send('Error sending data to printer');
        } else {
          console.log('✅ JSON data sent to printer');
          res.send('✅ Data sent to printer');
        }
        client.destroy();
      });
    });
  
    client.on('error', (err) => {
      console.error('❌ Printer connection error:', err.message);
      res.status(500).send('Could not connect to printer');
    });
  });
  

app.listen(port, () => {
  console.log(`🖨️ Print server running at http://localhost:${port}`);
});
