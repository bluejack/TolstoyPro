/* ======================================================================== *\
   
   Modal
   
   The TolstoyPro modal framework works like follows:
   
   * All subclasses are traditional modal.

   * There are two kinds of modal:
    - dialogs
    - pages
    
   * Dialogs have:
    - [mandatory] title bar
    - [optional]  close button
    - [mandatory] content
    - [otional]   user actions

   * Pages have:
    - [mandatory] page title
    - [optional]  back arrow
    - [mandatory] content
    - [optional]  user actions
   
   These are very similar in function, but they have different ux in
   presentation: 
   
   dialogs are small, and used for short notices or actions that break 
   the normal flow of app usage. For example: creating a new project
   or modifying application preferences.

   pages are large, near full-screen overlays that present long-form,
   generally static content, and have no or minimal user engagement.
   For example: the welcome page inviting sign-in, or the terms of
   service requiring acceptance.

\* ======================================================================== */

import ModalFactory from './ModalFactory.js';

var html = `<div id="lightbox"></div>`;

export default class Modal {
  constructor(title, closable) {
    this.title = title;
    this.closable = closable;
    this.elm = null;
    this.pid = document.getElementById('app');
  }  
  
  render() {
    this.pid.insertAdjacentHTML('afterbegin', html);
    this.elm = document.getElementById('lightbox');
    return this.elm;
  }
  
  remove() {
    this.elm.remove();
    ModalFactory.dequeue();
  }
}
