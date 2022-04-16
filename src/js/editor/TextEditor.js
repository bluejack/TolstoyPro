/* ========================================================================= *\
   
   Edit

   The primary panel for editing.

\* ========================================================================= */

import Quill from 'quill';
import Log   from '../sys/Log.js';
import ProjectHandler from '../controller/ProjectHandler.js';

export default {
  init:     init,
  set_file: set_file
};

const html = `<div id="editable"></div>`;

var edelm;
var quedit;
var file; 

function init() {
  document.getElementById('editor').innerHTML = html;
  edelm = document.getElementById('editable');
  var toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
  
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
  ];

  quedit = new Quill(edelm, {
    modules: { toolbar: toolbarOptions },
    theme: 'snow'
  });

  var proj = ProjectHandler.get_curr();
  if (proj) {
    var cf = proj.get_curr();
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
  var nf = proj.get_curr();
  if (nf) {
    set_file(nf);
  }
  proj.observe(proj_observer);    
}

function proj_observer(proj) {
  var nf = proj.get_curr();
  if (nf !== file) {
    set_file(nf);
  }
}

async function set_file(f) {
  try {
    if (file) {
      file.set_content(quedit.getContents());
      file.save();
    }
    file = f;
    var ct = await f.get_content();
    if (!ct) {
      ct = {};
    }
    quedit.setContents(ct,'api');
  } catch (err) {
    Log.error(err);
  }
}
  

