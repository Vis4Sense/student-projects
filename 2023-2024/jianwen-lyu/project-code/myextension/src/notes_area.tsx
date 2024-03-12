import React from 'react';

import { SplitPanel } from '@lumino/widgets';
import { ReactWidget } from '@jupyterlab/ui-components'


import '../style/notes.css';


const notelist = [
    {id:'1', name:'name'},
    {id:'2', name:'anme'},
    {id:'3', name:'emna'}
]

// the notes element, added to main notes area 
// when addButton is clicked
const Note = (): JSX.Element => {
    // variables

    // construct elements inside notes
    return (
        <div className='jp-note'>
            <p> This is Note </p>

            <button onClick={(): void => {

            }}>
            Add Note
            </button>

            <ul>
                {notelist.map(item => <li key={item.id}> {item.name} </li>)}
            </ul>
        </div>
    );
}

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
        super();
        this.orientation = 'vertical';
        this.addClass('jp-notes-area');

        // button to close the window
        const closeButton = document.createElement('button');
        closeButton.textContent = "close";
        closeButton.classList.add("jp-notes-button");
        closeButton.onclick = () => {
            document.body.removeChild(this.node);
            this.parent = null;
            this.dispose();
            // console.log(this.parent);
        }
        this.node.appendChild(closeButton);

        // container for notes
        const noteContainer = new NoteContainer();
        this.addWidget(noteContainer);
    }
}

class NoteContainer extends ReactWidget
{
    constructor()
    {
        super();
        this.addClass('jp-notes-container')
    }

    render(): JSX.Element {
        console.log("rendering");
        return <Note/>
    }
}

