export default function Footer() {
    return (
        <footer className="bg-dark text-white py-4 mt-5">
            <div className="container text-center">
                <h5 className="fw-bold">🌿 FunFarm</h5>
                <p className="small">
                    © {new Date().getFullYear()} FunFarm. All rights reserved.
                </p>
            </div>
        </footer>
    );
}