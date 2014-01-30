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
    }, this);
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
	
	var companyWithTheMostFrames = null;
	var companyWithTheLeastFrames = null;
	var companyWithTheMostSystems = null;
	
	self.updateScorePerAsset = function() {
		companyWithTheMostFrames = null;
		companyWithTheLeastFrames = null;
		companyWithTheMostSystems = null;
		
		var currentCompanies = self.companies();
		var nbCompanies = currentCompanies.length;
		//alert('nbCompanies : ' + nbCompanies);
		
		for ( var companiesIndex = 0; companiesIndex < nbCompanies; companiesIndex++) {
			var companyModel = currentCompanies[companiesIndex];
			companyModel.setScorePerAsset(5);
			var companyModelFrames = companyModel.getFrames();

			//alert('companyModelFrames.length : ' + companyModelFrames.length);
			
			//alert('companyWithTheMostFrames : ' + companyWithTheMostFrames);
			if ((companyWithTheMostFrames === null) || (typeof companyWithTheMostFrames === 'undefined')) {
				companyWithTheMostFrames = companyModel;
			}
			else {
				var companyWithTheMostFramesFrames = companyWithTheMostFrames.getFrames();
				//alert('companyWithTheMostFramesFrames.length : ' + companyWithTheMostFramesFrames.length);
				if (companyModelFrames.length > companyWithTheMostFramesFrames.length) {
					companyWithTheMostFrames = companyModel;
				} // if
			} // if
			
			//alert('companyWithTheLeastFrames : ' + companyWithTheLeastFrames);
			if ((companyWithTheLeastFrames === null) || (typeof companyWithTheLeastFrames === 'undefined')) {
				companyWithTheLeastFrames = companyModel;
			}
			else {
				//alert('companyWithTheLeastFrames.getFrames().length : ' + companyWithTheLeastFrames.getFrames().length);
				if (companyModelFrames.length < companyWithTheLeastFrames.getFrames().length) {
					companyWithTheLeastFrames = companyModel;
				} // if
			} // if

			//alert('companyWithTheMostSystems : ' + companyWithTheMostSystems);
			if ((companyWithTheMostSystems === null) || (typeof companyWithTheMostSystems === 'undefined')) {
				companyWithTheMostSystems = companyModel;
			}
			else {
				//alert('companyWithTheMostSystems.getFrames().length : ' + companyWithTheMostSystems.getFrames().length);
			} // if
		} // for

		if ((companyWithTheMostFrames !== null) && (typeof companyWithTheMostFrames !== 'undefined')) {		
			//alert('companyWithTheMostFrames.getScorePerAsset() : ' + companyWithTheMostFrames.getScorePerAsset());
			companyWithTheMostFrames.setScorePerAsset(companyWithTheMostFrames.getScorePerAsset() - 1);
			//alert('companyWithTheMostFrames.getScorePerAsset() : ' + companyWithTheMostFrames.getScorePerAsset());
		}// if
		
		if ((companyWithTheLeastFrames !== null) && (typeof companyWithTheLeastFrames !== 'undefined')) {		
			//alert('companyWithTheLeastFrames.getScorePerAsset() : ' + companyWithTheLeastFrames.getScorePerAsset());
			companyWithTheLeastFrames.setScorePerAsset(companyWithTheLeastFrames.getScorePerAsset() + 1);
			//alert('companyWithTheLeastFrames.getScorePerAsset() : ' + companyWithTheLeastFrames.getScorePerAsset());
		} // if
		
		/*companyWithTheMostFramesScoreValue = companyWithTheMostFrames.getNbStations() * companyWithTheMostFrames.getScorePerAsset();
		companyWithTheMostFrames.setScore(companyWithTheMostFramesScoreValue + ' [' + companyWithTheMostFrames.getScorePerAsset()  + ']');

		companyWithTheLeastFramesScoreValue = companyWithTheLeastFrames.getNbStations() * companyWithTheLeastFrames.getScorePerAsset();
		companyWithTheLeastFrames.setScore(companyWithTheLeastFramesScoreValue + ' [' + companyWithTheLeastFrames.getScorePerAsset()  + ']');*/
	};
	
}