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
