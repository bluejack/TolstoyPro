/* ========================================================================= *\
   
   Tree Binder
   
   Binder representation in the tree hierarchy.
   
   Note:
   * clicking a binder expands or closes it.
   * click-and-hold lifts it for the purpose of moving.
   * right click opens a context menu to rename / configure the binder.

\* ========================================================================= */

import BCM        from './BinderContextMenu.js';
import Tree       from './Tree.js';
import TreeItem   from './TreeItem.js';
import TreeDoc    from './TreeDoc.js';
import { v4 as uuidv4 } from 'uuid';

const TREE_CLASS = 'subtree';

export default class TreeBinder extends TreeItem {
  constructor(pelm, model, binder) {
    super(pelm, uuidv4(), model, binder);
    this.labid = uuidv4();
    this.html = `<div id="${this.id}" class="tree_item"><span class="toggle_icon">&nbsp;</span><span class="tree_icon tree_binder">&nbsp;</span><span id="${this.labid}" class="tree_label">${model.name}<span></div>`;
    this.subtree = null;
    this.open = false;
  }

  toggle() {
    if (this.model.open) {
      this.model.open = false;
      this.subtree.style.display = 'none';
      this.elm.firstChild.innerHTML = '&#x25B9;';
    } else {
      this.model.open = true;
      this.subtree.style.display = 'block';
      this.elm.firstChild.innerHTML = '&#x25BF;';
    }
  }

  render() {
    super.render();
    var self = this;
    var stree = new Tree(this.elm,this.model,TREE_CLASS);
    this.subtree = stree.render();
    this.labelm = document.getElementById(this.labid);
    if (this.model.open) {
      this.elm.firstChild.innerHTML = '&#x25BF;';
      this.subtree.style.display = 'block';      
    } else {
      this.elm.firstChild.innerHTML = '&#x25B9;';
      this.subtree.style.display = 'none';      
    }
    this.labelm.onclick = () => {
      self.toggle(); 
    };
    this.labelm.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      BCM.display(e, self.model);
    });
  }
  
}
