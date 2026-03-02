function FarmhouseCard({ data }) {
    return (
        <div className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm h-100 rounded-4">
                <img
                    src={data.image}
                    className="card-img-top rounded-top-4"
                    style={{ height: "230px", objectFit: "cover" }}
                    alt=""
                />
                <div className="card-body">
                    <h5 className="fw-bold">{data.name}</h5>
                    <p className="text-muted small">{data.location}</p>
                    <p className="text-success fw-bold">
                        ₹{data.price} / night
                    </p>
                </div>
                <div className="card-footer bg-white border-0">
                    <button className="btn btn-success w-100 rounded-pill">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function PopularSection() {
    return (
        <div className="container my-5">
            <h2 className="fw-bold text-center mb-5">
                Popular Farmhouses
            </h2>

            <div className="row">
                <FarmhouseCard data={{
                    name: "Sunset Farmhouse",
                    location: "Hilltop, Maharashtra",
                    price: 2500,
                    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef"
                }} />
                <FarmhouseCard data={{
                    name: "Sunset Farmhouse",
                    location: "Hilltop, Maharashtra",
                    price: 2500,
                    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef"
                }} />
                <FarmhouseCard data={{
                    name: "Sunset Farmhouse",
                    location: "Hilltop, Maharashtra",
                    price: 2500,
                    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef"
                }} />
            </div>
        </div>
    );
}