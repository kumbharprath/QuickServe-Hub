import React from 'react';

function TeamPage() {
    const h1Style = {
        fontSize: '2.5rem',
        color: '#212529',
        fontWeight: 'bold',
    };

    const pStyle = {
        fontSize: '1rem',
        color: '#6c757d',
        lineHeight: '1.6',
    };

    return (
        <div className='container mb-5 p-4'>
            <div className='row mb-5 p-4 col-8 offset-2 text-center team'>
                <p className='mt-4' style={h1Style}>
                    Team
                </p>
            </div>
            <div className='hero-p mt-5 mb-5 p-4 team-section'>
                <div className='text-center team-member'>
                    <div className='team-img'>
                        <img src='ca.jpg' alt='Founder' />
                    </div>
                    <div className='mt-4'>
                        <h2 style={h1Style}>Sneha Patil</h2>
                        <p style={pStyle}>Founder, CFO</p>
                    </div>
                </div>
                <div className='team-description text-center'>
                    <p style={pStyle}>
                        Hi, I'm Rushikesh Kumbhar, the founder of InvestEdge. Our company is dedicated to revolutionizing the stock market experience by providing innovative tools and resources designed to empower investors. At InvestEdge, we believe in making investing smarter, more accessible, and more rewarding for everyone. Whether you're a novice or an experienced investor, our user-friendly platforms and cutting-edge technology offer the knowledge and confidence you need to navigate the stock market effectively.
                    </p>
                    <p style={pStyle}>
                        With a strong focus on exceptional customer support and continuous innovation, InvestEdge is committed to helping you achieve your financial goals.
                    </p>
                    <p style={pStyle}>
                        <a style={{ textDecoration: "none" }} href='https://rushik9686.github.io/My-Portfolio-Website/#projects'>Connect with me</a>
                    </p>
                </div>
            </div>

            <div className='hero-p mt-5 mb-5 p-4 team-section'>
                <div className='text-center team-member'>
                    <div className='team-img'>
                        <img src='advisor.jpg' alt='Founder' />
                    </div>
                    <div className='mt-4'>
                        <h2 style={h1Style}>Rishi Kumbhar</h2>
                        <p style={pStyle}>Founder, CEO</p>
                    </div>
                </div>
                <div className='team-description text-center'>
                    <p style={pStyle}>
                        Hi, I'm Rushikesh Kumbhar, the founder of InvestEdge. Our company is dedicated to revolutionizing the stock market experience by providing innovative tools and resources designed to empower investors. At InvestEdge, we believe in making investing smarter, more accessible, and more rewarding for everyone. Whether you're a novice or an experienced investor, our user-friendly platforms and cutting-edge technology offer the knowledge and confidence you need to navigate the stock market effectively.
                    </p>
                    <p style={pStyle}>
                        With a strong focus on exceptional customer support and continuous innovation, InvestEdge is committed to helping you achieve your financial goals.
                    </p>
                    <p style={pStyle}>
                        <a style={{ textDecoration: "none" }} href='https://rushik9686.github.io/My-Portfolio-Website/#projects'>Connect with me</a>
                    </p>
                </div>
            </div>

            <div className='hero-p mt-5 mb-5 p-4 team-section'>
                <div className='text-center team-member'>
                    <div className='team-img'>
                        <img src='investor.jpg' alt='Investor' />
                    </div>
                    <div className='mt-4'>
                        <h2 style={h1Style}>Abhishek Kesare</h2>
                        <p style={pStyle}>CTO, Investor</p>
                    </div>
                </div>
                <div className='team-description text-center'>
                    <p style={pStyle}>
                        Hi, I'm Rushikesh Kumbhar, the founder of InvestEdge. Our company is dedicated to revolutionizing the stock market experience by providing innovative tools and resources designed to empower investors. At InvestEdge, we believe in making investing smarter, more accessible, and more rewarding for everyone. Whether you're a novice or an experienced investor, our user-friendly platforms and cutting-edge technology offer the knowledge and confidence you need to navigate the stock market effectively.
                    </p>
                    <p style={pStyle}>
                        With a strong focus on exceptional customer support and continuous innovation, InvestEdge is committed to helping you achieve your financial goals.
                    </p>
                    <p style={pStyle}>
                        <a style={{ textDecoration: "none" }} href='https://rushik9686.github.io/My-Portfolio-Website/#projects'>Connect with me</a>
                    </p>
                </div>
            </div>

            {/* CSS for TeamPage */}
            <style jsx>{`
                .team-section {
                    width: 100%;
                    max-width: 1200px;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    margin: auto;
                }
                .team-member, .team-description {
                    width: 100%;
                    max-width: 600px;
                    margin: 10px;
                    flex: 1 1 100%;
                    text-align: center;
                }
                .team-img img {
                    width: 100%;
                    height: auto;
                    border-radius: 8px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s ease;
                }
                .team-img img:hover {
                    transform: scale(1.05);
                }
                @media (min-width: 768px) {
                    .team-member, .team-description {
                        width: 50%;
                        flex: 1;
                    }
                }
                @media (max-width: 576px) {
                    .team-section {
                        flex-direction: column;
                        align-items: center;
                    }
                }
            `}</style>
        </div>
    );
}

export default TeamPage;
