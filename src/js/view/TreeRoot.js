/* ========================================================================= *\
   
   Tree Root
   
   Root level of tree. Project name, project actions, top level tree.
   
\* ========================================================================= */

import ProjectContextMenu from './ProjectContextMenu.js';
import ProjectHandler from '../controller/ProjectHandler.js';
import Tree from './Tree.js';
import TreeFrame from './TreeFrame.js';
import TreeDoc from './TreeDoc.js';
import TreeBinder from './TreeBinder.js';
import { v4 as uuidv4 } from 'uuid';

export default {
  render: render,
  init_move: init_move,
  arrange: arrange,
  finalize: finalize
};

const ROOT_TREE_CLASS = 'root_tree';
const id   = uuidv4();
const html = `<div id="${id}"><div id="proj_label"></div><div id="tree_pos"></div></div>`;

var open_list;
var root_tree;
var curr_pos;
var locator;
var moving;

function render(pelm) {
  pelm.innerHTML = html;
  const elm = document.getElementById(id);
  locator = document.getElementById('tree_pos');
  const proj = ProjectHandler.get();
  if (proj) {
    document.getElementById('proj_label').innerHTML = proj.name;

    root_tree = new Tree(elm,proj,ROOT_TREE_CLASS);
    root_tree.render();
    
    elm.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      ProjectContextMenu.display(e);
    });
  } else {
    document.getElementById('proj_label').innerHTML = '-';
  }
}

function init_move(start) {
  moving = start;
  const onodes = root_tree.get_open_nodes();
  open_list = onodes.map((n) => {
    return { y: n.elm.getBoundingClientRect().top, n: n};
  });
  start.elm.after(locator);
  locator.style.display = 'block';
  return document.getElementById(id);
}

function arrange(y) {
  var pos = _find_pos(y);
  if (pos !== curr_pos) {
    curr_pos = pos;
    if (!curr_pos) {
      document.getElementById('proj_label').after(locator);
    } else if (curr_pos instanceof TreeDoc) {
      curr_pos.elm.after(locator);
    } else {
      curr_pos.tree_par.after(locator);
    }
  }
}

function finalize() {
  if (curr_pos !== moving) {
    ProjectHandler.get().move_after(moving.model, curr_pos ? curr_pos.model : null);
  }
  locator.style.display = 'none';
  curr_pos = null;
  // I don't think we need to do this... changes to the project will trigger.
  TreeFrame.render(ProjectHandler.get());
}

function _find_pos(y) {
  
  var elm = null;
  for (var i = 0; i < open_list.length; i++) {
    if (y < open_list[i].y) return elm;
    elm = open_list[i].n;
  }
  return elm;
}
