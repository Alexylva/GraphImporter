function onOpen() {
  SpreadsheetApp.getUi()
  .createMenu("#Utils")
  .addItem("Run sheet translation",  "sheetTranslation")
  .addToUi();
}

function sheetTranslation() {
  const SS = SpreadsheetApp.getActiveSpreadsheet();
  if (!SS) throw "Unable to get current Spreadsheet";

  const knownLabels = {};

  const UI = SS.getUi();
  const sheets = SS.getSheets();
  if (!sheets || sheets.length < 2) throw "Can't get sheets or too little sheets (less than 2).";

  let userSelection = SS.getSelection().getActiveRange().getValues();
  if (
    !Array.isArray(userSelection) ||
    !Array.isArray(userSelection[0])
  ) throw "Select a valid interval (At least 2x2 including labels)."
  
  if (!userSelection[0].toString().localeCompare(
    "Source,Target", undefined, {'sensitivity': 'base'}
  )) throw "The headers must be \"[Source, Target]\"";

  for ([source, target] of userSelection) {
    [source, target] = [source,target].map(elem => parseLabel(elem));
    for (elem of [source, target]) {
      if (!knownLabels[elem.id]) knownLabels[elem.id] = fetchIdentifierInfo(elem.id);
      //...
    }
  }
}

function parseLabel(label) {
  const pattern = /^(\w{0,10}?)(\d{0,10})$/;
  let [undefined, id, index] = pattern.exec(label);
  return {id, index, label};
}
