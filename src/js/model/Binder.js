/* ======================================================================== *\
   
   Binder

   A "folder" in the tree view, contains a subset of documents and binders.

\* ======================================================================== */

import TreeNode from './TreeNode.js';

export default class Binder extends TreeNode {
  constructor(name, desc) {
    super(name, desc, 'bind');
    this.tree = [];
  }
  
  insert_item(item, pos) {
    if (!pos) pos = 0;
    this.tree.splice(pos, 0, item);
  }
  
  // Will we always know the position?
  remove_item(item, pos) {
    if (pos) {
      var i = this.tree[pos];
      if (i === item) {
        this.tree.splice(pos, 1);
      }
    } else {
      console.log("Do we need an option without position?");
    }
  }
}