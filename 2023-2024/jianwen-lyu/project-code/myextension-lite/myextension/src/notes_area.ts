import { 
    Panel,
    Widget
} from '@lumino/widgets';


import '../style/index.css';
import { ModelComponent } from './model_component';


export class NotesArea extends Panel
{
    cid : string = '';
    notes : Widget[] = [];
    data: string[] = [];
    notesContainer : Panel;

    // construct the notes area
    constructor()
    { 
        super();
        this.addClass('jp-notes-area');

        this.notesContainer = new Panel();
        this.notesContainer.addClass('jp-notes-container');

        const buttons = new Widget();
        buttons.addClass('jp-notes-buttons');

        let addButton = document.createElement('button');
        addButton.textContent = '+';
        buttons.node.appendChild(addButton);
        addButton.onclick = () => {
            const new_clip = new Widget();
            let userNote = document.createElement('input');
            userNote.classList.add('jp-notes-text');
            userNote.placeholder = 'user may add notes here';
            new_clip.node.appendChild(userNote);
            new_clip.addClass('jp-notes-input');

            this.notes.push(new_clip);
            this.notesContainer.addWidget(new_clip);
        }

        let deleteButton = document.createElement('button');
        deleteButton.textContent = '-';
        buttons.node.appendChild(deleteButton);
        deleteButton.onclick = () => {
            // delete the last widget of container
            let len = this.notes.length;
            if (len > 0)
            {
                const target = this.notes.pop();
                target?.dispose();
            }

            // auto-save when deleted some record
            // save: user text in input area
            if (!this.cid) {
                console.warn('Component ID (cid) is not set.');
                return;
            }
        
            let notesContent = this.notes.map(note => {
                let inputElement = note.node.querySelector('input');
                return inputElement ? inputElement.value : '';
            });
     
            let serializedNotes = JSON.stringify(notesContent);
            //console.log(serializedNotes);

            localStorage.setItem(this.cid, serializedNotes);
        }

        const upperButtons = new Widget();
        upperButtons.addClass('jp-notes-buttons');

        let closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        upperButtons.node.appendChild(closeButton);
        closeButton.onclick = () => {
            this.dispose();
        }

        let saveButton = document.createElement('button');
        saveButton.textContent = 'save';
        upperButtons.node.appendChild(saveButton);
        saveButton.onclick = () => {
            // save: user text in input area
            if (!this.cid) {
                console.warn('Component ID (cid) is not set.');
                return;
            }
        
            let notesContent = this.notes.map(note => {
                let inputElement = note.node.querySelector('input');
                return inputElement ? inputElement.value : '';
            });
     
            let serializedNotes = JSON.stringify(notesContent);
            //console.log(serializedNotes);

            localStorage.setItem(this.cid, serializedNotes);
        }

        // handling events (signals)
        this.disposed.connect(() => {
            if (!this.cid) {
                console.warn('Component ID (cid) is not set.');
                return;
            }
        
            let notesContent = this.notes.map(note => {
                let inputElement = note.node.querySelector('input');
                return inputElement ? inputElement.value : '';
            });
     
            let serializedNotes = JSON.stringify(notesContent);
            //console.log(serializedNotes);

            localStorage.setItem(this.cid, serializedNotes);
        })

        this.addWidget(upperButtons);
        this.addWidget(this.notesContainer);
        this.addWidget(buttons);
    }
    
    public SetCID(component:ModelComponent)
    {
        this.cid = component.componentID;
    }

    public loadNote(data:string, container:Panel)
    {
        const userData = JSON.parse(data);
        for (let i = 0; i < userData.length; i++)
        {
            const note = new Widget();
            let userNote = document.createElement('input');
            userNote.classList.add('jp-notes-text');
            userNote.value = userData[i];
            note.node.appendChild(userNote);
            note.addClass('jp-notes-input');
            this.notes.push(note);
            container.addWidget(note);
        }
    }
}

