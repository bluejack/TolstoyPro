/* ========================================================================= *\
   
   File Dialog
   
   Create and edit files.

\* ========================================================================= */

import Dialog   from './Dialog.js';
import PHandler from '../../controller/ProjectHandler.js';
import TreeView from '../TreeView.js';

const display = `
<div id="file" class="modal_body">
  <div class="alert" id="alert_missing">Include all required fields!</div>
  <div class="alert" id="alert_conflict">There is already a file with that name.</div>
  <div class="row">
    <span class="label" id="name_label">File Name:</span>
    <span class="selection"><input type="text" id="file_name" name="name" value="" maxlength="256" autofocus /></span>
  </div>
  <div class="row">
    <span class="label" id="desc_label">Description:</span>
    <span class="selection"><textarea id="file_desc" name="desc" cols="30" rows="5"></textarea></span>
  </div>
  <div class="row">
    <span class="label"><button class="gp_button" id="file_submit" name="file_submit"></button></span>
</div>
`;

export default class FileDialog extends Dialog {
  constructor(file) {
    var t = 'Create File';
    if (file) {
      t = 'Edit ' + file.get_name();
    }
    super(t, true);
    this.file = file;
    this.title   = t;
  }

  #reset_display() {
    document.getElementById('alert_conflict').style = 'display: none;';
    document.getElementById('alert_missing').style = 'display: none;';
    document.getElementById('name_label').style = 'color: var(--color);';
  }
  
  #validate_input(self) {
    if (!self.name) {
      throw('empty-name');
    } else {
      if (self.file) {
        if (self.file.get_name() == self.name && self.file.get_description() == self.desc) {
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
    self.name = document.getElementById('file_name').value;
    self.desc = document.getElementById('file_desc').value;
    try {
      self.#validate_input(self);
      var proj = PHandler.get_curr();
      if (!self.file) {
        self.file = await proj.create_file(self.name, self.desc);
      } else {
        await self.file.update(self.name, self.desc);
        TreeView.render(proj);
        proj.save();
      }
      super.remove();
    } catch(err) {
      self.#display_errors(err);
    }
  }
  
  render() {
    var pelm = super.render();
    var ctoa   = 'Create';
    if (this.file) {
      ctoa = 'Save';
    }
    pelm.innerHTML = display;
    var self = this;
    var but = document.getElementById('file_submit');
    if (this.file) {
      var input = document.getElementById('file_name');
      input.value = this.file.get_name();
      var desc = document.getElementById('file_desc');
      desc.value = this.file.get_desc();
    }
    but.innerHTML = ctoa;
    but.onclick = () => {
      self.#handle_submit(self);
    };
  }
}