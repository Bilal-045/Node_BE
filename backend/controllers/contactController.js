const nodemailer = require('nodemailer');
const Contact = require('../models/ContactModel');  // Adjust the path to your model

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail', // For example, using Gmail. You can use any email provider.
  auth: {
    user: 'youradminemail@gmail.com', // Replace with your admin email
    pass: 'yourpassword' // Replace with your email password (or use an App Password if using Gmail)
  }
});

// Controller to handle contact form submission and send email to admin
exports.submitContactForm = async (req, res) => {
  const { fullName, email, phoneNumber, companyName, websiteUrl, service, message } = req.body;

  // Validate input fields
  if (!fullName || !email || !message) {
    return res.status(400).json({ message: "Full Name, Email, and Message are required" });
  }

  try {
    // Save contact form data in the database
    const newContact = await Contact.create({
      fullName,
      email,
      phoneNumber,
      companyName,
      websiteUrl,
      service,
      message
    });

    // Send an email to the admin after contact form submission
    const mailOptions = {
      from: email, // Sender's email (user who submitted the form)
      to: 'youradminemail@gmail.com', // Admin email to receive the contact form details
      subject: 'New Contact Form Submission',
      html: `
        <h1>Contact Form Submission</h1>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone Number:</strong> ${phoneNumber || 'N/A'}</p>
        <p><strong>Company Name:</strong> ${companyName || 'N/A'}</p>
        <p><strong>Website URL:</strong> ${websiteUrl || 'N/A'}</p>
        <p><strong>Service:</strong> ${service || 'N/A'}</p>
        <p><strong>Message:</strong> ${message}</p>
      `
    };

    // Send the email
   /* transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email to admin' });
      }

      console.log('Email sent: ' + info.response);
    });
    */

    // Return success response
    res.status(201).json({ message: 'Contact form submitted successfully', data: newContact });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ message: 'An internal error occurred while submitting the contact form' });
  }
};

// Controller to retrieve all contact submissions (Admin use case)
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll();
    res.status(200).json({ message: 'Contact submissions retrieved successfully', data: contacts });
  } catch (error) {
    console.error('Error retrieving contacts:', error);
    res.status(500).json({ message: 'Error retrieving contacts', error: error.message });
  }
};

// Controller to retrieve a single contact by ID (Admin use case)
exports.getContactById = async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact form submission not found' });
    }
    res.status(200).json({ message: 'Contact form retrieved successfully', data: contact });
  } catch (error) {
    console.error('Error retrieving contact:', error);
    res.status(500).json({ message: 'Error retrieving contact form submission', error: error.message });
  }
};

// Controller to delete a contact submission by ID (Admin use case)
exports.deleteContact = async (req, res) => {
  const { id } = req.params;

  try {
    const contact = await Contact.findByPk(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact form submission not found' });
    }

    await contact.destroy(); // Delete the contact form entry
    res.status(200).json({ message: 'Contact form submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact form submission:', error);
    res.status(500).json({ message: 'An error occurred while deleting the contact form submission' });
  }
};
