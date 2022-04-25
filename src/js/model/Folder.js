/* ======================================================================== *\
   
   Folder
   
   File container.
   
   Does not, typically, have content.

\* ======================================================================== */

import Cloud    from '../persist/Cloud.js';
import Log      from '../sys/Log.js';
import TreeNode from './TreeNode.js';
import _        from 'lodash';

export default class Folder extends TreeNode {

  constructor(id, name, description, ts, items) {
    super(id, name, description, ts);
    this.items = items;
  }

  static async load(id) {
    try {
      var [meta, json] = await Promise.all([
        Cloud.obj_get_meta(id),
        Cloud.obj_load(id)
      ]);
      var body = JSON.parse(json);
    } catch (err) {
      Log.error(err, json);
    }
    var f = new Folder(id, meta.name, body.description, meta.modifiedTime, body.items);
    console.log(f);
    return f;
  }

  get_name() {
    return this.name;
  }

  get_description() {
    return this.description;
  }

  async update(name, desc) {
    if (name !== this.name) {
      this.name = name;
      Cloud.obj_rename(this.id, this.name);
    }
    if (desc !== this.desc) {
      this.desc = desc;
      this.save();
    }
  }

  add_node(i, pos) {
    if (typeof pos == 'undefined' || pos >= this.nodes.length) {
      this.nodes.push(i);
    } else {
      this.nodes.splice(pos, 0, i);
    }
    this.save();
  }

  async save() {
    var ts = await Cloud.save_file(this.id, this.#encode());
    this.ts = ts;
  }

  #parse(v) {
    var val = JSON.parse(v);
    this.desc = val.desc;
    this.content = val.cont;
  }
  
  #encode() {
    return JSON.stringify({
      desc: this.desc,
      cont: this.content
    });
  }
  
}
