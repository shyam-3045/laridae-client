"use client";
import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setFormStatus("submitting");

  try {
    const form = e.currentTarget;
    const data = new FormData(form);

    data.append("_captcha", "false");
    data.append("_subject", "New contact from Laridae website");

    await fetch(
      "https://formsubmit.co/ajax/s.m.shyam45@gmail.com",
      {
        method: "POST",
        body: data,
      }
    );

    setFormStatus("success");
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });

    form.reset();

    setTimeout(() => setFormStatus("idle"), 5000);

  } catch {
    setFormStatus("error");
  }
};


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal text-gray-800 mb-4">
              Get In Touch
            </h1>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              We'd love to hear from you. Whether you have a question about our
              premium teas, need assistance with an order, or just want to share
              your feedback, our team is here to help.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* Phone Card */}
          <a
            href="tel:+919025487084"
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:shadow-amber-100 transition-all duration-200 group"
          >
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-100 transition-colors duration-200">
              <Phone className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-800 mb-2">
              Phone Numbers
            </h3>
            <p className="text-sm text-gray-600 hover:text-yellow-600 transition-colors duration-200">
              +91 90254 87084
            </p>
            <p className="text-sm text-gray-600 hover:text-yellow-600 transition-colors duration-200">
              +91 73050 38784
            </p>
          </a>

          {/* Email Card */}
          <a
            href="mailto:sales@atiexports.com"
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:shadow-amber-100 transition-all duration-200 group"
          >
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-100 transition-colors duration-200">
              <Mail className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-800 mb-2">
              Email Address
            </h3>
            <p className="text-sm text-gray-600 hover:text-yellow-600 transition-colors duration-200 break-all">
              sales@atiexports.com
            </p>
          </a>

          {/* Location Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:shadow-amber-100 transition-all duration-200 group">
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-100 transition-colors duration-200">
              <MapPin className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-800 mb-2">
              Visit Our Store
            </h3>
            <p className="text-sm text-gray-600">
              149, Poondurai Main Road,
              <br />
              Mullamparappu, Erode - 638115
            </p>
          </div>

          {/* Hours Card */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:shadow-amber-100 transition-all duration-200 group">
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-100 transition-colors duration-200">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-800 mb-2">
              Business Hours
            </h3>
            <p className="text-sm text-gray-600">
              Mon - Sat: 9:00 AM - 6:00 PM
              <br />
              Sunday: Closed
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-normal text-gray-800 mb-2">
                Send Us a Message
              </h2>
              <p className="text-sm text-gray-500">
                Fill out the form below and we'll get back to you within 24
                hours
              </p>
            </div>

            <form
              onSubmit={handleSubmit} className="space-y-6"
            >
              <input type="hidden" name="_captcha" value="false" />
              <input
                type="hidden"
                name="_subject"
                value="New contact from Laridae website"
              />
              <input
                type="hidden"
                name="_next"
                value="https://your-domain.com/thank-you"
              />
              {/* Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="John Doe"
                />
              </div>

              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="john@example.com"
                />
              </div>

              {/* Phone Input */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="+91 12345 67890"
                />
              </div>

              {/* Subject Input */}
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="How can we help you?"
                />
              </div>

              {/* Message Textarea */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-sm resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              {/* Success Message */}
              {formStatus === "success" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Message Sent Successfully!
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      We'll get back to you within 24 hours.
                    </p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {formStatus === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">
                      Something went wrong
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      Please try again or contact us directly.
                    </p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={formStatus === "submitting"}
                className="w-full bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {formStatus === "submitting" ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center">
                * Required fields
              </p>
            </form>
          </div>

          {/* Map and Additional Info */}
          <div className="space-y-6">
            {/* Google Map */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden h-[400px] lg:h-[500px]">
              <iframe
                src="https://www.google.com/maps?q=Laridae+premium+tea,11.2843009,77.7267279&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Laridae Premium Tea Location"
              />
            </div>

            {/* Social Media Links */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Connect With Us
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://www.instagram.com/laridaeteapremium?igsh=MWp2cThy7WdpeHFhbw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200 group"
                >
                  <Instagram className="w-5 h-5 text-gray-600 group-hover:text-yellow-600 transition-colors duration-200" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    Instagram
                  </span>
                </a>

                <a
                  href="https://wa.me/919025487084"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200 group"
                >
                  <MessageCircle className="w-5 h-5 text-gray-600 group-hover:text-yellow-600 transition-colors duration-200" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    WhatsApp
                  </span>
                </a>

                <a
                  href="https://www.facebook.com/laridaeteapremium"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200 group"
                >
                  <Facebook className="w-5 h-5 text-gray-600 group-hover:text-yellow-600 transition-colors duration-200" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    Facebook
                  </span>
                </a>

                <a
                  href="https://www.youtube.com/@laridaeteapremium"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-all duration-200 group"
                >
                  <Youtube className="w-5 h-5 text-gray-600 group-hover:text-yellow-600 transition-colors duration-200" />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">
                    YouTube
                  </span>
                </a>
              </div>
            </div>

            {/* Quick Contact Info */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">
                Prefer Direct Contact?
              </h3>
              <div className="space-y-3">
                <a
                  href="tel:+919025487084"
                  className="flex items-center space-x-3 text-sm text-gray-700 hover:text-yellow-600 transition-colors duration-200"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call us at +91 90254 87084</span>
                </a>
                <a
                  href="mailto:sales@atiexports.com"
                  className="flex items-center space-x-3 text-sm text-gray-700 hover:text-yellow-600 transition-colors duration-200 break-all"
                >
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span>Email sales@atiexports.com</span>
                </a>
                <div className="flex items-start space-x-3 text-sm text-gray-700">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    149, Poondurai Main Road, Mullamparappu, Erode - 638115
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section (Optional) */}
      <div className="bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-normal text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-gray-500 max-w-2xl mx-auto">
              Quick answers to common questions about our teas and services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-800 mb-2">
                What are your delivery timelines?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We typically process orders within 24-48 hours. Delivery times
                vary by location, usually taking 3-7 business days within India.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-800 mb-2">
                Do you offer bulk orders?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Yes! We offer special pricing for bulk orders. Contact us
                directly for customized quotes and wholesale opportunities.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-800 mb-2">
                What is your return policy?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We accept returns within 7 days of delivery for unopened
                products. Contact us to initiate a return or exchange.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-800 mb-2">
                Can I visit your store?
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Absolutely! Visit us at our Erode location during business
                hours. We recommend calling ahead for personalized assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
