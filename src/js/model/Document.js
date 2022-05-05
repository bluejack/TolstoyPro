/* ======================================================================== *\
   
   Document
   
   A persistable object to represent a document's meta-data and content.
   
   The doc can be created with just a name, at which point nothing is done
   until something is saved, at which point the file is created, and 
   loaded onto the MetaTree.
   
   All saved text and metadata is stored in the file:
   
   desc: { file description }
   cont: { delta content for editor }
   
   Cloud & local_storage representation:
     name: <name>
     id:   <cloud key id>
     desc: <description>
     type: 'doc'

   Cloud representation has content, obtained by separate request.

\* ======================================================================== */

import Cloud    from '../persist/Cloud.js';
import Log      from '../sys/Log.js';
import TreeNode from './TreeNode.js';
import _        from 'lodash';

export default class Document extends TreeNode {

  constructor(id, name, description) {
    super(name, description, 'doc');
    this.id = id;
    this.content = null;
  }
  
  static async create(parid, name, desc) {
    var id = await Cloud.doc_create(parid, name, desc);
    return new Document(id, name, desc);
  }

  async update(name, desc) {
    if (name !== this.name || desc !== this.desc) {
      this.name = name;
      this.desc = desc;
      await Cloud.doc_rename(this.id, this.name);
    }
    this.notify();
  }
  
  async delete() {
    await Cloud.doc_delete(this.id);
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
        this.content = JSON.parse(await Cloud.doc_load(this.id));
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
    this.ts = await Cloud.doc_save(this.id, c);
  }

}
