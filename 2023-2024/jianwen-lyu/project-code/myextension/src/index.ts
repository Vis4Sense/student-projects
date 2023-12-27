import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {ButtonExtension} from "./button";

/**
 * Initialization data for the myextension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'myextension:plugin',
  description: 'A JupyterLab extension.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension myextension is activated!');

    let buttonExtension = new ButtonExtension();
    app.docRegistry.addWidgetExtension('Notebook', buttonExtension);
  }
};

export default plugin;
