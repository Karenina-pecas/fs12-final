var express = require('express')
var router = express.Router()
var models = require('../models')
const { v4: uuidv4 } = require('uuid')
const userShouldBeLoggedIn = require('../guards/userShouldBeLoggedIn')
const locationTokenShouldExist = require('../guards/locationTokenShouldExist')
const liveLocationShouldBeEnabled = require('../guards/liveLocationShouldBeEnabled')
require('dotenv').config()
const nodemailer = require('nodemailer')

//Get location by location_token
//liveLocationShouldBeEnabled
router.get(
  '/liveLocation/:location_token',
  [locationTokenShouldExist, liveLocationShouldBeEnabled],
  async (req, res) => {
    // const { latitude, longitude } = req.user;

    try {
      res.send(req.liveLocation)
      // res.send({ latitude, longitude });
    } catch (err) {
      res.status(500).send(err)
    }
  }
)

//here, we generate the location_token
//send email
router.post('/liveLocation', userShouldBeLoggedIn, async (req, res) => {
  const { latitude, longitude } = req.body
  const location_token = uuidv4()
  const user = req.user

  try {
    const response = await user.update({
      latitude,
      longitude,
      location_token,
      where: { id: user.id }
    })

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    let info = await transporter.sendMail({
      from: `"Safemme on behalf of ${user.name}" <safemmeapp@gmail.com>`, // sender address
      to: user.trusted_contact, // list of receivers
      subject: `Safemme - Your friend ${user.name} sends her location`, // Subject line
      text: `${process.env.PUBLIC_URL}/guestview/${location_token}`
    });

    console.warn('Message sent: %s', info.messageId)
    console.warn('Preview URL: %s', nodemailer.getTestMessageUrl(info))
    console.warn('this is the response from endpoint', response)
    res.send({ message: 'location_token successfully stored', user })
  } catch (error) {
    res.status(500).send(error.message)
  }
})

//Update location for one user from frontend
router.put('/liveLocation', userShouldBeLoggedIn, async (req, res) => {
  const { latitude, longitude } = req.body
  const user = req.user

  try {
    await user.update({
      latitude,
      longitude,
      where: { id: user.id },
    });

    res.send({ message: "Location successfully updated" });
  } catch (error) {
    res.status(500).send(error.message)
  }
})

module.exports = router
