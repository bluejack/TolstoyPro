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
    this.nodes  = [];
  }

  get_open_nodes() {
    var onodes = [];
    this.nodes.forEach((n) => {
      onodes.push(n);
      if (n instanceof TreeBinder) {
        if (n.model.open) {
          onodes.push(...n.stree.get_open_nodes());
        }
      }
    });
    return onodes;
  }
  
  render() {
    super.render();
    var self = this;
    this.binder.tree.forEach((i) => {
      if (i.type == 'doc') {
        const td = new TreeDoc(this.elm, i, this.binder)
        td.render();
        self.nodes.push(td);
      } else {
        const tb = new TreeBinder(this.elm, i, this.binder)
        tb.render();
        self.nodes.push(tb);
      }
    });
    return this.elm;
  }
}
