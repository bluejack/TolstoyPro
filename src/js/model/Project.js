/* ======================================================================== *\
   
   Project
   
   Represents an individual project; does not manage application state. Use
   ProjectHandler for managing application state. The active project is the
   only one that can be updated at any given time.

   A healthy project has metadata about the project structure including the
   current, active file. In that case, the project should load all the data
   sets to drive the tree and editor views.
   
   However, the following situations can happen:
   
   1. Existing files, but no metadata file:
      -- User needs to be informed about the function of the metadata file.
      -- The tree is rebuilt, and the user chooses a file.
   2. Existing metadata, but mismatch to files:
      -- User needs to be informed of any discrepancies
      -- If current file doesn't exist, user chooses a new file.
   3. Neither metadata nor files: 
      -- A new project, or folder manually created; treat as a new project,
         and get the user to create a new file.

\* ======================================================================== */

import Cloud from '../persist/Cloud.js';
import File  from './File.js';
import Log   from '../sys/Log.js';

export default class Project {
  
  constructor(name, id) {
    this.name = name;
    this.id = id;
    this.meta_id = null;
    this.map = {};
    this.tree = [];
    this.curr = null;
    this.observers = [];
  }

  get_name() {
    return this.name;
  }
  
  get_id() {
    return this.id;
  }

  get_curr() {
    return this.curr;
  }

  set_curr(f) {
    this.curr = f;
    this.#notify();
  }

  walk_tree(cb) {
    this.tree.forEach((item) => {
      cb(item);
    });
  }

  async create_file(name, desc) {
    try {
      var res = await Cloud.create_file(this.id, name);
      var file = new File(res.id, name, desc, res.ts);
      await file.save();
      this.map[res.id] = file;
      this.tree.push(file);
      this.curr = file;
      this.#notify();
      this.save();
    } catch (err) {
      console.log(err);
    }
  }
  
  async rename (name) {
    if (name == this.name) {
      return;
    } else {
      await Cloud.rename_obj(this.id, name);
      this.name = name;
    }
    this.#notify();
  }
  
  async save() {
    if (!this.meta_id) {
      this.meta_id = await Cloud.new_proj_meta(this.id, this.#encode());
    } else {
      Cloud.save_file(this.meta_id, this.#encode());
    }
  }
  
  async load() {
    try {
      var pmeta = await Cloud.get_proj_meta(this.id);
      if (! pmeta ) {
        this.meta_id = await Cloud.new_proj_meta(this.id, JSON.stringify( { curr: null, tree: [] } ));
      } else {
        this.meta_id = pmeta.id;
        this.#decode(pmeta.meta);
        if (this.curr) {
          await this.curr.get_content();
        }
      }
      // Get top level 
//      var pfiles = await Cloud.pull_folder(this.id);
    } catch (err) {
      console.log(err);
    }
  }

  // May need to rework this when we implement folders
  #decode(val) {
    try {
      var obj = JSON.parse(val);
      if (obj && obj.tree) {
        obj.tree.forEach((n) => {
          // FixMe: n.type should be enforced.
          if (n && (n.type == 'file' || !n.type)) {
            var f = new File(n.id, n.name, n.desc, n.ts);
            this.tree.push(f);
            this.map[n.id] = f; 
          } else {
            console.log("Ignoring file type " + n.type + " -- not implemented yet?");
            console.log(n);
          } 
        });
      }
      if (obj && obj.curr_id) {
        this.curr = this.map[obj.curr_id];
      }
    } catch(err) {
      Log.error("Failed loading project metadata.", val);
    }
  }
  
  #encode() {
    var sv = {
      curr_id: this.curr.get_id(),
      tree: []
    };
    this.tree.forEach((n) => {
      sv.tree.push(n.to_tree());
    });
    return JSON.stringify(sv);
  }
  
  observe(cb) {
    this.observers.push(cb);
  }
  
  #notify() {
    this.observers.forEach((obs) => {
      obs(this);
    });
  }
}

