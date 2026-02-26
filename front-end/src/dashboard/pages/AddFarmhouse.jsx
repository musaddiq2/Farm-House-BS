import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
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
    hourlyPrice: "",
    multiDayPrice: "",
    instantBooking: false,
    petsAllowed: false,
    alcoholAllowed: false,
    smokingAllowed: false,
    image: [],
    video: null,
  });

  const [existingImages, setExistingImages] = useState([]); // Store existing images from DB
  const [imagePreviews, setImagePreviews] = useState([]); // Store preview URLs for new files
  const [existingVideo, setExistingVideo] = useState(null); // Store existing video (URL or object)
  const [videoPreview, setVideoPreview] = useState(null); // Preview URL for newly selected video
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const user = JSON.parse(localStorage.getItem("user"));
  const Navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const fd = new FormData();

    // basic fields
    fd.append("name", formData.name);
    fd.append("adminId", user.user.id);
    fd.append("description", formData.description);

    // location
    fd.append("address", formData.address);
    fd.append("city", formData.city);
    fd.append("state", formData.state);
    fd.append("pincode", formData.pincode);

    // capacity
    fd.append("minGuests", Number(formData.minGuests));
    fd.append("maxGuests", Number(formData.maxGuests));

    // pricing
    fd.append("fullDay", Number(formData.fullDayPrice));
    fd.append("hourly", Number(formData.hourlyPrice));
    fd.append("multiDay", Number(formData.multiDayPrice));

    // booleans
    fd.append("instantBooking", formData.instantBooking);
    fd.append("petsAllowed", formData.petsAllowed);
    fd.append("alcoholAllowed", formData.alcoholAllowed);
    fd.append("smokingAllowed", formData.smokingAllowed);

    // new images (File objects only)
    formData.image.forEach(file => {
      if (file instanceof File) {
        fd.append("images", file);
      }
    });

    // existing images (for edit mode)
    if (existingImages.length > 0) {
      existingImages.forEach((image, index) => {
        fd.append(`existingImages[${index}]`, image.url || image);
      });
    }

    // video
    if (formData.video) {
      fd.append("video", formData.video);
    } else if (existingVideo) {
      // Send existing video path/url when no new file selected (edit mode)
      fd.append("existingVideo", existingVideo.url || existingVideo);
    }

    if (id) {
      try {
        await axios.put(
          "http://localhost:5000/api/farmhouses/update-farmhouse/" + id,
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        Navigate('/super-admin/view-farmhouses');
        toast.success("Farmhouse updated successfully!");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update farmhouse");
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        await axios.post(
          "http://localhost:5000/api/farmhouses/create-farmhouse",
          fd,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        Navigate('/super-admin/view-farmhouses');
        toast.success("Farmhouse added successfully!");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to add farmhouse");
      } finally {
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    if (id) {
      // Fetch farmhouse details and populate form for editing
      axios.get("http://localhost:5000/api/farmhouses/view-farmhouses/" + id)
        .then(res => {
          const farmhouse = res.data;

          setFormData({
            ...formData,
            name: farmhouse.data.name || "",
            description: farmhouse.data.description || "",
            address: farmhouse.data.location?.address || "",
            city: farmhouse.data.location?.city || "",
            state: farmhouse.data.location?.state || "",
            pincode: farmhouse.data.location?.pincode || "",
            minGuests: farmhouse.data.capacity.minGuests || "",
            maxGuests: farmhouse.data.capacity.maxGuests || "",
            fullDayPrice: farmhouse.data.pricing.fullDay || "",
            hourlyPrice: farmhouse.data.hourly || "",
            multiDayPrice: farmhouse.data.multiDay || "",
            instantBooking: farmhouse.data.instantBooking || false,
            petsAllowed: farmhouse.data.petsAllowed || false,
            alcoholAllowed: farmhouse.data.alcoholAllowed || false,
            smokingAllowed: farmhouse.data.smokingAllowed || false,
          });

          // Store existing images
          if (farmhouse.data.images) {
            setExistingImages(farmhouse.data.images || []);
          }
          // Store existing video (if any)
          if (farmhouse.data.videos) {
            setExistingVideo(farmhouse.data.videos);
          }
        })
        .catch(err => {
          console.error("Error fetching farmhouse details:", err);
        });
    }
  }, [id]);

  // cleanup preview URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);
  return (
    <div className="container">
      <h2 className="text-2xl text-center font-bold mb-6">{id ? "Edit Farmhouse" : "Add Farmhouse"}</h2>

      <form encType="multipart/form-data" onSubmit={handleSubmit} className="mt-4">
        {/* BASIC INFO */}
        <div className="mb-3">
          <label className="form-label fw-medium">Farmhouse Name</label>
          <input
            type="text"
            name="name"
            required
            className="form-control"
            placeholder="Farmhouse Name"
            value={formData.name || ""}
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
          <div className="col-md-6 mt-3">
            <label className="form-label fw-medium">Address</label>
            <input
              name="address"
              placeholder="Address"
              className="form-control"
              value={formData.address || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mt-3">
            <label className="form-label fw-medium">City</label>
            <input
              name="city"
              placeholder="City"
              className="form-control"
              value={formData.city || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mt-3">
            <label className="form-label fw-medium">State</label>
            <input
              name="state"
              placeholder="State"
              className="form-control"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6 mt-3">
            <label className="form-label fw-medium">Pincode</label>
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
            <label className="form-label fw-medium">Minimum Guests</label>
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
            <label className="form-label fw-medium">Maximum Guests</label>
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
              placeholder="Full Day Price"
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-medium">Hourly Price (Optional)</label>
            <input
              type="number"
              name="hourlyPrice"
              className="form-control"
              value={formData.hourlyPrice}
              placeholder="Hourly Price (Optional)"
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 mt-3">
            <label className="form-label fw-medium">Mutiday Price (Optional)</label>
            <input
              type="number"
              name="multiDayPrice"
              className="form-control"
              value={formData.multiDayPrice}
              placeholder="Mutiday Price (Optional)"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6 mt-3 mb-4">
            <label className="form-label fw-medium">Upload Images</label>
            <input
              type="file"
              name="images"
              className="form-control"
              onChange={(e) => {
                const files = Array.from(e.target.files);
                setFormData((prev) => ({
                  ...prev,
                  image: [...prev.image, ...files],
                }));

                // Create preview URLs for selected files
                files.forEach((file) => {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImagePreviews((prev) => [...prev, reader.result]);
                  };
                  reader.readAsDataURL(file);
                });
              }}
              multiple
            />
            {/* IMAGE PREVIEWS */}
            {(existingImages.length > 0 || imagePreviews.length > 0) && (
              <div className="mb-4">
                <h5>Image Previews</h5>
                <div className="row">
                  {/* Existing Images */}
                  {existingImages.map((image, index) => (
                    <div key={`existing-${index}`} className="col-md-3 mb-3">
                      <div className="position-relative">
                        <img
                          src={`${import.meta.env.VITE_IMG_URL}/${image.url}`}
                          alt={`${import.meta.env.VITE_IMG_URL}/${image.url}`}
                          className="img-thumbnail w-100"
                          style={{ height: "150px", objectFit: "cover" }}
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm position-absolute top-0 end-0"
                          onClick={() => {
                            setExistingImages(existingImages.filter((_, i) => i !== index));
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* New Image Previews */}
                  {imagePreviews.map((preview, index) => (
                    <div key={`preview-${index}`} className="col-md-3 mb-3">
                      <div className="position-relative">
                        <img
                          src={preview}
                          alt={`Preview ${index}`}
                          className="img-thumbnail w-100"
                          style={{ height: "150px", objectFit: "cover" }}
                        />
                        <button
                          type="button"
                          className="btn btn-danger btn-sm position-absolute top-0 end-0"
                          onClick={() => {
                            setImagePreviews(imagePreviews.filter((_, i) => i !== index));
                            setFormData((prev) => ({
                              ...prev,
                              image: prev.image.filter((_, i) => i !== index),
                            }));
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="col-md-6 mt-3 mb-4">
            <label className="form-label fw-medium">Upload Video</label>
            <input
              type="file"
              name="video"
              className="form-control"
              accept="video/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  // revoke previous preview if any
                  if (videoPreview) {
                    URL.revokeObjectURL(videoPreview);
                  }
                  const preview = URL.createObjectURL(file);
                  setVideoPreview(preview);
                  setExistingVideo(null);
                  setFormData((prev) => ({
                    ...prev,
                    video: file,
                  }));
                }
              }}
            />

            {/* Video preview / player */}
            {(videoPreview || existingVideo) && (
              <div className="mt-3 position-relative">
                <video
                  controls
                  className="w-100 img-thumbnail"
                  style={{ maxHeight: "300px", objectFit: "cover" }}
                  src={
                    videoPreview
                      ? videoPreview
                      : (existingVideo[0]?.url ? `${import.meta.env.VITE_IMG_URL}/${existingVideo[0].url}` : existingVideo)
                  }
                />
                <button
                  type="button"
                  className="btn btn-danger btn-sm position-absolute top-0 end-0"
                  onClick={() => {
                    // remove preview or existing video
                    if (videoPreview) {
                      URL.revokeObjectURL(videoPreview);
                      setVideoPreview(null);
                      setFormData((prev) => ({ ...prev, video: null }));
                    }
                    if (existingVideo) {
                      setExistingVideo(null);
                    }
                  }}
                >
                  ✕
                </button>
              </div>
            )}
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
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : id ? "Update Form" : "Add Farmhouse"}
        </button>
      </form>
    </div>
  );
}
