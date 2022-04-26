/* ========================================================================= *\

   Auth Handler
   
   Handle sign-in/sign-out events

\* ========================================================================= */

import Cloud    from '../persist/Cloud.js';
import Log      from '../sys/Log.js';
import View     from '../view/View.js';
import AppState from '../model/AppState.js';
import ProjectHandler from './ProjectHandler.js';
import User     from '../model/User.js';


export default (() => {
  
  var user = null;
  
  async function connect() {
    try {
      var u = await Cloud.connect();
      if (u) {
        user = new User(u);
      }
      return user;
    } catch (err) {
      /* This is most likely simply a matter of a user not logged in;
         end user should report accordingly! */
      return null;
    }
  }

  /* Resolves to user object on success, null on failure. */
  async function sign_in() {
    try {
      var u = await Cloud.login();
      if (u) {
        user = new User(u);
      }
      await AppState.init(user);
      await ProjectHandler.init();
    } catch (err) {
      Log.error(err);
      return null;
    }
  }
  
  /* Resolves to true on success; false on failure, but not sure what that means. Network error? */
  async function sign_out() {
    try {
      await Cloud.logout();
      AppState.clear();
      ProjectHandler.clear();
      View.reset('logout');
      user = null;
      return true;
    } catch (err) {
      Log.error(err);
      return false;
    }
  }
  
  /* Developer use only. */
  async function reset() {
    try {
      await Cloud.reset();
      user = null;
      Log.debug(new Error('Account reset complete.'));
    } catch (err) {
      Log.error(err);
    }
  }
  
  function get_user() {
    return user;
  }
  
  return {
    connect:  connect,
    reset:    reset,
    sign_in:  sign_in,
    sign_out: sign_out,
    user:     get_user
  };
  
})();
