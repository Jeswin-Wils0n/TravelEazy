import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPackages } from '../../services/packageService';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const PackageList = () => {
  const location = useLocation(); 
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    fromLocation: '',
    toLocation: '',
    startDate: null,
    endDate: null,
    sort: 'basePrice'
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiFilters = { ...filters };
        
        if (apiFilters.startDate) {
          apiFilters.startDate = format(apiFilters.startDate, 'yyyy-MM-dd');
        }
        
        if (apiFilters.endDate) {
          apiFilters.endDate = format(apiFilters.endDate, 'yyyy-MM-dd');
        }
        
        apiFilters.page = pagination.current;
        apiFilters.limit = 6; 
        
        const response = await getPackages(apiFilters);
        
        setPackages(response.data);
        setPagination({
          current: response.pagination.current,
          pages: response.pagination.pages,
          total: response.total
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching packages');
        toast.error(err.response?.data?.message || 'Error fetching packages');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [filters, pagination.current]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    const initialFilters = {
      fromLocation: searchParams.get('fromLocation') || '',
      toLocation: searchParams.get('toLocation') || '',
      startDate: searchParams.get('startDate') ? new Date(searchParams.get('startDate')) : null,
      endDate: searchParams.get('endDate') ? new Date(searchParams.get('endDate')) : null,
      sort: filters.sort 
    };
    
    if (searchParams.toString()) {
      setFilters(initialFilters);
    }
  }, [location.search]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleDateChange = (date, field) => {
    setFilters(prev => ({ ...prev, [field]: date }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handleSortChange = (e) => {
    const { value } = e.target;
    setFilters(prev => ({ ...prev, sort: value }));
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > pagination.pages) return;
    setPagination(prev => ({ ...prev, current: page }));
  };

  const renderPagination = () => {
    const pages = [];
    
    for (let i = 1; i <= pagination.pages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded-md ${
            pagination.current === i
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => handlePageChange(pagination.current - 1)}
          disabled={pagination.current === 1}
          className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(pagination.current + 1)}
          disabled={pagination.current === pagination.pages}
          className="px-3 py-1 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

  const renderPackageCard = (packageItem) => {
    return (
      <div key={packageItem._id} className="card overflow-hidden">
        <div className="bg-primary-100 h-40 flex items-center justify-center">
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
        <div className="p-4">
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
          <div className="mt-2 text-xs text-gray-500">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full ${
              packageItem.status === 'completed' ? 'bg-gray-100 text-gray-800' :
              packageItem.status === 'active' ? 'bg-green-100 text-green-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {packageItem.status.charAt(0).toUpperCase() + packageItem.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Travel Packages</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Search Packages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="fromLocation" className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <input
              type="text"
              id="fromLocation"
              name="fromLocation"
              value={filters.fromLocation}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Departure City"
            />
          </div>
          
          <div>
            <label htmlFor="toLocation" className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <input
              type="text"
              id="toLocation"
              name="toLocation"
              value={filters.toLocation}
              onChange={handleFilterChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Destination City"
            />
          </div>
          
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <DatePicker
              id="startDate"
              selected={filters.startDate}
              onChange={(date) => handleDateChange(date, 'startDate')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholderText="Select Start Date"
              dateFormat="yyyy-MM-dd"
            />
          </div>
          
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <DatePicker
              id="endDate"
              selected={filters.endDate}
              onChange={(date) => handleDateChange(date, 'endDate')}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholderText="Select End Date"
              dateFormat="yyyy-MM-dd"
              minDate={filters.startDate}
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-between items-center">
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
              Sort By
            </label>
            <select
              id="sort"
              name="sort"
              value={filters.sort}
              onChange={handleSortChange}
              className="rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="basePrice">Price: Low to High</option>
              <option value="-basePrice">Price: High to Low</option>
              <option value="startDate">Start Date</option>
              <option value="-startDate">Start Date (Descending)</option>
            </select>
          </div>
          
          <div className="self-end">
            <span className="text-sm text-gray-500">
              {pagination.total} packages found
            </span>
          </div>
        </div>
      </div>
      
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
      ) : packages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No packages found. Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map(packageItem => renderPackageCard(packageItem))}
          </div>
          {pagination.pages > 1 && renderPagination()}
        </>
      )}
    </div>
  );
};

export default PackageList;