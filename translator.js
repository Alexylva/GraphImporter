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
  let labelToRange = (label, id) => id.sheet.getRange(config.user.STARTING_ROW, label.index, config.user.MAXROWS, 1);

  //For each source and target pair of user selection...
  for ([source, target] of userSelection) {
    //Make source and target into Label Objects
    [source, target] = [source,target].map(elem => Label.parse(elem)); 

    //Ask user to identify the source and target sheets corresponding to each ID
    for (label of [source, target]) {
      if (!identifiers.has(label.id)) identifiers.set(label.id, Identifier.fetchFromUser(label, UI, SS));
    }
    
    // Grab source and target identifiers
    let sourceIdentifier = identifiers.get(source.id);
    let targetIdentifier = identifiers.get(target.id);

    try {
      //Try to get the corresponding columns
      let sourceRange = labelToRange(source, sourceIdentifier);
      let targetRange = labelToRange(target, targetIdentifier);
      //Copies the contents from source to target
      sourceRange.copyTo(targetRange);
    } catch (e) {
      console.error(new Error(`Error copying ${source} to ${target}\n${e}`));
    }
  }
}




