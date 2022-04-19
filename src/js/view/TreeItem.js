/* ========================================================================= *\
   
   Tree Item
   
   Files & Different Types of Folders.

\* ========================================================================= */

import Component from './Component.js';
import FileDialog from './modal/FileDialog.js';

export default class TreeItem extends Component {
  constructor(pelm, item, proj) {
    var domid = 'i.' + item.get_id();
    super(pelm, domid);
    this.html = `<div id="${domid}" class="tree_item">${item.get_name()}</div>`;
    this.item = item;
    this.proj = proj;
  }

  render() {
    super.render();
    var self = this;
    this.elm.onclick = () => {
      self.proj.set_curr(self.item);
    };
    this.elm.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      var edit_file = new FileDialog(self.item);
      edit_file.render();
    });
  }
  
}
