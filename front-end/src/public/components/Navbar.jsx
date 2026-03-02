import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top shadow-sm py-3">
            <div className="container">
                <Link className="navbar-brand fw-bold fs-4 text-success" to="/">
                    🌿 FunFarm
                </Link>

                <button
                    className="navbar-toggler"
                    data-bs-toggle="collapse"
                    data-bs-target="#nav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="nav">
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item mx-3">
                            <Link className="nav-link fw-semibold" to="/farmhouses">
                                Explore
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link className="btn btn-success rounded-pill px-4" to="/register">
                                List Your Farm
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}