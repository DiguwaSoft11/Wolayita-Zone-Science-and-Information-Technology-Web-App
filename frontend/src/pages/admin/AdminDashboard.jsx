import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formateDate } from "../../utils/formateDate";

const AdminDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const userRole = localStorage.getItem('role');
        if (userRole !== 'admin') {
            navigate('/login');
        } else {
            fetchAppointments();
        }
    }, [navigate]);

    const fetchAppointments = async () => {
        try {
            const response = await fetch('https://wzsit-backend.up.railway.app/api/v1/Org_appointments', { 
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await response.json();
            setAppointments(data.appointments);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
    };

    return (
        <div className="dashboard-container">
            <h2 className="heading text-center">Organizational Appointments</h2> 
            <table className="w-full text-left text-sm text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Name of Organization</th>
                        <th scope="col" className="px-6 py-3">Email</th>
                        <th scope="col" className="px-6 py-3">Subject</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Date</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments?.map(appointment => (
                        <tr
                            key={appointment._id}
                            onClick={() => navigate(`/appointment/${appointment._id}`)}
                            className="cursor-pointer hover:bg-gray-100"
                        >
                            <td className="px-6 py-4">{appointment.companyName}</td>
                            <td className="px-6 py-4">{appointment.email}</td>
                            <td className="px-6 py-4">{appointment.subject}</td>
                            <td className="px-6 py-4">
                                {appointment.status === "Done" && (
                                    <div className="flex items-center">
                                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                                        Done
                                    </div>
                                )}
                                {appointment.status === "Cancelled" && (
                                    <div className="flex items-center">
                                        <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                                        Cancelled
                                    </div>
                                )}
                                {appointment.status === "Pending" && (
                                    <div className="flex items-center">
                                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-500 mr-2"></div>
                                        Pending
                                    </div>
                                )}
                                {appointment.status === "Approved" && (
                                    <div className="flex items-center">
                                        <div className="h-2.5 w-2.5 rounded-full bg-blue-500 mr-2"></div>
                                        Approved
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4">{formateDate(appointment.createdAt)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
