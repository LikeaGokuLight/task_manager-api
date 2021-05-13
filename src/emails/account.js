const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    const myEmail = 'killakill95@hotmail.it '
    sgMail.send({
        to: `${email}`, // Change to your recipient
        from: `${myEmail}`, // Change to your verified sender
        subject: 'Welcome in our App!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
        html: '<strong>Welcome to the App!.</strong>',
    }).then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
            console.log(sgMail)
        })
}

const sendCancellationEmail = (email, name) => {
    const myEmail = 'killakill95@hotmail.it'
    sgMail.send({
        to: `${email}`,
        from: `${myEmail}`,
        subject: 'Cancellation Account',
        text: `Hello ${name}, First of all, we appreciate you being part of the our community.
            As per your request, your Account has been canceled. All your data is removed permanently can not be restored.
            We’d like to learn the reason behind your cancellation so we can better serve our customers (and hopefully you!) in the future.
            Thanks for been with Us.
        `,
        html: `<strong> Hello ${name}, First of all, we appreciate you being part of the our community.
            As per your request, your Account has been canceled. All your data is removed permanently can not be restored.
            We’d like to learn the reason behind your cancellation so we can better serve our customers (and hopefully you!) in the future.
            Thanks for been with Us. </strong>`
    }).then(() => {
        console.log('Email sent')
    })
        .catch((error) => {
            console.error(error)
            console.log(sgMail)
        })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}


