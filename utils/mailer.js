// mailer.js

// require our mailgun dependencies
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

// auth with our mailgun API key and domain
const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.EMAIL_DOMAIN
  }
}

// create a mailer
const nodemailerMailgun = nodemailer.createTransport(mg(auth));