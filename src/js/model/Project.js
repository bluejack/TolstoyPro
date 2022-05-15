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
     meta_id: <cloud id for meta file>
     name: <string>,
     curr: <id>,
     tree: <tree arrays>
   }
   
\* ======================================================================== */

import Cloud  from '../persist/Cloud.js';
import Binder from './Binder.js';
import Doc    from './Document.js';
import Log    from '../sys/Log.js';

export default class Project {
  
  constructor(id, state) {
    this.id        = id;
    this.observers = []; 
    this.pending   = false;
    this.#decode(state);
  }
  
  static async create(name) {
    const ids = await Cloud.proj_create(name);
    var state = {
      name: name,
      meta: ids.meta_id,
      curr: null,
      tree: [],
    };
    await Cloud.proj_save(ids.proj_id, state);
    return new Project(ids.proj_id, state);
  }

  static async load(id) {
    var p = Project.#load_from_local(id);
    if ( !p ) {
      p = await Project.#load_from_cloud(id);
    } else {
      await p.reconcile();
    }
    return p;
  }
  
  static #load_from_local(id) {
    var state = window.localStorage.getItem(id);
    if (state) {
      var sobj = JSON.parse(state);
      return new Project(id, sobj);
    }
    return null;
  }

  static async #load_from_cloud(id) {
    var state = await Cloud.proj_load(id);
    if (state) {
      return new Project(id, state);
    }
  }
  
  async reconcile() {
    var state    = await Cloud.proj_load(this.id);
    this.#decode(state);
    this.notify();
  }

  set_curr(doc) {
    this.curr = doc;
    this.save();
  }

  walk_tree(cb) {
    
    function _walk_arr(arr) {
      for (var pos=0; pos < arr.length; pos++) {
        cb(arr[pos], arr, pos);
        if (arr[pos] instanceof Binder) {
          _walk_arr(arr[pos].tree);
        }
      }
    }
    if (this.tree && this.tree.length > 0) {
      _walk_arr(this.tree);
    }
  }

  create_binder(name, desc, parent) {
    var binder = new Binder(name, desc);
    if (!parent) {
      this.tree.push(binder);
    } else {
      parent.tree.push(binder);
      parent.notify();
    }
    this.save();
  }

  async create_file(name, desc, binder) {
    try {
      var file = await Doc.create(this.id, name, desc);
      if (binder) {
        binder.tree.push(file);
        binder.open = true;
      } else {
        this.tree.push(file);
      }
      this.curr = file;
      this.save();
    } catch (err) {
      console.log(err);
    }
  }

  async rename (name) {
    if (name == this.name) {
      return;
    } else {
      this.name = name;
      await this.save();
    }
  }
  
  async remove_doc(d) {
    var reset_curr = false;
    if (d === this.curr) {
      reset_curr = true;
      this.curr = null;
    }
    this.walk_tree((doc,arr,pos) => {
      if (doc.id && d.id == doc.id) {
        arr.splice(pos,1);
      } else if (reset_curr) {
        this.curr = doc;
        reset_curr = false;
      }
    });
    this.save();
  }
  
  async move_after(from, to) {
    if (!to) {
      console.log("First pos");
      this.#lift(from);
      this.tree.splice(0,0,from);
    } else if (from === to) {
      console.log("No move required.");
    } else {
      this.#lift(from);
      if (!this.#shift(from, to)) {
        // This is a bug state, but we don't want to lose an item!
        this.tree.splice(0,0,from);
      }
    }
    this.notify();
  }
  
  async save() {
    this.notify();
    var state = this.#encode();
    window.localStorage.setItem(this.id, JSON.stringify(state));
    return Cloud.proj_save(this.meta, state);
  }
  
  #lift(node) {
    function _scan_to_lift(t) {
      for (var i = 0; i < t.length; i++) {
        if (t[i] === node) {
          t.splice(i, 1);
          return true;
        } else if (t[i] instanceof Binder) {
          if (_scan_to_lift(t[i].tree)) {
            return true;
          }
        }
      }
      return false;
    }
    return _scan_to_lift(this.tree);
  }
  
  #shift(add, after) {
    function _scan_to_shift(t) {
      for (var i = 0; i < t.length; i++) {
        if (t[i] === after) {
          if (t[i] instanceof Binder) {
            t[i].tree.splice(0,0,add);
          } else {
            t.splice(i+1, 0, add);
          }
          return true;
        } else if (t[i] instanceof Binder) {
          if (_scan_to_shift(t[i].tree)) {
            return true;
          }
        }
      }
      return false;
    }
    return _scan_to_shift(this.tree);
  }
  
  #encode() {
    
    function _extract_array(arr) {
      var tree = [];
      arr.forEach((i) => {
        var node = {
          type: i.type,
          name: i.name,
          desc: i.desc
        };
        switch (i.type) {
          case 'doc':
            node.id = i.id;
            tree.push(node);
            break;
          case 'bind':
            node.open = i.open;
            node.tree = _extract_array(i.tree);
            tree.push(node);
            break;
          default:
            console.log("Unexpected type: " + i.type);
        }
      });
      return tree;
    }
    
    var cache = _extract_array(this.tree);
    return {
      id: this.id,
      name: this.name,
      curr: this.curr.id,
      meta: this.meta,
      tree: cache
    };
  }
  
  #decode(state) {

    this.name      = state.name;
    this.meta      = state.meta;
    this.curr      = state.curr;

    var self = this;
    var tree = [];
    function _hydrate_tree(lst) {
      var arr = [];
      if (lst && lst.length > 0) {
        lst.forEach((i) => {
          switch (i.type) {
            case 'doc':
              var f = new Doc(i.id, i.name, i.desc);
              if (!self.curr || i.id === self.curr) {
                self.curr = f;
              }
              arr.push(f);
              break;
            case 'bind':
              var n = new Binder(i.name, i.desc, i.open);
              n.tree = _hydrate_tree(i.tree);
              arr.push(n);
              break;
            default:
              console.log(`Unexpected type: ${i.type}`);
          }
        });
      }
      if (!(self.curr instanceof Doc)) {
        self.curr = null;
      }
      return arr;
    }
    this.tree = _hydrate_tree(state.tree);
  }
  
  observe(cb) {
    this.observers.push(cb);
    if (this.pending == true) {
      this.pending = false;
      this.notify();
    }
  }
  
  notify() {
    if (this.observers.length == 0) {
      this.pending = true;
    }
    this.observers.forEach((obs) => {
      obs(this);
    });
  }
}
