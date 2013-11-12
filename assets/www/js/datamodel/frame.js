function Frame() {
  var self = this;
  
  self.id = null; 
  self.name = null;
  self.nbDefensive = 0;
  self.nbMovement = 0;
  self.nbSurveillanceCommunication = 0;
  self.nbHandToHand = 0;
  self.nbDirectFire = 0;
  self.nbArtilleryRange = 0;  
  self.dtCreated = null;
  self.dtModified = null;
  self.framePictureUrl = null;
  
  self.setId = function(pId) {
    self.id = pId;
  };
  
  self.setName = function(pName) {
    self.name = pName;
  };
}