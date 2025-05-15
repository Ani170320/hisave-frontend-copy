import React, { useState } from 'react';

const interestsList = ["Groceries", "Sports", "Movies", "fashion", "OTT", "Dinning"];

const EditProfileModal = ({onClose}) => {
  const [gender, setGender] = useState("Male");
  const [interests, setInterests] = useState(interestsList);

  return (
    <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content p-4">
          <div className="modal-header border-0">
            <h5 className="modal-title w-100 text-center">Edit Profile</h5>
          </div>
          <div className="modal-body">
            <p className="text-muted text-center">Final Step!</p>

            {/* Name */}
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" defaultValue="Rahul Sharma" />
            </div>

            {/* Gender */}
            <div className="mb-3">
              <label className="form-label">Gender</label>
              <div className="d-flex gap-3">
                {["Male", "Female", "Others"].map((g) => (
                  <div className="form-check" key={g}>
                    <input
                      className="form-check-input"
                      type="radio"
                      name="gender"
                      checked={gender === g}
                      onChange={() => setGender(g)}
                      id={`gender-${g}`}
                    />
                    <label className="form-check-label" htmlFor={`gender-${g}`}>
                      {g}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* DOB */}
            <div className="mb-3">
              <label className="form-label">Date Of Birth</label>
              <input type="date" className="form-control" defaultValue="2000-06-15" />
            </div>

            {/* Anniversary */}
            <div className="mb-3">
              <label className="form-label">Date Of Anniversary</label>
              <input type="date" className="form-control" defaultValue="2024-04-02" />
            </div>

            {/* Profession */}
            <div className="mb-3">
              <label className="form-label">My Profession</label>
              <input type="text" className="form-control" placeholder="Enter your Profession" />
            </div>

            {/* Interests */}
            <div className="mb-3">
              <label className="form-label">My Interests</label>
              <div className="d-flex flex-wrap gap-2">
                {interests.map((item) => (
                  <span key={item} className="badge bg-secondary">
                    {item} &times;
                  </span>
                ))}
              </div>
            </div>

            {/* Button */}
            <button className="btn btn-primary w-100 mt-3">Continue</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
