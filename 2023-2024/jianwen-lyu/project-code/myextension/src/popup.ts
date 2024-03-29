import { Widget } from '@lumino/widgets';


import '../style/popup.css'


export class Popup extends Widget {
  constructor() {
    super();
    this.addClass('jp-popup');

    const cName = document.createElement('input');
    cName.placeholder = 'enter component name';

    const submit = document.createElement('button');
    submit.textContent = 'OK';
    submit.onclick = () => {
      //...
    }
  }

  show() {
    // add window to current page
    document.body.appendChild(this.node);
  }

  hide() {
    // remove window from current page
    document.body.removeChild(this.node);
    this.node.remove();
  }
}