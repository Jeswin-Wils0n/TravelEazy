import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { getPackage, createPackage, updatePackage } from '../../services/packageService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const PackageForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const isEditMode = Boolean(id);
  
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [previewImage, setPreviewImage] = useState('');
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      navigate('/');
      toast.error('Access denied. Admin privileges required.');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchPackageData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getPackage(id);
        setPackageData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching package data');
        toast.error(err.response?.data?.message || 'Error fetching package data');
      } finally {
        setLoading(false);
      }
    };
    
    if (isEditMode && currentUser && currentUser.role === 'admin') {
      fetchPackageData();
    }
  }, [id, isEditMode, currentUser]);

  useEffect(() => {
    const handleLocationChange = (value) => {
      if (!value) {
        setPreviewImage('');
      }
    };
  
    return () => {
    };
  }, []);

  const validationSchema = Yup.object({
    fromLocation: Yup.string().required('From location is required'),
    toLocation: Yup.string().required('To location is required'),
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date()
      .required('End date is required')
      .min(Yup.ref('startDate'), 'End date must be after start date'),
    basePrice: Yup.number()
      .required('Base price is required')
      .min(0, 'Base price must be greater than or equal to 0'),
    includedServices: Yup.object({
      food: Yup.boolean(),
      accommodation: Yup.boolean()
    }),
    foodPrice: Yup.number()
      .min(0, 'Food price must be greater than or equal to 0')
      .when('includedServices.food', ([food], schema) => {
        return food ? schema.required('Food price is required when food is included') : schema;
      }),
    accommodationPrice: Yup.number()
      .min(0, 'Accommodation price must be greater than or equal to 0')
      .when('includedServices.accommodation', ([accommodation], schema) => {
        return accommodation ? schema.required('Accommodation price is required when accommodation is included') : schema;
      }),
    description: Yup.string(),
    images: Yup.string()
  });

  const getInitialValues = () => {
    if (isEditMode && packageData) {
      return {
        fromLocation: packageData.fromLocation || '',
        toLocation: packageData.toLocation || '',
        startDate: packageData.startDate ? new Date(packageData.startDate) : null,
        endDate: packageData.endDate ? new Date(packageData.endDate) : null,
        basePrice: packageData.basePrice || 0,
        includedServices: {
          food: packageData.includedServices?.food || false,
          accommodation: packageData.includedServices?.accommodation || false
        },
        foodPrice: packageData.foodPrice || 0,
        accommodationPrice: packageData.accommodationPrice || 0,
        description: packageData.description || '',
        images: packageData.image || ''
      };
    }
    
    return {
      fromLocation: '',
      toLocation: '',
      startDate: null,
      endDate: null,
      basePrice: 0,
      includedServices: {
        food: false,
        accommodation: false
      },
      foodPrice: 0,
      accommodationPrice: 0,
      description: '',
      images: ''
    };
  };
  
  const getUnsplashImageForDestination = async (destination) => {
    if (!destination) return '';
    
    try {
      const formattedDestination = encodeURIComponent(destination);
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${formattedDestination}&orientation=landscape&per_page=10&client_id=Ky0T3s4sTgJ1QKmcQ4ZWnqCuXCv3m1ijO0dELG5uvFs`);
      const data = await response.json();
      const results = data.results;
      const randomImage = results[Math.floor(Math.random() * results.length)];
      const imageUrl = randomImage.urls.regular;
      
      if (results && results.length > 0) {
        return imageUrl; 
      }
      return ''; 
    } catch (error) {
      console.error('Error fetching Unsplash image:', error);
      return ''; 
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitLoading(true);
      
      const updatedValues = {
        ...values,
        image: previewImage 
      };
      
      if (isEditMode) {
        await updatePackage(id, updatedValues);
        toast.success('Package updated successfully');
      } else {
        await createPackage(updatedValues);
        toast.success('Package created successfully');
      }
      
      navigate('/admin/packages');
    } catch (err) {
      toast.error(err.response?.data?.message || (isEditMode ? 'Error updating package' : 'Error creating package'));
    } finally {
      setSubmitLoading(false);
      setSubmitting(false);
    }
  };
  
  const handleGeneratePreview = async (destination) => {
    setIsGeneratingPreview(true);
    try {
      const imageUrl = await getUnsplashImageForDestination(destination);
      setPreviewImage(imageUrl);
    } catch (error) {
      console.error('Error generating preview:', error);
    } finally {
      setIsGeneratingPreview(false);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {isEditMode ? 'Edit Package' : 'Create New Package'}
      </h1>
      
      {error && (
        <div className="bg-red-50 p-4 rounded-md mb-6">
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
      )}
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <Formik
            initialValues={getInitialValues()}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="fromLocation" className="block text-sm font-medium text-gray-700">
                      From Location
                    </label>
                    <div className="mt-1">
                      <Field
                        type="text"
                        name="fromLocation"
                        id="fromLocation"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                      <ErrorMessage
                        name="fromLocation"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="toLocation" className="block text-sm font-medium text-gray-700">
                      To Location
                    </label>
                    <div className="mt-1">
                      <Field
                        type="text"
                        name="toLocation"
                        id="toLocation"
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        onChange={(e) => {
                          setFieldValue('toLocation', e.target.value);
                          if (!e.target.value) {
                            setPreviewImage('');
                          }
                        }}
                      />
                      <ErrorMessage
                        name="toLocation"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <div className="mt-1">
                      <DatePicker
                        selected={values.startDate}
                        onChange={(date) => setFieldValue('startDate', date)}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        dateFormat="yyyy-MM-dd"
                      />
                      <ErrorMessage
                        name="startDate"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <div className="mt-1">
                      <DatePicker
                        selected={values.endDate}
                        onChange={(date) => setFieldValue('endDate', date)}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        dateFormat="yyyy-MM-dd"
                        minDate={values.startDate}
                      />
                      <ErrorMessage
                        name="endDate"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700">
                      Base Price
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₹</span>
                      </div>
                      <Field
                        type="number"
                        name="basePrice"
                        id="basePrice"
                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">INR</span>
                      </div>
                    </div>
                    <ErrorMessage
                      name="basePrice"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="foodPrice" className="block text-sm font-medium text-gray-700">
                      Food Price
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₹</span>
                      </div>
                      <Field
                        type="number"
                        name="foodPrice"
                        id="foodPrice"
                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        disabled={!values.includedServices.food}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">INR</span>
                      </div>
                    </div>
                    <ErrorMessage
                      name="foodPrice"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="accommodationPrice" className="block text-sm font-medium text-gray-700">
                      Accommodation Price
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₹</span>
                      </div>
                      <Field
                        type="number"
                        name="accommodationPrice"
                        id="accommodationPrice"
                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        disabled={!values.includedServices.accommodation}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">INR</span>
                      </div>
                    </div>
                    <ErrorMessage
                      name="accommodationPrice"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>
                  
                  <div className="sm:col-span-6">
                    <fieldset>
                      <legend className="text-base font-medium text-gray-700">Included Services</legend>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <Field
                              type="checkbox"
                              name="includedServices.food"
                              id="includedServices.food"
                              className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="includedServices.food" className="font-medium text-gray-700">
                              Food
                            </label>
                            <p className="text-gray-500">Include food in the package price.</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <Field
                              type="checkbox"
                              name="includedServices.accommodation"
                              id="includedServices.accommodation"
                              className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="includedServices.accommodation" className="font-medium text-gray-700">
                              Accommodation
                            </label>
                            <p className="text-gray-500">Include accommodation in the package price.</p>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <Field
                        as="textarea"
                        name="description"
                        id="description"
                        rows={3}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="mt-1 text-sm text-red-600"
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      A brief description of the travel package.
                    </p>
                  </div>

                  <div className="sm:col-span-6">
                    <label className="block text-sm font-medium text-gray-700">
                      Destination Preview Image
                    </label>
                    <div className="mt-2">
                      <div className="bg-gray-100 rounded-lg overflow-hidden h-64">
                        {!values.toLocation && (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Enter a destination to see a preview image
                          </div>
                        )}
                        {values.toLocation && !previewImage && (
                          <div className="w-full h-full flex flex-col items-center justify-center">
                            <button
                              type="button"
                              onClick={() => handleGeneratePreview(values.toLocation)}
                              disabled={isGeneratingPreview}
                              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              {isGeneratingPreview ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                  Generating...
                                </>
                              ) : (
                                'Generate Preview'
                              )}
                            </button>
                          </div>
                        )}
                        {previewImage && values.toLocation && (
                          <div className="relative w-full h-full">
                            <img
                              src={previewImage}
                              alt={`${values.toLocation} preview`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleGeneratePreview(values.toLocation)}
                              className="absolute bottom-4 right-4 inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 bg-opacity-75 hover:bg-opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                              Regenerate
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      This image will automatically be used for your package. You can add additional images below.
                    </p>
                  </div>
                  
                  
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate('/admin/packages')}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || submitLoading}
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting || submitLoading ? (
                      isEditMode ? 'Updating...' : 'Creating...'
                    ) : (
                      isEditMode ? 'Update Package' : 'Create Package'
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default PackageForm;