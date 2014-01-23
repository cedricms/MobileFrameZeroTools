function CompanyModel() {
	var self = this;

	self.id = ko.observable(0);
	self.name = ko.observable('');
	self.nbStations = ko.observable(3);
	self.dtCreated = null;
	self.dtModified = null;
	self.companyPictureUrl = ko.observable('');
	self.frames = ko.observableArray();

	self.getFrames = function() {
		return self.frames;
	};
	
	self.getName = function() {
		return self.name;
	};
	
	self.getNbStations = function() {
		return self.nbStations;
	};
	self.setId = function(pId) {
		self.id = pId;
	};

	self.setNbStations = function(pNbStations) {
		self.nbStations = pNbStations;
	};

	self.setName = function(pName) {
		self.name = pName;
	};

	self.setCompanyPictureUrl = function(pCompanyPictureUrl) {
		self.companyPictureUrl = pCompanyPictureUrl;
	};
}