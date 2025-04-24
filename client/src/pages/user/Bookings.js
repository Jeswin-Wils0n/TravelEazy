import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserBookings } from '../../services/bookingService';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const status = activeTab === 'all' ? null : activeTab;
        
        const response = await getUserBookings(status);
        setBookings(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching bookings');
        toast.error(err.response?.data?.message || 'Error fetching bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderBookingCard = (booking) => {
    const packageItem = booking.package;
    
    return (
      <div key={booking._id} className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {packageItem.fromLocation} to {packageItem.toLocation}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {format(new Date(packageItem.startDate), 'MMM dd, yyyy')} - {format(new Date(packageItem.endDate), 'MMM dd, yyyy')}
              </p>
            </div>
            <div className={`rounded-full px-3 py-1 text-xs font-medium ${
              booking.currentStatus === 'completed' ? 'bg-gray-100 text-gray-800' :
              booking.currentStatus === 'active' ? 'bg-green-100 text-green-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {booking.currentStatus.charAt(0).toUpperCase() + booking.currentStatus.slice(1)}
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Booking Date</p>
              <p className="text-sm font-medium">
                {format(new Date(booking.bookingDate), 'MMM dd, yyyy')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Price</p>
              <p className="text-lg font-bold text-primary-600">
              ₹{booking.totalPrice.toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Selected Options</p>
              <div className="flex mt-1 space-x-2">
                {booking.selectedOptions.food && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Food
                  </span>
                )}
                {booking.selectedOptions.accommodation && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Accommodation
                  </span>
                )}
                {!booking.selectedOptions.food && !booking.selectedOptions.accommodation && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    Basic Package
                  </span>
                )}
              </div>
            </div>
            <Link
              to={`/packages/${packageItem._id}`}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View Package
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Your Bookings</h1>
      
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => handleTabChange('all')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'all'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All Bookings
          </button>
          <button
            onClick={() => handleTabChange('upcoming')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upcoming'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => handleTabChange('active')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'active'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => handleTabChange('completed')}
            className={`pb-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'completed'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Completed
          </button>
        </nav>
      </div>
      
      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <svg className="animate-spin h-10 w-10 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No bookings found.</p>
            <Link
              to="/packages"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Browse Packages
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map(booking => renderBookingCard(booking))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;