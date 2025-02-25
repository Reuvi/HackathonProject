// Profile.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../api/api"

function Profile() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Helper function to get a cookie by name
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  useEffect(() => {
    // Read the "values" cookie to extract the user info
    const valuesCookie = getCookie('values');
    if (valuesCookie) {
      try {
        const values = JSON.parse(valuesCookie);

        // IMPORTANT: match the key names in your cookie exactly:
        // e.g. if your cookie has "userName" and "userEmail", use those:
        setUsername(values.userName || '');
        setEmail(values.userEmail || '');
      } catch (err) {
        console.error("Failed to parse values cookie:", err);
      }
    }
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Call the login API endpoint with the email and password
      const response = await api.post('/v1/profile/update', { username, email, values: getCookie("values"), jwt: getCookie("jwt") }, { withCredentials: true });
      console.log(response.data.message);

      // Clear any previous error message
      setErrorMessage('');

      // Set authentication cookies
      document.cookie = `jwt=${JSON.stringify(response.data.jwt)}; path=/; Secure; SameSite=Strict`;
      document.cookie = `values=${JSON.stringify(response.data.values)}; path=/; Secure; SameSite=Strict`;

      // Navigate to the home page after a successful login
      navigate("/home");
    } catch (err) {
      console.error("Error logging in:", err);
      // Set error message from API response or a default message
      setErrorMessage(err.response?.data?.error || "Profile failed to update. Please try again.");
    }
  };

  return (
    <div className="h-full relative overflow-hidden bg-custom">
      <div className="relative flex items-center justify-center h-full px-4">
        <div className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-lg shadow-xl w-full max-w-md">
          <h1 className="text-3xl font-bold text-darkerPurple text-center mb-6">
            Profile
          </h1>
          {errorMessage && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errorMessage}
            </div>
          )}
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-darkerPurple mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 bg-white bg-opacity-70 border border-deeperPurple rounded-lg focus:outline-none focus:border-darkerPurple focus:ring-1 focus:ring-darkerPurple"
                required
              />
            </div>
            <div>
              <label className="block text-darkerPurple mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-white bg-opacity-70 border border-deeperPurple rounded-lg focus:outline-none focus:border-darkerPurple focus:ring-1 focus:ring-darkerPurple"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-darkerPurple bg-opacity-80 text-white py-2 px-4 rounded-lg hover:bg-darkerPurple/90 focus:outline-none focus:ring-2 focus:ring-darkerPurple focus:ring-offset-2 transition-colors duration-300"
            >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;