function validateCompany() {
	companyForm = document.getElementById("companyForm");

	companyId = companyForm.elements["companyId"].value;
	if ((companyId === null) || (companyId === "")) {
		companyName = companyForm.elements["companyName"].value;
		
		if ((companyName === null) || (companyName === "")) {
			jQuery.i18n.prop('youNeedToSetTheCompanysNameMessage');
			alert(youNeedToSetTheCompanysNameMessage);
		}
		else {
			// Check if creation or modification and save
			var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", dbSize);
			db.transaction(queryIsCompanyUnique, errorDB);
		} // if
	}
	else {
		companyName = companyForm.elements["companyName"].value;
		
		if ((companyName === null) || (companyName === "")) {
			jQuery.i18n.prop('youNeedToSetTheCompanysNameMessage');
			alert(youNeedToSetTheCompanysNameMessage);
		}
		else {
			modifyCompany();
			window.location.href = "./listCompanies.html";
		} // if
	} // if
}

// Query the database
function queryIsCompanyUnique(tx) {
	companyForm = document.getElementById("companyForm");

	companyName = companyForm.elements["companyName"].value;
	
    tx.executeSql('SELECT id FROM company WHERE upper(name)="' + companyName.toUpperCase() +'"', [], queryIsCompanyUniqueSuccess, errorDB);
}

// Query the success callback
function queryIsCompanyUniqueSuccess(tx, results) {
    var len = results.rows.length;
            
    if (len > 0) {
    	jQuery.i18n.prop('thatCompanyAlreadyExistsMessage');
		alert(thatCompanyAlreadyExistsMessage);
    }
    else {
    	companyForm = document.getElementById("companyForm");

    	companyId = companyForm.elements["companyId"].value;
    	
    	if ((companyId === null) || (companyId === "")) {
    		// Create
    		createCompany();
    	}
    	else {
    		// Modify
    		modifyCompany();
    	} // if
    	
    	window.location.href = "./listCompanies.html";
    } // if
}

//Transaction error callback
function errorDB(tx, err) {
	alert("Error processing SQL: "+err);
}

function loadCompany(urlCompanyId) {
	companyForm = document.getElementById("companyForm");
	
	companyId = companyForm.elements["companyId"];
	
	if (urlCompanyId === undefined) {
		// Do nothing
	}
	else {
		companyId.value = urlCompanyId;
		var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", dbSize);
		db.transaction(queryCompanyId, errorDB);
	} // if
}

// Query the database
function queryCompanyId(tx) {
	companyForm = document.getElementById("companyForm");
    companyId = companyForm.elements["companyId"];
    
    tx.executeSql('SELECT * FROM company WHERE id=?', [companyId.value], queryCompanyIdSuccess, errorDB);
}

// Query the success callback
function queryCompanyIdSuccess(tx, results) {
    var len = results.rows.length;
    
    companyForm = document.getElementById("companyForm");
    
    for (var i=0; i<len; i++){
    	var row = results.rows.item(i);
    	
    	companyName = companyForm.elements["companyName"];
    	companyName.value = row.name;
    	
    	tx.executeSql('SELECT f.id AS frameId, f.name AS frameName, nb_defensive, nb_movement, nb_surveillance_communication, nb_hand_to_hand, nb_direct_fire, nb_artillery_range, nb_rockets FROM company_frame cf, frame f WHERE cf.id_company=? AND cf.id_frame=f.id ORDER BY f.name', [row.id], queryFrameForRowSuccess, errorDB);
    	
    	break;
    } // for
}

function queryFrameForRowSuccess(tx, results) {
	var len = results.rows.length;
    
    for (var i=0; i<len; i++){
    	var row = results.rows.item(i);
		addFrameRow(row);
    
    	companyForm = document.getElementById("companyForm");
    	
    	nbFrame = i + 1;
    	nbRockets = companyForm.elements["nbRockets_" + nbFrame];
    	nbRockets.value = row.nb_rockets;
	} // for
}

function createCompany() {
	var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", dbSize);
	db.transaction(function(tx) {
						queryCreateCompany(tx);
					}, errorDB, successDB);
}

function queryCreateCompany(tx) {
	companyForm = document.getElementById("companyForm");

	companyName = companyForm.elements["companyName"].value;
	
	console.log('companyName : ' + companyName);
	
	tx.executeSql('INSERT INTO company (name, dt_created) VALUES ("' + companyName + '", datetime("now"))');
	
	// Shitty hack to go around the dreaded SQLite error 23 bug
	nbFrames = parseInt(companyForm.elements["nbFrames"].value);
	
	if (nbFrames > 0) {
		sqlInsertCompanyFrame = 'INSERT INTO company_frame (id_company, id_frame, nb_rockets, dt_created) ';
		
		iFrame = 1;
		while (iFrame <= nbFrames) {
			companyForm = document.getElementById("companyForm");
			frameId = companyForm.elements["frameId_" + iFrame];
			if (typeof frameId === "undefined") {
				// Probably a deleted frame
			}
			else {
				if (!isNaN(frameId.value)) {
        			frameIdInt = parseInt(frameId.value);
        		
	       			nbRockets = companyForm.elements["nbRockets_" + iFrame];
    	   			nbRocketsInt = 0;
        			if (!isNaN(nbRockets.value)) {
        				nbRocketsInt = parseInt(nbRockets.value);
        			} // if
	       		} // if
			} // if
		
			if (iFrame > 1) {
				sqlInsertCompanyFrame = sqlInsertCompanyFrame + ' UNION ALL ';
			} // if
			
			sqlInsertCompanyFrame = sqlInsertCompanyFrame + 'SELECT (SELECT MAX(c.id) FROM company c), ' + frameIdInt + ', ' + nbRocketsInt + ', datetime("now")';
					
			iFrame++;
		} // while
		
		sqlInsertCompanyFrame = sqlInsertCompanyFrame + ';';
		
		console.log('sqlInsertCompanyFrame : ' + sqlInsertCompanyFrame);
		
		tx.executeSql(sqlInsertCompanyFrame);
	} // if	
}

function successDB() {
		
}

function modifyCompany() {
	var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", dbSize);
	db.transaction(queryModifyCompany, errorDB);
}

function queryModifyCompany(tx) {
	companyForm = document.getElementById("companyForm");

	companyId = companyForm.elements["companyId"].value;
	
	companyName = companyForm.elements["companyName"].value;
	
	/*defensiveSystem = frameForm.elements["defensiveSystem"];	
	defensiveSystemValue = getRadioIntValue(defensiveSystem);

	movementSystem = frameForm.elements["movementSystem"];
	movementSystemValue = getRadioIntValue(movementSystem);

	surveillanceCommunicationSystem = frameForm.elements["surveillanceCommunicationSystem"];
	surveillanceCommunicationSystemValue = getRadioIntValue(surveillanceCommunicationSystem);

	handToHandWeaponSystem = frameForm.elements["handToHandWeaponSystem"];
	handToHandWeaponSystemValue = getRadioIntValue(handToHandWeaponSystem);

	directFireWeaponSystem = frameForm.elements["directFireWeaponSystem"];
	directFireWeaponSystemValue = getRadioIntValue(directFireWeaponSystem);

	artilleryRangeWeaponSystem = frameForm.elements["artilleryRangeWeaponSystem"];
	artilleryRangeWeaponSystemValue = getRadioIntValue(artilleryRangeWeaponSystem);*/
	
	updateQuery = 'UPDATE company SET name="' + companyName + '"' +
			/*', nb_defensive=' + defensiveSystemValue +
			', nb_movement=' + movementSystemValue +
			', nb_surveillance_communication=' + surveillanceCommunicationSystemValue +
			', nb_hand_to_hand=' + handToHandWeaponSystemValue +
			', nb_direct_fire=' + directFireWeaponSystemValue +
			', nb_artillery_range=' + artilleryRangeWeaponSystemValue +*/
			' WHERE id=' + companyId;
	
	tx.executeSql(updateQuery);
}

function populateFrameSelect() {
	var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", dbSize);
	db.transaction(queryPopulateFrameSelect, errorDB);
}

function queryPopulateFrameSelect(tx) {
    tx.executeSql('SELECT * FROM frame WHERE nb_defensive + nb_movement + nb_surveillance_communication + nb_hand_to_hand + nb_direct_fire + nb_artillery_range <= 4 ORDER BY upper(name) asc', [], queryPopulateFrameSelectSuccess, errorDB);
}

function queryPopulateFrameSelectSuccess(tx, results) {
	frameSelectMarkUp = '<select name="frameToAdd" onchange="showFrameInfoOnSelect()">';
	frameSelectMarkUp = frameSelectMarkUp + '<option value=""></option>';
	
    var len = results.rows.length;
        
    for (var i=0; i<len; i++){
      	var row = results.rows.item(i);
            
    	frameSelectMarkUp = frameSelectMarkUp + '<option value="' + row.id + '">' + row.name + '</option>';
	// <option value="">label</option>
	} // for
	
	frameSelectMarkUp = frameSelectMarkUp + '</select>';

	$('#frameSelect').append(frameSelectMarkUp);
}

function addFrameToCompany() {	
	var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", dbSize);
	db.transaction(queryAddFrameToCompany, errorDB);
}

function queryAddFrameToCompany(tx) {	
	companyForm = document.getElementById("companyForm");

	frameToAdd = companyForm.elements["frameToAdd"];
	
	frameToAddId = getSelectedOptionIntValue(frameToAdd);
	
    tx.executeSql('SELECT f.id AS frameId, f.name AS frameName, nb_defensive, nb_movement, nb_surveillance_communication, nb_hand_to_hand, nb_direct_fire, nb_artillery_range FROM frame f WHERE f.id=?', [frameToAddId], queryAddFrameToCompanySuccess, errorDB);
}

function queryAddFrameToCompanySuccess(tx, results) {
    var len = results.rows.length;
        
    for (var i=0; i<len; i++){
      	var row = results.rows.item(i);
            
        addFrameRow(row);
    	
    	break;
   	} // for
}

function addFrameRow(row) {
	frameToAddMarkUp = '';
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
         
        var tooManySystems = '';
        var nbSystems = nbDefensive + nbMovement + nbSurveillanceCommunication + nbHandToHand + nbDirectFire + nbArtilleryRange;
        if (nbSystems > 4) {
            tooManySystems = '<img alt="Error" src="./img/icons/error.png"/>';
        } // if
        
        companyForm = document.getElementById("companyForm");

	    nbFrames = parseInt(companyForm.elements["nbFrames"].value);
	    nbFrames++;
	    companyForm.elements["nbFrames"].value = nbFrames;
            
        frameToAddMarkUp = '<tr id="frame_' + nbFrames + '"><input name="frameId_' + nbFrames + '" type="hidden" value="' + row.frameId + '"/><td><a class="frameNameLink" href="./frameDetail.html?frameId=' + row.frameId + '">' + 
         	tooManySystems + ' ' + row.frameName + ' ' + tooManySystems + '</a></td><td>' + tooManySystems + ' ' + nbSystems + '/4 ' + 
           	tooManySystems + 
           	'</td><td><div class="systemDiceList">' + dice + '</div></td>' +
           	'<td><input class="form-control" name="nbRockets_' + nbFrames + '" type="text" value="0"/></td>' +
           	'<td><a href="Javascript:removeFrame(' + nbFrames + ');"><img alt="Delete" src="./img/icons/cross.png"/></a></td></tr>';

	$('#frameTable').append(frameToAddMarkUp);
}

function removeFrame(frameNumber) {
  $('#frame_' + frameNumber).remove();
}

function getSelectedOptionIntValue(selectComponent) {
	result = 0;
	
	optionValue = selectComponent.options[selectComponent.selectedIndex].value;
	
	if (!isNaN(optionValue)) {
        result = parseInt(optionValue);
    } // if
  
	return result;
}

function showFrameInfoOnSelect() {
	var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", dbSize);
	db.transaction(queryShowFrameInfoOnSelect, errorDB);
}

function queryShowFrameInfoOnSelect(tx) {	
	companyForm = document.getElementById("companyForm");

	frameToAdd = companyForm.elements["frameToAdd"];
	
	frameToAddId = getSelectedOptionIntValue(frameToAdd);
	
    tx.executeSql('SELECT * FROM frame WHERE id=?', [frameToAddId], queryShowFrameInfoOnSelectSuccess, errorDB);
}

function queryShowFrameInfoOnSelectSuccess(tx, results) {
	frameSelectMarkUp = '<div class="frameInformationZone">';
	
    var len = results.rows.length;
        
    for (var i=0; i<len; i++){
      	var row = results.rows.item(i);
            
    	frameSelectMarkUp = frameSelectMarkUp + row.name;
    	
    	break;
   	} // for
   	
   	frameSelectMarkUp = frameSelectMarkUp + '</div>';
	
	//$('#selectedFrameInformation').text(frameSelectMarkUp);
	
	//$('#selectedFrameInformation').val($("<div/>").html(frameSelectMarkUp).text());
}
