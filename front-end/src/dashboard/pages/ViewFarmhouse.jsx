import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ViewFarmhouse = () => {
  const navigate = useNavigate();
  const [farmhouses, setFarmhouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFarmhouses();
  }, []);

  const fetchFarmhouses = async () => {
    try {
      setLoading(true);
      const user = localStorage.getItem('user');
      const response = await axios.get(
        'http://localhost:5000/api/farmhouses/view-farmhouses',
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setFarmhouses(response.data.data || response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to load farmhouses');
      toast.error('Error loading farmhouses');
    } finally {
      setLoading(false);
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
      <h2 className="text-center mb-4">My Farmhouses</h2>

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
                <th>Description</th>
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
                <tr key={farmhouse._id}>
                  <td>{index + 1}</td>
                  <td className="fw-bold">{farmhouse.name}</td>
                  <td>
                    <i className="bi bi-geo-alt"></i> {farmhouse.location?.city}, {farmhouse.location?.state}
                  </td>
                  <td className="text-muted">
                    {farmhouse.description?.substring(0, 50)}...
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
                    {/* View Details Button */}
                    <button className='btn btn-warning'>
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className='btn btn-danger ms-2'>
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewFarmhouse;