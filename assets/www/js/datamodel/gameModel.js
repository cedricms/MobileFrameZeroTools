var companyWithTheMostFrames = null;	
var companyWithTheMostFramesId = null;
	
var companyWithTheLeastFrames = null;
var companyWithTheLeastFramesId = null;
	
var companyWithTheMostSystems = null;
var companyWithTheMostSystemsId = null;

var currentCompany = null;

function GameModel() {
	var self = this;
	
	self.second = ko.observable(0);
	self.minute = ko.observable(0);
	self.hour = ko.observable(0);

	self.startTime = ko.observable(new Date());
	self.currentTime = ko.observable(new Date());
	self.formattedStartTime = ko.computed(function() {
		deltaHour = self.hour();
		deltaMinute = self.minute();
		deltaSecond = self.second();

		if (deltaHour < 10) {
			deltaHour = '0' + deltaHour;
		} // if
		
		if (deltaMinute < 10) {
			deltaMinute = '0' + deltaMinute;
		} // if
		
		if (deltaSecond < 10) {
			deltaSecond = '0' + deltaSecond;
		} // if
		
		startTimeHours = self.startTime().getHours();
		if (startTimeHours < 10) {
			startTimeHours = '0' + startTimeHours;
		} // if
		
		startTimeMinutes = self.startTime().getMinutes();
		if (startTimeMinutes < 10) {
			startTimeMinutes = '0' + startTimeMinutes;
		} // if
		
        return startTimeHours + ':' + startTimeMinutes + ' (' + deltaHour + ':' + deltaMinute + ':' + deltaSecond + ')';
    });
	self.companies = ko.observableArray();
	self.doomsdayClock = ko.observable(11);

	self.getCompanies = function() {
		return self.companies;
	};

	self.getDoomsdayClock = function() {
		return self.doomsdayClock();
	};

	self.setDoomsdayClock = function(pDoomsdayClock) {
		self.doomsdayClock(pDoomsdayClock);
	};
	
	self.decrimentDoomsdayClock = function() {
		self.doomsdayClock(self.doomsdayClock() - 1);
	};
	
	self.updateCurrentTime = function() {
		self.currentTime(new Date());
		
		self.second(self.second() + 1);
		
		if (self.second() > 59) {
			self.second(0);
			
			self.minute(self.minute() + 1);
			
			if (self.minute() > 59) {
				self.minute(0);
				
				self.hour(self.hour() + 1);
			} // if
		} // if
	};
	
	self.updateScorePerAsset = function() {
		var companyWithTheMostFramesId = null;
		var companyWithTheMostFramesNbFrames = 0;
		var companyWithTheLeastFramesId = null;
		var companyWithTheLeastFramesNbFrames = 0;
		var companyWithTheMostSystemsId = null;
		var companyWithTheMostSystemsNbSystems = 0;
		var companyWithTheLeastSystemsId = null;
		var companyWithTheLeastSystemsNbSystems = 0;
		
		/*
		var companyWithTheMostFrames = new CompanyModel();
		var companyWithTheLeastFrames = new CompanyModel();
		var companyWithTheMostSystems = new CompanyModel();
		var companyWithTheLeastSystems = new CompanyModel();
		*/
		var currentCompanies = self.companies();
		var nbCompanies = currentCompanies.length;
		//alert('nbCompanies : ' + nbCompanies);
		
		for (var companiesIndex = 0; companiesIndex < nbCompanies; companiesIndex++) {
			currentCompany = currentCompanies[companiesIndex];

			// Init DB connection
			var db = window.openDatabase("mof0DB", dbVersion,
					"Mobile Frame Zero Tools", dbSize);
			
			var companyService = new CompanyService(db);
			
			if ((companyWithTheMostFramesId === null) || (typeof companyWithTheMostFramesId === 'undefined')) {
				companyWithTheMostFramesId = currentCompany.getId();
				companyWithTheMostFramesNbFrames = parseFloat(currentCompany.getNbFrames());
			}
			else {
				//companyService.getById(companyWithTheMostFramesId, checkCompanyWithTheMostFrames);
				
				currentCompanyNbFrames = parseFloat(currentCompany.nbFrames());
				if (currentCompanyNbFrames > companyWithTheMostFramesNbFrames) {
					companyWithTheMostFramesId = currentCompany.getId();
					companyWithTheMostFramesNbFrames = parseFloat(currentCompany.getNbFrames());
				} // if
			} // if
			
			if ((companyWithTheLeastFramesId === null) || (typeof companyWithTheLeastFramesId === 'undefined')) {
				companyWithTheLeastFramesId = currentCompany.getId();
				companyWithTheLeastFramesNbFrames = parseFloat(currentCompany.getNbFrames());
			}
			else {
				//companyService.getById(companyWithTheLeastFramesId, checkCompanyWithTheLeastFrames)
				currentCompanyNbFrames = parseFloat(currentCompany.nbFrames());
				if (currentCompanyNbFrames < companyWithTheLeastFramesNbFrames) {
					companyWithTheLeastFramesId = currentCompany.getId();
					companyWithTheLeastFramesNbFrames = parseFloat(currentCompany.getNbFrames());
				} // if
			} // if

			if ((companyWithTheMostSystemsId === null) || (typeof companyWithTheMostSystemsId === 'undefined')) {
				companyWithTheMostSystemsId = currentCompany.getId();
				companyWithTheMostSystemsNbSystems = parseFloat(currentCompany.getNbSystems());
			}
			else {
				//companyService.getById(companyWithTheMostSystemsId, checkCompanyWithTheMostSystems);
				
				currentCompanyNbSystems = parseFloat(currentCompany.nbSystems());
				if (currentCompanyNbSystems > companyWithTheMostSystemsNbSystems) {
					companyWithTheMostSystemsId = currentCompany.getId();
					companyWithTheMostSystemsNbSystems = parseFloat(currentCompany.getNbSystems());
				} // if
			} // if

			if ((companyWithTheLeastSystemsId === null) || (typeof companyWithTheLeastSystemsId === 'undefined')) {
				companyWithTheLeastSystemsId = currentCompany.getId();
				companyWithTheLeastSystemsNbSystems = parseFloat(currentCompany.getNbSystems());
			}
			else {
				//companyService.getById(companyWithTheLeastSystemsId, checkCompanyWithTheLeastSystems);
				
				currentCompanyNbSystems = parseFloat(currentCompany.nbSystems());
				if (currentCompanyNbSystems < companyWithTheLeastSystemsNbSystems) {
					companyWithTheLeastSystemsId = currentCompany.getId();
					companyWithTheLeastSystemsNbSystems = parseFloat(currentCompany.getNbSystems());
				} // if
			} // if
		} // for
		
		if ((companyWithTheMostFramesId !== null) && (typeof companyWithTheMostFramesId !== 'undefined')) {
			alert('companyWithTheMostFrames ' + companyWithTheMostFramesId + ', ' + companyWithTheMostFramesNbFrames);
			var companyWithTheMostFrames = findCompanyById(companyWithTheMostFramesId);
			
			if (companyWithTheMostFrames.scorePerAssetFramesCalculated() === false) {				
				companyWithTheMostFrames.scorePerAsset(companyWithTheMostFrames.scorePerAsset() - 1);
				companyWithTheMostFrames.scorePerAssetFramesCalculated(true);
			} // if
		} // if
		
		if ((companyWithTheLeastFramesId !== null) && (typeof companyWithTheLeastFramesId !== 'undefined')) {
			alert('companyWithTheLeastFrames ' + companyWithTheLeastFramesId + ', ' + companyWithTheLeastFramesNbFrames);
			var companyWithTheLeastFrames = findCompanyById(companyWithTheLeastFramesId);
			
			if (companyWithTheLeastFrames.scorePerAssetFramesCalculated() === false) {				
				companyWithTheLeastFrames.scorePerAsset(companyWithTheLeastFrames.scorePerAsset() + 1);
				companyWithTheLeastFrames.scorePerAssetFramesCalculated(true);
			} // if
		} // if
		
		if ((companyWithTheMostSystemsId !== null) && (typeof companyWithTheMostSystemsId !== 'undefined')) {
			alert('companyWithTheMostSystems ' + companyWithTheMostSystemsId + ', ' + companyWithTheMostSystemsNbSystems);		
			var companyWithTheMostSystems = findCompanyById(companyWithTheMostSystemsId);
			
			if (companyWithTheMostSystems.scorePerAssetSystemsCalculated() === false) {				
				companyWithTheMostSystems.scorePerAsset(companyWithTheMostSystems.scorePerAsset() - 1);
				companyWithTheMostSystems.scorePerAssetSystemsCalculated(true);
			} // if
		} // if
		
		if ((companyWithTheLeastSystemsId !== null) && (typeof companyWithTheLeastSystemsId !== 'undefined')) {	
			alert('companyWithTheLeastSystems ' + companyWithTheLeastSystemsId + ', ' + companyWithTheLeastSystemsNbSystems);	
			var companyWithTheLeastSystems = findCompanyById(companyWithTheLeastSystemsId);
			
			if (companyWithTheLeastSystems.scorePerAssetSystemsCalculated() === false) {				
				companyWithTheLeastSystems.scorePerAsset(companyWithTheLeastSystems.scorePerAsset() + 1);
				companyWithTheLeastSystems.scorePerAssetSystemsCalculated(true);
			} // if
		} // if
	};

}

function checkCompanyWithTheMostFrames(companyWithTheMostFrames) {
	currentCompanyNbFrames = parseFloat(currentCompany.nbFrames());
	companyWithTheMostFramesNbFrames = parseFloat(companyWithTheMostFrames.nbFrames());
	alert('checkCompanyWithTheMostFrames ' + companyWithTheMostFramesId + ' ' + companyWithTheMostFramesNbFrames + ' ' + currentCompany.getId() + ' ' + currentCompanyNbFrames);
	if (currentCompanyNbFrames > companyWithTheMostFramesNbFrames) {
		companyWithTheMostFramesId = currentCompany.getId();
	} // if
}

function checkCompanyWithTheLeastFrames(companyWithTheLeastFrames) {
	currentCompanyNbFrames = parseFloat(currentCompany.nbFrames());
	companyWithTheLeastFramesNbFrames = parseFloat(companyWithTheLeastFrames.nbFrames());
	alert('checkCompanyWithTheLeastFrames ' + companyWithTheLeastFramesId + ' ' + companyWithTheLeastFramesNbFrames + ' ' + currentCompany.getId() + ' ' + currentCompanyNbFrames);
	if (currentCompany.getNbFrames() < companyWithTheLeastFrames.getNbFrames()) {
		companyWithTheLeastFramesId = currentCompany.getId();
	} // if
}

function checkCompanyWithTheMostSystems(companyWithTheMostSystems) {
	currentCompanyNbSystems = parseFloat(currentCompany.nbSystems());
	companyWithTheMostFramesNbSystems = parseFloat(companyWithTheMostSystems.nbSystems());
	alert('checkCompanyWithTheMostSystems ' + companyWithTheMostSystemsId + ' ' + companyWithTheMostFramesNbSystems + ' ' + currentCompany.getId() + ' ' + currentCompanyNbSystems);
	if (currentCompany.getNbSystems() > companyWithTheMostSystems.getNbSystems()) {
		companyWithTheMostSystemsId = currentCompany.getId();
	} // if
}

function checkCompanyWithTheLeastSystems(companyWithTheLeastSystems) {
	currentCompanyNbSystems = parseFloat(currentCompany.nbSystems());
	companyWithTheLeastFramesNbSystems = parseFloat(companyWithTheLeastSystems.nbSystems());
	alert('checkCompanyWithTheLeastSystems ' + companyWithTheLeastSystemsId + ' ' + companyWithTheLeastFramesNbSystems + ' ' + currentCompany.getId() + ' ' + currentCompanyNbSystems);
	if (currentCompany.getNbSystems() < companyWithTheLeastSystems.getNbSystems()) {
		companyWithTheLeastSystemsId = currentCompany.getId();
	} // if
}

function findCompanyById(companyId) {
	var company = null;
	
	var currentCompanies = self.companies();
	var nbCompanies = currentCompanies.length;
	
	for ( var companiesIndex = 0; companiesIndex < nbCompanies; companiesIndex++) {
		currentCompany = currentCompanies[companiesIndex];
		
		if (currentCompany.id === companyId) {
			company = currentCompany;
			break;
		} // if
	} // for
	return company;
}