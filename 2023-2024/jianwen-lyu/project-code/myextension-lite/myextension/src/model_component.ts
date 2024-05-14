import { 
    Widget, 
    Panel
} from '@lumino/widgets';
import { IStateDB } from '@jupyterlab/statedb';
import { 
    NotebookPanel
} from '@jupyterlab/notebook';
import { JupyterFrontEnd } from '@jupyterlab/application';
import {Cell} from '@jupyterlab/cells';


import '../style/model_component.css';
import './notes_area';
import './popup';
import { OptionList } from './option_menu';
import { NotesArea } from './notes_area';
import { CodeOptionList } from './code_option_menu';


// when hovering: show options 1.add sub-component, 2.set location 3.add notes 4.goto location. 
export class ModelComponent extends Widget
{
    // id 
    public componentID : string;
    public nameContent = document.createElement('p');
    public tag : string;

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
    cell : Cell;
    isCode: boolean;

    // widgets cannot add inside components, should use Panel objects
    // constructor for model component, we have a jupyterlab current panel parameter,
    // which can extract information from it.
    constructor(app: JupyterFrontEnd, state: IStateDB, panel:NotebookPanel, container:Panel, title:string, cell:Cell, isCode:boolean)
    {
        // TODO: make model components able to collapse (extend sub-titles) 
        // basic settings
        super({node:document.createElement('div')});
        this.state = state;
        this.cell = cell;
        this.isCode = isCode;
        this.tag = "Parallel";
        
        this.addClass('jp-model-component');
        if (title[0] == "-")
        {
            this.componentTitle = title;
        }
        else if (title != "")
        {
            this.componentTitle = "- " + title;
        }
        this.componentID = this.componentTitle + '';

        // set option list
        if (this.isCode)
        {
            this.optionSettings(container);
        }

        // tracker for cell
        // const tracker: IWidgetTracker<Cell> = new WidgetTracker<Cell>({ namespace: 'selected-cell' });
        // const notebookTracker = new NotebookTracker({namespace:'notebook'});
        this.currentPanel = panel;
        if (app.shell.currentWidget instanceof NotebookPanel)
        {
            this.currentPanel = app.shell.currentWidget;
        }

        this.createTitleNode(this.nameContent);

        // when disposed...
        this.disposed.connect(() => {
            localStorage.setItem("tag" + this.componentID, this.tag);
        });
    } 

    public optionSettings(container:Panel)
    {
        let showOptions = false;

        let options : OptionList;
        // add a dropdown list after clicking 
        if (!this.isCode)
        {
            options = new OptionList(container, this);
            options.aboutToClose.connect(() => {
                showOptions = false;
            });
        }
        else
        {
            options = new CodeOptionList(container, this);
            options.aboutToClose.connect(() => {
                showOptions = false;
            });
        } 

        // we want button area to hide until user's mouse hover on it
        this.node.addEventListener('click', function(e) {
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
    }

    public createTitleNode(nameContent : HTMLParagraphElement)
    {
        // name text area
        nameContent.classList.add('jp-textarea');
        nameContent.textContent = this.componentTitle;
        this.node.appendChild(nameContent);
    }

    public addSubComponent(subComponent:ModelComponent) {
        this.childList.push(subComponent);
    }

    // function for command in command menu in OptionList
    public switchExpand(container:Panel)
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
    public showSubComponents(centerPanel:Panel, component:ModelComponent) 
    {
        let index = centerPanel.widgets.indexOf(this);
        //console.log(component.childList);
        //console.log("index of root: ", index);

        // show direct sub components
        for (let i = 0; i < component.childList.length; i++)
        {
            // base case
            let margin = 10 * component.childList[i].depth;
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

        component.isExpanded = true;
    }

    // show all children
    public showAllSubComponents(centerPanel:Panel, component:ModelComponent)
    {
        component.showSubComponents(centerPanel, component);
        component.childList.forEach(subComponent => {
            if (subComponent && subComponent.childList.length != 0)
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
            if (subComponent && subComponent.childList.length != 0)
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
    // public setCodeLocation = () => {
    //     console.log("code location setting...");
    //     // user's mouse select code snippets
    //     this.saveSelectedCell();
    // }

    // add notes function, user can add notes to the panel popped here
    public addNotes = (container:Panel) => {
        let index = container.widgets.indexOf(this);
        const note = new NotesArea();
        note.SetCID(this);
        note.node.style.marginLeft = this.depth * 10 + 'px';
        // if have saved notes, load...
        let this_notes = localStorage.getItem(this.componentID);
        if (this_notes)
        {
            note.loadNote(this_notes, note.notesContainer);
        }

        // add note area to next position
        container.insertWidget(index+1, note);
    }

    // navigate to the set code location before (cell)
    public navigateCode = () => {
        this.restoreSelectedCell();
    }

    // initiate: select cell
    public saveCellData = (cell:Cell) => {
        this.state.save('selectedCellIndex', cell.model.id);
        //console.log(cell.model.id);
    }
      
    // locate the notebook to selected cell
    private restoreSelectedCell = async () => {
        const currentId = this.cell.model.id;
        //console.log(currentId);
            
        // find the corresponding cell in notebook
        if (typeof currentId === 'string')
        {
            let foundCell = this.currentPanel.content._findCellById(currentId);
            if (foundCell)
            {
                this.currentPanel.content.scrollToCell(foundCell?.cell, 'start'); 
            }  
        }
        else
        {
            console.log('error: id must be type string');
        }
            
        //console.log("loaded");
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
    }

    // change the dsiplaying way in graphics view
    public changeGraphicView()
    {
        if (this.tag == "Sequential")
        {
            this.tag = "Parallel";
            localStorage.setItem("tag" + this.componentID, "Parallel");
        }
        else
        {
            this.tag = "Sequential";
            localStorage.setItem("tag" + this.componentID, "Sequential");
        }
    }

}
