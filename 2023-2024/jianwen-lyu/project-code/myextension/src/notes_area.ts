import { 
    Widget,
    SplitPanel
} from '@lumino/widgets';
import {
    Toolbar,
    ToolbarButton
} from '@jupyterlab/apputils'


import '../style/notes.css';
import { NotesContainer } from './notes_container';


// user choose which type the component is, if model tuning: add hp (auto)
// TODO: solve problem: notes buttons and notes doesn't appear on popup window
// mouse hover => 3 buttons occur, 
// TODO: grab user markdown titles and generate model components, 
// make components looks like titles instead of textareas, each as a type to choose,
// default: data loading, feature engineering, model training, output
// enable title hierachy and folding & collapsing...
export class NotesArea extends SplitPanel
{
    // construct the notes area
    constructor()
    { 
        // control units
        let isMoving = false;

        super();
        this.orientation = 'vertical';
        this.addClass('jp-notes-area');

        // container for notes
        const container = new NotesContainer();

        // add event listener for user's mouse (draggable function)
        this.node.addEventListener('mousedown', function(e) {
            isMoving = true;
        });
        this.node.addEventListener('mousemove', function(e) {
            console.log(isMoving);
            if (isMoving)
            {
                // set position of draggable panel
                this.style.left = e.clientX + 'px';
                this.style.top = e.clientY + 'px';
            }
        });
        this.node.addEventListener('mouseup', function() {
            isMoving = false;
        });

        // toolbar for the note area
        const noteTools = new Toolbar();
        noteTools.addClass('jp-notes-toolbar');

        // button to close the window
        const closeButton = new ToolbarButton({
            label: 'close',
        });
        closeButton.onClick = () => {
            console.log("close button clicked");
            document.body.removeChild(this.node);
            this.parent = null;
            this.dispose();
        }

        // button to add a note content
        const addButton = new ToolbarButton({
            label: 'add',
        });
        addButton.onClick = () => {
            console.log("add button clicked");
            const note = new NoteClip();
            container.addWidget(note);
        }

        noteTools.addItem('close', closeButton);
        noteTools.addItem('add note', addButton);

        this.addWidget(noteTools);
        this.addWidget(container);
    }
}

class NoteClip extends Widget
{
    constructor()
    {
        super();
        
        console.log("note created");
        // a text area for taking notes
        const note = document.createElement('input');
        this.node.appendChild(note);
    }
}
