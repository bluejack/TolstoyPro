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

import AppState from '../model/AppState.js';
import AuthHandler from './AuthHandler.js';
import Cloud    from '../persist/Cloud.js';
import Log      from '../sys/Log.js';
import ModalFactory from '../view/modal/ModalFactory.js';
import Project  from '../model/Project.js';

/* Interface o ------------------------------------------------------------- */

export default {
  init:     init,
  clear:    clear,
  create:   create,
  set_curr: set_curr,
  get_curr: get_curr,
  list:     list,
  rename:   rename,
  observe:  observe
};

/* Members o --------------------------------------------------------------- */

var curr = null;
var obs  = [];

/* Methods o --------------------------------------------------------------- */

async function init() {
  if (! AuthHandler.user()) return;
  try {
    var id = await AppState.proj_id();
    if (id) {
      var name = await Cloud.get_obj_meta(id);
      if (name) {
        curr = new Project(name, id);
        await curr.load();
        _validate();
      } else {
        // Expected project missing, repair?
      }
      notify();
    } else {
      // First time user: generate special messaging?
      ModalFactory.enqueue('project_create');
    }
  } catch (err) {
    Log.warning('could not find project: ' + err);
  }
}

function clear() {
  curr = null;
}

// TODO: load the new project.
async function set_curr(new_curr) {
  curr = new_curr;
  await curr.load();
  await AppState.proj_id(curr);
  notify();
}

function get_curr() {
  return curr;
}

async function rename(name) {
  if (!curr) {
    throw 'no-active-project';
  }
  await curr.rename(name);
  notify();
}

async function create(name) {
  var id = await Cloud.create_folder(Cloud.get_root(), name);
  var p = new Project(name, id);
  curr = p;
  AppState.proj_id(p);
  ModalFactory.enqueue('file_create');
  notify();
}

async function list() {
  var contents = await Cloud.pull_folder(Cloud.get_root());
  var projects = [];
  contents.forEach((obj) => {
    if (obj.mimeType == 'application/vnd.google-apps.folder') {
      projects.push({id: obj.id, name: obj.name});
    }
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
    cb(curr);
  });
}

function _validate() {
  if (!curr.get_curr()) {
    ModalFactory.enqueue('file_create');
  }
}
