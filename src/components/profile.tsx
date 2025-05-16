import React, { useState } from 'react';
import axios from 'axios'; // Make sure axios is installed
import { useAuth } from '../context/AuthContext';
import HomeService from '../services/HomeService';
import { Oval } from 'react-loader-spinner';
import '../css/profile.css'

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa'; // Optional: calendar icon


const interestsList = ["Groceries", "Sports", "Movies", "fashion", "OTT", "Dinning"];

const EditProfileModal = ({ onClose }) => {
    const { user, uid, setUser } = useAuth()
    const [isLoading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        user_name: '',
        gender: 'Male',
        dob: '',
        anniversary: '',
        profession: '',
        interests: interestsList
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const isFormValid = () => {
        return (
          formData.user_name.trim() !== '' &&
          formData.gender.trim() !== '' &&
          formData.dob.trim() !== '' &&
          formData.profession.trim() !== ''
        );
    };

      
    const handleSubmit = async () => {
        try {
            setLoading(true)
            // Parse user if it’s stored as string in localStorage
            const existingUser = typeof user === 'string' ? JSON.parse(user) : user;

            // Merge updated fields into the user payload
            const updated_payload = {
                ...existingUser,
                ...formData,
                modified_by: "API",
                modified_date: new Date().toUTCString(), // updated timestamp
            };
            const response = await HomeService.updateUser(updated_payload);
            console.log('Profile submitted:', response.data);
            const user_result = await HomeService.getUser({uid})
            localStorage.removeItem('user')
            localStorage.setItem('user', JSON.stringify(user_result))
            console.log('local', localStorage.getItem('user'));
            setUser(user_result)
            setLoading(false)
            onClose()
        } catch (error) {
            setLoading(false)
            onClose()
        console.error('Error submitting profile:', error);
        }
    };

    return (
        <div className="">
            {isLoading ? (
                <div className="loading-overlay">
                    <Oval visible={true} height="80" width="80" color="#3b82f6" ariaLabel="oval-loading" wrapperStyle={{}} wrapperClass="" />
                </div>
                ) : (
            <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="profile-modal-overlay profile-modal-overlay-centered" role="document">
                    <div className="profile-modal p-4">
                        <div className="modal-header border-0">
                            <h5 className="modal-title w-100 text-center">My Profile</h5>
                            <button type="button" onClick={onClose} className="fw-semibold border-0 bg-transparent fs-4" aria-label="Close" >
                                ×
                            </button>
                        </div>
                        <div className="modal-body">
                            {/* Name */}
                            <div className="form-group">
                            <label>Name</label>
                            <input type="text" name="user_name" value={formData.user_name} onChange={handleChange} />
                        </div>


                        <div className="form-group d-none">
                            <label>Date Of Birth</label>
                            <div className="custom-date-picker">
                                <span className="calendar-icon">
                                <FaCalendarAlt />
                                </span>
                                <DatePicker
                                selected={formData.dob ? new Date(formData.dob) : null}
                                onChange={(date) =>
                                    setFormData((prev) => ({
                                    ...prev,
                                    dob: date.toISOString().split("T")[0],
                                    }))
                                }
                                dateFormat="yyyy-MM-dd"
                                placeholderText="YYYY-MM-DD"
                                className="date-picker-input"
                                />
                            </div>
                        </div>


                        <div className="form-group">
                            <label>Gender</label>
                            <div className="radio-group">
                            {["Male", "Female", "Others"].map((g) => (
                                <label key={g} className="radio-option">
                                <input type="radio" name="gender" value={g} onChange={handleChange}/>
                                <span>{g}</span>
                                </label>
                            ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Date Of Birth</label>
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>My Profession</label>
                            <input type="text" name="profession" value={formData.profession} onChange={handleChange} />
                        </div>

                        <button className={`submit-btn ${isFormValid() ? 'active' : ''}`} disabled={!isFormValid()} onClick={handleSubmit}>
                            Continue
                        </button>
                        </div>
                    </div>
                </div>
            </div>)}
        </div>
    );
};

export default EditProfileModal;
