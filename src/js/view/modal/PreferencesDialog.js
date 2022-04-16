
/* ========================================================================= *\
   
   Preferences Dialog
   
   All the configurations in one screen.

\* ========================================================================= */

import AppState from '../../model/AppState.js';
import Dialog   from './Dialog.js';
import Log      from '../../sys/Log.js';

const display = `
<div id="prefs_dialog" class="modal_body">
  <div class="prefs_row">
    <span class="prefs_label">Color Theme:</span>
    <span class="prefs_selection">
      <span class="prefs_column">
        <input type="radio" id="default_theme" name="theme" value="Default">Default</input><br />
        <input type="radio" id="cream_theme" name="theme" value="Cream">Cream</input><br />
        <input type="radio" id="dark_theme" name="theme" value="Dark">Dark</input>
      </span>
    </span>
  </div>
</div>
`;

export default class PreferencesDialog extends Dialog {
  constructor() {
    super('Preferences', true);
  }

  #configure_prefs() {
    var prefs = AppState.prefs();
    var theme = prefs.theme();
    var cur = document.getElementById( theme + '_theme');
    if (cur) {
      cur.checked = true;
    }
    var themes = [ 'default', 'cream', 'dark' ];
    themes.forEach(function(t) {
      var elm = document.getElementById(t + '_theme');
      var thm = t;
      elm.onclick = function() {
        theme = prefs.theme();
        try {
          var app = document.getElementById('app');
          app.classList.remove(theme + '_theme');
          app.classList.add(thm + '_theme');
          prefs.theme(thm);
        } catch (err) {
          Log.error(err);
        }
      };
    });
  }

  render() {
    var pelm = super.render();
    pelm.insertAdjacentHTML('afterbegin', display);
    this.#configure_prefs();
  }
}

