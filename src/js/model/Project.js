/* ======================================================================== *\
   
   Project
   
   Represents an individual project; does not manage application state. Use
   ProjectHandler for managing application state. The active project is the
   only one that can be updated at any given time.
   
   A project stores lightweight state in localStorage and does a background 
   rebuild on load. This is enough to render the UI, although if files have
   changed from another browser or app session, the initial display will be
   incorrect until the full state is restored. 
   
   Local Storage:
   {
     name: <string>,
     curr: <id>,
     cache: <tree arrays>
   }
   
\* ======================================================================== */

import Cloud  from '../persist/Cloud.js';
import File   from './File.js';
import Folder from './Folder.js';
import Log    from '../sys/Log.js';

export default class Project {
  
  constructor(id, name, curr, nodes, map) {
    this.id        = id;
    this.folder    = new Folder(id, name, null, null, nodes);
    this.map       = map;
    this.curr      = curr;   // Current file.
    this.observers = []; 
    this.pending   = false;
  }
  
  static async create(name) {
    var id = await Cloud.proj_create(name);
    return new Project(id, name, null);
  }

  static async load(id) {
    var p = Project.#load_from_local(id);
    if ( !p ) {
      p = await Project.#load_from_cloud(id);
    } else {
      p.reconcile();
    }
    if (!p.curr) {
      p.curr = p.folder.nodes[0].id;
    }
    return p;
  }
  
  static #load_from_local(id) {
    try {
      var loc = window.localStorage.getItem(id);
      if (loc) {
        loc = JSON.parse(loc);
        var cache = [];
        var map = {};
        var curr;
        loc.cache.forEach((i) => {
          var f = new File(i.id, i.name);
          if (f.id == loc.curr) {
            curr = f;
          }
          // Todo, build folder hierarchy.
          cache.push(f);
          map[f.id] = f;
        });
        return new Project(id, loc.name, curr, cache, map);
      }
    } catch (err) {
      Log.error(err, id);
    }
    return null;
  }

  static async #load_from_cloud(id) {
    var parts   = await this.assemble_project(id);
    return new Project(id, parts.name, parts.curr, parts.nodes, parts.map);
  }
  
  async reconcile() {
    var parts   = await Project.assemble_project(this.id);
    this.name   = parts.name;
    this.map    = parts.map;
    this.folder = new Folder(this.id, this.name, null, null, parts.nodes);
    this.curr   = parts.curr;
    this.#notify();
  }

  static async assemble_project(id) {
    var proj_parts = {
      name:  null,
      map:   {},
      nodes: [],
      curr:  null
    };

    var rsp = await Cloud.proj_load(id);
    console.log(rsp);
    proj_parts.name = rsp.proj.name;
    var cid = null;
    if (rsp.proj.prop && rsp.proj.prop.curr) {
      cid = rsp.proj.prop.curr;
    }

    // TODO: Enhance to handle folders.    
    rsp.files.forEach((f) => {
      var f = new File(f.id, f.name, f.description, f.ts);
      if (cid && cid == f.id) {
        proj_parts.curr = f;
      }
      proj_parts.map[f.id] = f;
      proj_parts.nodes.push(f);
    });
    
    
    return proj_parts;    
  }

  get_id() {
    return this.folder.id;
  }

  get_name() {
    return this.folder.name;
  }
  
  get_curr() {
    return this.curr;
  }

  set_curr(f) {
    this.curr = f;
    this.#notify();
    this.save();
  }

  walk_tree(cb) {
    // Needs to handle folder recursion; set up root folder?
    this.folder.nodes.forEach((item) => {
      cb(item, this.folder);
    });
  }

  async create_folder(name, desc) {
    await Folder.create(this.folder.id, name, desc);    
  }

  async create_file(name, desc) {
    try {
      var file = await File.create(this.folder.id, name, desc);
      this.map[file.id] = file;
      this.folder.nodes.push(file);
      this.curr = file;
      this.#notify();
      this.save();
    } catch (err) {
      console.log(err);
    }
  }

  async rename (name) {
    if (name == this.folder.name) {
      return;
    } else {
      this.folder.name = name;
      await this.save();
    }
    this.#notify();
  }
  
  async remove_doc(d) {
    var reset_curr = false;
    if (d === this.curr) {
      reset_curr = true;
    }
    delete this.map[d.id];
    this.walk_tree((doc,fldr) => {
      if (d.id == doc.id) {
        fldr.remove(doc);
        return true;
      } else if (reset_curr) {
        this.curr = doc;
        reset_curr = false;
      }
      
    });
    this.#notify();
    this.save();
  }
  
  async save() {
    var cache = this.#encode();
    window.localStorage.setItem(this.folder.id, cache);
    return Cloud.proj_save(this.folder.id, this.folder.name, this.curr.id);
  }
  
  #encode() {
    var sv = {
      name: this.folder.name,
      curr: this.curr.id,
      cache: []
    };
    this.folder.nodes.forEach((n) => {
      sv.cache.push(n.to_tree());
    });
    return JSON.stringify(sv);
  }
  
  observe(cb) {
    this.observers.push(cb);
    if (this.pending == true) {
      this.#notify();
      this.pending == false;
    }
  }
  
  #notify() {
    if (this.observers.count == 0) {
      this.pending = true;
    }
    this.observers.forEach((obs) => {
      obs(this);
    });
  }
}

