import React from 'react';

// Style for h1
const h1Style = {
    fontWeight: "500",
    color: "#424242",
    fontSize: "2rem",
    lineHeight: "1.5",
};

// Style for p
const pStyle = {
    fontWeight: "400",
    color: "#424242",
    fontSize: "1.1rem",
    lineHeight: "1.6",
};

function Hero() {
    return (
        <div className='container mb-5 p-4'>
            <div className='row mb-5 p-4 col-8 offset-2 text-center about-hero'>
                <p className='mt-4' style={h1Style}>
                    "Your Trusted Partner in Financial Success.
                    <br />
                    Navigating Wealth with Precision and Care."
                </p>
            </div>
            <hr className='mt-5' style={{ width: "80%", background: "#EEEEEE", margin: 'auto' }} />
            <div className='hero-p mt-5 d-flex flex-column flex-md-row align-items-start'>
                <div className='mx-5 mt-5'>
                    <p style={pStyle}>
                        We kick-started operations on the 15th of August, 2010, with the goal of breaking all barriers that traders and investors face in India in terms of cost, support, and technology. We named the company InvestEdge, a combination of Invest and Edge. Today, our disruptive pricing models and in-house technology have made us the biggest stock broker in India. Over 1+ Crore clients place millions of orders every day through our powerful ecosystem of investment platforms, contributing over 15% of all Indian retail trading volumes.
                    </p>
                    <p style={pStyle}>
                        In addition, we run a number of popular open online educational and community initiatives to empower retail traders and investors. Rainmatter, our fintech fund and incubator, has invested in several fintech startups with the goal of growing the Indian capital markets. Our initiatives are designed to create a more inclusive and innovative financial ecosystem in India.
                    </p>
                    <p style={pStyle}>
                        And yet, we are always up to something new every day. Catch up on the latest updates on our blog or see what the media is saying about us. We are committed to continuous innovation and exceptional customer support to help you achieve your financial goals. Join us on our journey to make investing smarter, more accessible, and more rewarding for everyone.
                    </p>
                </div>
            </div>

            {/* Inline CSS */}
            <style jsx>{`
                .about-hero {
                    background-color: #f9f9f9;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                .hero-p {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    align-items: flex-start;
                    gap: 20px;
                }

                hr {
                    margin-top: 2rem;
                    width: 80%;
                    border: none;
                    height: 1px;
                    background-color: #EEEEEE;
                }

                @media (max-width: 768px) {
                    .hero-p {
                        flex-direction: column;
                        align-items: center;
                    }
                }
            `}</style>
        </div>
    );
}

export default Hero;
