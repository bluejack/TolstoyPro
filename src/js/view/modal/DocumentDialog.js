/* ========================================================================= *\
   
   File Dialog
   
   Create and edit files.

\* ========================================================================= */

import Dialog   from './Dialog.js';
import PHandler from '../../controller/ProjectHandler.js';
import Tree from '../Tree.js';

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
</div>
`;

export default class DocumentDialog extends Dialog {
  constructor(binder, doc) {
    var t = 'Create Document';
    if (doc) {
      t = 'Edit ' + doc.name;
    }
    super(t, true);
    this.doc = doc;
    this.title = t;
    this.binder = binder;
  }

  #reset_display() {
    document.getElementById('alert_conflict').style = 'display: none;';
    document.getElementById('alert_missing').style = 'display: none;';
    document.getElementById('name_label').style = 'color: var(--color);';
  }
  
  #validate_input() {
    if (!this.name) {
      throw('empty-name');
    } else {
      if (this.doc) {
        if (this.doc.name == this.name && this.doc.desc == this.desc) {
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
  
  async #handle_submit() {
    this.name = document.getElementById('file_name').value;
    this.desc = document.getElementById('file_desc').value;
    try {
      this.#validate_input();
      var proj = PHandler.get();
      if (!this.doc) {
        this.doc = await proj.create_file(this.name, this.desc, this.binder);
      } else {
        await this.doc.update(this.name, this.desc);
        Tree.render(proj);
        proj.save();
      }
      super.remove();
    } catch(err) {
      this.#display_errors(err);
    }
  }
  
  render() {
    var pelm = super.render();
    var ctoa   = 'Create';
    if (this.doc) {
      ctoa = 'Save';
    }
    pelm.innerHTML = display;
    var self = this;
    var but = document.getElementById('file_submit');
    if (this.doc) {
      var input = document.getElementById('file_name');
      input.value = this.doc.name;
      var desc = document.getElementById('file_desc');
      desc.value = this.doc.desc;
    }
    but.innerHTML = ctoa;
    but.onclick = () => {
      self.#handle_submit();
    };
  }
}