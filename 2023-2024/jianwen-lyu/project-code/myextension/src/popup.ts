import { Widget } from '@lumino/widgets';


import '../style/popup.css'


export class Popup extends Widget {
  constructor() {
    super();
    this.addClass('jp-popup');

    const close = new Widget();
    const closeButton = document.createElement('button');
    closeButton.textContent = "close";
    closeButton.onclick = () => {
        this.hide();
    }

    close.node.appendChild(closeButton);
    this.node.appendChild(close.node);
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