import React from "react";

function Hero() {
    return (
        <div className="support" style={{ backgroundColor: "#f1f1f1", padding: "50px 20px" }}>
            <div className="container mt-5 p-3">
                <div className="row">
                    {/* Left Column */}
                    <div className="col-md-6 col-12">
                        <h4>
                            <a
                                style={{
                                    textDecoration: "none",
                                    color: "#007BFF",
                                    fontWeight: "500",
                                    fontSize: "1.35rem",
                                }}
                                href="#support-portal"
                            >
                                Support Portal
                            </a>
                        </h4>
                        <h3
                            style={{
                                color: "#333",
                                fontWeight: "400",
                                fontSize: "1.5rem",
                                marginTop: "45px",
                                marginBottom: "35px",
                            }}
                        >
                            Search for an answer or browse help topics to create a ticket
                        </h3>
                        <form className="mb-4">
                            <input
                                style={{
                                    width: "100%",
                                    height: "50px",
                                    borderRadius: "8px",
                                    border: "1px solid #ddd",
                                    padding: "10px",
                                }}
                                type="text"
                                placeholder="E.g.: How do I activate F&O, Why is my order getting rejected..."
                            />
                        </form>
                        <div className="d-flex flex-wrap">
                            <a
                                style={{
                                    textDecoration: "none",
                                    color: "#007BFF",
                                    fontWeight: "400",
                                    fontSize: "1.1rem",
                                    marginRight: "20px",
                                }}
                                href="#track-account-opening"
                            >
                                Track account opening
                            </a>

                            <a
                                style={{
                                    textDecoration: "none",
                                    color: "#007BFF",
                                    fontWeight: "400",
                                    fontSize: "1.1rem",
                                    marginRight: "20px",
                                }}
                                href="#track-segment-activation"
                            >
                                Track segment activation
                            </a>

                            <a
                                style={{
                                    textDecoration: "none",
                                    color: "#007BFF",
                                    fontWeight: "400",
                                    fontSize: "1.1rem",
                                }}
                                href="#intraday-margins"
                            >
                                Intraday margins
                            </a>
                        </div>

                        <div className="mt-3">
                            <a
                                style={{
                                    textDecoration: "none",
                                    color: "#007BFF",
                                    fontWeight: "400",
                                    fontSize: "1.1rem",
                                }}
                                href="#kite-user-manual"
                            >
                                Kite user manual
                            </a>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-md-6 col-12 mt-4 mt-md-0">
                        <h4>
                            <a
                                style={{
                                    textDecoration: "none",
                                    color: "#007BFF",
                                    fontWeight: "500",
                                    fontSize: "1.35rem",
                                    textAlign: "right",
                                }}
                                href="#track-tickets"
                            >
                                Track tickets
                            </a>
                        </h4>
                        <div
                            className="mt-5 mx-3 p-3"
                            style={{ color: "#333", backgroundColor: "#e9ecef", borderRadius: "8px" }}
                        >
                            <h4>Featured</h4>
                            <ol style={{ marginTop: "10px", color: "#007BFF", padding: "20px" }}>
                                <li style={{ marginBottom: "15px" }}>
                                    Latest Intraday leverages and Square-off timings
                                </li>
                                <li>Surveillance measure on scrips - June 2024</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Hero;
