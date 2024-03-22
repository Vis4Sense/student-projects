import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  ICommandPalette, 
  //MainAreaWidget,
  //ToolbarButton,
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
    const center_panel = new SplitPanel();

    console.log('JupyterLab extension myextension is activated!');
    console.log("ICommandPalette: ", palette);

    // Define a widget creator function,
    // then call it to make a new widget
    const newWidget = (center_panel:SplitPanel) => {
      // Create a blank content widget inside of a MainAreaWidget
      //const content = new Widget();
      //const widget = new MainAreaWidget({ content });
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
      // const add_button = new ToolbarButton({
      //   label: 'add',
      //   onClick: () => {
      //     let component = new ModelComponent(app, state, panel, center_panel, "");
      //     center_panel.addWidget(component);
      //     // obtain current number of widgets
      //     const childrenCount = center_panel.widgets.length;
      //     // modify widgets size to equal
      //     const relativeSizes = Array.from({ length: childrenCount }, () => 1 / childrenCount);
      //     center_panel.setRelativeSizes(relativeSizes);
      //   }
      // })
      //tools.addItem('add', add_button);

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

    // a string list for headers of markdown cells
    let headerList : string[] = [];

    // Add an application command
    const command: string = 'window:open';
    app.commands.addCommand(command, {
      label: 'ML Helper Panel',
      execute: () => {
        // Regenerate the widget if disposed
        if (widget.isDisposed) {
          widget = newWidget(center_panel);
        }
        if (!widget.isAttached) {
          // Attach the widget to the main work area if it's not there
          const currentPanel = app.shell.currentWidget;
          console.log("current panel: ", currentPanel);
          // console.log("current panel: ", currentPanel);
          if (currentPanel instanceof NotebookPanel)
          {
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
                
                // empty headings for next cell
                //headerList = [];
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
                currentDepth--;
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
            console.log("roots: ", roots);
            roots.forEach(root => {
              center_panel.addWidget(root);
              root.showAllSubComponents(center_panel, root);
            })

            widget.addWidget(center_panel);
          }
          else
          {
            widget.addWidget(center_panel);
            alert("focus on notebook first");
          }
          app.shell.add(widget, 'left');
        }
        // Activate the widget
        app.shell.activateById(widget.id);
      }
    }); 

    // function to make root for heading hierarchy
    // read the number of prefix in string
    const readPrefix = (heading:string):number =>
    {
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

    const reducePrefix = (heading:string):string =>
    {
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

// TODO： user change file -> extension change
// headings -> text, hover -> dropdown functions
// all changes should be done in notebook
