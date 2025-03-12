const { ipcRenderer } = require('electron');

document.getElementById('minimize').addEventListener('click', () => {
    ipcRenderer.send('minimize-window');
});

document.getElementById('maximize').addEventListener('click', () => {
    ipcRenderer.send('maximize-window');
});

document.getElementById('close').addEventListener('click', () => {
    ipcRenderer.send('close-window');
});