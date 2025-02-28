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

const Message = mongoose.model('Message', messageSchema);
const Thread = mongoose.model('Threads', threadSchema, 'Threads');

app.get('/list', async(req, res) => {
	try {
		const catalog = await Thread.find();
		res.status(200).json(catalog);
	} catch (err) {
		res.status(500).json({ message: 'Error fetching thread list', error: err.message });
	}
});

app.get('/list/:dataini/:datafi', async(req, res) => {

	const { dataini, datafi } = req.params;

	try {
		const catalog = await Thread.find(
			{ "main_post.date_posted": {$lte: datafi, $gte: dataini} }
		);
		res.status(200).json(catalog);
	} catch (err) {
		res.status(500).json({ message: 'Error fetching thread list', error: err.message });
	}
});

app.post('/add', async (req, res) => {
	/// res.status(200).json(req.body);
	// If there is no text, cancel the operation
	if(!req.body.text)
		return;
	
	if(!req.body.date_posted)
		req.body.date_posted = new Date().toISOString();

	try {
		const OP = new Message({
			text: req.body.text, 
			date_posted: req.body.date_posted,
			attachment: req.body.attachment
		});
		const thr = new Thread({ main_post: OP, replies: [] });
		await thr.save();
		res.status(201).json(thr);
	} catch (err) {
		res.status(400).json({ message: 'Error creating thread', error: err.message });
	}
});

// Ruta per obtenir les dades d'un sol fil
app.get('/thread/:id', async (req, res) => {
	const { id } = req.params;

	try {
		//const thr = await Thread.findOne({'thread_id': id });
		const thr = await Thread.findById(id);
		if (!thr) {
		return res.status(404).json({ message: 'Thread not found' });
		}
		res.status(200).json(thr);
	} catch (err) {
		res.status(500).json({ message: 'Error fetching thread', error: err.message });
	}
});

// Ruta per respondre a un fil
app.put('/thread/:id', async (req, res) => {
	const { id } = req.params;

	try {
		const newReply = new Message({
			text: req.body.text,
			date_posted: req.body.date_posted,
			attachment: req.body.attachment
		});

		const thr = await Thread.findByIdAndUpdate(id, { $push: {replies: newReply} });
	if (!thr) {
		return res.status(404).json({ message: 'Thread not found' });
	}
		res.status(200).json(thr);
	} catch (err) {
		res.status(400).json({ message: 'Error replying to thread', error: err.message });
	}
});

// Ruta per eliminar una resposta d'un fil
app.delete('/thread/:id/:msg', async (req, res) => {
	const { id, msg } = req.params;

	console.log(msg);
	try {
		const thr = await Thread.findByIdAndUpdate(id, { $pull: { replies: {_id: msg} } });
		if (!thr) {
			return res.status(404).json({ message: 'Thread not found' });
		}
		res.status(200).json({ message: 'Message deleted successfully' });
	} catch (err) {
		res.status(500).json({ message: 'Error deleting message', error: err.message });
	}
});

app.delete('/thread/:id', async(req, res) => {
	const id = req.params.id;

	console.log(id);
	try {
		await Thread.deleteOne({_id: req.params.id});

		res.status(200).json({ message: 'Thread deleted successfully' });
	} catch (err) {
		res.status(500).json({ message: 'Error deleting thread', error: err.message });
	}
});

// Inicia el servidorxºxºz  
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
