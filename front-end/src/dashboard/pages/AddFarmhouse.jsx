import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AddFarmhouse() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    city: "",
    state: "",
    address: "",
    pincode: "",
    minGuests: "",
    maxGuests: "",
    fullDayPrice: "",
    instantBooking: false,
    petsAllowed: false,
    alcoholAllowed: false,
    smokingAllowed: false,
    image: null,
    video: null,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const user = JSON.parse(localStorage.getItem("user"));


  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      adminId: user.user.id,
      description: formData.description,
      location: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      capacity: {
        minGuests: Number(formData.minGuests),
        maxGuests: Number(formData.maxGuests),
      },
      pricing: {
        fullDay: Number(formData.fullDayPrice),
      },
      instantBooking: formData.instantBooking,
      rules: {
        petsAllowed: formData.petsAllowed,
        alcoholAllowed: formData.alcoholAllowed,
        smokingAllowed: formData.smokingAllowed,
        image: formData.image,
        video: formData.video
      },
    };

    try {
      await axios.post(
        "http://localhost:5000/api/farmhouses/create-farmhouse",
        payload,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success("Farmhouse added successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Error adding farmhouse");
    }
  };

  return (
    <div className="container">
      <h2 className="text-2xl text-center font-bold mb-6">Add Farmhouse</h2>

      <form onSubmit={handleSubmit} className="mt-4">
        {/* BASIC INFO */}
        <div className="mb-3">
          <label className="form-label fw-medium">Farmhouse Name</label>
          <input
            type="text"
            name="name"
            required
            className="form-control"
            placeholder="Farmhouse Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label fw-medium">Descriptions</label>
          <textarea
            name="description"
            className="form-control"
            placeholder="Descriptions"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* LOCATION */}
        <div className="row mb-3">
          <div className="col-md-6">
            <input
              name="address"
              placeholder="Address"
              className="form-control"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              name="city"
              placeholder="City"
              className="form-control"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              name="state"
              placeholder="State"
              className="form-control"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              name="pincode"
              placeholder="Pincode"
              className="form-control"
              value={formData.pincode}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* CAPACITY */}
        <div className="row mb-3">
          <div className="col-md-6">
            <input
              type="number"
              name="minGuests"
              placeholder="Min Guests"
              className="form-control"
              value={formData.minGuests}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <input
              type="number"
              name="maxGuests"
              placeholder="Max Guests"
              className="form-control"
              value={formData.maxGuests}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* PRICING */}
        <div className="row">
          <div className="col-md-6">
            <label className="form-label fw-medium">Full Day Price</label>
            <input
              type="number"
              name="fullDayPrice"
              className="form-control"
              value={formData.fullDayPrice}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-medium">Upload Images</label>
            <input type="file" className="form-control" multiple />
          </div>
          <div className="col-md-6 mt-3">
            <label className="form-label fw-medium">Upload Videos</label>
            <input type="file" className="form-control" multiple />
          </div>
        </div>

        {/* RULES */}
        <div className="mb-3">
          <div className="form-check form-check-inline">
            <input
              type="checkbox"
              className="form-check-input"
              id="petsAllowed"
              name="petsAllowed"
              checked={formData.petsAllowed}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="petsAllowed">
              Pets Allowed
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="checkbox"
              className="form-check-input"
              id="alcoholAllowed"
              name="alcoholAllowed"
              checked={formData.alcoholAllowed}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="alcoholAllowed">
              Alcohol Allowed
            </label>
          </div>
          <div className="form-check form-check-inline">
            <input
              type="checkbox"
              className="form-check-input"
              id="smokingAllowed"
              name="smokingAllowed"
              checked={formData.smokingAllowed}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="smokingAllowed">
              Smoking Allowed
            </label>
          </div>
        </div>

        {/* INSTANT BOOKING */}
        <div className="mb-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="instantBooking"
              name="instantBooking"
              checked={formData.instantBooking}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="instantBooking">
              Instant Booking
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-success px-4"
        >
          Add Farmhouse
        </button>
      </form>
    </div>
  );
}
