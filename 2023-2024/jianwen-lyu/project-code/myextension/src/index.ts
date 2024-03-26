import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
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
import {MarkdownCell} from '@jupyterlab/cells'
//import { DocumentRegistry } from '@jupyterlab/docregistry';
import { SplitPanel } from '@lumino/widgets';
import { IStateDB } from '@jupyterlab/statedb';


import '../style/index.css' 
import { ExtensionButton } from './extension_button'
import { ModelComponent } from './model_component'; 
import { NotesContainer } from './notes_container';
//import { Collapsible } from './collapsible_component';


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
    // panel for model components
    let center_panel = new SplitPanel();
    const components:ModelComponent[] = [];

    console.log('JupyterLab extension myextension is activated!');
    console.log("ICommandPalette: ", palette);

    // Define a widget creator function,
    // then call it to make a new widget
    const newWidget = (center_panel:SplitPanel) => {
      // Create a blank content widget 
      const widget = new SplitPanel();
      widget.orientation = 'vertical';

      // create a toolbar on the top of view
      const tools = new Toolbar();
      tools.addClass('jp-toolbar');

      // panel for containing ML components
      center_panel.orientation = 'vertical';
      center_panel.addClass('jp-center-panel');

      // panel for containing notes (popup contents by buttons)
      const notes_container = new NotesContainer();
      notes_container.addClass('jp-center-panel');

      // create toolbar buttons for functions
      const close_button = new ToolbarButton({
        label: 'close',
        onClick: () => {
          widget.dispose();
        }
      });
      tools.addItem('close', close_button);

      const refresh_button = new ToolbarButton({
        label:'refresh',
        onClick: () => {
          components.forEach(component => {
            component.dispose();
          });

          const currentPanel = app.shell.currentWidget;
          if (currentPanel instanceof NotebookPanel)
          {
            let tempc = makeHierarchy(currentPanel);
            tempc.forEach(c => {
              components.push(c);
            })
          }
          else 
          {
            alert("focus on a notebook first!");
          }
        }
      });
      tools.addItem('refresh', refresh_button);

      const collapse_button = new ToolbarButton({
        label:'collapse all',
        onClick: () => {
          center_panel.widgets.forEach(component => {
            if (component instanceof ModelComponent)
            {
              component.hideSubComponents(component);
            }
          })
        }
      });
      tools.addItem('collapse all', collapse_button);

      // add widgets to the left panel
      //content.node.appendChild(add_button.node);
      //content.node.appendChild(center_panel.node);
      widget.addWidget(tools);

      // define the basic information about this widget
      widget.id = 'mlhelp-jupyterlab';
      widget.title.label = 'ML Helper';
      widget.title.closable = true;
      return widget;
    }

    // create the new widget
    let widget = newWidget(center_panel);
    console.log("widget created: ", widget);

    // Add an application command
    const command: string = 'window:open';
    app.commands.addCommand(command, {
      label: 'ML Helper Panel',
      execute: () => {
        // get the current notebook panel
        const currentPanel = app.shell.currentWidget;

        // Regenerate the widget if disposed
        console.log("isDisposed: ", widget.isDisposed);
        console.log("isAttached: ", widget.isAttached);
        if (widget.isDisposed) {
          center_panel = new SplitPanel();
          widget = newWidget(center_panel);
        }
        if (!widget.isAttached) {
          // Attach the widget to the main work area if it's not there
          console.log("current panel: ", currentPanel);
          // console.log("current panel: ", currentPanel);
          if (currentPanel instanceof NotebookPanel)
          {
            let tempc = makeHierarchy(currentPanel);
            tempc.forEach(comp => {
              components.push(comp);
            })
            console.log("components", center_panel.widgets);
          }
          else
          {
            widget.addWidget(center_panel);
            alert("focus on a notebook first");
          }
          app.shell.add(widget, 'left');
        }
        // Activate the widget
        app.shell.activateById(widget.id);
      }
    }); 

    // function to make root for heading hierarchy
    // read the number of prefix in string
    const readPrefix = (heading:string):number => {
      let length = heading.length;
      let counter = 0;
      for (let i = 0; i < length; i++)
      {
        if (heading[i] == '#')
        {
          counter++;
        }
        if (heading[i] != '#')
        {
          break;
        }
      }
      //console.log("counter: ", counter);
      return counter;
    }

    // make hierarchy for the center panel
    const makeHierarchy = (currentPanel:NotebookPanel) : ModelComponent[] => {
      // a string list for headers of markdown cells
      let headerList : string[] = [];

      currentPanel.content.widgets.forEach(cell => {
        if (cell instanceof MarkdownCell)
        {
          // let depth = cell.headingInfo.level;
          // console.log("level depth: ", depth);
          cell.headings.forEach(pheading => {
            // const userComponent = new ModelComponent(app, state, panel, pheading.text);
            // center_panel.addWidget(userComponent);
            let prefix = "";
            for (let i = 0; i < pheading.level; i++)
            {
              prefix += "#";
            }
            headerList.push(prefix + pheading.text);
            // get a string list using headers, add prefix
            // what we want is the text, not headings themselves
          });
        }
      })

      // making hierarchy for markdown titles
      let currentIndex = 0;
      let currentDepth = 0;
      let rootIndex = 0;
      const roots:ModelComponent[] = [];
      const headings:ModelComponent[] = [];
      headerList.forEach(header => {
        const component = new ModelComponent(app, state, panel, center_panel, reducePrefix(header));
        console.log("component titles: ", component.componentTitle);
        headings.push(component);
      })

      while (currentIndex < headerList.length)
      {
        if (currentIndex == 0)
        {
          headings[currentIndex].setDepth(currentDepth);
          roots.push(headings[currentIndex]);
          console.log("build root at index 0");
          currentIndex++;
          currentDepth++; 
        }
        else if (readPrefix(headerList[currentIndex]) > readPrefix(headerList[rootIndex]))
        {
          if (currentDepth == 0) currentDepth++;
          console.log(currentDepth); 
          headings[currentIndex].setDepth(currentDepth);
          headings[rootIndex].addSubComponent(headings[currentIndex]);
          console.log(currentIndex, " is the child of ", rootIndex);
          rootIndex = currentIndex;
          currentIndex++;
          currentDepth++;
        }
        else if (readPrefix(headerList[currentIndex]) <= readPrefix(headerList[rootIndex]))
        {
          console.log("go back...");
          rootIndex--;
          if (currentDepth > 0) currentDepth--;
          if (rootIndex == -1)
          {
            console.log(currentIndex, "is another root");
            headings[currentIndex].setDepth(0);
            roots.push(headings[currentIndex]);
            rootIndex = currentIndex;
            currentIndex++;
            currentDepth = 0;
          }
        }
      }

      // add all roots into extension main panel
      roots.forEach(root => {
        center_panel.addWidget(root);
        root.showAllSubComponents(center_panel, root);
      })

      widget.addWidget(center_panel);
      return headings;
    }

    const reducePrefix = (heading:string):string => {
      let newHeading:string = "";
      let nprefix = readPrefix(heading);

      for (let i = nprefix; i < heading.length; i++)
      {
        newHeading += heading[i];
      }
      return newHeading;
    }

    // add the helper to command palette, as another way
    palette.addItem({ command, category: 'Tutorial' });

    // add a button for starting extension button
    let buttonExtension = new ExtensionButton(app);
    app.docRegistry.addWidgetExtension('Notebook', buttonExtension);

  }
};

export default plugin;

// TODO: notes on same panel with components: individual page or combined?