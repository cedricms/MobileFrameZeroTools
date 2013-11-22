function FrameModel() {
	var self = this;

	self.id = ko.observable(0);
	self.name = ko.observable('');
	self.nbDefensive = ko.observable(0);
	self.nbMovement = ko.observable(0);
	self.nbSurveillanceCommunication = ko.observable(0);
	self.nbHandToHand = ko.observable(0);
	self.nbDirectFire = ko.observable(0);
	self.nbArtilleryRange = ko.observable(0);
	self.dtCreated = null;
	self.dtModified = null;
	self.framePictureUrl = ko.observable('');
	self.nbRockets = ko.observable(0);

	self.setId = function(pId) {
		self.id = pId;
	};

	self.setName = function(pName) {
		self.name = pName;
	};
}