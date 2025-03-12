document.addEventListener("DOMContentLoaded", function () {
    // Load saved language from localStorage or set Czech as default
    const savedLanguage = localStorage.getItem("language") || "cz";
    document.getElementById("languageSelect").value = savedLanguage;
    applyLanguage(savedLanguage);
});

// Function to change language only for elements with class "jazyk"
function changeLanguage(selectElement) {
    const selectedLanguage = selectElement.value;
    localStorage.setItem("language", selectedLanguage);
    applyLanguage(selectedLanguage);
}

// Apply the selected language to elements with class "jazyk"
function applyLanguage(language) {
    const elements = document.querySelectorAll(".jazyk");

    const translations = {
        cz: ["Nastavení", "Světlý Režim", "Oznámení", "Jazyk", "Chcete se opravdu odhlásit?", "Ano, odhlásit se", "Zrušit"], // Czech is primary
        en: ["Settings", "Light Mode", "Notifications", "Language", "Do you really want to sign out?", "Yes, sign out", "Cancel"],
        es: ["Configuración", "Modo oscuro", "Notificaciones", "Idioma"],
        de: ["Einstellungen", "Dunkler Modus", "Benachrichtigungen", "Sprache"]
    };

    if (translations[language]) {
        elements.forEach((el, index) => {
            el.textContent = translations[language][index];
        });
    }
}
