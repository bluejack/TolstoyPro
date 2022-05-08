/* ========================================================================= *\
   
   Tree Binder
   
   Binder representation in the tree hierarchy.
   
   Note:
   * clicking a binder expands or closes it.
   * click-and-hold lifts it for the purpose of moving.
   * right click opens a context menu to rename / configure the binder.

\* ========================================================================= */

import BCM        from './BinderContextMenu.js';
import TreeItem   from './TreeItem.js';
import TreeDoc    from './TreeDoc.js';
import { v4 as uuidv4 } from 'uuid';

export default class TreeBinder extends TreeItem {
  constructor(pelm, item, proj, folder) {
    var domid = uuidv4();
    super(pelm, domid, item, proj, folder);
    this.html = `<div id="${domid}" class="tree_item"><span class="tree_icon tree_binder">&nbsp;</span><span class="tree_label">${item.name}<span></div>`;
    this.subtree = null;
    this.open = false;
  }

  toggle() {
    if (this.open) {
      this.subtree.display = 'none';
    } else {
      this.subtree.display = 'block';
    }
  }

  generate_subtree() {
    var domid = uuidv4;
    var p = this.proj;
    var subtree = `<div id="${domid}" class="subtree"></div>`;
    this.elm.insertAdjacentHTML('beforeend', subtree);
    var stelm = document.getElementById(domid);
    if (this.item.tree) {
      this.item.tree.forEach((i) => {
        var titem = new TreeDoc(stelm, i, p);
        titem.render();
      });
    }
  }

  render() {
    super.render();
    var self = this;
    this.generate_subtree();
    this.elm.onclick = () => {
      self.toggle(); 
    };
    this.elm.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      DCM.display(e, self.item);
    });
  }
  
}
