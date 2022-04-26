/* ========================================================================= *\
   
   Log

   System Logging.

\* ========================================================================= */

export default (() => {

  return {
    debug:   dbg,
    error:   err,
    warning: wrn
  };

  /* ----------------------------------------------------------------------- */
  
  function err(err, obj) {
    console.log("ERROR: " + err.message);
    if (obj) console.log(obj);
    console.log(err.stack);
  }
  
  function wrn(err, obj) {
    console.log("WARN: " + err.message);
    if (obj) console.log(obj);
  }
  
  function dbg(err, obj) {
    console.log("DEBUG: " + err.message);
    if (obj) console.log(obj);
  }

})();
