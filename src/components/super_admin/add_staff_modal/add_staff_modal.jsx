"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, Home, Calendar, Lock, Eye, Key, EyeOff, Info, Camera, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Add_Users, Update_Users } from '@/server/super_admin/users';
import { client } from '@/sanity/lib/client';

const AddStaffModal = ({ isOpen, onClose, onStaffAdded, user_info, isUpdate, setUpdateSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialFormData, setInitialFormData] = useState(null);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    is_email_verified: false,
    phone_number: '',
    role: '',
    gender: '',
    password: ''
  });

  // Set initial form data when user_info changes
  useEffect(() => {
    if (isUpdate && user_info) {
      const userData = {
        first_name: user_info.first_name || '',
        last_name: user_info.last_name || '',
        email: user_info.email || '',
        is_email_verified: user_info.is_email_verified || false,
        phone_number: user_info.phone_number || '',
        role: Array.isArray(user_info.role) ? user_info.role[0] : user_info.role || '',
        gender: user_info.gender || '',
        password: '' // Don't pre-fill password
      };
      
      setFormData(userData);
      setInitialFormData(userData);
      
      // Set preview image from user_info if it exists
      const imageUrl = user_info.profile_picture?.asset?.url || 
                      (typeof user_info.profile_picture === 'string' ? user_info.profile_picture : null);
      
      if (imageUrl) {
        setPreviewImage(imageUrl);
      }
    } else if (!isUpdate) {
      // Reset form for new user
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        is_email_verified: false,
        phone_number: '',
        role: '',
        gender: '',
        password: ''
      });
      setPreviewImage(null);
      setInitialFormData(null);
    }
  }, [isUpdate, user_info]);

  // Check for form changes
  useEffect(() => {
    if (!initialFormData) return;
    
    const isChanged = Object.keys(formData).some(key => {
      // Skip password field when checking for changes in update mode
      if (key === 'password') return false;
      return formData[key] !== initialFormData[key];
    });
    
    setHasChanges(isChanged);
  }, [formData, initialFormData]);

  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const generatePassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    let password = '';
    for (let i = 0; i < 13; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters.charAt(randomIndex);
    }
    setFormData(prev => ({
      ...prev,
      password: password.toString()
    }));
  };


  const checkPasswordStrength = () => {
    const password = formData.password;
    const newErrors = {};

    if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
      setShowTooltip(true);
    } else {
      setShowTooltip(false);
    }
    
    if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    }
    
    if (!/[a-z]/.test(password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    }
    
    if (!/[0-9]/.test(password)) {
      newErrors.password = 'Password must contain at least one number';
    }
    
    if (!/[!@#$%^&*()_+~`|}{[\]\\:;?><,./-]/.test(password)) {
      newErrors.password = 'Password must contain at least one special character';
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData(prev => ({
          ...prev,
          profile_picture: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.phone_number) {
      newErrors.phone_number = 'Phone number is required';
    } else if (!/^[0-9+\- ]+$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Invalid phone number';
    }
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    
    // Only validate password for new users or when password is being changed
    if (!isUpdate && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    // Only check password strength for new users or when password is being changed
    if ((!isUpdate || formData.password) && !checkPasswordStrength()) {
      toast.error('Please fix password requirements');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create FormData to handle file upload
      const formDataToSend = new FormData();
      
      // Only include changed fields in the form data
      Object.keys(formData).forEach(key => {
        // Skip password if it's an update and password field is empty
        if (isUpdate && key === 'password' && !formData[key]) return;
        
        // For role, ensure it's an array
        if (key === 'role' && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } 
        // Handle file upload
        else if (key === 'profile_picture' && formData[key]) {
          formDataToSend.append('file', formData[key]);
        } 
        // Only include other fields if they have values
        else if (formData[key] !== undefined && formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      let result;
      if (isUpdate && user_info?._id) {
        result = await Update_Users(user_info._id, formDataToSend);
        if (result.success) {
          toast.success(result.message || 'Staff member updated successfully!');
          onStaffAdded(result.data);
          setUpdateSuccess?.(true);
          onClose();
          return;
        }
      } else {
        result = await Add_Users(formDataToSend);
        if (result.success) {
          toast.success(result.message || 'Staff member added successfully!');
          onStaffAdded(result.data);
          onClose();
          return;
        }
      }
      
      if (!result.success) {
        throw new Error(result.message || `Failed to ${isUpdate ? 'update' : 'add'} staff member`);
      }
      onClose();
      
      // Reset form only if not in update mode
      if (!isUpdate) {
        setFormData({
          first_name: '',
          last_name: '',
          email: '',
          is_email_verified: false,
          phone_number: '',
          role: '',
          gender: '',
          password: ''
        });
        setPreviewImage(null);
      }
    } catch (error) {
      console.error(`Error ${isUpdate ? 'updating' : 'adding'} staff member:`, error);
      toast.error(error.message || `Failed to ${isUpdate ? 'update' : 'add'} staff member`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Add New Staff Member</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300">
                    {previewImage ? (
                      <div className="relative w-full h-full">
                        <img
                          src={previewImage}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <User className="w-16 h-16 text-gray-400" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    name="profile_picture"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      className="pl-10 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  {errors.first_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      className="pl-10 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                  {errors.last_name && (
                    <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john.doe@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className='space-y-2 space-x-2 flex items-center '>
                <input 
                  type="checkbox" 
                  name="is_email_verified"
                  checked={formData.is_email_verified}
                  onChange={handleChange}
                  id="is_email_verified"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_email_verified" className="ml-2 text-sm text-gray-700">
                  Authenticated Email
                </label>
                <div className="relative inline-block ml-1">
                  <Info 
                    size={14} 
                    className="text-gray-400 hover:text-gray-600 cursor-help"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  />
                  {showTooltip && (
                    <div className="absolute z-10 w-64 p-2 mt-1 text-xs text-gray-600 bg-white border border-gray-200 rounded shadow-lg -left-1/2 transform -translate-x-1/2">
                      Check this if the staff member has already verified their email address. This will allow them to log in immediately.
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      className="pl-10 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  {errors.phone_number && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone_number}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="date"
                      name="date_of_birth"
                      value={formData.date_of_birth || ''}
                      onChange={handleChange}
                      className="pl-10 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {errors.date_of_birth && (
                    <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    className="pl-10 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123 Main St, City, Country"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="libarian">Librarian</option>
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                  )}
                </div>
              </div>

              {!isUpdate && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 w-full rounded-md border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter password"
                      required={!isUpdate}
                      minLength="8"
                    />
                    <div className={`flex flex-row`}>
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={generatePassword}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
                        title="Generate password"
                      >
                        <Key className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    hasChanges || !isUpdate
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50`}
                  disabled={isSubmitting || (isUpdate && !hasChanges)}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      {isUpdate ? 'Updating...' : 'Adding...'}
                    </span>
                  ) : isUpdate ? 'Update Staff' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddStaffModal;