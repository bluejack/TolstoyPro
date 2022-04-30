/* ======================================================================== *\
   
   Change Log
   
   Crazy massive day-by-day release notes.

\* ======================================================================== */

import ModalPage from './ModalPage.js';

export default class ChangeLog extends ModalPage {
  constructor() {
    super('Change Log', true, 'changelog');
    this.html = `
<div id="changelog" class="static_page">
  <p>The following is ordered from most recent to most ancient, and offers a
     comprehensive view into the evolution of the app, as well as the ability 
     to get a sense as to recent developments. Note that prior to the alpha
     release releases occur frequently and have modest increases. With alpha,
     we begin to ensure that the chances of breaking the app that people might
     be using are minimized, so releases are bundled and tested before hitting
     the change log.</p>

  <div class="changelog">
    <ol class="majver" style="counter-reset: majver 1" reversed>
      <li><b>Pre-Release Development</b>
        <ol class="minver" style="counter-reset: minver 3" reversed>
          <li><b><u>The Basic Editor</u>
            <ol class="relver" style="counter-reset: relver 5" reversed>
              <li> (04.29.22)
                <ul class="clist">
                  <li> Tree-File Context Menu</li>
                </ul>
              </li>
              <li> (04.27.22)
                <ul class="clist">
                  <li> Tree folder implementation</li>
                </ul>
              </li>
              <li> (04.26.22)
                <ul class="clist">
                  <li> Code cosmetics.</li>
                  <li> Root folder support.</li>
                </ul>
              </li>
              <li> (04.24.22)
                <ul class="clist">
                  <li> Refactoring project stragegy in prep for folders</li>
                </ul>
              </li>
              <li> (04.19.22)
                <ul class="clist">
                  <li> Pro-active (but sane) file save strategy.</li>
                  <li> File Rename</li>
                  <li> Tree Styling</li>
                </ul>
              </li>
              <li> (04.16.22)
                <ul class="clist">
                  <li> Roadmap complete</li>
                  <li> Bug fix: fix state on proj change</li>
                </ul>
              </li>
              <li> (04.16.22)
                <ul class="clist">
                  <li>All Basic Editing functionality is solid assuming good network connectivity.</li>
                  <li>Development now goes to branched strategy.</li>
                </ul>
              </li>
              
            </ol>
          </li>
          <li><u>Building to Usable</u>
            <ol class="relver" style="counter-reset: relver 10" reversed>
              <li> (04.16.22)
                <ul class="clist">
                  <li>Final bug pass before 0.2.</li>
                </ul>
              </li>
              <li> (04.15.22)
                <ul class="clist">
                  <li>Clean up transitions.</li>
                  <li>File switcher in tree</li>
                  <li>Create file in menu</li>
                </ul>
              </li>
              <li> (04.07.22)
                <ul class="clist">
                  <li>File load on resume</li>
                </ul>
              </li>
              <li> (04.06.22)
                <ul class="clist">
                  <li>Refactor UX, removing unnecessary objects</li>
                </ul>
              </li>
              <li> (04.03.22)
                <ul class="clist">
                  <li>Add file create dialog.</li>
                  <li>Auto-prompt file create dialog on new project.</li>
                </ul>
              </li>
              <li> (04.01.22)
                <ul class="clist">
                  <li>Refactoring project for page views</li>
                  <li>Fix project display bugs</li>
                </ul>
              </li>
              <li> (03.26.22)
                <ul class="clist">
                  <li>Refactoring Project for modal dialogs</li>
                </ul>
              </li>
              <li> (03.13.22)
                <ul class="clist">
                  <li>Save/Load PoC</li>
                </ul>
              </li>
              <li> (02.27.22)
                <ul class="clist">
                  <li>Editor panel with editable text</li>
                </ul>
              </li>
            </ol>
          </li>
          <li><u>Foundational Development</u>
            <ol class="relver" style="counter-reset: relver 16" reversed>
              <li> (02.26.22)
                <ul class="clist">
                  <li>Major refactoring of asynchronous code</li>
                  <li>Rename projects</li>
                  <li>Switch projects functionality, unstyled.</li>
                </ul>
              </li>
              <li> (02.03.22)
                <ul class="clist">
                  <li>Load most recently used project on startup</li>
                </ul>
              </li>
              <li> (02.03.22)
                <ul class="clist">
                  <li>Activate new project menu item</li>
                  <li>Refactor static page displays</li>
                  <li>New Project create folder.</li>
                  <li>Update tree view</li>
                </ul>
              </li>
              <li> (02.02.22)
                <ul class="clist">
                  <li>Persist app state between sessions.</li>
                  <li>Reload chosen theme on user return/refresh.</li>
                  <li>First time setup of state file.</li>
                  <li>Setup content folder structure in google on first use.</li>
                  <li>Refactoring prior to new project panel.</li>
                </ul>
              </li>
              <li> (02.01.22)
                <ul class="clist">
                  <li>Establish initial themes: default, cream, dark.</li>
                  <li>Preferences page, with choosable themes</li>
                  <li>Style preferences page.</li>
                  <li>Monstrous, slightly pointless, refactoring</li>
                </ul>
              </li>
              <li> (01.31.22)
                <ul class="clist">
                  <li>Sub-menu styling improvements (vtc)</li>
                  <li>Intro page</li>
                  <li>Login lands on Intro page</li>
                  <li>Improve utility of anchor links</li>
                  <li>Obtain basic user data (name, email) from Google.</li>
                  <li>Fix layout glitches on scroll.</li>
                </ul>
              </li>
              <li> (01.30.22)
                <ul class="clist">
                  <li>Styled welcome screen</li>
                  <li>Re-worked / re-tested login flows</li>
                  <li>Disable-able Buttons</li>
                  <li>Refactor top menu to remove special case top menus</li>
                  <li>About view, with linked ToS/PP/Story/Changelog views</li>
                  <li>Improve styling on static content
                  <li>Placeholder PP/ToS pages
                  <li>Changelog page (this!)
                  <li>Handle anchor tags more smoothly
                  <li>Toggle Login / Out menu item on status
                </ul>
              </li>
              <li> (01.28.22)
                <ul class="clist">
                  <li> New Welcome screen & paradigm</li>
                </ul>
              </li>
              <li> (01.27.22)
                <ul class="clist">
                  <li> Externally linkable static pages (poc)</li>
                </ul>
              </li>
              <li> (01.26.22)
                <ul class="clist">
                  <li> Work on action panel display, layout struggles
                  <li> Footer display
                  <li> Three-column display
                  <li> Basic content panel
                </ul>
              </li>
              <li> (01.25.22)
                <ul class="clist">
                  <li> Multilevel Prefs Menu</li>
                  <li> All purpose background to ease transitions</li>
                  <li> Logout should land at signup info screen</li>
                  <li> Home menu w/ image</li>
                  <li> Sub-menu block</li>
                  <li> Text Top Menu</li>
                  <li> Logout </li>
                  <li> Sub-menu line-item</li>
                  <li> Sub-menu separator</li>
                </ul>
              </li>
              <li> (01.24.22)
                <ul class="clist">
                  <li> General info screen on not-logged in </li>
                </ul>
              </li>
              <li> (01.23.22)
                <ul class="clist">
                  <li> Loading screen</li>
                  <li> Refresh login</li>
                  <li> Refresh status test</li>
                  <li> Handle login errors</li>
                  <li> General info screen on error</li>
                </ul>
              </li>
              <li> (01.22.22)
                <ul class="clist">
                  <li> Feature list</li>
                  <li> Webpack framework</li>
                  <li> Get google apis working with webpack</li>
                </ul>
              </li>
              <li> (01.17.22)
                <ul class="clist">
                  <li> Create & Load Project Folder</li>
                  <li> Barebones UX for CTA for create project</li>
                </ul>
              </li>
            </ol>
          </li>
        </ol>
      </li>
    </ol>
  </div>
</div>
    `;
  }
}