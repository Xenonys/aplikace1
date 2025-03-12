// Function to Open Sign Out Popup
function openSignOutPopup() {
    document.getElementById("signoutOverlay").classList.add("active");
    document.getElementById("signoutPopup").classList.add("active");
}

// Function to Close Sign Out Popup
function closeSignOutPopup() {
    document.getElementById("signoutOverlay").classList.remove("active");
    document.getElementById("signoutPopup").classList.remove("active");
}

// Function to Confirm Sign Out
function confirmSignOut() {
    // Redirect to login page (change URL accordingly)
    window.location.href = "../pages/login.html";
}

// Function to Load Sign Out Popup on Any Page
function loadSignOutPopup() {
    fetch("../pages/signout.html")
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML("beforeend", html);
        });
}

// Load popup and CSS dynamically
document.addEventListener("DOMContentLoaded", () => {
    loadSignOutPopup();
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../CSS/styles.css";
    document.head.appendChild(link);
});

document.getElementById("logoutButton").addEventListener("click", function() {
    localStorage.clear(); // Completely remove all stored data
    sessionStorage.clear(); // Remove any session storage if used
    window.location.href = "../pages/login.html"; // Redirect to login page
});
