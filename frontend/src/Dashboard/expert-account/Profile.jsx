import React, { useState, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import uploadImageToCloudinary from './../../utils/uploadCloudinary'; 
import { BASE_URL, token } from './../../config';
import { toast } from 'react-toastify';

const Profile = ({ expertData }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        bio: "",
        gender: "",
        specialization: "",
        ticketPrice: 0,
        qualifications: [],
        experiences: [],
        timeSlots: [],
        about: "",
        photo: null,
    });

    useEffect(() => {
        setFormData({
            name: expertData?.name || "",
            email: expertData?.email || "",
            phone: expertData?.phone || "",
            bio: expertData?.bio || "",
            gender: expertData?.gender || "",
            specialization: expertData?.specialization || "",
            ticketPrice: expertData?.ticketPrice || 0,
            qualifications: expertData?.qualifications || [],
            experiences: expertData?.experiences || [],
            timeSlots: expertData?.timeSlots || [],
            about: expertData?.about || "",
            photo: expertData?.photo || null,
        });
    }, [expertData]);

    const handleInputChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileInputChange = async event => {
        const file = event.target.files[0];
        if (!file) return;
    
        try {
            const formData = new FormData();
            formData.append('file', file);
    
            const res = await fetch(`${BASE_URL}/upload`, {
                method: 'POST',
                body: formData,
            });
    
            const data = await res.json();
    
            if (!res.ok) {
                throw new Error(data.error || 'Error uploading image');
            }
    
            setFormData({ ...formData, photo: data.secure_url });
            toast.success('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Error uploading image');
        }
    };

    const updateProfileHandler = async e => {
        e.preventDefault();
    
        if (!expertData) {
            toast.error('Expert data is not available');
            return;
        }

        if (!expertData._id) {
            toast.error('Expert data_id is not available');
            return;
        }
    
        try {
            const res = await fetch(`${BASE_URL}/experts/${expertData._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const result = await res.json();
            if (!res.ok) {
                throw new Error(result.message);
            }
            toast.success(result.message);
        } catch (err) {
            console.error('Error updating profile:', err);
            toast.error(err.message);
        }
    };
    

    const addItem = (key, item) => {
        setFormData(prevFormData => ({ ...prevFormData, [key]: [...prevFormData[key], item] }));
    };

    const handleReusableInputChangeFunc = (key, index, event) => {
        const { name, value } = event.target;
        setFormData(prevFormData => {
            const updatedItems = [...prevFormData[key]];
            updatedItems[index][name] = value;
            return {
                ...prevFormData,
                [key]: updatedItems,
            };
        });
    };

    const deleteItem = (key, index) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            [key]: prevFormData[key].filter((_, i) => i !== index),
        }));
    };

    const addQualification = e => {
        e.preventDefault();
        addItem("qualifications", {
            startingDate: "",
            endingDate: "",
            degree: "Msc",
            university: "Addis Abeba University",
        });
    };

    const handleQualificationChange = (event, index) => {
        handleReusableInputChangeFunc('qualifications', index, event);
    };

    const deleteQualification = (e, index) => {
        e.preventDefault();
        deleteItem('qualifications', index);
    };

    const addExperience = e => {
        e.preventDefault();
        addItem("experiences", { startingDate: "", endingDate: "", position: "Software Engineer", work_place: "MINT Ethiopia" });
    };

    const handleExperienceChange = (event, index) => {
        handleReusableInputChangeFunc('experiences', index, event);
    };

    const deleteExperience = (e, index) => {
        e.preventDefault();
        deleteItem('experiences', index);
    };

    const addTimeSlot = e => {
        e.preventDefault();
        addItem("timeSlots", { day: "Monday", startingTime: "11:00", endingTime: "6:00" });
    };

    const handleTimeSlotChange = (event, index) => {
        handleReusableInputChangeFunc('timeSlots', index, event);
    };

    const deleteTimeSlot = (e, index) => {
        e.preventDefault();
        deleteItem('timeSlots', index);
    };

    const placeholderStyle = {
        color: 'black',
        border: '2px solid #808080',
        borderRadius: '5px',
        padding: '2px'
    };

    const buttonStyle = {
        backgroundColor: 'black',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        border: 'none',
        marginTop: '10px'
    };

    return (
        <div>
            <h2 className="text-headingColor font-bold text-[24px] leading-9 mb-10">
                Profile Information
            </h2>
            <form>
                <div className="mb-5">
                    <p className="form_label">Name*</p>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Full NAME"
                        className="form_input"
                        style={placeholderStyle}
                    />
                </div>

                <div className="mb-5">
                    <p className="form_label">Email*</p>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        className="form_input"
                        readOnly
                        aria-readonly
                        disabled
                        style={placeholderStyle}
                    />
                </div>

                <div className="mb-5">
                    <p className="form_label">Phone*</p>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Phone Number"
                        className="form_input"
                        
                        style={placeholderStyle}
                    />
                </div>

                <div className="mb-5">
                    <p className="form_label">Bio*</p>
                    <input
                        type="text"
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        placeholder="Bio"
                        className="form_input"
                        maxLength={100}
                        style={placeholderStyle}
                    />
                </div>

                <div className="mb-5">
                    <div className="grid grid-cols-3 gap-5 mb-[30px]">
                        <div>
                            <p className="form_label">Gender*</p>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="form_input py-3.5"
                                style={placeholderStyle}
                            >
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        <div>
                            <p className="form_label">Specialization*</p>
                            <select
                                name="Expert Field"
                                value={formData.specialization}
                                onChange={handleInputChange}
                                className="form_input py-3.5"
                                style={placeholderStyle}
                            >
                                <option value="">Select</option>
                                <option value="Requitment_engineering">Requitment engineering</option>
                                <option value="Requitment_engineering">Requitment engineering</option>
                                <option value="Requitment_engineering">Requitment engineering</option>
                                <option value="Requitment_engineering">Requitment engineering</option>
                                <option value="Requitment_engineering">Requitment engineering</option>
                            </select>
                        </div>

                        <div>
                            <p className="form_label">Ticket Price*</p>
                            <input
                                type="number"
                                placeholder="100"
                                name="ticketPrice"
                                value={formData.ticketPrice}
                                className="form_input"
                                onChange={handleInputChange}
                                style={placeholderStyle}
                            />
                        </div>
                    </div>
                </div>

                <div className="mb-5">
                    <p className="form_label">Qualifications*</p>
                    {formData.qualifications?.map((item, index) => (
                        <div key={index}>
                            <div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <p className="form_label">Starting Date*</p>
                                        <input
                                            type="date"
                                            name="startingDate"
                                            value={item.startingDate}
                                            className="form_input"
                                            onChange={e => handleQualificationChange(e, index)}
                                            style={placeholderStyle}
                                        />
                                    </div>
                                    <div>
                                        <p className="form_label">Ending Date*</p>
                                        <input
                                            type="date"
                                            name="endingDate"
                                            value={item.endingDate}
                                            className="form_input"
                                            onChange={e => handleQualificationChange(e, index)}
                                            style={placeholderStyle}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5 mt-5">
                                    <div>
                                        <p className="form_label">Degree*</p>
                                        <input
                                            type="text"
                                            name="degree"
                                            value={item.degree}
                                            className="form_input"
                                            onChange={e => handleQualificationChange(e, index)}
                                            style={placeholderStyle}
                                        />
                                    </div>
                                    <div>
                                        <p className="form_label">University*</p>
                                        <input
                                            type="text"
                                            name="university"
                                            value={item.university}
                                            className="form_input"
                                            onChange={e => handleQualificationChange(e, index)}
                                            style={placeholderStyle}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div onClick={e => deleteQualification(e, index)} className="text-end cursor-pointer mt-3">
                                <AiOutlineDelete className="inline-block" />
                            </div>
                        </div>
                    ))}
                    <div className="mt-5">
                        <button className="form_btn" onClick={addQualification} style={buttonStyle}>Add Qualification</button>
                    </div>
                </div>

                <div className="mb-5">
                    <p className="form_label">Experience*</p>
                    {formData.experiences?.map((item, index) => (
                        <div key={index}>
                            <div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <p className="form_label">Starting Date*</p>
                                        <input
                                            type="date"
                                            name="startingDate"
                                            value={item.startingDate}
                                            className="form_input"
                                            onChange={e => handleExperienceChange(e, index)}
                                            style={placeholderStyle}
                                        />
                                    </div>
                                    <div>
                                        <p className="form_label">Ending Date*</p>
                                        <input
                                            type="date"
                                            name="endingDate"
                                            value={item.endingDate}
                                            className="form_input"
                                            onChange={e => handleExperienceChange(e, index)}
                                            style={placeholderStyle}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5 mt-5">
                                    <div>
                                        <p className="form_label">Position*</p>
                                        <input
                                            type="text"
                                            name="position"
                                            value={item.position}
                                            className="form_input"
                                            onChange={e => handleExperienceChange(e, index)}
                                            style={placeholderStyle}
                                        />
                                    </div>
                                    <div>
                                        <p className="form_label">work_place*</p>
                                        <input
                                            type="text"
                                            name="work_place"
                                            value={item.work_place}
                                            className="form_input"
                                            onChange={e => handleExperienceChange(e, index)}
                                            style={placeholderStyle}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div onClick={e => deleteExperience(e, index)} className="text-end cursor-pointer mt-3">
                                <AiOutlineDelete className="inline-block" />
                            </div>
                        </div>
                    ))}
                    <div className="mt-5">
                        <button className="form_btn" onClick={addExperience} style={buttonStyle}>Add Experience</button>
                    </div>
                </div>

                <div className="mb-5">
                    <p className="form_label">Time Slots*</p>
                    {formData.timeSlots?.map((item, index) => (
                        <div key={index}>
                            <div className="grid grid-cols-3 gap-5 mb-3">
                                <div>
                                    <p className="form_label">Day*</p>
                                    <select
                                        name="day"
                                        value={item.day}
                                        onChange={e => handleTimeSlotChange(e, index)}
                                        className="form_input py-3.5"
                                        style={placeholderStyle}
                                    >
                                        <option value="">Select</option>
                                        <option value="Monday">Monday</option>
                                        <option value="Tuesday">Tuesday</option>
                                        <option value="Wednesday">Wednesday</option>
                                        <option value="Thursday">Thursday</option>
                                        <option value="Friday">Friday</option>
                                        <option value="Saturday">Saturday</option>
                                        <option value="Sunday">Sunday</option>
                                    </select>
                                </div>
                                <div>
                                    <p className="form_label">Starting Time*</p>
                                    <input
                                        type="time"
                                        name="startingTime"
                                        value={item.startingTime}
                                        className="form_input"
                                        onChange={e => handleTimeSlotChange(e, index)}
                                        style={placeholderStyle}
                                    />
                                </div>
                                <div>
                                    <p className="form_label">Ending Time*</p>
                                    <input
                                        type="time"
                                        name="endingTime"
                                        value={item.endingTime}
                                        className="form_input"
                                        onChange={e => handleTimeSlotChange(e, index)}
                                        style={placeholderStyle}
                                    />
                                </div>
                            </div>
                            <div onClick={e => deleteTimeSlot(e, index)} className="text-end cursor-pointer mt-3">
                                <AiOutlineDelete className="inline-block" />
                            </div>
                        </div>
                    ))}
                    <div className="mt-5">
                        <button className="form_btn" onClick={addTimeSlot} style={buttonStyle}>Add Time Slot</button>
                    </div>
                </div>

                <div className="mb-5">
                    <p className="form_label">About*</p>
                    <textarea
                        rows="5"
                        className="form_textarea"
                        name="about"
                        value={formData.about}
                        onChange={handleInputChange}
                        maxLength={500}
                        style={placeholderStyle}
                    ></textarea>
                </div>

                <div className="mb-5">
                    <p className="form_label">Photo*</p>
                    <input
                        type="file"
                        accept="image/*"
                        className="form_input"
                        onChange={handleFileInputChange}
                        style={placeholderStyle}
                    />
                    {formData.photo && (
                        <figure className="w-[60px] h-[60px] rounded-full border-2 border-solid border-primaryColor flex items-center justify-center">
                        <img src={formData.photo} alt="" className="w-full rounded-full" />
                        </figure>
                    )}
                </div>

                <div>
                    <button
                        className="bg-primaryColor py-3 px-8 text-white font-[500] rounded-[5px] hover:bg-smallTextColor"
                        onClick={updateProfileHandler}
                    >
                        Update Profile
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Profile;
