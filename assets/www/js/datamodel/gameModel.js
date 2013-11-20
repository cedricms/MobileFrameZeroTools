function GameModel() {
  var self = this;
  
  self.startTime = new Date(); 
  self.companies = new Array();
  self.doomsdayClock = ko.observable(11);
}