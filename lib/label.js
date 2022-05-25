class Label {
  constructor (id, index, label) {
    Object.assign(this, {id, index, label}); //Property assigning shorthand
  }
  
  static parse(label) {
    const pattern = /^(\w{0,10}?)(\d{0,10})$/;
    let result = pattern.exec(label);
    let [undefined, id, index] = result;
    if (id.length < 1 || index.length < 1) throw "Couldn't parse label.";
    return new Label(id, Number.parseInt(index), label);
  }
}