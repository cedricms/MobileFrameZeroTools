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
}