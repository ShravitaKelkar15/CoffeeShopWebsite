const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Replace with your email
        pass: 'your-email-password', // Replace with your email password or App Password
    },
});

// Endpoint to send order email
app.post('/send-order-email', (req, res) => {
    const { items, total } = req.body;

    // Construct the email content
    const emailContent = `
        <h2>New Coffee Order</h2>
        <p>Here are the details of the order:</p>
        <ul>
            ${items.map(item => `<li>${item.name} - $${item.discountedPrice}</li>`).join('')}
        </ul>
        <p><strong>Total: $${total}</strong></p>
    `;

    // Email options
    const mailOptions = {
        from: 'shravitakelkar@gmail.com', // Replace with your email
        to: 'your-email@gmail.com', // Recipient email
        subject: 'New Coffee Order',
        html: emailContent,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
            return res.status(500).json({ success: false, message: 'Failed to send email' });
        }
        console.log('Email sent:', info.response);
        res.status(200).json({ success: true, message: 'Email sent successfully' });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
