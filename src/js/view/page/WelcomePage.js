/* ======================================================================== *\
   
   Welcome Page
   
   Where first time and logged out users land.

\* ======================================================================== */

import ModalPage  from './ModalPage.js';
import Button     from '../Button.js';
import Auth       from '../../controller/AuthHandler.js';

export default class WelcomePage extends ModalPage {
  constructor() {
    super('Tolstoy Pro', false, 'welcome');
    this.html = `
<div id="welcome_page" class="static_page">
  <p class="tagline">Serious writing tools for serious writers.</p>
  <div id="login_box"></div>
  <p>TolstoyPro is a full-featured authoring application suitable for long-form fiction, short fiction,
     essays, plays, screenplays, non-fiction, class-notes, journals, brainstorming, free-writing,
     as well as for tracking writing (or similar) projects.</p>
  <p>This app keeps all of your work in <b>your</b> Google Drive. You never need to worry losing 
     access to or control over your work, so long as you have your google account. Even if you
     decide to stop using TolstoyPro, your work will remain in Google Drive in a non-proprietary
     formt.</p>
  <p>Accordingly, there are a few things to know:</p>
  <dl>
  <dt>You need a google account.</dt>
  <dd>You also need to give this app access to your Google Drive. Everything this app touches
      or stores will be in a top level folder called "Tolstoy".</dd>
  <dt>You need a modern browser.</dt>
  <dd>TolstoyPro uses web technology that is current to around 2022. Older browsers 
      may not work.</dd>
  <dt>Only desktop browsers have been tested at this time.</dt>
  <dd>Our beta release will introduce support for mobile devices, but at this time 
      we are only testing with desktop browsers.</dd>
  <dt>Incognito windows don't work!</dt>
  <dd>Google requires the use of cookies in ways that incognito browsing sessions
      block. If you repeatedly get this screen while trying to log in, make sure you
      are not in an incognito window!</dd>
  </dl>
  <p>If you feel all of the above criteria have been met and you are having difficulty
     getting started, please submit a bug report.</p>
  <p>With the alpha release, there will also be a Terms of Service & Privacy Policy, but 
     rest assured: TolstoyPro does not store any of your personal information or data.
     It is, however, offered without any guarantee that it's any good. That will come
     later.</p>
  <p>The current version is "pre-alpha" which means, it is still in initial development
     and nothing is guaranteed or even expected to work properly yet.</p>
</div>
    `;
  }
  
  render() {
    super.render();
    var lgn = document.getElementById('login_box');
    var login_button = new Button(lgn, 'login_b', 'login_b', 'Sign In to Google Now', (async () => {
      await Auth.sign_in();
      if (Auth.user()) {
        this.remove();
      }
    }));
    login_button.render();
  }
}