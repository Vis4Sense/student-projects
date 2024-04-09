import { 
    Panel,
    Menu
} from '@lumino/widgets';
import { CommandRegistry } from '@lumino/commands';


import { ModelComponent } from './model_component';


export class OptionList extends Menu
{
    component : ModelComponent;
    commands : CommandRegistry; 
    isSeq: boolean;

    constructor(container:Panel, component:ModelComponent)
    {
        super({
            commands: new CommandRegistry()
        });
        this.component = component;
        this.isSeq = (component.tag === "Sequential") ? true : false;
        this.commands = new CommandRegistry();
 
        // commands for the options
        const noteCommand:string = "note:add";
        this.commands.addCommand(noteCommand, {
            label: 'open notes',
            execute: () => {
                component.addNotes(container);
            }
        })
 
        const navigateCommand:string = "code:goto";
        this.commands.addCommand(navigateCommand, {
            label:'navigate to code location',  
            execute: () => {
                component.navigateCode();
            }
        }) 

        const expandCommand:string = "component:expand";
        this.commands.addCommand(expandCommand, {
            label:'expand/collapse',  
            execute: () => {
                component.switchExpand(container);
            }
        }) 

        const setProcessCommand:string = "component:set";
        this.commands.addCommand(setProcessCommand, {
            label: (this.isSeq) ? 'in graphic view: sequential' : 'in graphic view: parallel',
            execute: () => {
                this.isSeq = !this.isSeq;
                component.changeGraphicView();
            }
        });
 
        this.addItem({command: noteCommand});
        this.addItem({command: navigateCommand});
        this.addItem({command: expandCommand});
        this.addItem({command: setProcessCommand});
    }
}