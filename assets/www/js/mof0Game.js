var gameModel;

function initGame() {
	gameModel = new GameModel();
	
	
	
	ko.applyBindings(gameModel);
}