const { ipcRenderer } = require("electron");


document.getElementById("minimize-btn").addEventListener("click", () => {
    ipcRenderer.send("minimize-window");
  });

  document.getElementById("close-btn").addEventListener("click", () => {
    ipcRenderer.send("close-window");
  });

  document.getElementById("maximize").addEventListener("click", () => {
    ipcRenderer.send("maximize-restore-window");
  });
  
  // Poslouchej stav z main procesu
  ipcRenderer.on("window-is-maximized", (_, isMaximized) => {
    btn.textContent = isMaximized ? "🗗" : "🗖"; // nebo změna classy
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


  //............................SMENY.....................................
  const { ipcRenderer } = require('electron');

  // DOM elementy
  const calendarEl = document.getElementById('calendar');
  const shiftFormEl = document.getElementById('shiftForm');
  const userSelectEl = document.getElementById('userId');
  const selectedUserEl = document.getElementById('selectedUser');
  const adminSectionEl = document.getElementById('adminSection');
  const userSectionEl = document.getElementById('userSection');
  const toggleModeBtnEl = document.getElementById('toggleModeBtn');
  const currentModeDisplayEl = document.getElementById('currentModeDisplay');
  const userShiftsListEl = document.getElementById('userShiftsList');
  
  // Stav aplikace
  let isAdmin = true;
  let currentUserId = '';
  let allShifts = [];
  let calendar = null;
  
  // Ukázkový seznam uživatelů (v produkční verzi by byl pravděpodobně načítán z databáze)
  const users = [
    { id: 'user1', name: 'Jan Novák' },
    { id: 'user2', name: 'Petr Svoboda' },
    { id: 'user3', name: 'Marie Dvořáková' },
    { id: 'user4', name: 'Anna Černá' }
  ];
  
  // Barvy pro různé typy směn
  const shiftColors = {
    'ranní': '#ffcc00',
    'odpolední': '#66cc99',
    'noční': '#6699cc',
    'celý den': '#ff9966'
  };
  
  // Inicializace aplikace
  document.addEventListener('DOMContentLoaded', async () => {
    // Naplnění select boxů se seznamem uživatelů
    populateUserSelects();
    
    // Inicializace kalendáře
    initializeCalendar();
    
    // Načtení směn
    await loadShifts();
    
    // Přidání event listenerů
    setupEventListeners();
  });
  
  // Populace select boxů se seznamem uživatelů
  function populateUserSelects() {
    users.forEach(user => {
      const optionForAdmin = document.createElement('option');
      optionForAdmin.value = user.id;
      optionForAdmin.textContent = user.name;
      userSelectEl.appendChild(optionForAdmin);
      
      const optionForUser = document.createElement('option');
      optionForUser.value = user.id;
      optionForUser.textContent = user.name;
      selectedUserEl.appendChild(optionForUser);
    });
  }
  
  // Inicializace FullCalendar
  function initializeCalendar() {
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      locale: 'cs',
      events: [],
      eventClick: handleEventClick
    });
    
    calendar.render();
  }
  
  // Načtení směn
  async function loadShifts() {
    try {
      const data = await ipcRenderer.invoke('get-shifts');
      allShifts = data.shifts || [];
      updateCalendarEvents();
    } catch (error) {
      console.error('Chyba při načítání směn:', error);
      showError('Nepodařilo se načíst směny. Zkuste to prosím znovu.');
    }
  }
  
  // Přidání event listenerů k prvkům
  function setupEventListeners() {
    // Formulář pro přidání směny
    shiftFormEl.addEventListener('submit', handleAddShift);
    
    // Přepínání mezi admin a uživatelským režimem
    toggleModeBtnEl.addEventListener('click', toggleUserMode);
    
    // Změna vybraného uživatele v uživatelském režimu
    selectedUserEl.addEventListener('change', handleUserChange);
  }
  
  // Zpracování kliknutí na událost v kalendáři
  function handleEventClick(info) {
    const { title, start, end, extendedProps } = info.event;
    
    let message = `Směna: ${title}\n`;
    message += `Začátek: ${formatDateTime(start)}\n`;
    
    if (end) {
      message += `Konec: ${formatDateTime(end)}\n`;
    }
    
    if (extendedProps.notes) {
      message += `Poznámky: ${extendedProps.notes}`;
    }
    
    alert(message);
  }
  
  // Přidání nové směny
  async function handleAddShift(e) {
    e.preventDefault();
    
    // Získání hodnot z formuláře
    const formData = new FormData(shiftFormEl);
    const shiftData = {
      userId: formData.get('userId'),
      title: formData.get('title'),
      shiftType: formData.get('shiftType'),
      start: formData.get('start'),
      end: formData.get('end') || null,
      notes: formData.get('notes') || ''
    };
    
    // Validace
    if (!shiftData.userId || !shiftData.title || !shiftData.start) {
      showError('Vyplňte prosím všechna povinná pole (zaměstnanec, název směny a začátek)');
      return;
    }
  
    try {
      const response = await ipcRenderer.invoke('add-shift', shiftData);
      if (response.success) {
        allShifts = response.data.shifts;
        updateCalendarEvents();
        resetForm();
        showSuccess('Směna byla úspěšně přidána');
      } else {
        showError('Chyba při přidávání směny');
      }
    } catch (error) {
      console.error('Chyba při přidávání směny:', error);
      showError('Chyba při přidávání směny');
    }
  }
  
  // Přepnutí mezi admin a uživatelským režimem
  function toggleUserMode() {
    isAdmin = !isAdmin;
    
    if (isAdmin) {
      adminSectionEl.style.display = 'block';
      userSectionEl.style.display = 'none';
      currentModeDisplayEl.textContent = 'Aktuální režim: Admin';
      currentUserId = '';
    } else {
      adminSectionEl.style.display = 'none';
      userSectionEl.style.display = 'block';
      currentModeDisplayEl.textContent = 'Aktuální režim: Uživatel';
      selectedUserEl.value = '';
      userShiftsListEl.innerHTML = '';
    }
    
    updateCalendarEvents();
  }
  
  // Změna vybraného uživatele v uživatelském režimu
  async function handleUserChange(e) {
    currentUserId = e.target.value;
    
    if (currentUserId) {
      try {
        const userShifts = await ipcRenderer.invoke('get-user-shifts', currentUserId);
        displayUserShifts(userShifts);
        updateCalendarEvents(userShifts);
      } catch (error) {
        console.error('Chyba při načítání směn uživatele:', error);
        showError('Nepodařilo se načíst směny uživatele');
      }
    } else {
      userShiftsListEl.innerHTML = '';
      updateCalendarEvents();
    }
  }
  
  // Zobrazení směn uživatele v seznamu
  function displayUserShifts(shifts) {
    userShiftsListEl.innerHTML = '';
    
    if (shifts.length === 0) {
      const noShiftsEl = document.createElement('p');
      noShiftsEl.textContent = 'Žádné směny nenalezeny';
      userShiftsListEl.appendChild(noShiftsEl);
      return;
    }
    
    shifts.forEach(shift => {
      const shiftItemEl = document.createElement('div');
      shiftItemEl.className = `shift-item shift-${shift.shiftType}`;
      
      const titleEl = document.createElement('div');
      titleEl.className = 'shift-title';
      titleEl.textContent = shift.title;
      
      const timeEl = document.createElement('div');
      timeEl.className = 'shift-time';
      timeEl.textContent = `${formatDateTime(new Date(shift.start))} - ${shift.end ? formatDateTime(new Date(shift.end)) : 'Neurčeno'}`;
      
      shiftItemEl.appendChild(titleEl);
      shiftItemEl.appendChild(timeEl);
      
      if (shift.notes) {
        const notesEl = document.createElement('div');
        notesEl.className = 'shift-notes';
        notesEl.textContent = shift.notes;
        shiftItemEl.appendChild(notesEl);
      }
      
      userShiftsListEl.appendChild(shiftItemEl);
    });
  }
  
  // Aktualizace událostí v kalendáři
  function updateCalendarEvents(shiftsToDisplay = null) {
    // Odstranění všech stávajících událostí
    calendar.removeAllEvents();
    
    // Určení směn, které se mají zobrazit
    let shiftsForCalendar;
    if (shiftsToDisplay) {
      shiftsForCalendar = shiftsToDisplay;
    } else if (!isAdmin && currentUserId) {
      shiftsForCalendar = allShifts.filter(shift => shift.userId === currentUserId);
    } else {
      shiftsForCalendar = allShifts;
    }
    
    // Přidání událostí do kalendáře
    const events = shiftsForCalendar.map(shift => {
      const userName = getUserNameById(shift.userId);
      return {
        id: shift.id,
        title: isAdmin ? `${shift.title} (${userName})` : shift.title,
        start: shift.start,
        end: shift.end,
        backgroundColor: shiftColors[shift.shiftType] || '#999',
        borderColor: shiftColors[shift.shiftType] || '#999',
        extendedProps: {
          userId: shift.userId,
          shiftType: shift.shiftType,
          notes: shift.notes
        }
      };
    });
    
    calendar.addEventSource(events);
  }
  
  // Resetování formuláře pro přidání směny
  function resetForm() {
    shiftFormEl.reset();
  }
  
  // Pomocné funkce
  function getUserNameById(userId) {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Neznámý uživatel';
  }
  
  function formatDateTime(date) {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    
    return date.toLocaleString('cs-CZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  function showError(message) {
    alert(`Chyba: ${message}`);
  }
  
  function showSuccess(message) {
    alert(`Úspěch: ${message}`);
  }



/*----------------------------chat----------------------------------------*//*
let currentChat = '';

// Přihlášení uživatele
window.chat.register('adam');  // Nastavte automatické jméno pro testování
window.chat.getChats((chats) => {
  updateChatList(chats);
});

// Odesílání zpráv
function sendMessage() {
  const message = document.getElementById('message').value;
  if (currentChat && message) {
    window.chat.sendPrivate(currentChat, message);
    appendMessage(`Já -> ${currentChat}: ${message}`);
    document.getElementById('message').value = '';
  }
}

// Přidání zprávy do seznamu
function appendMessage(msg) {
  const li = document.createElement('li');
  li.textContent = msg;
  document.getElementById('messages').appendChild(li);
}

// Aktualizace seznamu chatů
function updateChatList(chats) {
  const chatList = document.getElementById('chatList');
  chatList.innerHTML = '';
  chats.forEach(chat => {
    const li = document.createElement('li');
    li.textContent = chat;
    li.onclick = () => openChat(chat);
    chatList.appendChild(li);
  });
}

// Otevření chatu
function openChat(chat) {
  currentChat = chat;
  document.getElementById('messages').innerHTML = '';
  appendMessage(`Začínáme chat s: ${chat}`);
  window.chat.onPrivate((msg) => {
    if (msg.from === chat || msg.to === chat) {
      appendMessage(`${msg.from}: ${msg.message}`);
    }
  });
}*/