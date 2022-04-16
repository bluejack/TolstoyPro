/* ======================================================================== *\
   View
   
   This api manages the user experience of Tolstoy.
   
   I'm not yet sure if we need this, or whether individual components can
   handle the full load, given a robust dispatcher.

\* ======================================================================== */

import Align            from './Align.js';
import Applet           from './AppletPanel.js';
import AppState         from '../model/AppState.js';
import AuthHandler      from '../controller/AuthHandler.js';
import Editor           from '../editor/TextEditor.js'; // TODO load this asyncronously! It's huuge.
import Footer           from './Footer.js';
import Log              from '../sys/Log.js';
import Menu             from './Menu.js';
import ModalFactory     from './modal/ModalFactory.js';
import ProjectHandler   from '../controller/ProjectHandler.js';
import Tree             from './Tree.js';

/* ( Interface )>----------------------------------------------------------- */

export default {
  init:           init,
  reset:          init, // Semantic option for readability.
  enqueue:        enqueue
};

/* ( Members )>------------------------------------------------------------- */

// View State
var domroot = null;
var queue = [];

/* ( Public Methods )>------------------------------------------------------ */

function init(page) {
  _apply_prefs();
  _build_ui();
  _present_page(page);
  document.getElementById('loading').style.display = 'none';
}

function enqueue(action) {
  queue.push(action);
}

/* ( Private Methods )>----------------------------------------------------- */
function _build_ui() {
  Menu.init();
  Tree.init();
  Editor.init();
  Applet.init();
  Footer.init();
  Align.init();
}

function _apply_prefs() {
  var prefs = AppState.prefs();
  if (prefs.theme() !== 'default') {
    var app = document.getElementById('app');
    app.classList.remove('default_theme');
    app.classList.add(prefs.theme() + '_theme');
  }
}

/* Various things can happen here:
 *  - Logged out: but page specified: load it.
 *  - Logged in, AND page specified: load it, and queue the project check
 */
function _present_page(page) {
  if (!AuthHandler.user()) {
    page = 'welcome';
  }
  if (page) {
    ModalFactory.enqueue(page);
  }
}