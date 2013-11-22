function CompanyModel() {
	var self = this;

	self.id = ko.observable(0);
	self.name = ko.observable('');
	self.dtCreated = null;
	self.dtModified = null;
	self.companyPictureUrl = ko.observable('');
	self.frames = ko.observableArray();

	self.getFrames = function() {
		return self.frames;
	};

	self.setId = function(pId) {
		self.id = pId;
	};

	self.setName = function(pName) {
		self.name = pName;
	};

	self.setCompanyPictureUrl = function(pCompanyPictureUrl) {
		self.companyPictureUrl = pCompanyPictureUrl;
	};
}