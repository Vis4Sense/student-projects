import { 
    SplitPanel 
} from '@lumino/widgets';


import '../style/index.css';

export class NotesContainer extends SplitPanel
{
    constructor()
    {
        super();
        this.orientation = 'vertical';
    }
}