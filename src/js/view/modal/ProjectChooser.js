/* ========================================================================= *\
   
   Project Panel
   
   Create and edit Project metadata

\* ========================================================================= */

import Dialog         from './Dialog.js';
import Project        from '../../model/Project.js';
import ProjectHandler from '../../controller/ProjectHandler.js';
import View           from '../View.js';

const display = `
<div id="proj_chooser" class="modal_body">
  <ol id="proj_options"></ol>
</div>
`;

export default class ProjectChooser extends Dialog {
  constructor() {
    super('Project Chooser', true);
    this.project = ProjectHandler.get();
  }

  async render(pelm) {
    pelm = super.render();
    pelm.insertAdjacentHTML('afterbegin', display);
    var optlist = document.getElementById('proj_options');
    var plist = await ProjectHandler.list();
    var curr = null;
    if (this.project) {
      curr = this.project.id;
    }
    plist.forEach((proj) => {
      if (proj.id == curr) {
        optlist.insertAdjacentHTML("beforeend", '<li> (current) ' + proj.name + '</li>');
      } else {
        optlist.insertAdjacentHTML("beforeend", '<li><a href="#" id="' + proj.id + '">' + proj.name + '</a></li>');
        document.getElementById(proj.id).onclick = async () => {
          var project = await Project.load(proj.id);
          ProjectHandler.set(project);
          super.remove();
        };
      }
    });
  }
}
