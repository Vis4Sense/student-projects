import { 
    Widget, 
    SplitPanel 
} from '@lumino/widgets';
import { IStateDB } from '@jupyterlab/statedb';
import { 
    NotebookPanel, 
    //NotebookTracker 
} from '@jupyterlab/notebook';
import { JupyterFrontEnd } from '@jupyterlab/application';


import '../style/model_component.css';
import './notes_area';
import './popup';
import { NotesArea } from './notes_area';


// when hovering: show options 1.add sub-component, 2.set location 3.add notes 4.goto location. 
export class ModelComponent extends SplitPanel
{
    // get user notebook panel
    currentPanel : NotebookPanel;
    componentTitle: string = "";
    // list of direct children
    childList : ModelComponent[] = [];
    // whether its expanded or hidden
    isExpanded : boolean = false;
    // depth as sub component
    depth:number = 0;

    // widgets cannot add inside components, should use Panel objects
    // constructor for model component, we have a jupyterlab current panel parameter,
    // which can extract information from it.
    constructor(app: JupyterFrontEnd, state: IStateDB, panel:NotebookPanel, container:SplitPanel, title:string)
    {
        // TODO: make model components able to collapse (extend sub-titles) 
        // basic settings
        super();
        this.addClass('jp-model-component');
        if (title != "")
        {
            this.componentTitle = title;
        }
        else
        {
            this.componentTitle = "model component";
        }

        // tracker for cell
        //const tracker: IWidgetTracker<Cell> = new WidgetTracker<Cell>({ namespace: 'selected-cell' });
        //const notebookTracker = new NotebookTracker({namespace:'notebook'});
        this.currentPanel = panel;
        if (app.shell.currentWidget instanceof NotebookPanel)
        {
            this.currentPanel = app.shell.currentWidget;
        }

        // attached widgets
        // structure framework
        this.orientation = 'horizontal';
        // name text area
        const nameArea = new Widget();
        nameArea.addClass('jp-textarea');
        const nameContent = document.createElement('input');
        nameContent.value = this.componentTitle;
        nameContent.placeholder = this.componentTitle; 
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

        // button for show child components
        this.isExpanded = false; 
        const button4 = document.createElement('button');
        button4.textContent = "expand";
        button4.classList.add("jp-component-button");
        button4.onclick = () => {
            if (this.isExpanded == false)
            {
                this.showSubComponents(container);
                this.isExpanded = true;
            }
            else if (this.isExpanded == true)
            {
                this.hideSubComponents(this);
                this.isExpanded = false;
            }

        }
        buttonArea.node.appendChild(button4);

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

        // auto modify size
        // this.fit();
    } 

    public addSubComponent(subComponent:ModelComponent) {
        this.childList.push(subComponent);
    }

    // show sub components of this component
    public showSubComponents(centerPanel:SplitPanel) {
        let index = centerPanel.widgets.indexOf(this);
        console.log(this.childList);
        console.log("index of root: ", index);

        // show direct sub components
        for (let i = 0; i < this.childList.length; i++)
        {
            let margin = 5 * this.childList[i].depth;
            this.childList[i].node.style.marginLeft = margin + 'px';
            this.childList[i].node.style.borderLeft = '3px solid blue';
            // if initially no subcomponents, insert, if not, show them.
            if (centerPanel.widgets.indexOf(this.childList[i]) != -1)
            {
                this.childList[i].show();
            }
            else
            {
                console.log(this.childList[i].componentTitle);
                centerPanel.insertWidget(index+i+1, this.childList[i]);
            }
        }
        // obtain current number of widgets
        const childrenCount = centerPanel.widgets.length;
        // modify widgets size to equal
        const relativeSizes = Array.from({ length: childrenCount }, () => 1 / childrenCount);
        centerPanel.setRelativeSizes(relativeSizes);
    }

    // iteratively hide the sub components of this component
    public hideSubComponents(component:ModelComponent) {
        component.childList.forEach(subComponent => {
            subComponent.hide();
            if (subComponent.childList.length != 0)
            {
                subComponent.isExpanded = false;
                this.hideSubComponents(subComponent);
            }
        })
    }

    // set the depth
    public setDepth(d:number)
    {
        this.depth = d;
    }

}

// TODO: make Model Components draggable, and drag to one component makes
// this component the child of the target component. 