if (!process.env.PORT) {
  require('dotenv').config()
  process.env.NODE_ENV = "dev"
}

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
//Responsible for parsing the incoming request
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
//Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it
const methodOverride = require('method-override')


const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');


const auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.EMAIL_DOMAIN
  }
}
const nodemailerMailgun = nodemailer.createTransport(mg(auth));
const app = express();


// export our send mail function
module.exports.sendMail = (user, req, res) => {
  // send an email to the user's email with a provided template
  nodemailerMailgun.sendMail({
      from: 'no-reply@example.com',
      to: user.email, // An array if you have multiple recipients.
      subject: 'Pet Purchased!',
      template: {
          name: 'email.handlebars',
          engine: 'handlebars',
          context: user
      }
  // One mail is sent, redirect to the purchased pet's page
  }).then(info => {
      console.log('Response: ' + info);
      res.redirect(`/pets/${req.params.id}`);
  // Catch error and redirect to the purchased pet's page
  }).catch(err => {
      console.log('Error: ' + err);
      res.redirect(`/pets/${req.params.id}`);
  });
}



const user = {
  email: 'shaan.hurley25@gmail.com',
  name: 'Shaan',
  age: '27'
};


nodemailerMailgun.sendMail({
  from: 'no-reply@example.com',
  to: user.email, // An array if you have multiple recipients.
  subject: 'Hey you, awesome!',
  template: {
    name: 'email.handlebars',
    engine: 'handlebars',
    context: user
  }
}).then(info => {
  console.log('Response: ' + info);
}).catch(err => {
  console.log('Error: ' + err);
});





const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/petes-pets');


//Stripe API key
app.locals.PUBLIC_STRIPE_API_KEY = process.env.PUBLIC_STRIPE_API_KEY

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method'))

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes/index.js')(app);
require('./routes/pets.js')(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
