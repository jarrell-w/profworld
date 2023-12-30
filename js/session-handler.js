// session-handler.js

// Function to check if the user is logged in
function isLoggedIn() {
    const userId = sessionStorage.getItem('user_id');
    const isAdmin = sessionStorage.getItem('isAdmin');
    return userId && isAdmin !== null;
}

function user_role() {
    const isAdmin = sessionStorage.getItem('isAdmin');
    return isAdmin === '1' ? 'admin' : 'student';
}

// Function to redirect to the login page if not logged in
function redirectToLogin() {
    if (!isLoggedIn()) {
        window.location.href = '/';
    }
}

// Export the functions for use in other scripts
export { isLoggedIn, user_role, redirectToLogin };