import { JupyterFrontEnd } from "@jupyterlab/application";
import { ToolbarButton } from "@jupyterlab/apputils";
import { DocumentRegistry } from "@jupyterlab/docregistry";
import { INotebookModel, NotebookPanel } from "@jupyterlab/notebook";
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
        console.log("from button: ", panel);
        let mybutton = new ToolbarButton({
            label: 'ML Helper',
            onClick: () => {
                this.extension_app.commands.execute('window:open');
            }
        });

        // Add the toolbar button to the notebook toolbar
        panel.toolbar.insertItem(10, 'mybutton', mybutton);

        // The ToolbarButton class implements `IDisposable`, so the
        // button *is* the extension for the purposes of this method.
        return mybutton;
    }
}