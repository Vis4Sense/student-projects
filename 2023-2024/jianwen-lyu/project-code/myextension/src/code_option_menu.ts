import { 
    Panel
} from '@lumino/widgets';
import { 
    NotebookPanel
} from '@jupyterlab/notebook';


import { OptionList } from "./option_menu";
import { ModelComponent } from './model_component';


export class CodeOptionList extends OptionList
{
    constructor(container:Panel, component:ModelComponent)
    {
        super(container, component);

        // add new command
        const deleteCommand = "component:delete";
        this.commands.addCommand(deleteCommand, {
            label: "Delete Code Component",
            execute: () => {
                let fileStr = "";
                const np = component.currentPanel;
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
                    let data = JSON.parse(codeComponentData);
                    for (let i = 0; i < data.length; i++)
                    {
                        console.log(data[i][0]);
                        console.log(component.componentID);
                        if (data[i][0] == component.componentID)
                        {
                            data.splice(i);
                            break;
                        }
                    }
                    const jsonString = JSON.stringify(data);
                    localStorage.setItem('code' + fileStr, jsonString);
                    component.dispose();

                    // find relevant notes and delete
                    localStorage.removeItem(component.componentID);
                    
                    alert("code component deleted");
                }
            }
        })

        // remove old items in father class
        super.removeItemAt(2);
        this.addItem({command: deleteCommand});
        //super.removeItemAt(2);
    }

}