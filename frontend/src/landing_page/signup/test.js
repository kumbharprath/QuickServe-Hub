{showLoginPopup && (
    <div style={styles.popup}>
      <div style={styles.popupContent}>
        <h4>Login</h4>
        <form onSubmit={handleLoginSubmit}>
          <div className='mb-3'>
            <label htmlFor='email' className='form-label'>Email</label>
            <input type='text' className='form-control' id='email' name='email' placeholder='Enter your Email' value={loginFormData.email} // Bind value to state
              onChange={handleLoginFormChange} />
            {loginErrors.email && <div className='invalid-feedback'>{loginErrors.email}</div>} {/* Show error if any */}
          </div>
          <div className='mb-3'>
            <label htmlFor='loginPassword' className='form-label'>Password</label>
            <input type='password' className='form-control' id='loginPassword' name='password' placeholder='Enter your Password' value={loginFormData.password} // Bind value to state
              onChange={handleLoginFormChange}/>
            {loginErrors.password && <div className='invalid-feedback'>{loginErrors.password}</div>} {/* Show error if any */}
          </div>
          <button type='submit' className='btn btn-primary'>Login</button>
        </form>
        <button onClick={handleClosePopup} style={styles.closeButton}>
          <FaTimes />
        </button>
      </div>
    </div>
  )}