import React, { useState, useContext, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const { currentUser, updateProfile, updateProfilePicture, loading } = useContext(AuthContext);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);

  useEffect(() => {
    if (currentUser?.profilePicture) {
      setProfilePicturePreview(currentUser.profilePicture);
    }
  }, [currentUser]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters'),
    'address.street': Yup.string(),
    'address.city': Yup.string(),
    'address.state': Yup.string(),
    'address.zipCode': Yup.string(),
    'address.country': Yup.string(),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const updatedProfile = { ...values };
      
      if (profilePicture) {
        updatedProfile.profilePicture = URL.createObjectURL(profilePicture);
      }
      
      await updateProfile(updatedProfile);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Profile update failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setProfilePicturePreview(URL.createObjectURL(file));
        
        const formData = new FormData();
        formData.append('profilePicture', file);
        
        const res = await axios.post('/api/users/profile/picture', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (res.data.success) {
          updateProfilePicture(res.data.data.profilePicture);
          toast.success('Profile picture updated successfully');
        }
      } catch (error) {
        toast.error('Failed to upload profile picture');
        console.error('Upload error:', error);
        
        setProfilePicturePreview(currentUser?.profilePicture || null);
      }
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">Please login to view your profile.</p>
        </div>
      </div>
    );
  }

  const initialValues = {
    name: currentUser.name || '',
    address: {
      street: currentUser.address?.street || '',
      city: currentUser.address?.city || '',
      state: currentUser.address?.state || '',
      zipCode: currentUser.address?.zipCode || '',
      country: currentUser.address?.country || '',
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
      
      <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="flex flex-col items-center">
                <div className="relative">
                  {profilePicturePreview ? (
                    <img
                      src={profilePicturePreview}
                      alt={currentUser.name}
                      className="h-40 w-40 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-40 w-40 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-5xl font-medium text-primary-800">
                        {currentUser.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <label
                    htmlFor="profile-picture"
                    className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <input
                      id="profile-picture"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleProfilePictureChange}
                    />
                  </label>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Click the camera icon to update your profile picture
                </p>
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-base">{currentUser.email}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 md:mt-0 md:col-span-2">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Full Name
                        </label>
                        <Field
                          type="text"
                          name="name"
                          id="name"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                        <ErrorMessage
                          name="name"
                          component="div"
                          className="mt-1 text-sm text-red-600"
                        />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Address</h3>
                        <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-6">
                            <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                              Street Address
                            </label>
                            <Field
                              type="text"
                              name="address.street"
                              id="address.street"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                            <ErrorMessage
                              name="address.street"
                              component="div"
                              className="mt-1 text-sm text-red-600"
                            />
                          </div>
                          
                          <div className="sm:col-span-3">
                            <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                              City
                            </label>
                            <Field
                              type="text"
                              name="address.city"
                              id="address.city"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                            <ErrorMessage
                              name="address.city"
                              component="div"
                              className="mt-1 text-sm text-red-600"
                            />
                          </div>
                          
                          <div className="sm:col-span-3">
                            <label htmlFor="address.state" className="block text-sm font-medium text-gray-700">
                              State / Province
                            </label>
                            <Field
                              type="text"
                              name="address.state"
                              id="address.state"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                            <ErrorMessage
                              name="address.state"
                              component="div"
                              className="mt-1 text-sm text-red-600"
                            />
                          </div>
                          
                          <div className="sm:col-span-3">
                            <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700">
                              ZIP / Postal Code
                            </label>
                            <Field
                              type="text"
                              name="address.zipCode"
                              id="address.zipCode"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                            <ErrorMessage
                              name="address.zipCode"
                              component="div"
                              className="mt-1 text-sm text-red-600"
                            />
                          </div>
                          
                          <div className="sm:col-span-3">
                            <label htmlFor="address.country" className="block text-sm font-medium text-gray-700">
                              Country
                            </label>
                            <Field
                              type="text"
                              name="address.country"
                              id="address.country"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                            <ErrorMessage
                              name="address.country"
                              component="div"
                              className="mt-1 text-sm text-red-600"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmitting || loading}
                          className="btn-primary"
                        >
                          {isSubmitting || loading ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          to="/bookings"
          className="inline-flex items-center px-6 py-3 border border-primary-600 rounded-md shadow-sm text-sm font-medium text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
            />
          </svg>
          View My Bookings
        </Link>
      </div>
    </div>
  );
};

export default Profile;