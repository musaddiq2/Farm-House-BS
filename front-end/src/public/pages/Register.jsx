import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [profilePreview, setProfilePreview] = useState(null);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        profilePicture: file,
      });
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phone && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number (10 digits)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('firstName', formData.firstName);
      submitData.append('lastName', formData.lastName);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('phone', formData.phone);
      
      
      // console.log("Registration response:", submitData);

      // Replace with your actual API endpoint
      const response = await axios.post('http://localhost:5000/api/users/register',
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 201) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        navigate('/login');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          profilePicture: null,
        });
        setProfilePreview(null);
      } else {
        setErrors({ submit: response.data.message || 'Registration failed. Please try again.' });
      }
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'An error occurred. Please try again.' });
      // console.error('Registration Error:', error.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                <h2 className="text-center mb-4 fw-bold text-primary">Create Account</h2>
                <p className="text-center text-muted mb-4">
                  Join us today and discover amazing farmhouses
                </p>

                {successMessage && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {successMessage}
                  </div>
                )}

                {errors.submit && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {errors.submit}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  {/* First Name */}
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label fw-bold">
                      First Name <span className='text-danger fw-bold'>*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control  ${errors.firstName ? 'is-invalid' : ''
                        }`}
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <div className="invalid-feedback d-block">{errors.firstName}</div>
                    )}
                  </div>

                  {/* Last Name */}
                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label fw-bold">
                      Last Name <span className='text-danger fw-bold'>*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control  ${errors.lastName ? 'is-invalid' : ''
                        }`}
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <div className="invalid-feedback d-block">{errors.lastName}</div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-bold">
                      Email Address <span className='text-danger fw-bold'>*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''
                        }`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <div className="invalid-feedback d-block">{errors.email}</div>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label fw-bold">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className={`form-control  ${errors.phone ? 'is-invalid' : ''
                        }`}
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number (10 digits)"
                    />
                    {errors.phone && (
                      <div className="invalid-feedback d-block">{errors.phone}</div>
                    )}
                  </div>

                  

                  {/* Password */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-bold">
                      Password <span className='text-danger fw-bold'>*</span>
                    </label>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''
                        }`}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter a strong password (min 6 characters)"
                    />
                    {errors.password && (
                      <div className="invalid-feedback d-block">{errors.password}</div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label fw-bold">
                      Confirm Password <span className='text-danger fw-bold'>*</span>
                    </label>
                    <input
                      type="password"
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && (
                      <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 fw-bold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Registering...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </form>

                {/* Login Link */}
                <div className="text-center mt-4">
                  <p className="text-muted">
                    Already have an account?{' '}
                    <a href="/login" className="text-primary fw-bold text-decoration-none">
                      Login here
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;