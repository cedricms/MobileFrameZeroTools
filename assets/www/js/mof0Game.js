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
	companies = gameModel.companies;

	for ( var companyIdsArrayIndex = 0; companyIdsArrayIndex < companyIdsArray.length; companyIdsArrayIndex++) {
		var companyId = companyIdsArray[companyIdsArrayIndex];

		var companyModel = companyService.getById(companyId, addCompany);

		//ko.applyBindings(companyModel);
	} // for

	ko.applyBindings(gameModel);
	
	//gameModel.updateScorePerAsset();
	
	window.setInterval(updateGame, 1000);
}

function addCompany(companyModel) {
	companies.push(companyModel);
}

function updateGame() {
	gameModel.updateCurrentTime();
	if (gameModel.doomsdayClock() === 11) {
		gameModel.updateScorePerAsset();
	} // if
}

function nextRound() {
	if (gameModel.getDoomsdayClock() > 0) {
		gameModel.decrimentDoomsdayClock();

		if (gameModel.getDoomsdayClock() > 0) {
			companies = gameModel.companies();

			for ( var companyIndex = 0; companyIndex < companies.length; companyIndex++) {
				var company = companies[companyIndex];
				var companyName = company.getName();
				jQuery.i18n.prop('doYouWantToCountDownTheDoomsDayClockMessage');
				var countDownConfirmationMessage = companyName + doYouWantToCountDownTheDoomsDayClockMessage + ' ' + gameModel.getDoomsdayClock() + ')';
				var countDownAction = confirm(countDownConfirmationMessage);
				if (countDownAction == true) {
					gameModel.decrimentDoomsdayClock();
					if (gameModel.getDoomsdayClock() > 0) {
						continue;
					}
					else {
						endOfGame();
						break;
					} // if
				}
				else {
					continue;
				} // if
			} // for
		} else {
			// End of the game
			endOfGame();
		} // if
	} else {
		// End of the game
		endOfGame();
	} // if
}

function endOfGame() {
	alert('End of game!');
}