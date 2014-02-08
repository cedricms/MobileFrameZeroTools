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
		var maxNbFrames = 0;
		var minNbFrames = 8;
		var maxNbSystems = 0;
		var minNbSystems = 32;
		
		var currentCompanies = self.companies();
		var nbCompanies = currentCompanies.length;
		
		for (var companiesIndex = 0; companiesIndex < nbCompanies; companiesIndex++) {
			var currentCompany = currentCompanies[companiesIndex];

			currentCompanyNbFrames = parseFloat(currentCompany.nbFrames());
			if (currentCompanyNbFrames > maxNbFrames) {
				maxNbFrames = currentCompanyNbFrames;
			} // if
			
			if (currentCompanyNbFrames < minNbFrames) {
				minNbFrames = currentCompanyNbFrames;
			} // if

			currentCompanyNbSystems = parseFloat(currentCompany.nbSystems());
			if (currentCompanyNbSystems > maxNbSystems) {
				maxNbSystems = currentCompanyNbSystems;
			} // if
			
			if (currentCompanyNbSystems < minNbSystems) {
				minNbSystems = currentCompanyNbSystems;
			} // if
		} // for
		
		updateScorePerAssetForMaxNbFrames(currentCompanies, maxNbFrames);
		updateScorePerAssetForMinNbFrames(currentCompanies, minNbFrames);
		updateScorePerAssetForMaxNbSystems(currentCompanies, maxNbSystems);
		updateScorePerAssetForMinNbSystems(currentCompanies, minNbSystems);
	};

}

function updateScorePerAssetForMaxNbFrames(currentCompanies, maxNbFrames) {
	var nbCompanies = currentCompanies.length;
	
	for (var companiesIndex = 0; companiesIndex < nbCompanies; companiesIndex++) {
		var currentCompany = currentCompanies[companiesIndex];

		if (currentCompany.scorePerAssetFramesCalculated() === false) {
			if (parseFloat(currentCompany.nbFrames()) === maxNbFrames) {
				currentCompany.scorePerAsset(currentCompany.scorePerAsset() - 1);
				currentCompany.scorePerAssetFramesCalculated(true);
			} // if
		} // if
	} // for
}

function updateScorePerAssetForMinNbFrames(currentCompanies, minNbFrames) {
	var nbCompanies = currentCompanies.length;
	
	for (var companiesIndex = 0; companiesIndex < nbCompanies; companiesIndex++) {
		var currentCompany = currentCompanies[companiesIndex];

		if (currentCompany.scorePerAssetFramesCalculated() === false) {
			if (parseFloat(currentCompany.nbFrames()) === minNbFrames) {
				currentCompany.scorePerAsset(currentCompany.scorePerAsset() + 1);
				currentCompany.scorePerAssetFramesCalculated(true);
			} // if
		} // if
	} // for
}

function updateScorePerAssetForMaxNbSystems(currentCompanies, maxNbSystems) {
	var nbCompanies = currentCompanies.length;
	
	for (var companiesIndex = 0; companiesIndex < nbCompanies; companiesIndex++) {
		var currentCompany = currentCompanies[companiesIndex];

		if (currentCompany.scorePerAssetSystemsCalculated() === false) {
			if (parseFloat(currentCompany.nbSystems()) === maxNbSystems) {
				currentCompany.scorePerAsset(currentCompany.scorePerAsset() - 1);
				currentCompany.scorePerAssetSystemsCalculated(true);
			} // if
		} // if
	} // for
}

function updateScorePerAssetForMinNbSystems(currentCompanies, minNbSystems) {
	var nbCompanies = currentCompanies.length;
	
	for (var companiesIndex = 0; companiesIndex < nbCompanies; companiesIndex++) {
		var currentCompany = currentCompanies[companiesIndex];

		if (currentCompany.scorePerAssetSystemsCalculated() === false) {
			if (parseFloat(currentCompany.nbSystems()) === minNbSystems) {
				currentCompany.scorePerAsset(currentCompany.scorePerAsset() + 1);
				currentCompany.scorePerAssetSystemsCalculated(true);
			} // if
		} // if
	} // for
}