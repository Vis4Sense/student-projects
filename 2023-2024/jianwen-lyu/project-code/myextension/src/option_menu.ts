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

    constructor(container:Panel, component:ModelComponent)
    {
        super({
            commands: new CommandRegistry()
        });
        this.component = component;
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
 
        this.addItem({command: noteCommand});
        this.addItem({command: navigateCommand});
        this.addItem({command: expandCommand});
    }
}