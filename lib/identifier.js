class Identifier {
  constructor(id, sheet) {
    Object.assign(this, {id, sheet});
  }

  static fetchFromUser(id, ui, ss) {
    if (!ui || !ss) throw new Error(`Can't access UI or active Spreadsheet.`);
    const pageNames = ss.getSheets().map(elem => elem.getName());
    const getPageChoices = (pageNames) => pageNames.map( (e, i) => `${i}: ${e}` ).join('\n');

    let answer, response;
    while(true) {
      response = ui.prompt(
        `What page the label ID "${id}" represents?\n
        Answer the corresponding number:\n
        ${getPageChoices(pageNames)}\n`);

      if (response.getSelectedButton() === Button.CLOSE || response.getSelectedButton() === Button.CANCEL) throw new Error("User cancelled the operation");
      answer = Number.parseInt(response.getResponseText());

      if (!Number.isNaN(answer) && 0 <= answer && answer < answer.length) {
        answer = pageNames[answer];
        break
      }
      ui.alert(`${answer} is not a valid page.`);
    }

    let sheet = ss.getSheetByName(answer);

    return new Identifier(id, sheet); //Still needs a Map to be useful, but at least groups the information :e
  };
}