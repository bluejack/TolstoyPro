/* ======================================================================== *\
   
   File
   
   A persistable object to represent a file with content.
   
   The file can be created with just a name, at which point nothing is done
   until something is saved, at which point the file is created, and 
   loaded onto the MetaTree.
   
   All saved text and metadata is stored in the file:
   
   desc: { file description }
   cont: { delta content for editor }

\* ======================================================================== */

import Cloud    from '../persist/Cloud.js';
import Log      from '../sys/Log.js';
import TreeNode from './TreeNode.js';
import _        from 'lodash';

export default class File extends TreeNode {

  constructor(id, name, description, ts) {
    super(id, name, description, ts);
    this.content = null;
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
      Cloud.rename_obj(this.id, this.name);
    }
    if (desc !== this.desc) {
      this.desc = desc;
      this.save();
    }
  }

  set_content(c) {
    // Do a changed-on-disk check here.
    if (!this.content || !this.content.ops || !_.isEqual(c.ops, this.content.ops)) {
      this.content = c;
      this.save();
    }
  }
  
  async get_content() {
    // Changed on disk check?
    if (!this.content) {
      try {
        this.#parse(await Cloud.load_file(this.id));
      } catch (err) {
        Log.error(err);
      }
    }
    return this.content;
  }

  // ToDo -- there might be a race condition with loading content.
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
