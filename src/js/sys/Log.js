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
  
  function err(msg, obj) {
    console.log("ERROR: " + msg);
    if (obj) console.log(obj);
    console.trace(); // This trace sucks; throw a fatal up the stack?
  }
  
  function wrn(msg, obj) {
    console.log("WARN: " + msg);
    if (obj) console.log(obj);
  }
  
  function dbg(msg, obj) {
    console.log("DEBUG: " + msg);
    if (obj) console.log(obj);
  }

})();
