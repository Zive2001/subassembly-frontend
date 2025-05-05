import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white';
  };

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white text-xl font-bold"></span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link 
                  to="/" 
                  className={`${isActive('/')} px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/targets" 
                  className={`${isActive('/targets')} px-3 py-2 rounded-md text-sm font-medium`}
                >
                  Target Settings
                </Link>
              </div>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {/* Optional: Add additional navbar items here */}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex">
            <button 
              type="button"
              className="bg-gray-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg 
                className="block h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            to="/" 
            className={`${isActive('/')} block px-3 py-2 rounded-md text-base font-medium`}
          >
            Dashboard
          </Link>
          <Link 
            to="/targets" 
            className={`${isActive('/targets')} block px-3 py-2 rounded-md text-base font-medium`}
          >
            Target Settings
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;