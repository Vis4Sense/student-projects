import { 
    Widget, 
    SplitPanel 
} from '@lumino/widgets';

import { IStateDB } from '@jupyterlab/statedb';

import { 
    NotebookPanel, 
    //NotebookTracker 
} from '@jupyterlab/notebook';


import '../style/index.css';
import './notes_area';
import './popup';
import { NotesArea } from './notes_area';
import { JupyterFrontEnd } from '@jupyterlab/application';


export class ModelComponent extends SplitPanel
{
    // get user notebook panel
    currentPanel : NotebookPanel;

    // widgets cannot add inside components, should use Panel objects
    // constructor for model component, we have a jupyterlab current panel parameter,
    // which can extract information from it.
    constructor(app: JupyterFrontEnd, state: IStateDB, panel:NotebookPanel)
    {
        // basic settings
        super();
        this.addClass('jp-model-component');

        // tracker for cell
        //const tracker: IWidgetTracker<Cell> = new WidgetTracker<Cell>({ namespace: 'selected-cell' });
        //const notebookTracker = new NotebookTracker({namespace:'notebook'});
        this.currentPanel = panel;
        if (app.shell.currentWidget instanceof NotebookPanel)
        {
            this.currentPanel = app.shell.currentWidget;
            console.log("adding...");
        }
        console.log(this.currentPanel);

        // attached widgets
        // structure framework
        this.orientation = 'horizontal';
        // name text area
        const nameArea = new Widget();
        nameArea.addClass('jp-textarea');
        const nameContent = document.createElement('textarea');
        nameContent.value = 'component name';
        nameContent.placeholder = 'enter component here'; 
        nameArea.node.appendChild(nameContent);

        // better to capsule components into one Widget, 
        // then we can manipulate spacing
        // an area for buttons
        const buttonArea = new Widget();
        buttonArea.addClass('jp-component-button-area');

        // button for set code location
        const button1 = document.createElement('button');
        button1.textContent = "set";
        button1.classList.add("jp-component-button");
        button1.onclick = () => {
            setCodeLocation();
        }
        buttonArea.node.appendChild(button1);

        // button for making notes
        const button2 = document.createElement('button');
        button2.textContent = "note";
        button2.classList.add("jp-component-button");
        button2.onclick = () => {
            addNotes();
        }
        buttonArea.node.appendChild(button2);

        // button for goto code location
        const button3 = document.createElement('button');
        button3.textContent = "goto";
        button3.classList.add("jp-component-button");
        button3.onclick = () => {
            navigateCode();
        }
        buttonArea.node.appendChild(button3);

        // construct reaction functions for the buttons
        // set code location function, user can set relevant code for this component
        // if there exist a markdown as name, set to the markdown as default  
        const setCodeLocation = () => {
            console.log("code location");
            // user's mouse select code snippets
            saveSelectedCell();
        }

        // add notes function, user can add notes to the panel popped here
        const addNotes = () => {
            console.log("Notes added");
            // add a note panel for taking notes
            // a popup window for notes
            const notes = new NotesArea();
            document.body.appendChild(notes.node);

        }

        // navigate to the set code location before (cell)
        const navigateCode = () => {
            restoreSelectedCell();
        }

        // listener for code cell change in notebook panel
        // and 
        const saveSelectedCell = async () => {
            console.log("saving...");
            const current = this.currentPanel.content.selectedCells[0];
            console.log(current);
            if (current) 
            {
                await state.save('selectedCellIndex', current.model.id);
                console.log("saved");
                alert("selected code cell saved");
            }
            else
            {
                alert("focus on an ipynb file first!");
            }
          };
      
        // locate the notebook to selected cell
        const restoreSelectedCell = async () => {
            console.log("loading...");
            const currentId = await state.fetch('selectedCellIndex');
            
            // find the corresponding cell in notebook
            if (typeof currentId === 'string')
            {
                let foundCell = this.currentPanel.content._findCellById(currentId);
                if (foundCell)
                {
                    this.currentPanel.content.scrollToCell(foundCell?.cell, 'auto'); 
                }  
            }
            else
            {
                console.log('error: id must be type string');
            }
            
            console.log("loaded");
        };
        
      

        // add sub-components into widget
        this.addWidget(nameArea);
        this.addWidget(buttonArea);
    }
    
}