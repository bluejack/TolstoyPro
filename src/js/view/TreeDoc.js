/* ========================================================================= *\
   
   Tree Doc
   
   Document representation in the tree hierarchy.
   
   Note:
   * clicking a document opens it.
   * click-and-hold lifts it for the purpose of moving.
   * right click opens a context menu to rename, delete the doc.

\* ========================================================================= */

import DCM        from './DocumentContextMenu.js';
import PHandler   from '../controller/ProjectHandler.js';
import TreeItem   from './TreeItem.js';

export default class TreeDoc extends TreeItem {
  constructor(pelm, model, binder) {
    super(pelm, model.id, model, binder);
    this.html = `<div id="${this.id}" class="tree_item"><span class="toggle_icon">&nbsp;</span><span class="tree_icon tree_doc">&nbsp;</span><span class="tree_label">${model.name}<span></div>`;
  }

  render() {
    super.render();
    var self = this;
    this.elm.onclick = () => {
      PHandler.get().set_curr(self.model);
    };
    this.elm.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      DCM.display(e, self.model);
    });
  }
  
}
