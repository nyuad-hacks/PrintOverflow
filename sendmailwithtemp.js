const nodemailer = require('nodemailer');
const EmailTemplate = require('email-templates').EmailTemplate;
const path = require('path');
const Promise = require('bluebird');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'printoverflow@gmail.com',
    pass: 'xxxpasswordxxx',
  },
});

function sendEmail (obj) {
  return transporter.sendMail(obj);
}

function loadTemplate (templateName,context) {

  let template = new EmailTemplate(path.join(__dirname,'templates',templateName));


  return new Promise((resolve,reject) => {
    template.render(context, (err,result) => {
      if (err) reject(err);
      else resolve({
        email: result,
        context,
      });
    });
  });

}


module.exports = function sendsend(templateName,users) {
  loadTemplate(templateName,users).then((result) => {
  console.log(JSON.stringify(result,null,4));

    sendEmail({
      to: result.context.netid,
      from: 'Print Overflow',
      html: result.email.html,
      text: result.email.text,
      subject: result.email.subject,
    }).then(() => {
    console.log("Yay");
  });
});
}
