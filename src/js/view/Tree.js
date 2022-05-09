/* ========================================================================= *\
   
   Tree
   
   The parent component for the file hierarchy tree.
   
\* ========================================================================= */

import Component from './Component.js';
import TreeBinder from './TreeBinder.js';
import TreeDoc  from './TreeDoc.js';
import { v4 as uuidv4 } from 'uuid';

export default class Tree extends Component {
  constructor(pelm, binder, style) {
    super(pelm, uuidv4());
    this.binder = binder;
    this.html   = `<div id="${this.id}" class="${style}"></div>`;
  }
  
  render() {
    super.render();
    this.binder.tree.forEach((i) => {
      if (i.type == 'doc') {
        new TreeDoc(this.elm, i, this.binder).render();
      } else {
        new TreeBinder(this.elm, i, this.binder).render();
      }
    });
    return this.elm;
  }
}
