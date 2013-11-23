function GameModel() {
  var self = this;
  
  self.startTime = new Date(); 
  self.companies = ko.observableArray();
  self.doomsdayClock = ko.observable(11);
  
  self.getCompanies = function() {
    return self.companies;
  };
}