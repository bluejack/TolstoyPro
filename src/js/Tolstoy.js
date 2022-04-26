/* ========================================================================= *\

                                   Tolstoy
   
   The Tolstoy Pro authoring application is a single-page web app offering a
   complete set of tools for those who write in any and all forms: authoring
   large works of fiction, non-fiction, short stories, poetry, screenplays &
   dramatic works --but it is also intended to be used to keep a journal, to
   take notes, to write and record letters, to manage task lists, to compose
   and collect letters. It supports organizing large writing projects of all 
   sorts, from conception to completion.
   
   This is the entry point for the application.
   
\* ========================================================================= */

import AppState       from './model/AppState.js';
import Auth           from './controller/AuthHandler.js';
import Log            from './sys/Log.js';
import ModalFactory   from './view/modal/ModalFactory.js';
import ProjectHandler from './controller/ProjectHandler.js';
import View           from './view/View.js';

/* ( Interface )>----------------------------------------------------------- */

export default {
  start: start
};

/* ( Public )>-------------------------------------------------------------- */

async function start() {
  var dest = _process_url();
  try {
    await Auth.connect();
    await AppState.init();
    await ProjectHandler.init();
    View.init(dest);
  } catch (err) {
    Log.error(err);
  }
}

/* ( Private )>------------------------------------------------------------- */

function _listen_for_url_changes(e) {
  var dest = window.location.hash.substr(1);
  if (dest && dest !== '#') {
    ModalFactory.enqueue(dest);
  }
}

function _process_url() {
  window.addEventListener('popstate', _listen_for_url_changes);
  return window.location.hash.substr(1);
}


