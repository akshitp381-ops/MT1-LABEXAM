const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

const patients = [
  {
    id: 1,
    name: 'Amit Kumar',
    age: 35,
    disease: 'Fever',
    doctorName: 'Dr. Sharma'
  },
  {
    id: 2,
    name: 'Priya Singh',
    age: 28,
    disease: 'Migraine',
    doctorName: 'Dr. Verma'
  },
  {
    id: 3,
    name: 'Rahul Mehta',
    age: 42,
    disease: 'Diabetes',
    doctorName: 'Dr. Patel'
  }
];

const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
};

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === 'GET' && url === '/') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, 'utf8', (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error: Unable to load welcome page');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    });
    return;
  }

  if (method === 'GET' && url === '/about') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(
      '<h1>About City Care Hospital</h1>' +
      '<p>City Care Hospital provides 24/7 emergency, outpatient, and specialist care.</p>'
    );
    return;
  }

  if (method === 'GET' && url === '/patients') {
    sendJSON(res, 200, patients);
    return;
  }

  if (method === 'POST' && url === '/add-patient') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { id, name, age, disease, doctorName } = data;

        if (
          id === undefined ||
          !name ||
          age === undefined ||
          !disease ||
          !doctorName
        ) {
          sendJSON(res, 400, {
            message: 'Missing required fields: id, name, age, disease, doctorName'
          });
          return;
        }

        const newPatient = { id, name, age, disease, doctorName };
        patients.push(newPatient);

        sendJSON(res, 201, {
          message: 'Patient added successfully',
          patient: newPatient
        });
      } catch (error) {
        sendJSON(res, 400, { message: 'Invalid JSON request body' });
      }
    });
    return;
  }

  sendJSON(res, 404, { message: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
