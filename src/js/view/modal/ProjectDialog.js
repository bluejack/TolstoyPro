/* ========================================================================= *\
   
   Project Dialog
   
   Create and edit Project metadata

\* ========================================================================= */

import Dialog   from './Dialog.js';
import PHandler from '../../controller/ProjectHandler.js';

const display = `
<div id="project" class="modal_body">
  <div class="alert" id="alert_missing">Include all required fields!</div>
  <div class="alert" id="alert_conflict">There is already a project with that name.</div>
  <div class="row">
    <span class="label" id="name_label">Project Name:</span>
    <span class="selection"><input type="text" id="project_name" name="name" value="" maxlength="256" autofocus /></span>
  </div>
  <div class="row">
    <span class="label"><button class="gp_button" id="proj_submit" name="proj_submit"></button></span>
</div>
`;

export default class ProjectDialog extends Dialog {
  constructor(proj) {
    var t = 'Create Project';
    if (proj) {
      t = 'Edit ' + proj.get_name();
    }
    super(t, true);
    this.project = proj;
    this.title   = t;
  }

  #reset_display() {
    document.getElementById('alert_conflict').style = 'display: none;';
    document.getElementById('alert_missing').style = 'display: none;';
    document.getElementById('name_label').style = 'color: var(--color);';
  }
  
  #validate_input(self) {
    if (!self.pname) {
      throw('empty-name');
    } else {
      if (self.project) {
        if (self.project.name == self.pname) {
          throw('no-change');
        }
      }
    }
  }
  
  #display_errors(err) {
    console.log(err);
    switch (err) {
      case 'empty-name':
        document.getElementById('alert_missing').style = 'display: block;';
        document.getElementById('name_label').style = 'color: var(--inline-alert);';
        break;
      default:
        break;
    }
  }
  
  async #handle_submit(self) {
    self.pname = document.getElementById('project_name').value;
    try {
        self.#validate_input(self);
      if (!self.project) {
        self.project = await PHandler.create(self.pname);
      } else {
        self.project = await PHandler.rename(self.pname);
      }
      self.remove();
    } catch(err) {
      self.#display_errors(err);
    }
  }
  
  render() {
    var pelm = super.render();
    var ctoa   = 'Create';
    if (this.project) {
      ctoa = 'Save';
    }
    pelm.innerHTML = display;
    var self = this;
    var but = document.getElementById('proj_submit');
    if (this.project) {
      var input = document.getElementById('project_name');
      input.value = this.project.get_name();
    }
    but.innerHTML = ctoa;
    but.onclick = () => {
      self.#handle_submit(self);
    };
  }
}