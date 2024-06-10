const emailConfig = require('../config/email');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const { reset } = require('nodemon');
const util = require('util'); //Para el callback cuando se envia el correo.

let transport = nodemailer.createTransport({
    host: emailConfig.host,
    port: emailConfig.port,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
});



//Utilizar template de handlebars
transport.use(
    'compile',
    hbs({
      viewEngine: {
        extName: 'handlebars',
        partialsDir: __dirname + '/../views/emails',
        layoutsDir: __dirname + '/../views/emails',
        defaultLayout: 'reset.handlebars'
      },
      viewPath: __dirname + '/../views/emails',
      extName: '.handlebars'
    })
  );

exports.enviar = async(opciones) => {
    const opcionesEmail = {
        from: 'DebJobs <support@pjs360.com>',
        to: opciones.usuario.email,
        subject: opciones.subject,
        template: opciones.archivo,
        context: {
            resetUrl: opciones.resetUrl
        }
    }
    const sendMail = util.promisify(transport.sendMail, transport); //Para promesas.
    return sendMail.call(transport, opcionesEmail);
}