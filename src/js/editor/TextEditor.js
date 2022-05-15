/* ========================================================================= *\
   
   Edit

   The primary panel for editing.

\* ========================================================================= */

import Document from '../model/Document.js';
import Quill from 'quill';
import Log   from '../sys/Log.js';
import PersistObserver from './PersistObserver.js';
import ProjectHandler  from '../controller/ProjectHandler.js';

export default {
  init:     init,
  pause:    pause,
  resume:   resume,
  set_file: set_file
};

const html = `<div id="editable"></div>`;

var edelm;
var quedit;
var file; 
var onhold;
var blankpage = { ops: [ { insert: '\n' }]};

function init() {
  document.getElementById('editor').innerHTML = html;
  edelm = document.getElementById('editable');
  var toolbarOptions = [
    [{ 'font': [] }],
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
//    ['blockquote', 'code-block'],
  
//    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'align': [] }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
//    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
//    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  
    ['clean']                                         // remove formatting button
  ];

  quedit = new Quill(edelm, {
    modules: { toolbar: toolbarOptions },
    theme: 'snow'
  });
  PersistObserver.set_editor(quedit);

  var proj = ProjectHandler.get();
  if (proj) {
    var cf = proj.curr;
    if (cf) {
      set_file(cf);
    }
    // For file change events:
    proj.observe(proj_observer);
  }

  // In case of project change;
  ProjectHandler.observe(ph_observer);
}

function ph_observer(proj) {
  var nf = proj.curr;
  if (nf) {
    set_file(nf);
  }
  proj.observe(proj_observer);    
}

function proj_observer(proj) {
  var nf = proj.curr;
  if (nf !== file) {
    set_file(nf);
  }
}

function pause() {
  
  if (file) {
    PersistObserver.pause();
    file.set_content(quedit.getContents());
    quedit.setContents(blankpage);
    file.save();
  }
  onhold = file;
  file = null;
}

function resume() {
  if (onhold && !file) {
    file = onhold;
    onhold = null;
    quedit.detContants(file.get_content());
    PersistObserver.start(file);
  }
}

async function set_file(f) {
  if (! (f instanceof Document)) {
    file = null;
    PersistObserver.pause();
    return;
    // TODO - disable editor.
  }
  try {
    if (file) {
      PersistObserver.pause();
      file.set_content(quedit.getContents());
      file.save();
    }
    file = f;
    var ct = await f.get_content();
    if (!ct) {
      ct = blankpage;
    }
    quedit.setContents(ct,'api');
    PersistObserver.start(f);
    
  } catch (err) {
    Log.error(err);
  } 
}
  

