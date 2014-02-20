var gameModel;
var companies;
var gameRefreshIntervalId;

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
	
	gameRefreshIntervalId = window.setInterval(updateGame, 1000);
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
			var companies = gameModel.companies();

			for ( var companyIndex = 0; companyIndex < companies.length; companyIndex++) {
				var company = companies[companyIndex];
				var companyName = company.name();
				jQuery.i18n.prop('doYouWantToCountDownTheDoomsDayClockMessage');
				var countDownConfirmationMessage = companyName + doYouWantToCountDownTheDoomsDayClockMessage + ' ' + parseFloat(gameModel.getDoomsdayClock()) + ')';
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
	window.clearInterval(gameRefreshIntervalId);
	
	//Get the context of the canvas element we want to select
	var ctx = document.getElementById("endOfGameChart").getContext("2d");
	var data = {
			labels : ["January","February","March","April","May","June","July"],
			datasets : [
				{
					fillColor : "rgba(220,220,220,0.5)",
					strokeColor : "rgba(220,220,220,1)",
					pointColor : "rgba(220,220,220,1)",
					pointStrokeColor : "#fff",
					data : [65,59,90,81,56,55,40]
				},
				{
					fillColor : "rgba(151,187,205,0.5)",
					strokeColor : "rgba(151,187,205,1)",
					pointColor : "rgba(151,187,205,1)",
					pointStrokeColor : "#fff",
					data : [28,48,40,19,96,27,100]
				}
			]
		}
	var endOfGameChart = new Chart(ctx).Line(data);
	
	gameModel.endTime(new Date());
	$('#endOfGameModal').modal('show');
}