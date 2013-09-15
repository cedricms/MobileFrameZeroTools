var systemsMessage = "";

function getNbSystems() {
	result = 0;
	
	frameForm = document.getElementById("frameForm");

	defensiveSystem = frameForm.elements["defensiveSystem"];	
	result = result + getRadioIntValue(defensiveSystem);

	movementSystem = frameForm.elements["movementSystem"];
	result = result + getRadioIntValue(movementSystem);

	surveillanceCommunicationSystem = frameForm.elements["surveillanceCommunicationSystem"];
	result = result + getRadioIntValue(surveillanceCommunicationSystem);

	handToHandWeaponSystem = frameForm.elements["handToHandWeaponSystem"];
	result = result + getRadioIntValue(handToHandWeaponSystem);

	directFireWeaponSystem = frameForm.elements["directFireWeaponSystem"];
	result = result + getRadioIntValue(directFireWeaponSystem);

	artilleryRangeWeaponSystem = frameForm.elements["artilleryRangeWeaponSystem"];
	result = result + getRadioIntValue(artilleryRangeWeaponSystem);
	
	return result;
}

function validateFrame() {
	frameForm = document.getElementById("frameForm");

	frameId = frameForm.elements["frameId"].value;
	if ((frameId === null) || (frameId === "")) {
		frameName = frameForm.elements["frameName"].value;
		
		if ((frameName === null) || (frameName === "")) {
			jQuery.i18n.prop('youNeedToSetTheFramesNameMessage');
			alert(youNeedToSetTheFramesNameMessage);
		}
		else {
			// Check if creation or modification and save
			var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", 200000);
			db.transaction(queryIsFrameUnique, errorDB);
		} // if
	}
	else {
		frameName = frameForm.elements["frameName"].value;
		
		if ((frameName === null) || (frameName === "")) {
			jQuery.i18n.prop('youNeedToSetTheFramesNameMessage');
			alert(youNeedToSetTheFramesNameMessage);
		}
		else {
			modifyFrame();
			window.location.href = "./listFrames.html";
		} // if
	} // if
}

// Query the database
function queryIsFrameUnique(tx) {
	frameForm = document.getElementById("frameForm");

	frameName = frameForm.elements["frameName"].value;
	
    tx.executeSql('SELECT id FROM frame WHERE upper(name)="' + frameName.toUpperCase() +'"', [], queryIsFrameUniqueSuccess, errorDB);
}

// Query the success callback
function queryIsFrameUniqueSuccess(tx, results) {
    var len = results.rows.length;
            
    if (len > 0) {
    	jQuery.i18n.prop('thatFrameAlreadyExistsMessage');
		alert(thatFrameAlreadyExistsMessage);
    }
    else {
    	frameForm = document.getElementById("frameForm");

    	frameId = frameForm.elements["frameId"].value;
    	
    	if ((frameId === null) || (frameId === "")) {
    		// Create
    		createFrame();
    	}
    	else {
    		// Modify
    		modifyFrame();
    	} // if
    	
    	window.location.href = "./listFrames.html";
    } // if
}

//Transaction error callback
function errorDB(tx, err) {
	alert("Error processing SQL: "+err);
}

function createFrame() {
	var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", 200000);
	db.transaction(queryCreateFrame, errorDB);
}

function queryCreateFrame(tx) {
	frameForm = document.getElementById("frameForm");

	frameName = frameForm.elements["frameName"].value;
	
	defensiveSystem = frameForm.elements["defensiveSystem"];	
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
	artilleryRangeWeaponSystemValue = getRadioIntValue(artilleryRangeWeaponSystem);
	
	tx.executeSql('INSERT INTO frame (name, nb_defensive, nb_movement, nb_surveillance_communication, nb_hand_to_hand, nb_direct_fire, nb_artillery_range) VALUES ("' + 
			frameName + '", ' + 
			defensiveSystemValue + ', ' +
			movementSystemValue + ', ' +
			surveillanceCommunicationSystemValue + ', ' +
			handToHandWeaponSystemValue + ', ' +
			directFireWeaponSystemValue + ', ' +
			artilleryRangeWeaponSystemValue
			 + ')');
}

function modifyFrame() {
	var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", 200000);
	db.transaction(queryModifyFrame, errorDB);
}

function queryModifyFrame(tx) {
	frameForm = document.getElementById("frameForm");

	frameId = frameForm.elements["frameId"].value;
	
	frameName = frameForm.elements["frameName"].value;
	
	defensiveSystem = frameForm.elements["defensiveSystem"];	
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
	artilleryRangeWeaponSystemValue = getRadioIntValue(artilleryRangeWeaponSystem);
	
	updateQuery = 'UPDATE frame SET name="' + frameName + '"' +
			', nb_defensive=' + defensiveSystemValue +
			', nb_movement=' + movementSystemValue +
			', nb_surveillance_communication=' + surveillanceCommunicationSystemValue +
			', nb_hand_to_hand=' + handToHandWeaponSystemValue +
			', nb_direct_fire=' + directFireWeaponSystemValue +
			', nb_artillery_range=' + artilleryRangeWeaponSystemValue +
			' WHERE id=' + frameId;
	
	tx.executeSql(updateQuery);
}

function getRadioIntValue(nodeList) {
  result = 0;

  for (i=0; i < nodeList.length; i++) {
    if (nodeList[i].checked) {
      nodeValue = nodeList[i].value;
      if (!isNaN(nodeValue)) {
        result = parseInt(nodeValue);
        break;
      } // if
    } // if
  } // for
  
  return result;
}

function setRadioValue(nodeList, nodeValue) {
	for (i=0; i < nodeList.length; i++) {
		if (nodeList[i].value == nodeValue) {
			nodeList[i].checked = true;
			break;
		} // if
    } // for
}

function getSystemsLabel(pSystemsMessage) {
	systemsMessage = pSystemsMessage;
	
	nbSystems = getNbSystems();
	
	prefix = "";
	suffix = "";
	
	if (nbSystems > 4) {
		prefix = '/!\\ ';
		suffix = ' /!\\';
		//prefix = '<img alt="Error" src="./img/icons/error.png"/> ';
		//suffix = ' <img alt="Error" src="./img/icons/error.png"/>';
	} // if
	
	return prefix + systemsMessage + " (" + nbSystems + " / 4)" + suffix;
}

function updateFrame() {
	// Update dice	
	showHideDice();	
	
	// Update system count
	$("#systemsLabel").text(getSystemsLabel(systemsMessage));
}

function showHideDice() {
	frameForm = document.getElementById("frameForm");

	defensiveSystem = frameForm.elements["defensiveSystem"];	
	defensiveValue = getRadioIntValue(defensiveSystem);
	
	switch (defensiveValue) {
		case 0:
			$('#defensiveDice').hide('fast');
			$('#defensive1').hide('fast');
			$('#defensive2').hide('fast');
	    break;
		case 1:
			$('#defensiveDice').show('fast');
			$('#defensive1').show('fast');
			$('#defensive2').hide('fast');
		break;
		case 2:
			$('#defensiveDice').show('fast');
			$('#defensive1').show('fast');
			$('#defensive2').show('fast');
		break;
		default:
			$('#defensiveDice').hide('fast');
			$('#defensive1').hide('fast');
			$('#defensive2').hide('fast');
	} // switch
	
	movementSystem = frameForm.elements["movementSystem"];	
	movementValue = getRadioIntValue(movementSystem);
	
	switch (movementValue) {
		case 0:
			$('#moveDice').hide('fast');
			$('#move1').hide('fast');
			$('#move2').hide('fast');
	    break;
		case 1:
			$('#moveDice').show('fast');
			$('#move1').show('fast');
			$('#move2').hide('fast');
		break;
		case 2:
			$('#moveDice').show('fast');
			$('#move1').show('fast');
			$('#move2').show('fast');
		break;
		default:
			$('#moveDice').hide('fast');
			$('#move1').hide('fast');
			$('#move2').hide('fast');
	} // switch
	
	surveillanceCommunicationSystem = frameForm.elements["surveillanceCommunicationSystem"];	
	surveillanceCommunicationValue = getRadioIntValue(surveillanceCommunicationSystem);
	
	switch (surveillanceCommunicationValue) {
		case 0:
			$('#spottingDice').hide('fast');
			$('#spotting1').hide('fast');
			$('#spotting2').hide('fast');
	    break;
		case 1:
			$('#spottingDice').show('fast');
			$('#spotting1').show('fast');
			$('#spotting2').hide('fast');
		break;
		case 2:
			$('#spottingDice').show('fast');
			$('#spotting1').show('fast');
			$('#spotting2').show('fast');
		break;
		default:
			$('#spottingDice').hide('fast');
			$('#spotting1').hide('fast');
			$('#spotting2').hide('fast');
	} // switch
	
	weaponTaken = false;
	
	handToHandWeaponSystem = frameForm.elements["handToHandWeaponSystem"];	
	handToHandWeaponValue = getRadioIntValue(handToHandWeaponSystem);
	
	switch (handToHandWeaponValue) {
		case 0:
			$('#hthDice').hide('fast');
			$('#hth1').hide('fast');
			$('#hth2').hide('fast');
			$('#hthD8').hide('fast');
	    break;
		case 1:
			$('#hthDice').show('fast');
			$('#hth1').show('fast');
			$('#hth2').show('fast');
			$('#hthD8').hide('fast');
			weaponTaken = true;
		break;
		case 2:
			$('#hthDice').show('fast');
			$('#hth1').show('fast');
			$('#hth2').show('fast');
			$('#hthD8').show('fast');
			weaponTaken = true;
		break;
		default:
			$('#hthDice').hide('fast');
			$('#hth1').hide('fast');
			$('#hth2').hide('fast');
			$('#hthD8').hide('fast');
			weaponTaken = true;
	} // switch

	directFireWeaponSystem = frameForm.elements["directFireWeaponSystem"];	
	directFireWeaponValue = getRadioIntValue(directFireWeaponSystem);
	
	switch (directFireWeaponValue) {
		case 0:
			$('#directDice').hide('fast');
			$('#direct1').hide('fast');
			$('#direct2').hide('fast');
			$('#directD8').hide('fast');
	    break;
		case 1:
			$('#directDice').show('fast');
			$('#direct1').show('fast');
			$('#direct2').show('fast');
			$('#directD8').hide('fast');
			weaponTaken = true;
		break;
		case 2:
			$('#directDice').show('fast');
			$('#direct1').show('fast');
			$('#direct2').show('fast');
			$('#directD8').show('fast');
			weaponTaken = true;
		break;
		default:
			$('#directDice').hide('fast');
			$('#direct1').hide('fast');
			$('#direct2').hide('fast');
			$('#directD8').hide('fast');
			weaponTaken = true;
	} // switch

	artilleryRangeWeaponSystem = frameForm.elements["artilleryRangeWeaponSystem"];	
	artilleryRangeWeaponValue = getRadioIntValue(artilleryRangeWeaponSystem);
	
	switch (artilleryRangeWeaponValue) {
		case 0:
			$('#artilleryDice').hide('fast');
			$('#artillery1').hide('fast');
			$('#artillery2').hide('fast');
			$('#artilleryD8').hide('fast');
	    break;
		case 1:
			$('#artilleryDice').show('fast');
			$('#artillery1').show('fast');
			$('#artillery2').show('fast');
			$('#artilleryD8').hide('fast');
			weaponTaken = true;
		break;
		case 2:
			$('#artilleryDice').show('fast');
			$('#artillery1').show('fast');
			$('#artillery2').show('fast');
			$('#artilleryD8').show('fast');
			weaponTaken = true;
		break;
		default:
			$('#artilleryDice').hide('fast');
			$('#artillery1').hide('fast');
			$('#artillery2').hide('fast');
			$('#artilleryD8').hide('fast');
			weaponTaken = true;
	} // switch
	
	if (weaponTaken) {
		$('#moveD8').hide('fast');
	}
	else {
		$('#moveDice').show('fast');
		$('#moveD8').show('fast');
	} // if
}

function loadFrame(urlFrameId) {
	frameForm = document.getElementById("frameForm");
	
	frameId = frameForm.elements["frameId"];
	
	if (urlFrameId === undefined) {
		// Do nothing
	}
	else {
		frameId.value = urlFrameId;
		var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", 200000);
		db.transaction(queryFrameById, errorDB);
	} // if
}

// Query the database
function queryFrameById(tx) {
	frameForm = document.getElementById("frameForm");
    frameId = frameForm.elements["frameId"];
    
    tx.executeSql('SELECT * FROM frame WHERE id=' + frameId.value, [], queryFrameByIdSuccess, errorDB);
}

// Query the success callback
function queryFrameByIdSuccess(tx, results) {
    var len = results.rows.length;
    
    frameForm = document.getElementById("frameForm");
    
    for (var i=0; i<len; i++){
    	var row = results.rows.item(i);
    	
    	frameName = frameForm.elements["frameName"];
    	frameName.value = row.name;
    	
    	defensiveSystem = frameForm.elements["defensiveSystem"];
    	setRadioValue(defensiveSystem, row.nb_defensive);
    	
    	movementSystem = frameForm.elements["movementSystem"];
    	setRadioValue(movementSystem, row.nb_movement);
    	
    	surveillanceCommunicationSystem = frameForm.elements["surveillanceCommunicationSystem"];
    	setRadioValue(surveillanceCommunicationSystem, row.nb_surveillance_communication);
    	
    	handToHandWeaponSystem = frameForm.elements["handToHandWeaponSystem"];
    	setRadioValue(handToHandWeaponSystem, row.nb_hand_to_hand);
    	
    	directFireWeaponSystem = frameForm.elements["directFireWeaponSystem"];
    	setRadioValue(directFireWeaponSystem, row.nb_direct_fire);
    	
    	artilleryRangeWeaponSystem = frameForm.elements["artilleryRangeWeaponSystem"];
    	setRadioValue(artilleryRangeWeaponSystem, row.nb_artillery_range);
    	
    	break;
    } // for
}

// Transaction error callback
function errorDB(tx, err) {
	alert("Error processing SQL: "+err);
}