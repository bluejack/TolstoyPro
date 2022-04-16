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

export default class File extends TreeNode {

  constructor(id, name, description) {
    super(id, name, description);
    this.content = null;
  }

  set_name(n) {
    this.name = n;
    // Todo change file name on disc. 
  }

  set_description(d) {
    this.desc = d;
    this.save();
  }

  set_content(c) {
    if (c !== this.content) {
      this.content = c;
      this.save();
    }
  }
  
  async get_content() {
    try {
      if (!this.content) {
        try {
          this.#parse(await Cloud.load_file(this.id));
        } catch (err) {
          Log.warn(err);
        }
      }
    } catch (err) {
      Log.error(err);
    }
    return this.content;
  }

  async save() {
    return Cloud.save_file(this.id, this.#encode());
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
