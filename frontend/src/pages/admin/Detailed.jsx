// Detailed.jsx 
//2
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from "../../components/Loader/Loading"; // Assuming you have a Loading component
import { IoDownload } from "react-icons/io5"; // Download icon from react-icons

const Detailed = () => {
    const { id } = useParams();
    const [appointment, setAppointment] = useState(null);
    const [status, setStatus] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [feedbackError, setFeedbackError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch appointment details by ID
        const fetchAppointment = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/v1/Org_appointments/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                if (data && data.appointment) {
                    setAppointment(data.appointment);
                    setStatus(data.appointment.status || "N/A");
                } else {
                    console.error("Unexpected data format:", data);
                }
            } catch (error) {
                console.error("Error fetching appointment details:", error);
            }
        };

        fetchAppointment();
    }, [id]);

    // Handle status change
    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        if (newStatus === 'Done' && !feedback) {
            setFeedbackError(true);
        } else {
            setFeedbackError(false);
        }
    };

    // Handle feedback attachment
    const handleFeedbackChange = (event) => {
        setFeedback(event.target.files[0]);
        setFeedbackError(false);
    };

    // Save changes
    const handleApply = async () => {
        if (status === 'Done' && !feedback) {
            setFeedbackError(true);
            return;
        }

        const formData = new FormData();
        formData.append('status', status);
        if (feedback) formData.append('feedback', feedback);

        try {
            await fetch(`http://localhost:5000/api/v1/Org_appointments/${id}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                body: formData,
            });
            navigate('/admin');
        } catch (error) {
            console.error("Error updating appointment:", error);
        }
    };

    if (!appointment) return <Loading />; // Show loading component

    return (
        <div className="detailed-container p-4 bg-white rounded-lg shadow-md">
            <h1 className="detailed-title text-xl font-bold mb-4">Appointment Details</h1>
            <div className="details mb-6">
                <p><strong>Company Name:</strong> {appointment.companyName}</p>
                <p><strong>Head's Name:</strong> {appointment.headName}</p>
                <p><strong>Phone:</strong> {appointment.phone}</p>
                <p><strong>Email:</strong> {appointment.email}</p>
                <p><strong>Subject:</strong> {appointment.subject}</p>
                <p><strong>Message:</strong> {appointment.message}</p>
                <div className="resource-links">
                    <div className="flex items-center">
                        <strong>Formal Letter:</strong>
                        {appointment.sealImage && (
                            <a href={appointment.sealImage} download className="ml-2">
                                <IoDownload className="text-blue-500 hover:text-blue-700" />
                            </a>
                        )}
                    </div>
                    <div className="flex items-center mt-2">
                        <strong>Additional File:</strong>
                        {appointment.additionalFile && (
                            <a href={appointment.additionalFile} download className="ml-2">
                                <IoDownload className="text-blue-500 hover:text-blue-700" />
                            </a>
                        )}
                    </div>
                </div>
                <div className="status my-4">
                    <label className="block"><strong>Status:</strong></label>
                    <select value={status} onChange={(e) => handleStatusChange(e.target.value)} className="border rounded p-1">
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Cancelled">Cancelled</option>
                        <option value="Done">Done</option>
                    </select>
                </div>
                {status === 'Done' && (
                    <div className="feedback-upload mb-4">
                        <label><strong>Feedback Form:</strong></label>
                        <input type="file" onChange={handleFeedbackChange} className="border rounded p-1 mt-1" />
                        {feedbackError && <p className="text-red-500 text-sm">Feedback form is required.</p>}
                    </div>
                )}
            </div>
            <div className="actions flex justify-end">
                <button onClick={() => navigate('/admin')} className="bg-gray-300 text-black rounded px-4 py-2 mr-2">Cancel</button>
                <button onClick={handleApply} className="bg-blue-500 text-white rounded px-4 py-2">Apply</button>
            </div>
        </div>
    );
};

export default Detailed;

