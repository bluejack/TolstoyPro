/* ========================================================================= *\
   
   Tree Doc
   
   Document representation in the tree hierarchy.
   
   Note:
   * clicking a document opens it.
   * click-and-hold lifts it for the purpose of moving.
   * right click opens a context menu to rename, delete the doc.

\* ========================================================================= */

import DCM        from './DocumentContextMenu.js';
import TreeItem   from './TreeItem.js';
import FileDialog from './modal/FileDialog.js';


export default class TreeDoc extends TreeItem {
  constructor(pelm, item, proj, folder) {
    var domid = 'i.' + item.get_id();
    super(pelm, domid, item, proj, folder);
    this.html = `<div id="${domid}" class="tree_item"><span class="tree_icon tree_doc">&nbsp;</span><span class="tree_label">${item.get_name()}<span></div>`;
  }

  render() {
    super.render();
    var self = this;
    this.elm.onclick = () => {
      self.proj.set_curr(self.item);
    };
    this.elm.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      DCM.display(e, self.item);
    });
  }
  
}
