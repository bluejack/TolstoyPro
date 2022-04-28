/* ======================================================================== *\
   
   Folder
   
   File container.
   
   Note: stores all persistent data in the file resource on google; there's
   no need to json it down to disk.

\* ======================================================================== */

import Cloud    from '../persist/Cloud.js';
import Log      from '../sys/Log.js';
import TreeNode from './TreeNode.js';
import _        from 'lodash';

export default class Folder extends TreeNode {

  constructor(id, name, description, ts, nodes) {
    super(id, name, description, 'folder', ts);
    this.nodes = nodes ? nodes : [];
  }

  remove(node) {
    this.nodes = _.remove(this.nodes, (n) => {return n.id == node.id});
    this.save();
  }

  add(node, pos) {
    if (typeof pos == 'undefined' || pos >= this.nodes.length) {
      this.nodes.push(node);
    } else {
      this.nodes.splice(pos, 0, node);
    }
    this.save();
  }
  
  async save() {
    var nlist = [];
    this.nodes.forEach((n) => {nlist.push(n.id)});
    var props = {
      nodes: JSON.stringify(nlist)
    };
    await Cloud.proj_save(this.id, this.name, this.desc, props);
  }

}
