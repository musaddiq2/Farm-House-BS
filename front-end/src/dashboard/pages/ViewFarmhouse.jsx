import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ViewFarmhouse = () => {
  const navigate = useNavigate();
  const [farmhouses, setFarmhouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    fetchFarmhouses();
  }, []);

  const fetchFarmhouses = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || null);
      const response = await axios.get('http://localhost:5000/api/farmhouses/view-farmhouses', {
        headers: user ? { Authorization: `Bearer ${user.token}` } : {}
      });
      setFarmhouses(response.data.data || response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load farmhouses');
      toast.error('Error loading farmhouses');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (farmhouseId, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this farmhouse?`)) return;

    try {
      const user = JSON.parse(localStorage.getItem('user') || null);
      await axios.put(
        `http://localhost:5000/api/farmhouses/update-farmhouse-status/${farmhouseId}`,
        { status },
        { headers: user ? { Authorization: `Bearer ${user.token}` } : {} }
      );
      toast.success(`Farmhouse ${status} successfully`);
      fetchFarmhouses();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || `Failed to ${status} farmhouse`);
    }
  };

  const handleDeleteFarmhouse = async (farmhouseId) => {
    if (!window.confirm('Are you sure you want to delete this farmhouse? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:5000/api/farmhouses/delete-farmhouse/${farmhouseId}`
      );
      toast.success('Farmhouse deleted successfully!');
      fetchFarmhouses(); // Refresh the list
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete farmhouse');
    }
  };

  if (loading) {
    return <div className="container mt-5"><p className="text-center">Loading farmhouses...</p></div>;
  }

  if (error) {
    return <div className="container mt-5"><p className="text-center text-danger">{error}</p></div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Farmhouses</h2>

      {farmhouses.length === 0 ? (
        <div className="alert alert-info">
          No farmhouses found. <a href="/dashboard/add-farmhouse">Create one now!</a>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover">
            <thead className="table-light">
              <tr>
                <th>id</th>
                <th>Name</th>
                <th>Location</th>
                
                <th>Status</th>
                <th>Capacity</th>
                <th>Price/Day</th>
                <th>Bookings</th>
                <th>Views</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {farmhouses.map((farmhouse, index) => (
                <React.Fragment key={farmhouse._id}>
                  <tr>
                    <td>{index + 1}</td>
                    <td className="fw-bold">{farmhouse.name}</td>
                    <td>
                      <i className="bi bi-geo-alt"></i> {farmhouse.location?.city}, {farmhouse.location?.state}
                    </td>
                    
                    <td>
                      <span className={`badge bg-${farmhouse.status === 'approved' ? 'success' : farmhouse.status === 'pending' ? 'warning' : 'danger'}`}>
                        {farmhouse.status?.toUpperCase() || 'PENDING'}
                      </span>
                    </td>
                    <td>{farmhouse.capacity?.minGuests}-{farmhouse.capacity?.maxGuests}</td>
                    <td className="fw-bold">₹{farmhouse.pricing?.fullDay}</td>
                    <td>{farmhouse.totalBookings || 0}</td>
                    <td>{farmhouse.views || 0}</td>
                    <td>
                      <button type="button" className='btn btn-success btn-sm me-2' onClick={() => handleUpdateStatus(farmhouse._id, 'approved')}>
                        <i className="fas fa-circle-check"></i>
                      </button>
                      <button type="button" className='btn btn-danger btn-sm me-2' onClick={() => handleUpdateStatus(farmhouse._id, 'rejected')}>
                        <i className="fas fa-times-circle"></i>
                      </button>
                      <button type="button" className="btn btn-info me-2" onClick={() => setOpenId(openId === farmhouse._id ? null : farmhouse._id)}>
                        <i className="fas fa-eye"></i>
                      </button>
                      <Link to={`/super-admin/edit-farmhouse/${farmhouse._id}`} className='btn btn-warning'>
                        <i className="fas fa-pencil"></i>
                      </Link>
                      <button className='btn btn-danger ms-2' onClick={() => handleDeleteFarmhouse(farmhouse._id)}>
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                  {openId === farmhouse._id && (
                    <tr>
                      <td colSpan="10">
                        <div className="p-3 bg-light">
                          <div className="row">
                            <div className="col-md-4">
                              {farmhouse.images && farmhouse.images.length > 0 ? (
                                <div className="mb-2">
                                  <img src={import.meta.env.VITE_IMG_URL + farmhouse.images[0].url} alt={farmhouse.name} className="img-fluid rounded" />
                                </div>
                              ) : (
                                <div className="mb-2 text-muted">No image</div>
                              )}
                              <div className="d-flex flex-wrap gap-2">
                                {(farmhouse.images || []).slice(0, 4).map((img, i) => (
                                  <img key={i} src={import.meta.env.VITE_IMG_URL + img.url} alt={`${farmhouse.name}-${i}`} style={{ width: 60, height: 45, objectFit: 'cover' }} className="me-2 rounded" />
                                ))}
                              </div>
                            </div>
                            <div className="col-md-8">
                              <h5>Description</h5>
                              <p className="mb-2">{farmhouse.description || '—'}</p>

                              <div className="row">
                                <div className="col-md-6">
                                  <h6>Location</h6>
                                  <p className="mb-1">{farmhouse.location?.address || ''}</p>
                                  <p className="mb-1">{farmhouse.location?.city}, {farmhouse.location?.state} {farmhouse.location?.pincode || ''}</p>

                                  <h6 className="mt-2">Capacity</h6>
                                  <p className="mb-1">{farmhouse.capacity?.minGuests || '-'} - {farmhouse.capacity?.maxGuests || '-' } guests</p>

                                  <h6 className="mt-2">Rules</h6>
                                  <p className="mb-1">Pets: {farmhouse.rules?.petsAllowed ? 'Yes' : 'No'}</p>
                                  <p className="mb-1">Alcohol: {farmhouse.rules?.alcoholAllowed ? 'Yes' : 'No'}</p>
                                  <p className="mb-1">Smoking: {farmhouse.rules?.smokingAllowed ? 'Yes' : 'No'}</p>
                                </div>

                                <div className="col-md-6">
                                  <h6>Pricing</h6>
                                  <p className="mb-1">Hourly: {farmhouse.pricing?.hourly ? `₹${farmhouse.pricing.hourly}` : '—'}</p>
                                  <p className="mb-1">Full day: {farmhouse.pricing?.fullDay ? `₹${farmhouse.pricing.fullDay}` : '—'}</p>
                                  <p className="mb-1">Multi day: {farmhouse.pricing?.multiDay ? `₹${farmhouse.pricing.multiDay}` : '—'}</p>

                                  <h6 className="mt-2">Amenities</h6>
                                  <div className="mb-2">
                                    {(farmhouse.amenities || []).length === 0 ? (
                                      <span className="text-muted">No amenities listed</span>
                                    ) : (
                                      (farmhouse.amenities || []).map((a, i) => (
                                        <span key={i} className="badge bg-secondary me-1 mb-1">{a.name}</span>
                                      ))
                                    )}
                                  </div>

                                  <h6 className="mt-2">Meta</h6>
                                  <p className="mb-1">Instant booking: {farmhouse.instantBooking ? 'Yes' : 'No'}</p>
                                  <p className="mb-1">Featured: {farmhouse.featured ? 'Yes' : 'No'}</p>
                                  <p className="mb-1">Ratings: {farmhouse.rating?.average || 0} ({farmhouse.rating?.count || 0})</p>
                                  <p className="mb-1">Total bookings: {farmhouse.totalBookings || 0}</p>
                                  <p className="mb-1">Views: {farmhouse.views || 0}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewFarmhouse;