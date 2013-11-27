function GameModel() {
	var self = this;

	self.startTime = ko.observable(new Date());
	self.formattedStartTime = ko.computed(function() {
        return self.startTime().getHours() + ":" + self.startTime().getMinutes();
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
}