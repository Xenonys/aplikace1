// auth.js - Authentication utility functions

/**
 * Checks if a user is currently authenticated
 * @returns {boolean} True if user is logged in, false otherwise
 */
function isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // If we have both a token and the isLoggedIn flag, consider the user logged in
    return !!token && isLoggedIn;
  }
  
  /**
   * Redirects to the appropriate page based on authentication status
   * @param {string} loginPage - The page to redirect to if not logged in
   * @param {string} homePage - The page to redirect to if logged in
   */
  function redirectBasedOnAuth(loginPage = '/login.html', homePage = '/index.html') {
    if (isAuthenticated()) {
      // User is logged in, redirect to home/index page if not already there
      if (!window.location.pathname.endsWith(homePage)) {
        window.location.href = homePage;
      }
    } else {
      // User is not logged in, redirect to login page if not already there
      if (!window.location.pathname.endsWith(loginPage)) {
        window.location.href = loginPage;
      }
    }
  }
  
  /**
   * Logs out the current user by clearing authentication data
   */
  function logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.setItem('isLoggedIn', 'false');
    window.location.href = '/login.html';
  }
  
  // Export the functions if using modules
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { isAuthenticated, redirectBasedOnAuth, logout };
  }