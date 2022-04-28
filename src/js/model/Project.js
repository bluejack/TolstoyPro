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
  
  constructor(id, name, curr, nodes) {
    this.folder = new Folder(id, name, null, null, nodes);
    this.map   = {};     // Map of objects
    this.curr  = curr;   // Current file.
    this.observers = []; 
    this.build_map();
  }
  
  static async create(name) {
    var id = await Cloud.proj_create(name);
    return new Project(id, name, null);
  }

  static async load(id) {
    var p = Project.#load_from_local(id);
    if ( !p ) {
      p = await Project.#load_from_cloud(id);
    }
    if (!p.curr) {
      p.curr = p.cache[0];
    }
    p.hydrate(); // Background loads.
    return p;
  }
  
  static async #load_from_cloud(id) {
    var cloud = await Cloud.proj_load(id);
    var proj  = cloud.proj;
    // Todo: handle folders. 
    var cache = [];
    var cid = null;
    if (proj.prop && proj.prop.curr) {
      cid = proj.prop.curr;
    }
    var curr = null;
    cloud.files.forEach((i) => {
      var f = new File(i.id, i.name, i.description, i.ts);
      if (cid && cid == i.id) {
        curr = f;
      }
      // Todo: build folder hierarchy
      cache.push(f);
    });
    return new Project(id, proj.name, curr, cache);
  }
  
  static #load_from_local(id) {
    try {
      var loc = window.localStorage.getItem(id);
      if (loc) {
        loc = JSON.parse(loc);
        var cache = [];
        var curr;
        loc.cache.forEach((i) => {
          var f = new File(i.id, i.name);
          if (f.id == loc.curr) {
            curr = f;
          }
          // Todo, build folder hierarchy.
          cache.push(f);
        });
        return new Project(id, loc.name, curr, cache);
      }
    } catch (err) {
      Log.error(err, id);
    }
    return null;
  }

  build_map() {
    this.walk_tree((i) => {
      this.map[i.id] = i;
    });
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
      cb(item);
    });
  }

  async create_folder(name, desc) {
    var folder = Folder.create(this.folder.id, name, desc);    
  }

  async create_file(name, desc) {
    try {
      var file = File.create(this.folder.id, name, desc);
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
      await Cloud.obj_rename(this.folder.id, name);
      this.folder.name = name;
    }
    this.#notify();
  }
  
  async save() {
    var cache = this.#encode();
    window.localStorage.setItem(this.folder.id, cache);
    return Cloud.proj_save(this.folder.id, this.folder.name, this.curr.id);
  }
  
  async hydrate() {
    try {
      var rsp = await Cloud.proj_load(this.folder.id);
      this.folder.name = rsp.proj.name;
      var nc = [];
      this.folder.nodes.forEach(async (o) => {
        // Todo add folder type handling.
        var f = new File(o.id, o.name, o.desc, o.ts);
        nc.push(f);
        this.map[o.id] = f; 
        await f.get_content();
      });
      this.folder.nodes = nc;
    } catch (err) {
      console.log(err);
    }
  }

  #encode() {
    var sv = {
      name: this.folder.name,
      curr: this.curr.id,
      cache: []
    };
    this.nodes.forEach((n) => {
      sv.cache.push(n.to_tree());
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

