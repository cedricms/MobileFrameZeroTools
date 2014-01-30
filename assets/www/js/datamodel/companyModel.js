function CompanyModel() {
	var self = this;

	self.id = ko.observable(0);
	self.name = ko.observable('');
	self.nbStations = ko.observable(3);
	self.dtCreated = null;
	self.dtModified = null;
	self.companyPictureUrl = ko.observable('');
	self.frames = ko.observableArray();
	self.scorePerAsset = ko.observable(5);
	self.companyScore = ko.computed(function() {
		//alert('self.nbStations() : ' + self.nbStations());
		//alert('self.scorePerAsset() : ' + self.scorePerAsset());
		//scoreValue = self.nbStations() * self.scorePerAsset();
		//alert('scoreValue : ' + scoreValue);
        //return scoreValue + ' [' + self.scorePerAsset()  + ']';
		return self.nbStations() * self.scorePerAsset();
    }, this);

	self.getFrames = function() {
		return self.frames;
	};
	
	self.getName = function() {
		return self.name;
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

	self.setNbStations = function(pNbStations) {
		self.nbStations(pNbStations);
	};

	self.setScorePerAsset = function(pScorePerAsset) {
		self.scorePerAsset(pScorePerAsset);
	};
}