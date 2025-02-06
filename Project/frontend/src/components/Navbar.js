import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const isGuest = document.cookie.includes("guest=true");

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  const updateUsernameFromCookie = () => {
    const valuesCookie = getCookie('values');
    if (valuesCookie) {
      try {
        const values = JSON.parse(valuesCookie);
        setUsername(values.userName || '');
      } catch (err) {
        console.error("Failed to parse values cookie:", err);
      }
    } else {
      setUsername('');
    }
  };

  useEffect(() => {
    updateUsernameFromCookie();

    const observer = new MutationObserver(() => {
      updateUsernameFromCookie();
    });

    observer.observe(document, { subtree: true, childList: true });
    return () => observer.disconnect();
  }, []);

  const handleSignOut = () => {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "values=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "guest=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-darkerPurple backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center h-full">
            <Link to="/home" className="flex items-center h-full">
              <img
                src="/images/logo_dark_background.png"
                alt="Logo"
                className="h-full w-[200px] object-contain"
              />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/home" className="text-white hover:text-paleYellow transition">
              Home
            </Link>
            {!isGuest && (
              <Link to="/cookbook" className="text-white hover:text-paleYellow transition">
                Cookbook
              </Link>
            )}
            <Link to="/recipe/generate" className="text-white hover:text-paleYellow transition">
              Generate Recipe
            </Link>
            <Link to="/ingredient/generate" className="text-white hover:text-paleYellow transition">
              Generate Ingredients
            </Link>
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-white focus:outline-none"
              >
                <span>{username || "Guest"}</span>
                <svg className="ml-1 h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                  {!isGuest && (
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        navigate("/profile");
                      }}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                    >
                      Profile
                    </button>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;