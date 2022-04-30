/* ========================================================================= *\
   
   Tree Item
   
   Files & Different Types of Folders.

\* ========================================================================= */

import Component from './Component.js';
import FileDialog from './modal/FileDialog.js';

export default class TreeItem extends Component {
  constructor(pelm, id, item, proj, folder) {
    super(pelm, id);
    this.item = item;
    this.proj = proj;
  }

}
