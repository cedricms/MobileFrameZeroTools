function FrameModel() {
	var self = this;

	self.id = ko.observable(0);
	self.name = ko.observable('');
	self.nbDefensive = ko.observable(0);
	self.removeDefensive = function() {
		if (parseFloat(self.nbDefensive()) > 0) {
			self.nbDefensive(self.nbDefensive() - 1);
		} // if
    }
	self.defensiveValue1 = ko.observable(0);
	self.defensiveValue2 = ko.observable(0);
	self.rollDefensive = function() {
		if (parseFloat(self.nbDefensive()) > 0) {
			self.defensiveValue1(Math.floor(Math.random() * 6) + 1);
		} // if
		
		if (parseFloat(self.nbDefensive()) > 1) {
			self.defensiveValue2(Math.floor(Math.random() * 6) + 1);
		} // if
    }
	
	self.defensiveValue1Css = ko.computed(function() {
        return 'blued' + parseFloat(self.defensiveValue1());
    }, self);
	
	self.defensiveValue2Css = ko.computed(function() {
        return 'blued' + parseFloat(self.defensiveValue2());
    }, self);
	
	self.nbMovement = ko.observable(0);
	self.removeMovement = function() {
		if (parseFloat(self.nbMovement()) > 0) {
			self.nbMovement(self.nbMovement() - 1);
		} // if
    }
	self.movementValue1 = ko.observable(0);
	self.movementValue2 = ko.observable(0);
	self.movementValue3 = ko.observable(0);
	self.rollMovement = function() {
		if (parseFloat(self.nbMovement()) > 0) {
			self.movementValue1(Math.floor(Math.random() * 6) + 1);
		} // if
		
		if (parseFloat(self.nbMovement()) > 1) {
			self.movementValue2(Math.floor(Math.random() * 6) + 1);
		} // if
		
		if ((parseFloat(self.nbDirectFire()) === 0) || (parseFloat(self.nbArtilleryRange()) === 0)) {
			self.movementValue3(Math.floor(Math.random() * 8) + 1);
		} // if
    }
	
	self.movementValue1Css = ko.computed(function() {
        return 'greend' + parseFloat(self.movementValue1());
    }, self);
	
	self.movementValue2Css = ko.computed(function() {
        return 'greend' + parseFloat(self.movementValue2());
    }, self);
	
	self.movementValue3Css = ko.computed(function() {
        return 'greend' + parseFloat(self.movementValue3());
    }, self);
	
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

	self.setFramePictureUrl = function(pFramePictureUrl) {
		self.framePictureUrl = pFramePictureUrl;
	};

	self.setNbDefensive = function(pNbDefensive) {
		self.nbDefensive = pNbDefensive;
	};

	self.setNbMovement = function(pNbMovement) {
		self.nbMovement = pNbMovement;
	};

	self.setNbSurveillanceCommunication = function(pNbSurveillanceCommunication) {
		self.nbSurveillanceCommunication = pNbSurveillanceCommunication;
	};

	self.setNbHandToHand = function(pNbHandToHand) {
		self.nbHandToHand = pNbHandToHand;
	};

	self.setNbDirectFire = function(pNbDirectFire) {
		self.nbDirectFire = pNbDirectFire;
	};

	self.setNbArtilleryRange = function(pNbArtilleryRange) {
		self.nbArtilleryRange = pNbArtilleryRange;
	};

	self.setNbRockets = function(pNbRockets) {
		self.nbRockets = pNbRockets;
	};
}