/* ======================================================================== *\
   
   Page (Modal)
   
   Abstract class for all the static views.

\* ======================================================================== */

import AppState     from '../../model/AppState.js';
import Modal        from '../modal/Modal.js';

const page_html = `
<div id="modal_page">
  <div id="modal_page_h"><span id="modal_title"></span></div>
  <div id="modal_page_content"></div>
  <div id="modal_end_close" class="hide"><button id="modal_done">DONE</buttom></div>
</div>
`;

export default class ModalPage extends Modal {

  constructor(title, closable, key) {
    super(title, closable);
    this.key = key;
  }

  #_handle_closable() {
    if (this.closable) {
      this.done.classList.remove('hide');
    }
  }

  remove() {
    super.remove();
    window.location.hash = '';
  }

  render() {
    var pelm = super.render();
    pelm.innerHTML = page_html;
    document.getElementById('modal_title').innerHTML = this.title;
    this.done  = document.getElementById('modal_end_close');
    this.#_handle_closable();
    document.getElementById('modal_done').onclick = () => { this.remove(); };
    document.getElementById('modal_page_content').innerHTML = this.html;
  }
}
