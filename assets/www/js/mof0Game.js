var gameModel;
var companies;

function initGame() {
	// Init DB connection
	var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", dbSize);
	
	// Load game data
	gameModel = new GameModel();
	
	var companyIds = getUrlVars()['companyIds'];
	var companyIdsArray = companyIds.split('|');
	
	var companyService = new CompanyService(db);
	companies = gameModel.getCompanies();
	
	for (var companyIdsArrayIndex = 0; companyIdsArrayIndex < companyIdsArray.length; companyIdsArrayIndex++) {
		var companyId = companyIdsArray[companyIdsArrayIndex];
		
		var companyModel = companyService.getById(companyId, addCompany);
    } // for
	
	ko.applyBindings(gameModel);
}

function addCompany(companyModel) {
	companies.push(companyModel); 
}