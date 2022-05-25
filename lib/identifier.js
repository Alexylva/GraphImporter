class Identifier {
  constructor(label, range) {
    Object.assign(this, {label, range});
  }

  static fetchFromUser(label, ui, ss) {
    if (!label instanceof Label) throw new Error(`${label} is not a instance of Label.`)
    if (!ui) throw new Error(`Can't access UI.`);
    
    let answer, range;
    while(true) {
      answer = ui.prompt(`What column the label ID "${label.id}" represents?\nAnswer in A1 Notation including the page name. Ex: 'Page 1'!A:A`);
      try {
        range =  ss.getRange(answer);
      } catch (e) {
        ui.alert(`${answer} is not a valid A1 Notation.`);
        continue;
      }
      break;
    }
    range = range.getSheet().getRange(1, range.getColumn(), config.constants.MAXROWS, 1); //Turns the selected range into a 1x1000 range of the selected column

    return Identifier(label, range); //Still needs a Map to be useful, but at least groups the information :e
  };
}