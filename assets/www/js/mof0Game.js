var gameModel;
var companies;

function initGame() {
	// Init DB connection
	var db = window.openDatabase("mof0DB", dbVersion,
			"Mobile Frame Zero Tools", dbSize);

	// Load game data
	gameModel = new GameModel();

	var companyIds = getUrlVars()['companyIds'];
	var companyIdsArray = companyIds.split('|');

	var companyService = new CompanyService(db);
	companies = gameModel.getCompanies();

	for ( var companyIdsArrayIndex = 0; companyIdsArrayIndex < companyIdsArray.length; companyIdsArrayIndex++) {
		var companyId = companyIdsArray[companyIdsArrayIndex];

		var companyModel = companyService.getById(companyId, addCompany);
	} // for

	ko.applyBindings(gameModel);
	
	window.setInterval(gameModel.updateCurrentTime, 1000);
}

function addCompany(companyModel) {
	companies.push(companyModel);
}

function nextRound() {
	if (gameModel.getDoomsdayClock() > 1) {
		gameModel.decrimentDoomsdayClock();
	} else {
		// End of the game
	}
}