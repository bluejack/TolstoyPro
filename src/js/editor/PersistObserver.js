/* ========================================================================= *\
   
   Persist Observer

   Save changes at a sane pace.

\* ========================================================================= */

export default {
  set_editor: set_editor,
  start:      start,
  pause:      pause
}

var editor;
var interval = null;
var changes = false;

const SAVE_CHECK = 10000; // every ten seconds.

function set_editor(editor) {
  editor = editor;
  editor.on('text-change', () => {
    changes = true;
  });
}

function start(file) {
  if (interval) return;
  changes = false;
  interval = setInterval(() => {
    if (changes) {
      file.save();
    }
  },SAVE_CHECK);
}

function pause() {
  clearInterval(interval);
  interval = null;
}
