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
import { OptionList } from './option_menu';


// when hovering: show options 1.add sub-component, 2.set location 3.add notes 4.goto location. 
export class ModelComponent extends SplitPanel
{
    // get user notebook panel
    currentPanel : NotebookPanel;
    state : IStateDB;

    componentTitle: string = "";
    // list of direct children
    childList : ModelComponent[] = [];
    // whether its expanded or hidden
    isExpanded : boolean = false;
    // depth as sub component
    depth:number = 0;
    showOptions : boolean = false;

    // widgets cannot add inside components, should use Panel objects
    // constructor for model component, we have a jupyterlab current panel parameter,
    // which can extract information from it.
    constructor(app: JupyterFrontEnd, state: IStateDB, panel:NotebookPanel, container:SplitPanel, title:string)
    {
        // TODO: make model components able to collapse (extend sub-titles) 
        // basic settings
        super();
        this.state = state;
        this.addClass('jp-model-component');
        if (title != "")
        {
            this.componentTitle = title;
        }
        else
        {
            this.componentTitle = "model component";
        }

        this.disposed.connect(() => {
            console.log("this component is disposed");
        })

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
        const nameContent = document.createElement('p');
        nameContent.textContent = this.componentTitle; 
        nameArea.node.appendChild(nameContent);

        // better to capsule components into one Widget, 
        // then we can manipulate spacing
        // an area for buttons
        // const buttonArea = new Widget();
        // buttonArea.addClass('jp-component-button-area');

        // // button for set code location
        // const button1 = document.createElement('button');
        // button1.textContent = "set";
        // button1.classList.add("jp-component-button");
        // button1.onclick = () => {
        //     this.setCodeLocation();
        // }
        // buttonArea.node.appendChild(button1);

        // // button for making notes
        // const button2 = document.createElement('button');
        // button2.textContent = "note";
        // button2.classList.add("jp-component-button");
        // button2.onclick = () => {
        //     this.addNotes();
        // }
        // buttonArea.node.appendChild(button2);

        // // button for goto code location
        // const button3 = document.createElement('button');
        // button3.textContent = "goto";
        // button3.classList.add("jp-component-button");
        // button3.onclick = () => {
        //     this.navigateCode();
        // }
        // buttonArea.node.appendChild(button3);

        // // button for show child components
        // this.isExpanded = false; 
        // const button4 = document.createElement('button');
        // button4.textContent = "expand";
        // button4.classList.add("jp-component-button");
        // button4.onclick = () => {
        //     if (this.isExpanded == false)
        //     {
        //         this.showSubComponents(container, this);
        //     }
        //     else if (this.isExpanded == true)
        //     {
        //         this.hideSubComponents(this);
        //     }
        // }
        // buttonArea.node.appendChild(button4);

        let showOptions = false;
        // add a dropdown list after clicking
        const options = new OptionList(container, this); 
        options.aboutToClose.connect(() => {
            showOptions = false;
        });

        // we want button area to hide until user's mouse hover on it
        this.node.addEventListener('click', function(e) {
            console.log("mouse clicked");
            if (!showOptions)
            {
                // get mouse location on the page
                var mouseX = e.pageX;
                var mouseY = e.pageY;
                // locate area to this place
                //buttonArea.node.style.display = 'block'; 
                options.open(mouseX, mouseY);
                showOptions = true;
            }
            else if (showOptions)
            {
                //buttonArea.node.style.display = 'none';
                options.close();
                showOptions = false;
            } 
        });
        
        // add sub-components into widget, unfold children
        this.addWidget(nameArea);
        //document.body.appendChild(buttonArea.node);
        //this.addWidget(buttonArea);
        //buttonArea.hide();
    } 

    public addSubComponent(subComponent:ModelComponent) {
        this.childList.push(subComponent);
    }

    // function for command in command menu in OptionList
    public switchExpand(container:SplitPanel, component:ModelComponent)
    {
        if (this.isExpanded == false)
        {
            this.showSubComponents(container, this);
        }
        else if (this.isExpanded == true)
        {
            this.hideSubComponents(this);
        }
    }

    // show sub components of this component
    public showSubComponents(centerPanel:SplitPanel, component:ModelComponent) 
    {
        let index = centerPanel.widgets.indexOf(this);
        //console.log(component.childList);
        //console.log("index of root: ", index);

        // show direct sub components
        for (let i = 0; i < component.childList.length; i++)
        {
            // base case
            let margin = 5 * component.childList[i].depth;
            component.childList[i].node.style.marginLeft = margin + 'px';
            // if initially no subcomponents, insert, if not, show them.
            if (centerPanel.widgets.indexOf(component.childList[i]) != -1)
            {
                component.childList[i].show();
            }
            else
            {
                centerPanel.insertWidget(index+i+1, component.childList[i]);
            }
        }
        // obtain current number of widgets
        const childrenCount = centerPanel.widgets.length;
        // modify widgets size to equal
        const relativeSizes = Array.from({ length: childrenCount }, () => 1 / childrenCount);
        centerPanel.setRelativeSizes(relativeSizes);
        component.isExpanded = true;
    }

    // show all children
    public showAllSubComponents(centerPanel:SplitPanel, component:ModelComponent)
    {
        component.showSubComponents(centerPanel, component);
        component.childList.forEach(subComponent => {
            if (subComponent.childList.length != 0)
            {
                subComponent.showAllSubComponents(centerPanel, subComponent);
            }
        })
    }

    // iteratively hide the sub components of this component
    public hideSubComponents(component:ModelComponent) 
    {
        component.childList.forEach(subComponent => {
            subComponent.hide();
            if (subComponent.childList.length != 0)
            {
                this.hideSubComponents(subComponent);
            }
        })
        component.isExpanded = false;
    }

    // set the depth
    public setDepth(d:number)
    {
        this.depth = d;
    }

    // construct reaction functions for the buttons
    // set code location function, user can set relevant code for this component
    // if there exist a markdown as name, set to the markdown as default  
    public setCodeLocation = () => {
        console.log("code location setting...");
        // user's mouse select code snippets
        this.saveSelectedCell();
    }

    // add notes function, user can add notes to the panel popped here
    public addNotes = () => {
        console.log("Notes added");
        // add a note panel for taking notes
        // a popup window for notes
        const notes = new NotesArea();
        document.body.appendChild(notes.node);
    }

    // navigate to the set code location before (cell)
    public navigateCode = () => {
        this.restoreSelectedCell();
    }

    // listener for code cell change in notebook panel
    // and 
    private saveSelectedCell = async () => {
        console.log("saving...");
        const current = this.currentPanel.content.selectedCells[0];
        if (current) 
        {
            await this.state.save('selectedCellIndex', current.model.id);
            console.log("saved");
            alert("selected code cell saved");
        }
        else
        {
            alert("focus on an ipynb file first!");
        }
    };
      
    // locate the notebook to selected cell
    private restoreSelectedCell = async () => {
        console.log("loading...");
        const currentId = await this.state.fetch('selectedCellIndex');
            
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

    // clear this and all children
    public clear = () => {
        if (this.childList.length != 0)
        {
            this.childList.forEach(child => {
                child.clear();
            }) 
        } 
        this.dispose();
        //console.log("component closed");
    }

}

// TODO: 1) improve UI looking
//       2) note system: draggable,   