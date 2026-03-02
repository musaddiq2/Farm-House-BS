export default function Hero() {
  return (
    <section className="hero-section d-flex align-items-center">
      <div className="container text-center text-white">
        <h1 className="display-3 fw-bold">
          Discover Nature. Book Happiness.
        </h1>
        <p className="lead mt-3">
          Find premium farmhouses for parties, weddings & weekend escapes.
        </p>

        {/* Floating Search Box */}
        <div className="search-box shadow-lg p-4 mt-5">
          <div className="row g-3">
            <div className="col-md-4">
              <input className="form-control" placeholder="Enter Location" />
            </div>
            <div className="col-md-3">
              <input type="date" className="form-control" />
            </div>
            <div className="col-md-3">
              <input type="number" className="form-control" placeholder="Guests" />
            </div>
            <div className="col-md-2">
              <button className="btn btn-success w-100 fw-bold">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}