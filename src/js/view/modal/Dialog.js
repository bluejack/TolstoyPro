/* ======================================================================== *\
   
   Dialog
   
   Smallish but flexible dialog box.

\* ======================================================================== */

import Modal from './Modal.js';

/* ( Display )>------------------------------------------------------------ */

var dialog_html = `
  <div id="dialog">
    <div id="dialog_h"><span id="modal_title"></span>
      <div id="close_modal">&#10005;</div>
    </div>
    <div id="modal_content"></div>
  </div>
`;

/* ( Public Methods )>------------------------------------------------------ */

export default class Dialog extends Modal {

  render() {
    var lelm = super.render();
    var self = this;
    lelm.innerHTML = dialog_html;
    document.getElementById('modal_title').innerHTML = this.title;
    var closeme = document.getElementById('close_modal');
    if (! this.closable) {
      closeme.classList.add('hide');
    } else {
      closeme.onclick = () => {
        self.remove();
      };
    }
    return document.getElementById('modal_content');
  }
  
}
