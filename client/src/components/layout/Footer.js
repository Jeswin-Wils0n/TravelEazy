import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white shadow-inner">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">TravelEase</h3>
            <p className="mt-2 text-sm text-gray-600">
              Your trusted partner for unforgettable travel experiences.
              Book your next adventure with us!
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/packages" className="text-sm text-gray-600 hover:text-gray-900">
                  Packages
                </Link>
              </li>
              
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Contact Us</h3>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-gray-600">
                <span className="font-medium">Address:</span> MG Road, Kochi, India
              </li>
              <li className="text-sm text-gray-600">
                <span className="font-medium">Phone:</span> +91 1234567890
              </li>
              <li className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> info@travelease.com
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-6 flex justify-between">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} TravelEase. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Designed and Built by{' '}
            <a
              href="https://jeswinwilson.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-900 font-medium transition duration-200"
            >
              Jeswin Wilson
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;