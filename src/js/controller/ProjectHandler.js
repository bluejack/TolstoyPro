/* ========================================================================= *\

   Project Handler
   
   Handle all aspects of project-scope management.
   
   When activating the handler, a healthy state looks like so: the "current"
   project exists. However, some things can be anomalous:
   
   1. There is no known current project, but projects exist: 
      -- User should choose the project
   2. The named current project does not exist:
      -- User should be informed of the error and choose/create a project.
   3. There is no known current project, and none exist:
      -- New User walk through to create project and first file.
  
\* ========================================================================= */

import AppState     from '../model/AppState.js';
import AuthHandler  from './AuthHandler.js';
import Cloud        from '../persist/Cloud.js';
import Log          from '../sys/Log.js';
import ModalFactory from '../view/modal/ModalFactory.js';
import Project      from '../model/Project.js';

/* Interface o ------------------------------------------------------------- */

export default {
  init:     init,
  clear:    clear,
  create:   create,
  set:      set,
  get:      get,
  list:     list,
  rename:   rename,
  observe:  observe
};

/* Members o --------------------------------------------------------------- */

var curr_proj = null;
var obs  = [];

/* Methods o --------------------------------------------------------------- */

async function init() {
  if (! AuthHandler.user()) return;
  try {
    var id = await AppState.proj_id();
    if (id) {
      curr_proj = await Project.load(id);
      _validate();
    } else {
      ModalFactory.enqueue('project_create');
    }
  } catch (err) {
    Log.error(err);
  }
}

function clear() {
  curr_proj = null;
}

async function set(new_curr) {
  curr_proj = new_curr;
  await AppState.proj_id(curr_proj);
  notify();
}

function get() {
  return curr_proj;
}

async function rename(name) {
  if (!curr_proj) {
    throw 'no-active-project';
  }
  await curr_proj.rename(name);
  notify();
}

async function create(name) {
  var p = await Project.create(name);
  curr_proj = p;
  AppState.proj_id(p);
  ModalFactory.enqueue('doc_create');
  notify();
}

async function list() {
  var contents = await Cloud.proj_list();
  var projects = [];
  contents.forEach((obj) => {
    projects.push({id: obj.id, name: obj.name});
  });
  return projects;
}

function observe(cb) {
  obs.forEach((i) => {
    if (cb === i) return;
  });
  obs.push(cb);
}

function notify() {
  obs.forEach((cb) => {
    cb(curr_proj);
  });
}

function _validate() {
  if (!curr_proj.curr) {
    ModalFactory.enqueue('doc_create');
  }
}
