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
			var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", 200000);
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

function createCompany() {
	var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", 200000);
	db.transaction(queryCreateCompany, errorDB);
}

function queryCreateCompany(tx) {
	companyForm = document.getElementById("companyForm");

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
	
	tx.executeSql('INSERT INTO company (name) VALUES ("' + 
			companyName + '")');
}

function modifyCompany() {
	var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", 200000);
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
	var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", 200000);
	db.transaction(queryPopulateFrameSelect, errorDB);
}

function queryPopulateFrameSelect(tx) {
    tx.executeSql('SELECT * FROM frame WHERE nb_defensive + nb_movement + nb_surveillance_communication + nb_hand_to_hand + nb_direct_fire + nb_artillery_range <= 4 ORDER BY upper(name) asc', [], queryPopulateFrameSelectSuccess, errorDB);
}

function queryPopulateFrameSelectSuccess(tx, results) {
	frameSelectMarkUp = '<select name="frameToAdd">';
	
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
	companyForm = document.getElementById("companyForm");

	frameToAdd = companyForm.elements["frameToAdd"];
	
	frameToAddId = getSelectedOptionIntValue(frameToAdd);
	
	alert('frameToAdd : ' + frameToAddId);
	
	// Show Frame line
}

function getSelectedOptionIntValue(selectComponent) {
	result = 0;
	
	optionValue = selectComponent.options[selectComponent.selectedIndex].value;
	
	if (!isNaN(optionValue)) {
        result = parseInt(optionValue);
    } // if
  
	return result;
}