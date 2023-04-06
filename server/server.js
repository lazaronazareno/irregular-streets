const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config()

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(`mongodb+srv://${process.env.DB_MONGO_USER}:${process.env.DB_MONGO_PASSWORD}@cluster0.u1fb7j5.mongodb.net/irregular`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to database');
}).catch((err) => {
  console.log('Error connecting to database:', err);
});

const irregularidadesSchema = new mongoose.Schema({
  tipo: { type: String, required: true },
  anotacion: { type: String },
  creador: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
  ubicacion: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [], required: true },
  },
});

irregularidadesSchema.index({ ubicacion: '2dsphere' });

const Irregularidad = mongoose.model('Irregularidad', irregularidadesSchema);

app.post('/irregularidades', async (req, res) => {
  console.log('POST')
  console.log(req.body)
  const { tipo, anotacion, creador, latitud, longitud } = req.body;

  const nuevaIrregularidad = new Irregularidad({
    tipo,
    anotacion,
    creador,
    ubicacion: {
      type: 'Point',
      coordinates: [longitud, latitud],
    },
  });

  try {
    nuevaIrregularidad.save();
    res.status(201).json({ message: 'Irregularidad creada con éxito' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error al crear irregularidad', error });
  }
});

app.get('/irregularidades', async (req, res) => {
  console.log('GET')
  try {
    const irregularidades = await Irregularidad.find();
    res.status(200).json(irregularidades);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener irregularidades' });
  }
});

app.listen(3001, () => {
  console.log('Server started on port 3001');
});
