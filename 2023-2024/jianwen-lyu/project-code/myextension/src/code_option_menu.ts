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
                        if (data[i][0] === component.componentID)
                        {
                            data.splice(i, 1);
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

        this.addItem({command: deleteCommand});
    }

}