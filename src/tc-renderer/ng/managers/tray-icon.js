import icon16 from '../../../assets/icon16.png';
import angular from 'angular';
import settings from '../../lib/settings';

angular.module('tc').factory('trayIcon', ($rootScope, electron) => {

  if (process.platform !== 'win32') return null;
  const Tray = electron.remote.Tray;
  const nativeImage = electron.remote.nativeImage;
  const Menu = electron.remote.Menu;
  const app = electron.remote.app;
  const ipcRenderer = electron.local.ipcRenderer;
  const browserWindow = electron.remote.BrowserWindow;
  const path = require('path');

  const tray = new Tray(nativeImage.createFromDataURL(icon16));

  tray.on('clicked', () => browserWindow.getAllWindows()[0].show());

  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Run Tc when my computer starts',
      type: 'checkbox',
      checked: settings.behavior.autoStart,
      click: function() {
        settings.behavior.autoStart = !settings.behavior.autoStart;
        setAutoStart();
        $rootScope.$apply();
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit Tc',
      click: app.exit.bind(app, 0)
    }
  ]));

  function setAutoStart() {
    const autoStart = settings.behavior.autoStart;
    const command = autoStart ? 'enable-auto-start' : 'disable-auto-start';
    ipcRenderer.send(command);
  }

  return tray;
});