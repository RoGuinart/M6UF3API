const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3030;
// Middleware per parsejar el cos de les sol·licituds a JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Connecta't a MongoDB (modifica l'URI amb la teva pròpia cadena de connexió)
mongoose.connect('mongodb+srv://RoGuinart:RGuinartPassword@m06-rguinart.63gkt.mongodb.net', { dbName: 'Forum' }, {collection: 'Threads'})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err)
);

// Definició del model de dades (un exemple simple d'un model de "Usuari")

const messageSchema = new mongoose.Schema({
	reply_id: Number,
	date_posted: String,
	text: {type: String, required: true},
	attachment: String
});

const threadSchema = new mongoose.Schema({
	thread_id: Number,
	main_post: { type: messageSchema },
	replies: [{ type: messageSchema }]
});

const Threads = mongoose.model('Threads', threadSchema, 'Threads');

app.get('/', async(req, res) => {
	try {
	  const catalog = await Threads.find();
	  res.status(200).json(catalog);
	} catch (err) {
	  res.status(500).json({ message: 'Error fetching catalog', error: err.message });
	}
});

/*
app.get

app.post('/users', async (req, res) => {
  /// res.status(200).json(req.body);
  // Check if request body is empty and fill with default values
  if (!req.body.name || !req.body.email) {
    req.body.name = req.body.name || "err";
    req.body.email = req.body.email || "err";
  }

  try {
    const user = new User({ name: req.body.name, email: req.body.email });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Error creating user', error: err.message });
  }
});

// Ruta per obtenir tots els usuaris
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

// Ruta per obtenir un usuari per ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
});

// Ruta per actualitzar un usuari per ID
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, { name, email }, { new: true });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: 'Error updating user', error: err.message });
  }
});

// Ruta per eliminar un usuari per ID
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
});
*/
// Inicia el servidorxºxºz  
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
