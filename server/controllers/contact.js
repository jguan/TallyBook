var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport('SMTP', {
  service: 'Mandrill',
  auth: {
    user: "jeremy.guan@gmail.com",
    pass: "KyAfuljD1H9J626_8kdJXw"
  }
});

/**
 * GET /contact
 * Contact form page.
 */
/*
exports.getContact = function(req, res) {
  res.render('contact', {
    title: 'Contact'
  });
};
*/
/**
 * POST /contact
 * Send a contact form via Nodemailer.
 * @param email
 * @param name
 * @param subject
 * @param message
 */

exports.postContact = function(req, res) {
  console.log(req);
  console.log(res);

  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('message', 'Message cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    //req.flash('errors', errors);
    console.log(errors);
    // TODO: display error array in toastr
    return res.send({success:false, error:'Contact form contains invalid data!'});
  }

  var from = req.body.email;
  var name = req.body.name;
  var body = req.body.message;
  var to = 'jeremy.guan@gmail.com';
  var subject = req.body.subject || 'Contact Form | Tally Book';

  var mailOptions = {
    to: to,
    from: from,
    subject: subject,
    text: body
  };

  smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      return res.send({success:false, error:error.message});
    }
    res.send({success:true, response:response.message});
  });
};
