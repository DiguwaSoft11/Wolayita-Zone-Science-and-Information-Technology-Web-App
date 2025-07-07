{/*// Contact.jsx old

import React, { useState } from 'react';

const Contact = () => {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://wst-webapp-production.up.railway.app/api/v1/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, subject, message }),
      });

      const result = await response.json();
      setStatus(result.message);
    } catch (error) {
      setStatus('Failed to send email');
    }
  };

  return (
    <section>
      <div className="px-4 mx-auto max-w-screen-md">
        <h2 className="heading text-center">Contact Us</h2>
        <p className="mb-8 lg:mb-16 font-light text-center text_para">
          Got a technical issue? Want to send feedback about a beta feature? Let us know.
        </p>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="email" className="form_label">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="form_input mt-1 bordered-input"
            />
          </div>
          <div>
            <label htmlFor="subject" className="form_label">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Let us know how we can help you"
              className="form_input mt-1 bordered-input"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="form_label">
              Your Message
            </label>
            <textarea
              rows="6"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave a comment..."
              className="form_input mt-1 bordered-input"
            />
          </div>
          <div className="flex justify-end">
            <button type="submit" className="btn rounded sm:w-fit">
              Submit
            </button>
          </div>
          {status && <p>{status}</p>}
        </form>
      </div>
    </section>
  );
};

export default Contact;
*/}

// Contact.jsx

import React, { useState } from 'react';
import { services } from '../assets/data/services';
import Loading from "../components/Loader/Loading";

// Modal component
const Modal = ({ message, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded shadow-md text-center w-80">
      <p>{message}</p>
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        OK
      </button>
    </div>
  </div>

  /* 
  To display the status message in an alert with an "OK" button, 
  you can use the window.alert function or, for a more customized approach, 
  a modal dialog component. Here's how to use the window.alert method within your component.


  isModalOpen: This new state controls the visibility of the modal.
  Modal Component: A simple modal component with the status message and an "OK" button.
  closeModal Function: Closes the modal and clears the status message.
  Conditionally Render: The modal is conditionally rendered based on the 
  isModalOpen state, so it only appears after a form submission and can be closed with the "OK" button. 
  */
);

const Contact = () => {
  const [companyName, setCompanyName] = useState('');
  const [headName, setHeadName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(''); 
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sealImage, setSealImage] = useState(null);
  const [additionalFile, setAdditionalFile] = useState(null);
  const [sealImagePreview, setSealImagePreview] = useState(null);
  const [additionalFilePreview, setAdditionalFilePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    setFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!companyName.trim()) newErrors.companyName = "Company name is required.";
    if (!headName.trim()) newErrors.headName = "Head name is required.";
    if (!phone.match(/^\d{10}$/)) newErrors.phone = "Please enter a valid 10-digit phone number.";
    if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.email = "Please enter a valid email address."; 
    if (!subject) newErrors.subject = "Please select a service.";
    if (!message.trim()) newErrors.message = "Message is required.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true); // Start loading

    const formData = new FormData();
    formData.append('companyName', companyName);
    formData.append('headName', headName);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('subject', subject);
    formData.append('message', message);
    if (sealImage) formData.append('sealImage', sealImage);
    if (additionalFile) formData.append('additionalFile', additionalFile);

    try {
      const response = await fetch('https://wzsit-backend.up.railway.app/api/v1/contact', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      setStatus(result.message);
      setIsModalOpen(true); // Open the modal with the status message
    } catch (error) {
      setStatus('Failed to send appointment request');
      setIsModalOpen(true); // Open the modal with the error message
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setStatus(''); // Clear the status message when closing the modal
  };

  return (
    <section>
      <div className="px-4 mx-auto max-w-screen-md">
        <h2 className="heading text-center">Book an Organizational Appointment with Us</h2>
        <p className="mb-8 lg:mb-16 font-light text-center text_para">
          Submit your request for a formal appointment with our organization.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="companyName" className="form_label">Name of Company</label>
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Your Company Name"
                className="form_input mt-1 bordered-input"
              />
              {errors.companyName && (<p className="text-red-500">{errors.companyName}</p>)}
            </div>
            <div>
              <label htmlFor="headName" className="form_label">Name of Head</label>
              <input
                type="text"
                id="headName"
                value={headName}
                onChange={(e) => setHeadName(e.target.value)}
                placeholder="Head's Name"
                className="form_input mt-1 bordered-input"
              />
              {errors.headName && (<p className="text-red-500">{errors.headName}</p>)}
            </div>
            <div>
              <label htmlFor="phone" className="form_label">Phone</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Your Phone Number"
                className="form_input mt-1 bordered-input"
              />
              {errors.phone && (<p className="text-red-500">{errors.phone}</p>)}
            </div>
            <div>
              <label htmlFor="email" className="form_label">Email</label> {/* New email label */}
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // New email state handler
                placeholder="Your Email Address"
                className="form_input mt-1 bordered-input"
              /> 
              {errors.email && (<p className="text-red-500">{errors.email}</p>)}
            </div>
            <div>
              <label htmlFor="subject" className="form_label">Subject</label>
              <select
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="form_input mt-1 bordered-input"
              >
                <option value="">Select a service</option>
                {services.map((service, index) => (
                  <option key={index} value={service.name}>{service.name}</option>
                ))}
              </select> 
              {errors.subject && (<p className="text-red-500">{errors.subject}</p>)}
            </div>
          </div>
          <div>
            <label htmlFor="message" className="form_label">Your Message</label>
            <textarea
              rows="6"
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave a comment..."
              className="form_input mt-1 bordered-input"
            /> 
            {errors.message && (<p className="text-red-500">{errors.message}</p>)}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="sealImage" className="form_label">Attach Formal Letter with Company Seal (Image)</label>
              <input
                type="file"
                id="sealImage"
                accept="image/*"
                onChange={(e) => handleFileChange(e, setSealImage, setSealImagePreview)}
                className="form_input mt-1"
              />
              {sealImagePreview && <img src={sealImagePreview} alt="Seal Preview" className="w-full mt-2" />}
            </div>
            <div>
              <label htmlFor="additionalFile" className="form_label">Attach Additional Resources (Video/Other)</label>
              <input
                type="file"
                id="additionalFile"
                onChange={(e) => handleFileChange(e, setAdditionalFile, setAdditionalFilePreview)}
                className="form_input mt-1"
              />
              {additionalFilePreview && <video controls src={additionalFilePreview} className="w-full mt-2" />}
            </div>
          </div>
          
          <div className="flex justify-end">
            <button type="submit" className="btn rounded sm:w-fit">Submit</button>
          </div>
        </form>

        {/* Show loading spinner at the bottom of the form */}
        {isLoading && <Loading />}

        {/* Display status message */}
        {isModalOpen && <Modal message={status} onClose={closeModal} />}
      </div>
    </section>
  );
};

export default Contact;

