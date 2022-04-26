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

import Cloud from '../persist/Cloud.js';
import File  from './File.js';
import Log   from '../sys/Log.js';

export default class Project {
  
  constructor(id, name, curr, cache) {
    this.name  = name;
    this.id    = id;     // id of folder
    this.map   = {};     // Map of objects
    this.cache = cache;  // Tree of objects
    this.curr  = curr;   // Current file.
    this.observers = []; 
    this.build_map();
  }
  
  static async create(name) {
    var id = await Cloud.proj_create(name);
    return new Project(id, name, null, []);
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
    var remote = await Cloud.proj_load(id);
    var proj   = remote.proj;
    // Todo: handle folders. 
    var cache = [];
    var cid = null;
    if (proj.prop && proj.prop.curr) {
      cid = proj.prop.curr;
    }
    var curr = null;
    remote.files.forEach((i) => {
      var f = new File(i.id, i.name, i.description, i.ts);
      if (cid && cid == i.id) {
        curr = f;
      }
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
    return this.id;
  }

  get_name() {
    return this.name;
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
    this.cache.forEach((item) => {
      cb(item);
    });
  }

  async create_file(name, desc) {
    try {
      var res = await Cloud.obj_create(this.id, name);
      var file = new File(res.id, name, desc, res.ts);
      await file.save();
      this.map[res.id] = file;
      this.cache.push(file);
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
      await Cloud.obj_rename(this.id, name);
      this.name = name;
    }
    this.#notify();
  }
  
  async save() {
    var cache = this.#encode();
    window.localStorage.setItem(this.id, cache);
    return Cloud.proj_save(this.id, this.name, this.curr.id);
  }
  
  async hydrate() {
    try {
      var rsp = await Cloud.proj_load(this.id);
      this.name = rsp.proj.name;
      var nc = [];
      this.cache.forEach(async (o) => {
        // Todo add folder type handling.
        var f = new File(o.id, o.name, o.desc, o.ts);
        nc.push(f);
        this.map[o.id] = f; 
        await f.get_content();
      });
      this.cache = nc;
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
            this.cache.push(f);
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
      console.log("Decoded:");
      console.log(this);
    } catch(err) {
      console.log(err);
      Log.error("Failed loading project metadata.", val);
    }
  }
  
  #encode() {
    var sv = {
      name: this.name,
      curr: this.curr.id,
      cache: []
    };
    this.cache.forEach((n) => {
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

