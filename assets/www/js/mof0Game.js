var gameModel;

function initGame() {
	gameModel = new GameModel();
	
	var companyIds = getUrlVars()['companyIds'];
	var companyIdsArray = companyIds.split('|');
	
	var companyService = new CompanyService();
	var companies = gameModel.getCompanies();
	
	for (var companyIdsArrayIndex = 0; companyIdsArrayIndex < companyIdsArray.length; companyIdsArrayIndex++) {
		var companyId = companyIdsArray[companyIdsArrayIndex];
		
		var companyModel = companyService.getById(companyId);
		
		companies.push(companyModel); 
    } // for
	
	ko.applyBindings(gameModel);
}