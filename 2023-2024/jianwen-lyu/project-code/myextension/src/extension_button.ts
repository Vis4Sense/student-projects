import { JupyterFrontEnd } from "@jupyterlab/application";
import { ToolbarButton } from "@jupyterlab/apputils";
import { DocumentRegistry } from "@jupyterlab/docregistry";
import { INotebookModel, NotebookPanel} from "@jupyterlab/notebook";
import { IDisposable } from "@lumino/disposable";


export class ExtensionButton implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> 
{
    extension_app: JupyterFrontEnd

    constructor(app: JupyterFrontEnd)
    { 
        this.extension_app = app
    }

    createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {
        // Create the toolbar button
        let mybutton = new ToolbarButton({
            label: 'ML Helper',
            onClick: () => {
                //console.log("extension buttion clicked: ", this.extension_app);
                this.extension_app.commands.execute('window:open');
                //console.log("command executed");
            }
        });

        // Add the toolbar button to the notebook toolbar
        panel.toolbar.insertItem(10, 'mybutton', mybutton);
        context.fileChanged.connect(() => {
            const thispanel = this.extension_app.shell.currentWidget;
            if (thispanel instanceof NotebookPanel)
            {
                thispanel.toolbar.insertItem(10, 'mybutton', mybutton);
            }
        })

        // The ToolbarButton class implements `IDisposable`, so the
        // button *is* the extension for the purposes of this method.
        return mybutton;
    }
}