function Company() {
  var self = this;
  
  self.id = null; 
  self.name = null;
  self.dtCreated = null;
  self.dtModified = null;
  self.companyPictureUrl = null;
  
  self.setId = function(pId) {
    self.id = pId;
  };
  
  self.setName = function(pName) {
    self.name = pName;
  };
}