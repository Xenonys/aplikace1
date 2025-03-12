function openPopup() {
    document.getElementById("popupOverlay").classList.add("active");
    document.getElementById("popup").classList.add("active");
}

function closePopup() {
    document.getElementById("popupOverlay").classList.remove("active");
    document.getElementById("popup").classList.remove("active");
}

function toggleOption(element) {
    element.classList.toggle("active");
}

function loadPopup() {
    fetch("popup.html")
        .then(response => response.text())
        .then(html => {
            document.body.insertAdjacentHTML("beforeend", html);

            document.querySelectorAll(".toggle").forEach(toggle => {
                toggle.addEventListener("click", () => toggle.classList.toggle("active"));
            });
        });
}

document.addEventListener("DOMContentLoaded", () => {
    loadPopup();
    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../CSS/styles.css";
    document.head.appendChild(link);
});
