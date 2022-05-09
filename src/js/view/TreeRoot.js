/* ========================================================================= *\
   
   Tree Root
   
   Root level of tree. Project name, project actions, top level tree.
   
\* ========================================================================= */

import ProjectContextMenu from './ProjectContextMenu.js';
import ProjectHandler from '../controller/ProjectHandler.js';
import Tree from './Tree.js';
import { v4 as uuidv4 } from 'uuid';

export default {
  render: render
};

const ROOT_TREE_CLASS = 'root_tree';
const id   = uuidv4();
const html = `<div id="${id}"><div id="proj_label"></div></div>`;

function render(pelm) {
  pelm.innerHTML = html;
  const elm = document.getElementById(id);
  const proj = ProjectHandler.get();
  if (proj) {
    document.getElementById('proj_label').innerHTML = proj.name;

    new Tree(elm,proj,ROOT_TREE_CLASS).render();
    
    elm.addEventListener('contextmenu', function (e) {
      e.preventDefault();
      ProjectContextMenu.display(e);
    });
  } else {
    document.getElementById('proj_label').innerHTML = '-';
  }
}