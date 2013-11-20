function GameModel() {
  var self = this;
  
  self.startTime = new Date(); 
  self.companies = ko.observableArray();
  self.doomsdayClock = ko.observable(11);
}