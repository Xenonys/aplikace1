const { ipcRenderer } = require('electron');

async function loadTranslations() {
  document.getElementById('settingsTitle').innerText = await ipcRenderer.invoke('get-translation', 'settings');
  document.getElementById('languageLabel').innerText = await ipcRenderer.invoke('get-translation', 'language');
  document.getElementById('saveButton').innerText = await ipcRenderer.invoke('get-translation', 'save');
}

document.getElementById('saveButton').addEventListener('click', async () => {
  const selectedLanguage = document.getElementById('languageSelect').value;
  await ipcRenderer.invoke('set-language', selectedLanguage);
  await loadTranslations(); // reload translate
});

// load při startu
loadTranslations();