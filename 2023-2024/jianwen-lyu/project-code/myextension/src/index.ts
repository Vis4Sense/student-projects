import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  ICommandPalette, 
  //MainAreaWidget,
  ToolbarButton,
  Toolbar
} from '@jupyterlab/apputils'

import { 
  NotebookPanel
} from '@jupyterlab/notebook';

//import { DocumentRegistry } from '@jupyterlab/docregistry';

import { SplitPanel } from '@lumino/widgets';

import { IStateDB } from '@jupyterlab/statedb';


import '../style/index.css' 
import { ExtensionButton } from './extension_button'
import { ModelComponent } from './model_component'; 
import { NotesContainer } from './notes_container';


/**
 * Initialization data for the myextension extension.
 * this is a jupyter-plugin object constant
 */
const plugin: JupyterFrontEndPlugin<void> = {
  // basic attributes
  id: 'myextension:plugin',
  description: 'A JupyterLab extension for ML Assistant.',
  autoStart: true,
  requires: [ICommandPalette, IStateDB],

  // operation to start this plugin
  activate: (app: JupyterFrontEnd, palette: ICommandPalette, state:IStateDB, panel:NotebookPanel) => {
    console.log('JupyterLab extension myextension is activated!');
    console.log("ICommandPalette: ", palette);

    // Define a widget creator function,
    // then call it to make a new widget
    const newWidget = () => {
      // Create a blank content widget inside of a MainAreaWidget
      //const content = new Widget();
      //const widget = new MainAreaWidget({ content });
      const widget = new SplitPanel();
      widget.orientation = 'vertical';

      // create a toolbar on the top of view
      const tools = new Toolbar();
      tools.addClass('jp-toolbar');

      // panel for containing ML components
      const center_panel = new SplitPanel();
      center_panel.orientation = 'vertical';
      center_panel.addClass('jp-center-panel');

      // panel for containing notes (popup contents by buttons)
      const notes_container = new NotesContainer();
      notes_container.addClass('jp-center-panel');

      // create toolbar buttons for functions
      const add_button = new ToolbarButton({
        label: 'add',
        onClick: () => {
          let component = new ModelComponent(app, state, panel);
          center_panel.addWidget(component);
          console.log(component);
        }
      })
      tools.addItem('add', add_button);

      // add widgets to the left panel
      //content.node.appendChild(add_button.node);
      //content.node.appendChild(center_panel.node);
      widget.addWidget(tools);
      widget.addWidget(center_panel);

      // define the basic information about this widget
      widget.id = 'mlhelp-jupyterlab';
      widget.title.label = 'ML Helper';
      widget.title.closable = true;
      return widget;
    }

    // create the new widget
    let widget = newWidget();
    console.log("widget created: ", widget);

    // Add an application command
    const command: string = 'window:open';
    app.commands.addCommand(command, {
      label: 'ML Helper Panel',
      execute: () => {
        // Regenerate the widget if disposed
        if (widget.isDisposed) {
          widget = newWidget();
        }
        if (!widget.isAttached) {
          // Attach the widget to the main work area if it's not there
          app.shell.add(widget, 'left');
        }
        // Activate the widget
        app.shell.activateById(widget.id);
      }
    });
    
    // add the helper to command palette, as another way
    palette.addItem({ command, category: 'Tutorial' });

    // add a button for starting extension button
    let buttonExtension = new ExtensionButton(app);
    app.docRegistry.addWidgetExtension('Notebook', buttonExtension);
  }
};

export default plugin;
