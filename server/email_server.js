var express = require('express');
var app = express();
var mail = require('sendgrid').mail;
var fromEmail = new mail.Email('resumemanager.linkedin@gmail.com');
app.get('/sendMailAccept', function(req, res) {
  var email_address = req.query.email;
  var content = new mail.Content('text/plain', "Congratulations! We would like to schedule an interview with you!")
  var mailClient = new mail.Mail(fromEmail, "Welcome Aboard!", email_address, content);

  var sg_var = require('sendgrid')(process.env.SENDGRID_API_KEY)
  var request = sg_var.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: mailClient.toJSON()
});
  sg_var.API(request, function(error, response) {
    res.send('success')
  });
})
app.get('/sendMailReject', function(req, res) {
  var email_address = req.query.email;
  var content = new mail.Content('text/plain', "Sorry, we received many highly qualified applicants this year, and could not find a position for you.")
  var mailClient = new mail.Mail(fromEmail, "Internship Application Status", email_address, content);

  var sg_var = require('sendgrid')(process.env.SENDGRID_API_KEY)
  var request = sg_var.emptyRequest({
  method: 'POST',
  path: '/v3/mail/send',
  body: mailClient.toJSON()
});
  sg_var.API(request, function(error, response) {
    res.send('success')
  });
})
app.listen(3000);
