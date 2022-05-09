/* ========================================================================= *\
   
   Tree Item
   
   Files & Different Types of Folders.

\* ========================================================================= */

import Component from './Component.js';

export default class TreeItem extends Component {
  constructor(pelm, id, model, binder) {
    super(pelm, id);
    this.model  = model;
    this.binder = binder;
  }
}
