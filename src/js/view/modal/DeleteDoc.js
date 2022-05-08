/* ========================================================================= *\
   
   Delete Documemt
   
   Confirm deletion.

\* ========================================================================= */

import Dialog   from './Dialog.js';
import PHandler from '../../controller/ProjectHandler.js';
import TextEditor from '../../editor/TextEditor.js';

const display = `
<div id="deldoc" class="modal_body">
  <p>Are you sure you want to delete this document?</p>
  <div class="row">
    <span class="label"><button class="gp_button" id="doc_del" name="doc_del"></button></span>
</div>
`;

export default class DeleteDoc extends Dialog {
  constructor(file) {
    var t = 'Delete Document: ' + file.name;
    super(t, true);
    this.file = file;
  }

  async handle_submit() {
    try {
      TextEditor.set_file(null);
      PHandler.get().remove_doc(this.file);
      await this.file.delete();
    } catch (err) {
      console.log(err);
    }
    this.remove();
  }
  
  render() {
    var pelm = super.render();
    var ctoa = 'Delete';
    pelm.innerHTML = display;
    var self = this;
    var but  = document.getElementById('doc_del');
    but.innerHTML = ctoa;
    but.onclick   = () => {
      self.handle_submit();
    };
  }
}