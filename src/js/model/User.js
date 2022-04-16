/* ======================================================================== *\
   
   User
   
   First, Last & Email. (( Should be persisted in local storage & metadata. ))

\* ======================================================================== */

export default class User {
  constructor(umap) {
    this.first = umap.fname;
    this.last  = umap.lname;
    this.email = umap.email;
  }
  
  first_name() {
    return this.first;
  }
  
  to_string() {
    return '{ "first": "' + this.first + '", "last": "' + this.last + '", "email": "' + this.email + '" }';
  }
}
