/* ======================================================================== *\
   
   Intro Page -- The landing page for someone signing in / up
   
\* ======================================================================== */

import ModalPage from './ModalPage.js';
import AppState   from '../../model/AppState.js';

export default class IntroPage extends ModalPage {
  constructor() {
    super('Welcome Back!', true, 'intro');
    this.html = `
<div id="intro_page" class="static_page">
  <p>Welcome <span id="user_first_name"></span>!</p>
  <p>TolstoyPro should be easy to use. There are just a few useful things to
     be aware of:</p>
  <ol class="intro">
    <li>Each project is completely distinct from the next. You can
     easily re-organize any given project, but moving material between
     projects has less support. Good candidates for a project might be:
     <ul>
       <li>A novel</li>
       <li>A standalone short story</li>
       <li>A play or screenplay</li>
       <li>A non-fiction book</li>
       <li>Poems intended to work or publish together</li>
       <li>A year's worth of journal entries</li>
       <li>Class notes for one specific class</li>
    </ul>
    But don't let our ideas impede your creativity. Do it your way!
    </li>
    <li>The project organizer is on the left, and lets you structure and 
        restructure your project to your heart's content.</li>
    <li>Each file in your project is a separate file in your Google Drive,
        and you can always access them there, outside of this app.</li>
    <li>(( A word on file formats, once we settle this. ))</li>
    <li>This panel will usually be your editing panel, where you can just
        write and format as you would in any other app.</li>
    <li>The thin strip to the right is where you have mini-apps, such as a
        todo list, that you can quickly reference at any time.</li>
    <li>There is a bit of extra info in the footer. You've porbably
        already noticed it!</li>
    <li>You do not need to sign out or log out between sessions unless you 
        are using a public machine, or if you use multiple google drive
        accounts.</li>
  </ol>
</div>
    `;
  }
  
  render() {
    super.render();
    var u = AppState.user();
    if (u) {
      document.getElementById('user_first_name').innerHTML = u.first_name();
    }
  }
}