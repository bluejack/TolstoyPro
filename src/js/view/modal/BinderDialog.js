/* ========================================================================= *\
   
   Binder Dialog
   
   Create and edit files.

\* ========================================================================= */

import Dialog   from './Dialog.js';
import PHandler from '../../controller/ProjectHandler.js';
import TreeFrame from '../TreeFrame.js';

const display = `
<div id="file" class="modal_body">
  <div class="row">
    <span class="label" id="name_label">Binder Name:</span>
    <span class="selection"><input type="text" id="binder_name" name="name" value="" maxlength="256" autofocus /></span>
  </div>
  <div class="row">
    <span class="label" id="desc_label">Description:</span>
    <span class="selection"><textarea id="binder_desc" name="desc" cols="30" rows="5"></textarea></span>
  </div>
  <div class="row">
    <span class="label"><button class="gp_button" id="binder_submit" name="binder_submit"></button></span>
</div>
`;

export default class BinderDialog extends Dialog {
  constructor(parent, binder) {
    var t = 'Create Binder';
    if (binder) {
      t = 'Edit ' + binder.name;
    }
    super(t, true);
    this.parent = parent;
    this.binder = binder;
    this.title   = t;
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
    this.name = document.getElementById('binder_name').value;
    this.desc = document.getElementById('binder_desc').value;
    try {
      var proj = PHandler.get();
      if (!this.binder) {
        this.binder = await proj.create_binder(this.name, this.desc, this.parent);
      } else {
        await this.binder.update(this.name, this.desc);
        proj.save();
      }
      super.remove();
    } catch(err) {
      console.log(err);
    }
  }
  
  // TODO Only allow button press when there is a changed binder name.
  render() {
    var pelm = super.render();
    var ctoa   = 'Create';
    if (this.binder) {
      ctoa = 'Save';
    }
    pelm.innerHTML = display;
    var self = this;
    var but = document.getElementById('binder_submit');
    if (this.binder) {
      var input = document.getElementById('binder_name');
      input.value = this.binder.name;
      var desc = document.getElementById('binder_desc');
      desc.value = this.binder.desc;
    }
    but.innerHTML = ctoa;
    but.onclick = () => {
      self.#handle_submit();
    };
  }
}