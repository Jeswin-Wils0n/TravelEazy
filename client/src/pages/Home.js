import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPackages } from '../services/packageService';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Home = () => {
  const navigate = useNavigate();
  const [featuredPackages, setFeaturedPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilters, setSearchFilters] = useState({
    fromLocation: '',
    toLocation: '',
    startDate: null,
    endDate: null
  });

  useEffect(() => {
    const fetchFeaturedPackages = async () => {
      try {
        setLoading(true);
        
        const response = await getPackages({ 
          sort: 'startDate',
          limit: 3
        });
        
        setFeaturedPackages(response.data);
      } catch (error) {
        console.error('Error fetching featured packages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedPackages();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, field) => {
    setSearchFilters(prev => ({ ...prev, [field]: date }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    const queryParams = new URLSearchParams();
    
    if (searchFilters.fromLocation) {
      queryParams.append('fromLocation', searchFilters.fromLocation);
    }
    
    if (searchFilters.toLocation) {
      queryParams.append('toLocation', searchFilters.toLocation);
    }
    
    if (searchFilters.startDate) {
      queryParams.append('startDate', format(searchFilters.startDate, 'yyyy-MM-dd'));
    }
    
    if (searchFilters.endDate) {
      queryParams.append('endDate', format(searchFilters.endDate, 'yyyy-MM-dd'));
    }
    
    navigate(`/packages?${queryParams.toString()}`);
  };

  return (
    <div>
      <div className="relative bg-primary-700">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Travel background"
          />
          <div className="absolute inset-0 bg-primary-700 mix-blend-multiply" aria-hidden="true"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">Discover Your Next Adventure</h1>
          <p className="mt-6 text-xl text-white max-w-3xl">
            Book unforgettable travel experiences with TravelEase. Explore new destinations and create memories that last a lifetime.
          </p>
          
          <div className="mt-10 max-w-4xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-xl overflow-hidden border-2 border-gray-200">
              <form onSubmit={handleSearch} className="p-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="fromLocation" className="block text-sm font-medium text-gray-800 mb-1">
                      From
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="fromLocation"
                        id="fromLocation"
                        value={searchFilters.fromLocation}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-2 border-gray-300 rounded-md bg-white p-3"
                        placeholder="Departure City"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="toLocation" className="block text-sm font-medium text-gray-800 mb-1">
                      To
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="toLocation"
                        id="toLocation"
                        value={searchFilters.toLocation}
                        onChange={handleInputChange}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-2 border-gray-300 rounded-md bg-white p-3"
                        placeholder="Destination City"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-800 mb-1">
                      Start Date
                    </label>
                    <div className="mt-1">
                      <DatePicker
                        id="startDate"
                        selected={searchFilters.startDate}
                        onChange={(date) => handleDateChange(date, 'startDate')}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-2 border-gray-300 rounded-md bg-white p-3"
                        placeholderText="Select Start Date"
                        dateFormat="yyyy-MM-dd"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-800 mb-1">
                      End Date
                    </label>
                    <div className="mt-1">
                      <DatePicker
                        id="endDate"
                        selected={searchFilters.endDate}
                        onChange={(date) => handleDateChange(date, 'endDate')}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-2 border-gray-300 rounded-md bg-white p-3"
                        placeholderText="Select End Date"
                        dateFormat="yyyy-MM-dd"
                        minDate={searchFilters.startDate}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Search Packages
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Featured Travel Packages</h2>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Explore our curated selection of top travel experiences.
            </p>
          </div>
          
          <div className="mt-12">
            {loading ? (
              <div className="flex justify-center">
                <svg className="animate-spin h-10 w-10 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : featuredPackages.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredPackages.map((packageItem) => (
                  <div key={packageItem._id} className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="bg-primary-100 h-48 flex items-center justify-center">
                      {packageItem.image ? (
                        <img
                          src={packageItem.image}
                          alt={`${packageItem.fromLocation} to ${packageItem.toLocation}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-primary-800 text-xl font-semibold">
                          {packageItem.fromLocation} to {packageItem.toLocation}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {packageItem.fromLocation} to {packageItem.toLocation}
                      </h3>
                      <div className="mt-2 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{format(new Date(packageItem.startDate), 'MMM dd, yyyy')}</span>
                          <span>-</span>
                          <span>{format(new Date(packageItem.endDate), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                      {packageItem.description && (
                        <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                          {packageItem.description}
                        </p>
                      )}
                      <div className="mt-4 flex justify-between items-center">
                        <div className="text-lg font-bold text-primary-600">
                        ₹{packageItem.basePrice.toFixed(2)}
                        </div>
                        <Link
                          to={`/packages/${packageItem._id}`}
                          className="btn-primary text-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No featured packages available at the moment.</p>
              </div>
            )}
            
            <div className="mt-10 text-center">
              <Link
                to="/packages"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                View All Packages
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 -mr-1 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Benefits</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose TravelEase?
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We provide the best travel experiences with attention to every detail.
            </p>
          </div>
          
          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Best Prices Guaranteed</h3>
                  <p className="mt-2 text-base text-gray-500">
                    We offer the most competitive prices for all our travel packages, ensuring you get the best value for your money.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Safety & Security</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Your safety is our top priority. We ensure that all our travel packages meet the highest safety standards.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Fast & Easy Booking</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Our booking process is quick and hassle-free, allowing you to plan your trip with just a few clicks.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">24/7 Customer Support</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Our dedicated customer support team is available around the clock to assist you with any queries or concerns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-primary-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to start your adventure?</span>
            <span className="block text-primary-300">Book your travel package today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/packages"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50"
              >
                Explore Packages
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-500"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;