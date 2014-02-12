function CompanyModel() {
	var self = this;

	self.id = ko.observable(0);
	self.name = ko.observable('');
	self.nbStations = ko.observable(3);
	self.addStation = function() {
		self.nbStations(self.nbStations() + 1);
    }
	self.removeStation = function() {
		if (parseFloat(self.nbStations()) > 0) {
			self.nbStations(self.nbStations() - 1);
		} // if
    }
	self.dtCreated = null;
	self.dtModified = null;
	self.companyPictureUrl = ko.observable('');
	self.frames = ko.observableArray();
	self.nbFrames = ko.observable(0);
	self.nbSystems = ko.observable(0);
	self.scorePerAsset = ko.observable(5);
	self.scorePerAssetFramesCalculated = ko.observable(false);
	self.scorePerAssetSystemsCalculated = ko.observable(false);
	
	self.companyScore = ko.computed(function() {
		scoreValue = (self.nbFrames() + self.nbStations()) * self.scorePerAsset();
        return scoreValue + ' [' + self.scorePerAsset()  + ']';
    });

	self.getFrames = function() {
		return self.frames;
	};
	
	self.getId = function() {
		return self.id;
	};
	
	self.getName = function() {
		return self.name;
	};

	self.getNbFrames = function() {
		return self.nbFrames;
	};

	self.getNbSystems = function() {
		return self.nbSystems;
	};
	
	self.getScorePerAsset = function() {
		return self.scorePerAsset();
	};
	
	self.getNbStations = function() {
		return self.nbStations();
	};

	self.setCompanyPictureUrl = function(pCompanyPictureUrl) {
		self.companyPictureUrl = pCompanyPictureUrl;
	};
	
	self.setId = function(pId) {
		self.id = pId;
	};

	self.setName = function(pName) {
		self.name = pName;
	};

	self.setNbFrames = function(pNbFrames) {
		self.nbFrames = pNbFrames;
	};
	
	self.setNbStations = function(pNbStations) {
		self.nbStations(pNbStations);
	};

	self.setNbSystems = function(pNbSystems) {
		self.nbSystems = pNbSystems;
	};

	self.setScorePerAsset = function(pScorePerAsset) {
		self.scorePerAsset(pScorePerAsset);
	};
}