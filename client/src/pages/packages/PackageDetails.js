import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPackage } from '../../services/packageService';
import { createBooking } from '../../services/bookingService';
import { format } from 'date-fns';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const PackageDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  
  const [packageItem, setPackageItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({
    food: false,
    accommodation: false
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getPackage(id);
        setPackageItem(response.data);
        
        setTotalPrice(response.data.basePrice);
        
        if (response.data.includedServices) {
          setSelectedOptions({
            food: response.data.includedServices.food,
            accommodation: response.data.includedServices.accommodation
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching package details');
        toast.error(err.response?.data?.message || 'Error fetching package details');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id]);

  useEffect(() => {
    if (packageItem) {
      let price = packageItem.basePrice;
      
      if (selectedOptions.food && packageItem.foodPrice) {
        price += packageItem.foodPrice;
      }
      
      if (selectedOptions.accommodation && packageItem.accommodationPrice) {
        price += packageItem.accommodationPrice;
      }
      
      setTotalPrice(price);
    }
  }, [selectedOptions, packageItem]);
  

  const handleOptionChange = (e) => {
    const { name, checked } = e.target;
    setSelectedOptions(prev => ({ ...prev, [name]: checked }));
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book this package');
      navigate('/login', { state: { from: { pathname: `/packages/${id}` } } });
      return;
    }
    
    try {
      setBookingLoading(true);
      
      const bookingData = {
        package: id,
        selectedOptions,
        totalPrice
      };
      
      await createBooking(bookingData);
      toast.success('Booking successful');
      navigate('/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <svg className="animate-spin h-10 w-10 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </div>
    );
  }

  if (!packageItem) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">Package not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="bg-primary-600 h-48 flex items-center justify-center relative">
          {packageItem.image ? (
            <img
              src={packageItem.image}
              alt={`${packageItem.fromLocation} to ${packageItem.toLocation}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-white text-3xl font-bold">
              {packageItem.fromLocation} to {packageItem.toLocation}
            </div>
          )}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
            <h1 className="text-3xl font-bold text-white">
              {packageItem.fromLocation} to {packageItem.toLocation}
            </h1>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Trip Details
                </h2>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="text-lg font-medium">
                        {packageItem.fromLocation}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">To</p>
                      <p className="text-lg font-medium">
                        {packageItem.toLocation}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Start Date</p>
                      <p className="text-lg font-medium">
                        {format(
                          new Date(packageItem.startDate),
                          "MMM dd, yyyy"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">End Date</p>
                      <p className="text-lg font-medium">
                        {format(new Date(packageItem.endDate), "MMM dd, yyyy")}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="text-lg font-medium">
                        {Math.ceil(
                          (new Date(packageItem.endDate) -
                            new Date(packageItem.startDate)) /
                            (1000 * 60 * 60 * 24)
                        )}{" "}
                        days
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p
                        className={`text-lg font-medium ${
                          packageItem.status === "completed"
                            ? "text-gray-600"
                            : packageItem.status === "active"
                            ? "text-green-600"
                            : "text-blue-600"
                        }`}
                      >
                        {packageItem.status.charAt(0).toUpperCase() +
                          packageItem.status.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {packageItem.description && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Description
                  </h2>
                  <p className="text-gray-600">{packageItem.description}</p>
                </div>
              )}

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Included Services</h2>
                <ul className="list-disc pl-5 text-gray-600">
                  {packageItem.includedServices?.food && (
                    <li>Food and Beverages</li>
                  )}
                  {packageItem.includedServices?.accommodation && (
                    <li>Accommodation</li>
                  )}
                  <li>Transportation</li>
                  <li>Guide Services</li>
                </ul>
              </div>
            </div>

            <div>
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Book This Package
                </h2>

                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Base Price</span>
                  <span className="font-medium">
                  ₹{packageItem.basePrice.toFixed(2)}
                  </span>
                </div>

                <div className="border-t border-gray-200 py-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Customize Your Trip
                  </h3>

                  {(packageItem.includedServices?.food ||
                    packageItem.foodPrice > 0) && (
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <input
                          id="food"
                          name="food"
                          type="checkbox"
                          checked={selectedOptions.food}
                          onChange={handleOptionChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="food" className="ml-2 text-gray-600">
                          Food and Beverages
                        </label>
                      </div>
                      {packageItem.foodPrice > 0 ? (
                        <span className="text-gray-600">
                          +₹{packageItem.foodPrice.toFixed(2)}
                        </span>
                      ) : packageItem.includedServices?.food ? (
                        <span className="text-green-600">Included</span>
                      ) : null}
                    </div>
                  )}

                  {(packageItem.includedServices?.accommodation ||
                    packageItem.accommodationPrice > 0) && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="accommodation"
                          name="accommodation"
                          type="checkbox"
                          checked={selectedOptions.accommodation}
                          onChange={handleOptionChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="accommodation"
                          className="ml-2 text-gray-600"
                        >
                          Accommodation
                        </label>
                      </div>
                      {packageItem.accommodationPrice > 0 ? (
                        <span className="text-gray-600">
                          +₹{packageItem.accommodationPrice.toFixed(2)}
                        </span>
                      ) : packageItem.includedServices?.accommodation ? (
                        <span className="text-green-600">Included</span>
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Price:</span>
                    <span className="text-2xl font-bold text-primary-600">
                    ₹{totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={
                    bookingLoading || packageItem.status === "completed"
                  }
                  className={`w-full py-3 px-4 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                    packageItem.status === "completed"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary-600 hover:bg-primary-700"
                  }`}
                >
                  {bookingLoading
                    ? "Processing..."
                    : packageItem.status === "completed"
                    ? "Trip Completed"
                    : "Book Now"}
                </button>

                {packageItem.status === "completed" && (
                  <p className="mt-2 text-sm text-center text-gray-500">
                    This trip has already been completed.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetails;