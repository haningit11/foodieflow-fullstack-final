import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaCommentAlt, FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

/**
 * Contact Page
 * 
 * A contact form for users to send messages.
 * Uses react-hot-toast for feedback and client-side validation.
 */
const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }
    toast.success('Message sent successfully! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen py-16 bg-foodie-background">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-foodie-text tracking-tight">Contact Us</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have a question about our menu, pricing, or anything else, our team is ready to answer all your questions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-xl border-t-4 border-foodie-primary">
            <h2 className="text-2xl font-bold text-foodie-text mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none rounded-lg block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-foodie-primary focus:border-foodie-primary sm:text-sm transition-all duration-200"
                    placeholder="Your name"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none rounded-lg block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-foodie-primary focus:border-foodie-primary sm:text-sm transition-all duration-200"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FaCommentAlt className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="appearance-none rounded-lg block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-foodie-primary focus:border-foodie-primary sm:text-sm transition-all duration-200"
                    rows="6"
                    placeholder="Your message..."
                    required
                  />
                </div>
              </div>

              <Button text="Send Message" type="submit" variant="primary" className="w-full shadow-md hover:shadow-lg" />
            </form>
          </Card>

          <div className="space-y-8">
            <Card className="shadow-lg h-auto">
              <h2 className="text-2xl font-bold text-foodie-text mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-foodie-primary/10 rounded-full text-foodie-primary shrink-0">
                    <FaMapMarkerAlt className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foodie-text text-lg">Address</h3>
                    <p className="text-gray-600 mt-1">
                      123 Food Street<br />
                      Culinary City, CC 12345<br />
                      Lebanon
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-foodie-primary/10 rounded-full text-foodie-primary shrink-0">
                    <FaPhone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foodie-text text-lg">Phone</h3>
                    <p className="text-gray-600 mt-1 hover:text-foodie-primary transition-colors">
                      <a href="tel:+15551234567">(555) 123-4567</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-foodie-primary/10 rounded-full text-foodie-primary shrink-0">
                    <FaEnvelope className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foodie-text text-lg">Email</h3>
                    <p className="text-gray-600 mt-1 hover:text-foodie-primary transition-colors">
                      <a href="mailto:info@foodieflow.com">info@foodieflow.com</a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-foodie-primary/10 rounded-full text-foodie-primary shrink-0">
                    <FaClock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foodie-text text-lg">Hours</h3>
                    <p className="text-gray-600 mt-1">
                      Monday - Friday: 11:00 AM - 10:00 PM<br />
                      Saturday - Sunday: 10:00 AM - 11:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-0 overflow-hidden shadow-lg h-64 md:h-80">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.903017708491!2d-73.98565668459386!3d40.74881707932744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzU2LjAiTiA3M8KwNTknMTYuMCJX!5e0!3m2!1sen!2sus!4v1633024800000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps Location"
                className="w-full h-full"
              ></iframe>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
