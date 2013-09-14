function listFrames() {
	// Wait for PhoneGap to load
	document.addEventListener("deviceready", onDeviceReady, false);

	// PhoneGap is ready
	function onDeviceReady() {
		var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", 200000);
		db.transaction(populateDB, errorDB, successDB);
	}
	
    // Query the database
    function queryDB(tx) {
        tx.executeSql('SELECT * FROM frame ORDER BY name', [], querySuccess, errorDB);
    }

    // Query the success callback
    function querySuccess(tx, results) {
        var len = results.rows.length;
        
        for (var i=0; i<len; i++){
        	var row = results.rows.item(i);
        
            var nbDefensive = row.nb_defensive;
            var defensiveDice = '';
            if (nbDefensive > 0) {
                defensiveDice = defensiveDice + '<img alt="Defensive" src="./img/dice/Defense.png"/>';
            } // if
            if (nbDefensive > 1) {
                defensiveDice = defensiveDice + '<img alt="Defensive" src="./img/dice/Defense.png"/>';
            } // if
            
            var nbMovement = row.nb_movement;
            var mouvementDice = '';
            if (nbMovement > 0) {
                mouvementDice = mouvementDice + '<img alt="Movement" src="./img/dice/Move.png"/>';
            } // if
            if (nbMovement > 1) {
                mouvementDice = mouvementDice + '<img alt="Movement" src="./img/dice/Move.png"/>';
            } // if
            
            var nbSurveillanceCommunication = row.nb_surveillance_communication;
            var surveillanceCommunicationDice = '';
            if (nbSurveillanceCommunication > 0) {
                surveillanceCommunicationDice = surveillanceCommunicationDice + '<img alt="Surveillance/communication" src="./img/dice/Spotting.png">';
            } // if
            if (nbSurveillanceCommunication > 1) {
                surveillanceCommunicationDice = surveillanceCommunicationDice + '<img alt="Surveillance/communication" src="./img/dice/Spotting.png">';
            } // if
            
            var nbHandToHand = row.nb_hand_to_hand;
            var handToHandDice = '';
            if (nbHandToHand > 0) {
                handToHandDice = handToHandDice + 
                                 '<img alt="Hand-to-hand weapon" src="./img/dice/HtH.png">' +
                                 '<img alt="Hand-to-hand weapon" src="./img/dice/HtH.png">';
            } // if
            if (nbHandToHand > 1) {
                handToHandDice = handToHandDice + '<img alt="Hand-to-hand weapon" src="./img/dice/HtH D8.png">';
            } // if
            
            var nbDirectFire = row.nb_direct_fire;
            var directFireDice = '';
            if (nbDirectFire > 0) {
                directFireDice = directFireDice + 
                                 '<img alt="Direct fire weapon" src="./img/dice/Direct.png">' +
                                 '<img alt="Direct fire weapon" src="./img/dice/Direct.png">';
            } // if
            if (nbDirectFire > 1) {
                directFireDice = directFireDice + '<img alt="Direct fire weapon" src="./img/dice/Direct D8.png">';
            } // if
            
            var nbArtilleryRange = row.nb_artillery_range;
            var artilleryRangeDice = '';
            if (nbArtilleryRange > 0) {
                artilleryRangeDice = artilleryRangeDice + 
                                 '<img alt="Artillery range weapon" src="./img/dice/Artillery.png">' +
                                 '<img alt="Artillery range weapon" src="./img/dice/Artillery.png">';
            } // if
            if (nbArtilleryRange > 1) {
                artilleryRangeDice = artilleryRangeDice + '<img alt="Artillery range weapon" src="./img/dice/Artillery D8.png">';
            } // if
            
            if (nbHandToHand + nbDirectFire + nbArtilleryRange === 0) {
                mouvementDice = mouvementDice + '<img alt="Movement" src="./img/dice/Move D8.png"/>';
            } // if
            
            var dice = '<img alt="Wild" src="./img/dice/White Die.png">' + 
                       '<img alt="Wild" src="./img/dice/White Die.png">' + 
                       defensiveDice + 
                       mouvementDice + 
                       surveillanceCommunicationDice + 
                       handToHandDice + 
                       directFireDice + 
                       artilleryRangeDice;
            
            $('#frameTable').append( '<tr><td><a href="./frameDetail.html?frameId=' + row.id + '">' + row.name + '</a></td><td><div class="systemDiceList">' + dice + '</div></td></tr>' );
        } // for
    }

	// Populate the database 
	function populateDB(tx) {

	}

	// Transaction error callback
	function errorDB(tx, err) {
		alert("Error processing SQL: "+err);
	}

	// Transaction success callback
	function successDB() {
		var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", 200000);
        db.transaction(queryDB, errorDB);
	}
}