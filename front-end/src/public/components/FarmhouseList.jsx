export default function FarmhouseList() {
    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-3">
                    <div className="card p-3 shadow-sm rounded-4">
                        <h5>Filters</h5>
                        <input type="range" className="form-range mt-3" />
                        <select className="form-select mt-3">
                            <option>Capacity</option>
                            <option>10-20</option>
                            <option>20-50</option>
                        </select>
                    </div>
                </div>

                <div className="col-md-9">
                    <div className="row">
                        {/* Map FarmhouseCard Here */}
                    </div>
                </div>
            </div>
        </div>
    );
}