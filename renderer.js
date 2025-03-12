const { ipcRenderer } = require("electron");


document.getElementById("minimize-btn").addEventListener("click", () => {
    ipcRenderer.send("minimize-window");
  });

  document.getElementById("close-btn").addEventListener("click", () => {
    ipcRenderer.send("close-window");
  });


document.addEventListener('DOMContentLoaded', () => {
    console.log('Renderer script načten');
  
    // Zpracování ovládacích prvků okna (pokud existují)
    setupWindowControls();
  
    // Zpracování přihlašovacího formuláře
    setupLoginForm();
  
    // Zpracování navigace
    setupNavigation();
    
    // Načtení a zobrazení dat uživatele na chráněných stránkách
    loadUserData();
  });
  
  function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      console.log('Přihlašovací formulář nalezen');
      const errorMessage = document.getElementById('errorMessage');
      
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('Odesílání přihlašovacího formuláře');
        
        // Získání hodnot z formuláře
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Zobrazení zprávy o zpracování
        if (errorMessage) {
          errorMessage.textContent = "Probíhá přihlašování...";
          errorMessage.style.color = "blue";
        }
        
        try {
          console.log('Volání login API');
          // Komunikace s hlavním procesem Electronu
          const response = await window.electronAPI.login({ 
            username,
            password 
          });
          
          console.log('Odpověď z login API:', response);
          
          if (response.success) {
            if (errorMessage) {
              errorMessage.textContent = "Přihlášení úspěšné!";
              errorMessage.style.color = "green";
            }
            
            console.log('Přihlášení úspěšné, přesměrování...');
            
            // Krátká pauza před přesměrováním
            setTimeout(async () => {
              console.log('Přesměrování na index stránku');
              await window.electronAPI.navigateTo('index');
            }, 1000);
          } else {
            if (errorMessage) {
              errorMessage.textContent = response.message || "Neúspěšné přihlášení";
              errorMessage.style.color = "red";
            }
          }
        } catch (error) {
          console.error("Chyba při přihlašování:", error);
          if (errorMessage) {
            errorMessage.textContent = 'Chyba při přihlašování: ' + error.message;
            errorMessage.style.color = "red";
          }
        }
      });
    }
  }
  
  function setupNavigation() {
    // Přidání event listenerů na navigační prvky
    document.querySelectorAll('[data-nav]').forEach(link => {
      link.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const page = this.getAttribute('data-nav');
        console.log(`Navigace na: ${page}`);
        
        try {
          const result = await window.electronAPI.navigateTo(page);
          if (!result.success) {
            console.error('Navigace selhala:', result.message);
          }
        } catch (error) {
          console.error('Chyba při navigaci:', error);
        }
      });
    });
    
    // Přidání event listeneru pro odhlášení
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async function() {
        console.log('Odhlašování...');
        try {
          // Odhlášení přes Electron API
          await window.electronAPI.logout();
          
          // Přesměrování na přihlašovací stránku
          await window.electronAPI.navigateTo('login');
        } catch (error) {
          console.error('Chyba při odhlašování:', error);
        }
      });
    }
  }
  
  async function loadUserData() {
    // Zkontrolujeme, zda jsme na stránce, kde chceme zobrazit data uživatele
    const userDataElement = document.getElementById('user-data');
    const userNameElement = document.getElementById('user-name');
    
    if (userDataElement || userNameElement) {
      try {
        // Zkontrolujeme, zda je uživatel přihlášen
        const isAuthenticated = await window.electronAPI.isAuthenticated();
        
        if (isAuthenticated) {
          // Získáme data uživatele
          const userData = await window.electronAPI.getUser();
          console.log('Data uživatele:', userData);
          
          // Zobrazíme jméno uživatele, pokud je k dispozici element
          if (userNameElement && userData && userData.name) {
            userNameElement.textContent = userData.name;
          }
          
          // Zobrazíme další údaje o uživateli, pokud je k dispozici element
          if (userDataElement && userData) {
            userDataElement.innerHTML = `
              <p><strong>ID:</strong> ${userData.id || 'Nedostupné'}</p>
              <p><strong>Jméno:</strong> ${userData.name || 'Nedostupné'}</p>
              <!-- Další údaje podle struktury userData -->
            `;
          }
        }
      } catch (error) {
        console.error('Chyba při načítání dat uživatele:', error);
      }
    }
  }