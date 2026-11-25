const express = require('express');

const app = express();
const PORT = 4000;

app.use(express.json());

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

// Retrieve all patients
app.get('/patients', (req, res) => {
  res.status(200).json(patients);
});

// Retrieve a patient by ID
app.get('/patients/:id', (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: 'Invalid patient ID' });
  }

  const patient = patients.find((p) => p.id === id);
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }

  res.status(200).json(patient);
});

// Add a new patient
app.post('/patients', (req, res) => {
  const { id, name, age, disease, doctorName } = req.body || {};

  if (
    id === undefined ||
    !name ||
    age === undefined ||
    !disease ||
    !doctorName
  ) {
    return res.status(400).json({
      message: 'Missing required fields: id, name, age, disease, doctorName'
    });
  }

  const existing = patients.find((p) => p.id === Number(id));
  if (existing) {
    return res.status(400).json({ message: 'Patient with this ID already exists' });
  }

  const newPatient = {
    id: Number(id),
    name,
    age: Number(age),
    disease,
    doctorName
  };

  patients.push(newPatient);

  res.status(201).json({
    message: 'Patient added successfully',
    patient: newPatient
  });
});

// Update patient details
app.put('/patients/:id', (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: 'Invalid patient ID' });
  }

  const patient = patients.find((p) => p.id === id);
  if (!patient) {
    return res.status(404).json({ message: 'Patient not found' });
  }

  const { name, age, disease, doctorName } = req.body || {};
  if (!name && age === undefined && !disease && !doctorName) {
    return res.status(400).json({ message: 'No valid fields provided for update' });
  }

  if (name) patient.name = name;
  if (age !== undefined) patient.age = Number(age);
  if (disease) patient.disease = disease;
  if (doctorName) patient.doctorName = doctorName;

  res.status(200).json({
    message: 'Patient updated successfully',
    patient
  });
});

// Delete a patient
app.delete('/patients/:id', (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ message: 'Invalid patient ID' });
  }

  const index = patients.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Patient not found' });
  }

  const [deletedPatient] = patients.splice(index, 1);

  res.status(200).json({
    message: 'Patient deleted successfully',
    patient: deletedPatient
  });
});

// Handle invalid JSON syntax errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON payload' });
  }
  next(err);
});

// Handle invalid routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
