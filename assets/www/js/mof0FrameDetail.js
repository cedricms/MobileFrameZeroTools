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
	return systemsMessage + " (" + getNbSystems() + " / 4)";
}

function updateFrame() {
	// Update dice
	
	// Update system count
	//$("#systemsLabel").text(htmlToSpecialCharacters(getSystemsLabel(systemsMessage))).html();
	$("#systemsLabel").text(getSystemsLabel(systemsMessage));
}

function htmlToSpecialCharacters(htmlString) {
	result = htmlString;
	
	result = result.replace("&egrave;", "è");
	
	return result;
}