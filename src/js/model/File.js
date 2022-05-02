/* ======================================================================== *\
   
   File
   
   A persistable object to represent a file with content.
   
   The file can be created with just a name, at which point nothing is done
   until something is saved, at which point the file is created, and 
   loaded onto the MetaTree.
   
   All saved text and metadata is stored in the file:
   
   desc: { file description }
   cont: { delta content for editor }
   
   Cloud & local_storage representation:
     name: <name>
     id:   <cloud key id>
     description: <description>
     ts:   <last modified timestamp>
     properties: 
       nodes: < array of ids, referencing items: files do not use this. >
       type:  'file'
       
   Cloud representation has content, obtained by separate request.

\* ======================================================================== */

import Cloud    from '../persist/Cloud.js';
import Log      from '../sys/Log.js';
import TreeNode from './TreeNode.js';
import _        from 'lodash';

export default class File extends TreeNode {

  constructor(id, name, description, ts) {
    super(id, name, description, 'file', ts);
    this.content = null;
  }
  
  static async create(parid, name, desc) {
    var res = await Cloud.doc_create(parid, name, desc);
    return new File(res.id, name, desc, res.ts);
  }

  static async load(id) {
    var rsp = await Cloud.obj_get_meta(id);
    return new File(id, rsp.name, rsp.desc, rsp.ts);
  }

  async update(name, desc) {
    if (name !== this.name || desc !== this.desc) {
      this.name = name;
      this.desc = desc;
      this.ts = await Cloud.obj_update(this.id, this.name, this.desc);
    }
  }
  
  async delete() {
    await Cloud.obj_delete(this.id);
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
        this.content = JSON.parse(await Cloud.obj_load(this.id));
      } catch (err) {
        Log.error(err);
      }
    }
    return this.content;
  }

  // ToDo -- there might be a race condition with loading content.
  async save() {
    var c = '';
    if (this.content) {
      c = JSON.stringify(this.content);
    }
    this.ts = await Cloud.obj_save(this.id, c);
  }

}
