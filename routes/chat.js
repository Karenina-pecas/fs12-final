var express = require('express');
var router = express.Router();
require('dotenv').config();
var Pusher = require('pusher');
// var Message = require("../models/message");
const Sequelize = require('sequelize');
const userShouldBeLoggedIn = require('../guards/userShouldBeLoggedIn');
const Op = Sequelize.Op;
var models = require('../models');

//Kelly account
// PUSHER_APP_ID=1232502
// PUSHER_KEY=28f10c936cccdf0afe24
// PUSHER_SECRET=d6654dc36c745785fd6f
//cluster ap1

var channels_client = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: 'ap1',
  useTLS: true
});

router.post('/pusher/auth', userShouldBeLoggedIn, function (req, res) {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const [_, __, id1, id2] = channel.split('-');

  console.log('THE CHANNEL NAME IS ', channel);
  try {
    if (+id1 === req.user.id || +id2 === req.user.id) {
      console.log('WE GOT HERE!!!', socketId, channel);
      const auth = channels_client.authenticate(socketId, channel);
      res.send(auth);
    } else {
      res.status(401).send({ message: 'Please log in AM I HERE?' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.post('/:receiver_id', userShouldBeLoggedIn, (req, res) => {
  const sender_id = req.user.id;
  let { receiver_id } = req.params;
  let text = req.body.data.message;

  try {
    //store in DB
    models.Message.create({ text, sender_id, receiver_id });

    const ids = [sender_id, receiver_id].sort();
    let channel = `private-chat-${ids[0]}-${ids[1]}`;

    //send to Pusher
    channels_client.trigger(channel, 'message', {
      text,
      sender_id,
      receiver_id
    });

    res.send({ msg: 'Sent' });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/:id2', userShouldBeLoggedIn, async (req, res) => {
  const id1 = req.user.id;
  let { id2 } = req.params;

  // console.log("I AM HERE", models);
  let messages = await models.Message.findAll({
    where: {
      sender_id: {
        [Op.in]: [id1, id2]
      },
      receiver_id: {
        [Op.in]: [id1, id2]
      }
    },
    limit: 100,
    order: [['id', 'DESC']]
  });

  res.send(messages.reverse());
});

module.exports = router;
