import React from 'react';

// Style for h1
const h1Style = {
    fontWeight: "500",
    color: "#424242",
    fontSize: "2rem",
    marginBottom: "20px"
}
// Style for p
const pStyle = {
    fontWeight: "400",
    color: "gray",
    fontSize: "1rem",
};

function NotFound() {
    return ( 
        <div className='container mb-5 p-5'>
            <div className='row mt-5 p-5 col-8 offset-2 text-center'>
                <h1 className='mt-4'style={h1Style}>
                404 Not Found
                </h1>
                <p className='mb-5' style={pStyle}>
                Sorry, the page you are looking for does not exist.
                </p>
            </div>
        </div>
     );
}

export default NotFound;