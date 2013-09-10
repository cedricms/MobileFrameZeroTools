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
  
  //alert(nodeList.name + " : " + result);
  
  return result;
}

function getSystemsLabel(pSystemsMessage) {
	systemsMessage = pSystemsMessage;
	
	nbSystems = getNbSystems();
	
	prefix = "";
	suffix = "";
	
	if (nbSystems > 4) {
		prefix = "!!! ";
		suffix = " !!!";
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