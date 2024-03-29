import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';
import {
  ICommandPalette, 
  //MainAreaWidget,
  ToolbarButton,
  Toolbar,
  InputDialog
} from '@jupyterlab/apputils'
import { 
  NotebookPanel,
  INotebookTracker
} from '@jupyterlab/notebook';
import {MarkdownCell} from '@jupyterlab/cells'
import { Panel } from '@lumino/widgets';
import { IStateDB } from '@jupyterlab/statedb';


import '../style/index.css' 
import { ExtensionButton } from './extension_button'
import { ModelComponent } from './model_component'; 
import { NotesContainer } from './notes_container';
import { NotesArea } from './notes_area';


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
  activate: (app: JupyterFrontEnd, palette: ICommandPalette, state:IStateDB, panel:NotebookPanel, tracker:INotebookTracker) => {
    const { commands } = app;
    
    // panel for model components
    let center_panel = new Panel();
    center_panel.addClass('jp-center-panel');
    let components:ModelComponent[] = [];
    // for storing new code compoents
    let code_components:string[][] = [];

    console.log('JupyterLab extension myextension is activated!');
    console.log("ICommandPalette: ", palette);

    // Define a widget creator function,
    // then call it to make a new widget
    const newWidget = (center_panel:Panel) => {
      // Create a blank content widget 
      const widget = new Panel();

      // create a toolbar on the top of view
      const tools = new Toolbar();
      tools.addClass('jp-toolbar');

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
          // destroy all components
          components.forEach(component => {
            component.dispose();
          });
          // TODO: destroy notes and save
          center_panel.widgets.forEach(c => {
            if (c instanceof NotesArea)
            {
              c.close();
              c.dispose();
            }
          });

          const currentPanel = app.shell.currentWidget;
          if (currentPanel instanceof NotebookPanel)
          {
            // markdown widgets
            let tempc = makeHierarchy(currentPanel);
            tempc.forEach(c => {
              components.push(c);
            })
            //code widgets
            loadCodeComponent(app, state, center_panel);
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

    // Add an application command
    const command:string = 'window:open';
    app.commands.addCommand(command, {
      label: 'ML Helper Panel',
      execute: () => {
        // get the current notebook panel
        const currentPanel = app.shell.currentWidget;

        // Regenerate the widget if disposed
        if (widget.isDisposed) {
          center_panel = new Panel();
          center_panel.addClass('jp-center-panel');
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
            loadCodeComponent(app, state, center_panel);
          }
          else
          {
            widget.addWidget(center_panel);
            alert("focus on a notebook first");
          }
          //widget.addWidget(notes);
          app.shell.add(widget, 'left');
        }
        // Activate the widget
        app.shell.activateById(widget.id);
      }
    });

    // commands integrated on code cell
    const code_command:string = 'toolbar-button:code-label';
    commands.addCommand(code_command, {
      label: 'Add Code Component (Extension)',
      execute: () => {
        getText(); 
      },  
    });
    const getText = async () => {
      const result = await InputDialog.getText({
        title: 'name the compoennt',
        okLabel: 'OK',
        cancelLabel: 'cancel'
      })
      if (result.button.accept)
      {
        const currentPanel = app.shell.currentWidget;
        if (currentPanel instanceof NotebookPanel)
        {
          let cell = currentPanel.content.selectedCells[0];
          if (cell)
          {
            let userText = result.value;
            if (userText)
            {
              // attach widget
              const codect = new ModelComponent(app, state, panel, center_panel, userText, cell, true);
              codect.componentID = codect.componentTitle + center_panel.widgets.indexOf(codect) + currentPanel.context.path;
              components.push(codect);
              center_panel?.addWidget(codect);

              // save code data to localStorage
              let codeCellId = cell.model.id;
              code_components.push([codect.componentID, codect.componentTitle, codeCellId]);
              saveCodeComponent(code_components);
            }
          }
          else
          {
            alert('select a cell first');
          }
        }
      }
    }
    app.contextMenu.addItem({
      command: code_command,
      selector: '.jp-Notebook .jp-Cell',
      rank: 100
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

    // store the code component data into localStorage
    const saveCodeComponent = (list:string[][]) => {
      let fileStr = "";
      const np = app.shell.currentWidget;
      if (np instanceof NotebookPanel)
      {
        fileStr = np.context.path;
      }
      else
      {
        fileStr = "notfound";
      }
      const jsonString = JSON.stringify(list);
      localStorage.setItem('code' + fileStr, jsonString);
    }

    // load component data of all code components stored
    const loadCodeComponent = (app:JupyterFrontEnd, state:IStateDB, container:Panel) => {
      // find current notebook
      const panel = app.shell.currentWidget;
      let fileStr = "";
      const np = app.shell.currentWidget;
      if (np instanceof NotebookPanel)
      {
        fileStr = np.context.path;
      }
      else
      {
        fileStr = "notfound";
      }

      const codeComponentData = localStorage.getItem('code' + fileStr);
      if (codeComponentData) 
      {
        const codeComponentList = JSON.parse(codeComponentData);
        for (let i = 0; i < codeComponentList?.length; i++)
        {
          const c_component = codeComponentList[i];
          let title = c_component[1];
          let id = c_component[2];

          // find cell and build component 
          if (panel instanceof NotebookPanel)
          {
            const cell = panel.content._findCellById(id);
            if (cell)
            {  
              const codect = new ModelComponent(app, state, panel, container, title, cell.cell, true);
              codect.componentID = codect.componentTitle + center_panel.widgets.indexOf(codect) + panel.context.path;
              components.push(codect);
              container.addWidget(codect);
            }
          }
        }
      }
    }

    const dePrefix = (title:string) : string => {
      let newstr = title.replace(/^(#+\s*)/, '');
      console.log("deprefixed: ", newstr);
      return newstr;
    }

    // make hierarchy for the center panel
    const makeHierarchy = (currentPanel:NotebookPanel) : ModelComponent[] => {
      // a string list for headers of markdown cells
      let headerList : string[] = [];
      const headings:ModelComponent[] = [];

      currentPanel.content.widgets.forEach(cell => {
        if (cell instanceof MarkdownCell)
        {
          // cell.headings.forEach(pheading => {
          //   let prefix = "";
          //   for (let i = 0; i < pheading.level; i++)
          //   {
          //     prefix += "#";
          //   }
          //   // get a string list using headers, add prefix
          //   // what we want is the text, not headings themselves
          //   headerList.push(prefix + pheading.text);
          //   const component = new ModelComponent(app, state, panel, center_panel, pheading.text, cell, false);
          //   component.saveCellData(cell);
          //   console.log("component titles: ", component.componentTitle);
          //   headings.push(component);         

            // new approach
            let cellText = cell.model.toJSON().source.toString();
            let cellLines = cellText.split('\n');

            cellLines.forEach(line => {
              const titlePattern = /^(#{1,6})\s+(.*)$/gm;
              const titleMatch = line.match(titlePattern)
              if (titleMatch) {
                headerList.push(line);
                //console.log("line content: ", line);
                const component = new ModelComponent(app, state, panel, center_panel, dePrefix(line), cell, false);
                component.saveCellData(cell);
                //console.log("component titles: ", component.componentTitle);
                headings.push(component);        
              }
              const boldPattern = /^\*\*(.+?)\*\*$|^__(.+?)__$/;
              const boldMatch = line.match(boldPattern);
              if (boldMatch) {
                const boldText = boldMatch[1] || boldMatch[2];
                headerList.push('##########' + boldText);
                const component = new ModelComponent(app, state, panel, center_panel, boldText, cell, false);
                component.saveCellData(cell);
                //console.log("component titles: ", component.componentTitle);
                headings.push(component);        
              }
            })

          //});
        }
      })

      // making hierarchy for markdown titles
      let currentIndex = 0;
      let currentDepth = 0;
      let rootIndex = 0;
      const roots:ModelComponent[] = [];

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
      });

      headings.forEach(component => {
        let fileStr = "";
        const np = app.shell.currentWidget;
        if (np instanceof NotebookPanel)
        {
          fileStr = np.context.path;
        }
        else
        {
          fileStr = "notfound";
        }
        component.componentID = component.componentTitle + center_panel.widgets.indexOf(component) + fileStr;
        console.log('cid: ', component.componentID);
      })

      widget.addWidget(center_panel);
      return headings;
    }

    // add the helper to command palette, as another way
    palette.addItem({ command, category: 'Tutorial' });

    // add a button for starting extension button
    let buttonExtension = new ExtensionButton(app);
    app.docRegistry.addWidgetExtension('Notebook', buttonExtension);

  }
};

export default plugin;

// TODO: save user-built code cells , by (title, cell.model.id) in localStorage, so cannot dispose after refresh or close