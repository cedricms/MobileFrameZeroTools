var dbVersion = "1.0";
var dbSize = 1000000;
var applicationVersion = "1.0.0";
var dropFrameSQL = 'DROP TABLE IF EXISTS frame';
var createFrameSQL = 'CREATE TABLE IF NOT EXISTS frame (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, nb_defensive INT, nb_movement INT, nb_surveillance_communication INT, nb_hand_to_hand INT, nb_direct_fire INT, nb_artillery_range INT, dt_created DATETIME, dt_modified DATETIME)';
var insertFrame1SQL = 'INSERT INTO frame (name, nb_defensive, nb_movement, nb_surveillance_communication, nb_hand_to_hand, nb_direct_fire, nb_artillery_range, dt_created) VALUES ("Soldier configuration", 1, 1, 1, 0, 1, 0, datetime("now"))';
var dropCompanySQL = 'DROP TABLE IF EXISTS company';
var createCompanySQL = 'CREATE TABLE IF NOT EXISTS company (id INTEGER PRIMARY KEY AUTOINCREMENT, name, dt_created DATETIME, dt_modified DATETIME)';
var dropCompanyFrameSQL = 'DROP TABLE IF EXISTS company_frame';
var createCompanyFrameSQL = 'CREATE TABLE IF NOT EXISTS company_frame (id INTEGER PRIMARY KEY AUTOINCREMENT, id_company INTEGER NOT NULL, id_frame INTEGER NOT NULL, nb_rockets INT, dt_created DATETIME, dt_modified DATETIME)';

function getBackButtonMarkup(applicationTitle) {
	return '<a class="backButton" href="./menu.html"><img src="./img/moF0LittleGuy/MoF0LittleGuy_50_57.png" class="img-responsive" alt="' + applicationTitle + '"></a>';
}

function initLanguages() {
	var userLang = navigator.language || navigator.userLanguage;
	userLang = userLang.substring(0,2);
	loadBundles(userLang);
}

function supportsHtml5Ttorage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}

function initDb() {
	// Wait for PhoneGap to load
	document.addEventListener("deviceready", onDeviceReady, false);

	// PhoneGap is ready
	function onDeviceReady() {
		var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", dbSize);
		db.transaction(populateDB, errorDB, successDB);
	}

	// Populate the database 
	function populateDB(tx) {
		var localStorageDbVersion = "0.0";
		if (supportsHtml5Ttorage()) {
			console.log('localStorage.getItem("localStorageDbVersion")' + localStorage.getItem("localStorageDbVersion"));
			if(localStorage.getItem("localStorageDbVersion") === null){
				localStorage.setItem("localStorageDbVersion", localStorageDbVersion);
			} 
			else {
				localStorageDbVersion = localStorage.getItem("localStorageDbVersion");
				// To reset the initial version
				//localStorage.setItem("localStorageDbVersion", localStorageDbVersion);
			} // if
			
			if (localStorageDbVersion === "0.0") {
				tx.executeSql(createFrameSQL);
				tx.executeSql(insertFrame1SQL);
				tx.executeSql(createCompanySQL);
				tx.executeSql(createCompanyFrameSQL);
				localStorage.setItem("localStorageDbVersion", "1.0");
				console.log('Database initialised');
			} // if
			
			if (localStorageDbVersion === "1.0") {
				// To update the next version
				
			} // if
		}
		else {
			alert("Local storage not supported :'( ...");
		} // if
	}

	// Transaction error callback
	function errorDB(tx, err) {
		alert("Error processing SQL: "+err);
	}

	// Transaction success callback
	function successDB() {
		
	}
}

function resetDatabase() {
	jQuery.i18n.prop('areYouSureToWantToResetTheDatabaseMessage');
	var resetAction=confirm(areYouSureToWantToResetTheDatabaseMessage);
	if (resetAction == true) {		
		var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", dbSize);
		
		db.transaction(function(tx) {
							tx.executeSql(dropFrameSQL,[]);
							tx.executeSql(createFrameSQL,[]);
							tx.executeSql(insertFrame1SQL,[]);
							tx.executeSql(dropCompanySQL,[]);
							tx.executeSql(createCompanySQL,[]);
							tx.executeSql(dropCompanyFrameSQL,[]);
							tx.executeSql(createCompanyFrameSQL,[]);
						}, errorDB, successDB);
		
		jQuery.i18n.prop('databaseResetConfirmationMessage');
		alert(databaseResetConfirmationMessage);
	}
	else {
		// Do nothing
	} // if
}

// Transaction error callback
function errorDB(tx, err) {
	alert("Error processing SQL: "+err);
}

// Transaction success callback
function successDB() {
	
}

function getApplicationVersion() {
	return applicationVersion;
}

function getDbVersion() {
	return dbVersion;
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

