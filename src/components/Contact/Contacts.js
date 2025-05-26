import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Contacts.css';
import emailLogo from '../../images/logo/email.png';
import whatsappLogo from '../../images/logo/WhatsApp.webp';
import linkedinLogo from '../../images/logo/linkedin.png';

export default function Contacts() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    const formDataObj = new FormData();
    formDataObj.append('entry.1436918931', formData.name);
    formDataObj.append('entry.115868657', formData.email);
    formDataObj.append('entry.1530612299', formData.subject);
    formDataObj.append('entry.499974809', formData.message);

    try {
      await fetch(
        'https://docs.google.com/forms/d/e/1FAIpQLSc1G9vTsiEK1lAljrjXKv1RYqRCotJ0K1YvQ04wURPuRptd4g/formResponse',
        {
          method: 'POST',
          mode: 'no-cors',
          body: formDataObj,
        }
      );
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      id: 'email',
      iconSrc: emailLogo,
      title: 'Email',
      link: 'mailto:ayushkumawat2112@gmail.com',
      description: 'ayushkumawat2112@gmail.com',
    },
    {
      id: 'whatsapp',
      iconSrc: whatsappLogo,
      title: 'WhatsApp',
      link: 'https://wa.me/919098984098?text=Hello%20Ayush!',
      description: 'Connect on WhatsApp',
    },
    {
      id: 'linkedin',
      iconSrc: linkedinLogo,
      title: 'LinkedIn',
      link: 'https://www.linkedin.com/in/ayush-kumawat/',
      description: 'Connect on LinkedIn',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="contact" className="contact_section">
      <div className="background-shapes">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
      </div>
      
      <motion.h1 variants={itemVariants} className="contact-title">
        Get in <span>Touch</span>
      </motion.h1>
      
      <motion.p variants={itemVariants} className="contact-subtitle">
        Let's discuss how we can work together to bring your ideas to life
      </motion.p>

      <div className="contact-content">
        <motion.div variants={itemVariants} className="contact-info">
          <div className="contact-methods">
            {contactMethods.map((method) => (
              <motion.a
                key={method.id}
                href={method.link}
                className="contact-card glass-card"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img src={method.iconSrc} alt={`${method.title} icon`} className="contact-icon" />
                <div className="text-content">
                  <h3>{method.title}</h3>
                  <p>{method.description}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.form 
          variants={itemVariants}
          className="contact-form glass-card"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Subject"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="form-group">
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              required
              disabled={isSubmitting}
            ></textarea>
          </div>
          <motion.button
            type="submit"
            className={`submit-btn ${isSubmitting ? 'submitting' : ''} ${submitStatus ? `submit-${submitStatus}` : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : submitStatus === 'success' ? 'Message Sent!' : submitStatus === 'error' ? 'Try Again' : 'Send Message'}
          </motion.button>
          {submitStatus === 'error' && (
            <p className="error-message">Failed to send message. Please try again.</p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
