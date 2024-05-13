import {Collapser} from '@jupyterlab/ui-components';
import { Widget } from '@lumino/widgets';

export class Collapsible extends Collapser
{
    constructor(widget:Widget)
    {
        super({
            widget: widget
        });
    }

}