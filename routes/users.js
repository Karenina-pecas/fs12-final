var express = require('express');
var router = express.Router();
var models = require('../models');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const { Router } = require('express');
const saltRounds = 10;
var fs = require('fs/promises');
var path = require('path');
const { v4: uuidv4 } = require('uuid');
var mime = require('mime-types');
const { profile } = require('console');
const userShouldBeLoggedIn = require('../guards/userShouldBeLoggedIn');

require('dotenv').config();
const supersecret = process.env.SUPER_SECRET;

/* GET users listing. */
router.get('/', userShouldBeLoggedIn, async (req, res) => {
  try {
    const users = await models.User.findAll({
      attributes: [
        'id',
        'name',
        'email',
        'password',
        'address',
        'phone',
        'trusted_contact',
        'trusted_name',
        'profile_photo',
        'latitude',
        'longitude',
        'location_token'
      ]
      // include: { model: models.Album, attributes: ['name'] }
    });
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

// GET one user
router.get('/id', userShouldBeLoggedIn, async (req, res) => {
  try {
    await res.send(req.user);
  } catch (err) {
    res.status(500).send(err);
  }
});

// REGISTRATION OF USER
router.post('/register', async (req, res) => {
  const {
    name,
    email,
    password,
    address,
    phone,
    trusted_contact,
    trusted_name,
    latitude,
    longitude,
    location_token
  } = req.body;

  try {
    const { profile_photo } = req.files;
    const extension = mime.extension(profile_photo.mimetype);
    const filename = uuidv4() + '.' + extension;
    const tmp_path = profile_photo.tempFilePath;
    const target_path = path.join(__dirname, '../public/img/') + filename;

    const hash = await bcrypt.hash(password, saltRounds);

    const accessTmp = fs.access(tmp_path);
    const accessFinal = fs.access(path.join(__dirname, '../public/img/'));

    console.log({ accessTmp, accessFinal });

    // causing an error in Heroku
    await fs.rename(tmp_path, target_path);

    const user = await models.User.create({
      name,
      email,
      password: hash,
      address,
      phone,
      trusted_contact,
      trusted_name,
      profile_photo: filename,
      latitude,
      longitude,
      location_token
    });
    res.send({ message: 'Registration successfully', user });
  } catch (err) {
    res.status(500).send({ msg: 'Please, fill in all required fields.' });
  }
});

//LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await models.User.findOne({
      where: { email }
    });

    const userId = user.id;

    if (userId) {
      const user_id = userId;

      const correctPassword = await bcrypt.compare(password, user.password);

      if (!correctPassword) throw new Error('Incorrect Password');

      const token = jwt.sign({ user_id }, supersecret);
      res.send({
        message: 'Login succesful, here is your token',
        token,
        user_id
      });
    } else {
      throw new Error('User does not exist');
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

//UPDATE user's profile without the profile_photo
router.put('/profile', userShouldBeLoggedIn, async function (req, res, next) {
  const { name, email, address, phone, trusted_contact, trusted_name, latitude, longitude } = req.body;

  const user = req.user;

  try {
    const data = await user.update({
      name,
      email,
      address,
      phone,
      trusted_contact,
      trusted_name,
      latitude,
      longitude,
      where: { id: user.id }
    });

    console.log('this is data:', data);
    res.send({ message: 'User details was updated correctly', data: data });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//Update photo_profile by user_id
router.put('/profile/photo_profile', userShouldBeLoggedIn, async function (req, res, next) {
  const { profile_photo } = req.files;
  const extension = mime.extension(profile_photo.mimetype);

  const filename = uuidv4() + '.' + extension;

  const tmp_path = profile_photo.tempFilePath;

  const target_path = path.join(__dirname, '../public/img/') + filename;

  console.log('i am updating this on req.file', req.file);
  const user = req.user;

  try {
    await fs.rename(tmp_path, target_path);

    await user.update({
      profile_photo: filename,
      where: { id: user.id }
    });

    res.send({ message: 'Users photo_profile was updated correctly' });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await models.User.destroy({
      where: { id }
    });
    res.send({ msg: 'User deleted' });
  } catch (err) {
    res.status(404).send(err);
  }
});

module.exports = router;
