const THREE = 3;

function onOpen() {
  SpreadsheetApp.getUi()
  .createMenu("#Utils")
  .addItem("Run sheet translation",  "sheetTranslation")
  .addToUi();
}

function sheetTranslation() {
  const SS = SpreadsheetApp.getActiveSpreadsheet();
  if (!SS) throw new Error("Unable to get current Spreadsheet");

  const UI = SS.getUi();
  const sheets = SS.getSheets();
  if (!sheets || sheets.length < 2) throw new Error("Can't get sheets or too little sheets (less than 2).");

  let userSelection = SS.getSelection().getActiveRange().getValues();
  if (
    !Array.isArray(userSelection) ||
    !Array.isArray(userSelection[0])
  ) throw new Error("Select a valid interval (At least 2x2 including labels).");
  
  if (!userSelection[0].toString().localeCompare(
    "Source,Target", undefined, {'sensitivity': 'base'}
  )) throw new Error("The headers must be \"[Source, Target]\"");

  const identifiers = new Map(); //Map Label to Identifier that contains our Range
  for ([source, target] of userSelection) {
    [source, target] = [source,target].map(elem => Label.parse(elem)); //Make source and target into Label Objects

    for (label of [source, target]) {
      //Ask user to identify the Identifier to know from where to fetch the data
      if (!identifiers.get(label)) identifiers.set(label, Identifier.fetchFromUser(label, UI, SS));
    }

    //My dumb code can't reutilize Labels, fix it pls by making a label list..??? 

  }
}


