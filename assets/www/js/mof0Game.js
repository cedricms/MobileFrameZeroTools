var gameModel;

function initGame() {
	gameModel = new GameModel();
	
	var companyIds = getUrlVars()['companyIds'];
	var companyIdsArray = companyIds.split('|');
	
	for (var companyIdsArrayIndex = 0; companyIdsArrayIndex < companyIdsArray.length; companyIdsArrayIndex++) {
		alert('companyIdsArray[companyIdsArrayIndex] : ' + companyIdsArray[companyIdsArrayIndex]);
    } // for
	
	ko.applyBindings(gameModel);
}