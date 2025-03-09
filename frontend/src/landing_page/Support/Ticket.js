import React from 'react';

// Style for h2
const h2Style = {
    fontWeight: "400",
    color: "#424242",
    fontSize: "2rem",
    marginBottom: "30px",
    textAlign: "center",
};

// Style for h3
const h3Style = {
    fontWeight: "400",
    color: "#424242",
    fontSize: "1.4rem",
    marginBottom: "30px",
};

// Style for list items
const liStyle = {
    fontSize: "1rem",
    fontWeight: "400",
    marginBottom: "15px"
};

function Ticket() {
    return (
        <div className="container mt-5 p-3">
            <div className="row">
                <h1 style={h2Style}>To create a ticket, select a relevant topic</h1>

                <div className="col-lg-4 col-md-6 col-12 mt-5">
                    <h3 style={h3Style}>
                        <i className="fa-solid fa-circle-plus"></i>&nbsp; Account Opening
                    </h3>
                    <ul>
                        <li style={liStyle}><a style={{ textDecoration: "none" }} href="#getting-started">Getting started</a></li>
                        <li style={liStyle}><a style={{ textDecoration: "none" }} href="#online">Online</a></li>
                        <li style={liStyle}><a style={{ textDecoration: "none" }} href="#offline">Offline</a></li>
                        <li style={liStyle}><a style={{ textDecoration: "none" }} href="#charges">Charges</a></li>
                        <li style={liStyle}><a style={{ textDecoration: "none" }} href="#company-partnership">Company, Partnership and HUF</a></li>
                        <li style={liStyle}><a style={{ textDecoration: "none" }} href="#nri">Non Resident Indian (NRI)</a></li>
                    </ul>
                </div>

                <div className="col-lg-4 col-md-6 col-12 mt-5">
                    <h3 style={h3Style}>
                        <i className="fa-regular fa-user"></i>&nbsp; Your InvestEdge Account
                    </h3>
                    <ul>
                        <li style={liStyle}><a style={{ textDecoration: "none" }} href="#about">About</a></li>
                        <li style={liStyle}><a style={{ textDecoration: "none" }} href="#login-credentials">Login credentials</a></li>
                        <li style={liStyle}><a style={{ textDecoration: "none" }} href="#your-profile">Your Profile</a></li>
                        <li style={liStyle}><a style={{ textDecoration: "none" }} href="#account-modification">Account modification and segment addition</a></li>
                        <li style={liStyle}><a style={{ textDecoration: "none" }} href="#cmr-dp-id">CMR & DP ID</a></li>
                        <li style={liStyle}><a style={{ textDecoration: "none" }} href="#nomination">Nomination</a></li>
                        <li style={liStyle}><a style={{ textDecoration: "none" }} href="#transfer-conversion">Transfer and conversion of shares</a></li>
                    </ul>
                </div>

                <div className="col-lg-4 col-md-6 col-12 mt-5">
                    <h3 style={h3Style}>
                        <i className="fa-solid fa-chart-simple"></i>&nbsp; Trading and Markets
                    </h3>
                    <ul>
                        <li style={liStyle}><a style={{ textDecoration: "none" }} href="#trading-faqs">Trading FAQs</a></li>
                        <li style={liStyle}><a style={{ textDecoration: "none" }} href="#kite">Kite</a></li>
                        <li style={liStyle}><a style={{ textDecoration: "none" }} href="#margins">Margins</a></li>
                        <li style={liStyle}><a style={{ textDecoration: "none" }} href="#product-order-types">Product and order types</a></li>
                        <li style={liStyle}><a style={{ textDecoration: "none" }} href="#corporate-actions">Corporate actions</a></li>
                        <li style={liStyle}><a style={{ textDecoration: "none" }} href="#kite-features">Kite features</a></li>
                    </ul>
                </div>

            </div>
        </div>
    );
}

export default Ticket;
