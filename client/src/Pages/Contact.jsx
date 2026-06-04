import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API request
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
      console.log('Form submitted:', formData);
      // Reset form
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-black" />,
      title: 'Address',
      content: '4th Floor, Coastal Business Centre, MG Road Ernakulam, Kerala 682016',
      link: 'https://maps.google.com/?q=Coastal+Business+Centre+MG+Road+Ernakulam+Kerala+682016'
    },
    {
      icon: <Phone className="w-6 h-6 text-black" />,
      title: 'Phone',
      content: '+91 484 400 1234',
      link: 'tel:+914844001234'
    },
    {
      icon: <Mail className="w-6 h-6 text-black" />,
      title: 'Email',
      content: 'contact@lumiere.com',
      link: 'mailto:contact@lumiere.com'
    },
    {
      icon: <Clock className="w-6 h-6 text-black" />,
      title: 'Business Hours',
      content: 'Mon - Fri: 9AM - 6PM',
      link: null
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[10%] left-[-10%] w-[35%] h-[35%] rounded-full bg-yellow-400/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-500/5 blur-[150px] pointer-events-none" />

      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs uppercase tracking-widest font-bold text-yellow-600 bg-yellow-100/60 px-3 py-1.5 rounded-full inline-block mb-3">
            Contact Us
          </span>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4"
        >
          Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-amber-500 to-amber-600">Touch</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium"
        >
          Have a question about our luxury lighting collection? Our design and support team is here to assist you.
        </motion.p>
      </div>

      {/* Contact Info Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 relative z-10"
      >
        {contactInfo.map((info, index) => {
          const CardComponent = info.link ? 'a' : 'div';
          return (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-md"
            >
              <CardComponent
                href={info.link || undefined}
                target={info.link ? "_blank" : undefined}
                rel={info.link ? "noopener noreferrer" : undefined}
                className={`flex flex-col items-center h-full w-full ${info.link ? 'cursor-pointer group' : ''}`}
              >
                <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-sm">
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-yellow-600 transition-colors">
                  {info.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed max-w-xs mx-auto">
                  {info.content}
                </p>
              </CardComponent>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Contact Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative z-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Form Side */}
          <div className="p-6 sm:p-10 lg:p-12 lg:col-span-7 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.div
                  key="form-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                    Send us a message
                  </h2>
                  <p className="text-slate-500 mb-8 text-sm sm:text-base">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Input */}
                    <div className="flex flex-col">
                      <label className="text-sm font-bold text-slate-700 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-yellow-500 focus:ring-4 focus:ring-yellow-400/20 focus:outline-none transition-all duration-200 text-slate-800 text-sm sm:text-base"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email Input */}
                    <div className="flex flex-col">
                      <label className="text-sm font-bold text-slate-700 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-yellow-500 focus:ring-4 focus:ring-yellow-400/20 focus:outline-none transition-all duration-200 text-slate-800 text-sm sm:text-base"
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Subject Input */}
                    <div className="flex flex-col">
                      <label className="text-sm font-bold text-slate-700 mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-yellow-500 focus:ring-4 focus:ring-yellow-400/20 focus:outline-none transition-all duration-200 text-slate-800 text-sm sm:text-base"
                        placeholder="Inquiry about custom lighting"
                      />
                    </div>

                    {/* Message Textarea */}
                    <div className="flex flex-col">
                      <label className="text-sm font-bold text-slate-700 mb-1.5">
                        Your Message
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows="5"
                        className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:border-yellow-500 focus:ring-4 focus:ring-yellow-400/20 focus:outline-none transition-all duration-200 text-slate-800 resize-none text-sm sm:text-base"
                        placeholder="Tell us details about your lighting requirements..."
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 active:scale-[0.98] text-black font-extrabold py-3.5 sm:py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      <span>{loading ? 'Sending Message...' : 'Send Message'}</span>
                      {!loading && <Send className="w-4 h-4 ml-1" />}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success-container"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="text-center py-12 px-4 flex flex-col items-center justify-center"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
                    Thank You!
                  </h2>
                  <p className="text-slate-600 text-lg mb-8 max-w-md">
                    Your message has been sent successfully. Our lighting experts will get in touch with you shortly.
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl transition duration-200 cursor-pointer shadow-md"
                  >
                    <span>Send Another Message</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Info/Callout Side */}
          <div className="lg:col-span-5 relative bg-gradient-to-br from-yellow-500 via-amber-600 to-stone-900 p-8 sm:p-10 lg:p-12 flex flex-col justify-between overflow-hidden">
            {/* Decorative Background Rings */}
            <div className="absolute top-[-10%] right-[-10%] w-52 h-52 border-8 border-white/10 rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-40 h-40 border-8 border-white/10 rounded-full pointer-events-none" />

            <div className="relative z-10">
              <h3 className="text-3xl font-extrabold text-white mb-6 leading-tight">
                Let's illuminate your space together
              </h3>
              <p className="text-yellow-50/90 text-base mb-8 leading-relaxed">
                Our team of lighting designers is ready to help you create the perfect ambiance for your custom home, restaurant, or business project.
              </p>

              {/* Value Propositions */}
              <div className="space-y-5">
                {[
                  'Free consultation with lighting designers',
                  'Custom dimension & finish tailoring',
                  'Secure worldwide insured shipping',
                  '5-year manufacturer warranty'
                ].map((feature, index) => (
                  <div key={index} className="flex items-start text-white">
                    <CheckCircle2 className="w-5 h-5 mr-3 text-yellow-300 flex-shrink-0 mt-0.5" />
                    <span className="text-base font-medium leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Icons */}
            <div className="mt-12 relative z-10">
              <p className="text-yellow-100/80 text-sm font-bold tracking-wider uppercase mb-4">
                Connect With Us
              </p>
              <div className="flex space-x-3">
                {[
                  { icon: <Facebook className="w-5 h-5 text-white" />, link: '#' },
                  { icon: <Twitter className="w-5 h-5 text-white" />, link: '#' },
                  { icon: <Instagram className="w-5 h-5 text-white" />, link: '#' },
                  { icon: <Linkedin className="w-5 h-5 text-white" />, link: '#' }
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.link}
                    whileHover={{ scale: 1.1, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-white/20"
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>
          
        </div>
      </motion.div>

      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="max-w-6xl mx-auto mt-16 rounded-3xl overflow-hidden shadow-lg border border-slate-100 h-96 relative z-10"
      >
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.07185361099!2d76.28054927503144!3d9.969595990134444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d46d0f6244f%3A0x5bf4b5d27d7e1273!2sMG%20Road%2C%20Ernakulam%2C%20Kochi%2C%20Kerala!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale hover:grayscale-0 transition-all duration-700"
        />
      </motion.div>
    </div>
  );
};

export default ContactPage;
