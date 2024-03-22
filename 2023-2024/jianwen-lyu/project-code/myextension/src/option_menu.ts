import { 
    SplitPanel,
    Menu 
} from '@lumino/widgets';

import { CommandRegistry } from '@lumino/commands';


import { ModelComponent } from './model_component';


export class OptionList extends Menu
{
    component : ModelComponent;
    commands : CommandRegistry; 

    constructor(container:SplitPanel, component:ModelComponent)
    {
        super({
            commands: new CommandRegistry()
        });
        this.component = component;
        this.commands = new CommandRegistry();

        // register commands for the items
        const setCommand:string = "code:set";
        this.commands.addCommand(setCommand, {
            label: 'set code location',
            execute: () => {
                component.setCodeLocation();
            }
        })
 
        const noteCommand:string = "note:add";
        this.commands.addCommand(noteCommand, {
            label: 'add notes',
            execute: () => {
                component.addNotes();
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
                component.switchExpand(container, component);
            }
        }) 
 
        this.addItem({command: setCommand});
        this.addItem({command: noteCommand});
        this.addItem({command: navigateCommand});
        this.addItem({command: expandCommand});
    }
}