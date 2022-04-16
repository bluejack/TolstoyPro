/* ======================================================================== *\
   
   AppState
   
   The data structure that represents the state and content of the app.
   
   On startup, if there is no existing state file, a new user experience is
   triggered.

\* ======================================================================== */

import Cloud       from '../persist/Cloud.js';
import Log         from '../sys/Log.js';
import Preferences from './Preferences.js';
import User        from './User.js';
import AuthHandler from '../controller/AuthHandler.js';

/* Interface       o ------------------------------------------------------- */

export default {
  init:    init,
  sync:    sync,
  proj_id: proj_id,
  prefs:   function() { return model.prefs },
  user:    function() { return model.user },
  clear:   clear_state

};

/* Members                 o ----------------------------------------------- */

var state;

var model = {
  user:  null,
  prefs: null,
};

const default_state = {
  prefs: { 
    theme: 'default' 
  },
  root: null, // google object id
  proj: null  // google object id
};

/* Methods                o ------------------------------------------------ */

/* Definitely Used. */

async function init() {
  var u = AuthHandler.user();
  if (!u) {
    state = default_state;
    model.prefs = new Preferences(state.prefs);
    return;
  }
  try {
    model.user = u;
    state = await _load_state();
    model.prefs = new Preferences(state.prefs);
  } catch (err) {
    Log.error(err);
  }
}

async function sync() {
  state.prefs = model.prefs.get_map();
  try {
    await Cloud.set_state(state);
  } catch (err) {
    Log.error(err, state);
  }
}

async function proj_id(proj) {
  if (proj) {
    state.proj = proj.get_id();
    sync();
  }
  return state.proj;
}

function clear_state() {
  model.user  = null;
}

/* Private methods */

async function _load_state() {
  var s = await Cloud.load_state();
  if (!s) {
    s = default_state;
    s.root = await Cloud.create_root();
    await Cloud.set_state(s);
  }
  return s;
}
