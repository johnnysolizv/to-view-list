const Entry = require('../models/entry');
const User = require('../models/user');
const validator = require('validator');

const getEntries = async (req, res) => {
  const entries = await Entry.find({ user: req.user });
  res.json(entries);
};

const addNewEntry = async (req, res) => {
const { title, link, description, type, tags} = req.body;

  if (!link || !validator.isURL(link)) {
    return res
      .status(401)
      .send({ error: 'Se requiere una URL válida para el campo link' });
  }

  const user = await User.findById(req.user);

  if (!user) {
    return res.status(404).send({ error: 'Usuario no existe en la base de datos' });
  }

  const entry = new Entry({
    title,
    link,
    description,
    type,
    tags,
    user: user._id,
  });

  const savedEntry = await entry.save();
  res.status(201).json(savedEntry);
};

const deleteEntry = async (req, res) => {
  const { id: entryId } = req.params;

  const user = await User.findById(req.user);
  const entry = await Entry.findById(entryId);

  if (!user) {
    return res.status(404).send({ error: 'Usuario no existe en la base de datos' });
  }

  if (!entry) {
    return res
      .status(404)
      .send({ error: `Tarea con ID: ${entryId} no existe en la base de datos` });
  }

  if (entry.user.toString() !== user._id.toString()) {
    return res.status(401).send({ error: 'Acceso denegado' });
  }

  await Entry.findByIdAndDelete(entryId);
  res.status(204).end();
};

const updateEntry = async (req, res) => {
  const { id: entryId } = req.params;
  const { title, link, description, type, tags} = req.body;

  if (!title || !link || !description || !type || !tags) {
    return res.status(400).send({ error: 'No han sido completados todos los campos.' });
  }

  if (!link || !validator.isURL(link)) {
    return res
      .status(401)
      .send({ error: 'Se requiere una URL válida para el campo link' });
  }

  const user = await User.findById(req.user);
  const entry = await Entry.findById(entryId);

  if (!user) {
    return res.status(404).send({ error: 'Usuario no existe en la base de datos' });
  }

  if (!entry) {
    return res
      .status(404)
      .send({ error: `Tarea con ID: ${entryId} no existe en la base de datos` });
  }

  if (entry.user.toString() !== user._id.toString()) {
    return res.status(401).send({ error: 'Acceso denegado' });
  }

  const updatedEntryObj = {
    title,
    link,
    description,
    type,
    tags,
    user: user._id,
  };

  const updatedEntry = await Entry.findByIdAndUpdate(entryId, updatedEntryObj, {
    new: true,
  });
  res.json(updatedEntry);
};

const starEntry = async (req, res) => {
  const { id: entryId } = req.params;

  const entry = await Entry.findById(entryId);

  if (!entry) {
    return res
      .status(404)
      .send({ error: `Tarea con ID: ${entryId} no existe en la base de datos` });
  }

  entry.isStarred = !entry.isStarred;

  await entry.save();
  res.status(202).end();
};

const markEntryAsViewed = async (req, res) => {
  const { id: entryId } = req.params;

  const entry = await Entry.findById(entryId);

  if (!entry) {
    return res
      .status(404)
      .send({ error: `Tarea con ID: ${entryId} no existe en la base de datos` });
  }

  entry.isViewed = !entry.isViewed;

  await entry.save();
  res.status(202).end();
};

module.exports = {
  getEntries,
  addNewEntry,
  deleteEntry,
  updateEntry,
  starEntry,
  markEntryAsViewed,
};
