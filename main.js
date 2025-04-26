const { MongoClient, ServerApiVersion } = require('mongodb');
const { app, BrowserWindow, ipcMain, Menu, globalShortcut} = require('electron');
const path = require('path');
const uri = "mongodb+srv://patrikvaleska:Ahojky123@patko.flhk1.mongodb.net/?retryWrites=true&w=majority&appName=patko";
const axios = require('axios');
const API_URL = 'http://localhost:5000';


ipcMain.handle('login', async (event, credentials) => {
  console.log('Login handler volán s:', credentials);
  
  try {
      // Zkontrolujte, zda API_URL je nastavený
      console.log("API URL:", API_URL);
      
      const response = await
       axios.post(`${API_URL}/api/login`, credentials);
      console.log('Odpověď od serveru:', response.data);

      // Check if response.data has the expected structure
      if (!response.data || !response.data.login) {
          console.error('Neplatná odpověď od serveru:', response.data);
          return { 
              success: false, 
              message: 'Neplatná odpověď od serveru'
          };
      }

      return { 
          success: true, 
          message: response.data.message
      };
  } catch (error) {
      // Podrobnější logování chyby
      console.error('Chyba při přihlašování:', error);
      console.error('Detail chyby:', error.message);
      
      if (error.response) {
          // Chyba z API - máme odpověď
          console.error('Status:', error.response.status);
          console.error('Data:', error.response.data);
          return { 
              success: false, 
              message: error.response.data.message || 'Neplatné přihlašovací údaje'
          };
      } else if (error.request) {
          // Žádost byla odeslána, ale nedostali jsme odpověď
          console.error('Žádná odpověď od serveru');
          return { 
              success: false, 
              message: 'Server není dostupný'
          };
      } else {
          // Chyba při přípravě žádosti
          return { 
              success: false, 
              message: 'Chyba při přihlašování: ' + error.message
          };
      }
  }
});

ipcMain.handle('test', () => {
  console.log("Test handler volán");
  return "Test úspěšný";
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 1444,     // Nejmenší šířka okna
    minHeight: 800,     // Nejmenší výška okna
    resizable: true,    // Můžeš změnit velikost, ale ne pod minimum
    movable: true,  
    frame: true,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  win.webContents.openDevTools()
  win.loadFile(path.join(__dirname, 'pages', 'login.html'));

  globalShortcut.register('F12', () => {
    win.webContents.toggleDevTools();
  });

  Menu.setApplicationMenu(null); 



  ipcMain.on("minimize-window", () => {
    const win = BrowserWindow.getAllWindows()[0]; // Získání hlavního okna
    if (win) win.minimize();
  });

  ipcMain.on("close-window", () => {
      const win = BrowserWindow.getAllWindows()[0];
      if (win) win.close();
  });

  
}


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


app.on('ready', createWindow);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server    (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("ahojky").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);


i18next.use(Backend).init({
  backend: {
    loadPath: `${__dirname}/locales/{{lng}}/translation.json`,
  },
  lng: store.get('language') || 'en', // výchozí jazyk
  fallbackLng: 'en',
});

ipcMain.handle('get-translation', (event, key) => {
  return i18next.t(key);
});

ipcMain.handle('set-language', (event, lang) => {
  store.set('language', lang);
  i18next.changeLanguage(lang);
});

//...............................SMENY..............................................
function loadShifts() {
  try {
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8');
      return JSON.parse(data);
    }
    return { users: {}, shifts: [] };
  } catch (error) {
    console.error('Chyba při načítání směn:', error);
    return { users: {}, shifts: [] };
  }
}

// Uložení směn do souboru
function saveShifts(data) {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Chyba při ukládání směn:', error);
    return false;
  }
}

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC komunikace mezi hlavním procesem a renderer procesem
ipcMain.handle('get-shifts', async () => {
  return loadShifts();
});

ipcMain.handle('add-shift', async (event, shift) => {
  const data = loadShifts();
  const newShift = {
    id: Date.now().toString(),
    ...shift
  };
  
  data.shifts.push(newShift);
  
  // Přidání směny konkrétnímu uživateli
  if (!data.users[shift.userId]) {
    data.users[shift.userId] = [];
  }
  data.users[shift.userId].push(newShift.id);
  
  const success = saveShifts(data);
  return { success, data };
});

ipcMain.handle('get-user-shifts', async (event, userId) => {
  const data = loadShifts();
  const userShifts = [];
  
  if (data.users[userId] && data.users[userId].length > 0) {
    data.users[userId].forEach(shiftId => {
      const shift = data.shifts.find(s => s.id === shiftId);
      if (shift) userShifts.push(shift);
    });
  }
  
  return userShifts;
});