
export default class TreeNode {
  constructor(id, name, desc) {
    this.id   = id;
    this.name = name;
    this.desc = desc;
    this.nodes = [];
    this.obs   = [];
  }
  
  get_id() {
    return this.id;
  }
  
  get_name() {
    return this.name;
  }
  
  get_desc() {
    return this.desc;
  }
  
  get_nodes() {
    return this.nodes;
  }
  
  observe(cb) {
    this.obs.forEach((i) => {
      if (i === cb) return;
    });
    this.obs.push(cb);
  }
  
  notify() {
    this.obs.forEach((cb) => { cb(this); });
  }
  
  to_tree() {
    var tree = [];
    if (this.nodes.length > 0) {
      this.nodes.forEach((n) => {
        tree.push(n.to_tree());
      });
    }
    return {
      type: this.type,
      id: this.id,
      name: this.name,
      desc: this.desc,
      tree: tree
    };
  }
}