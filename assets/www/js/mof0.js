var applicationVersion = "1.1.0";
var dbVersion = "1.1";
var dbSize = 1000000;
var dropFrameSQL = 'DROP TABLE IF EXISTS frame';
var createFrameSQL = 'CREATE TABLE IF NOT EXISTS frame (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, nb_defensive INT, nb_movement INT, nb_surveillance_communication INT, nb_hand_to_hand INT, nb_direct_fire INT, nb_artillery_range INT, dt_created DATETIME, dt_modified DATETIME)';
var insertFrame1SQL = 'INSERT INTO frame (name, nb_defensive, nb_movement, nb_surveillance_communication, nb_hand_to_hand, nb_direct_fire, nb_artillery_range, dt_created) VALUES ("The Soldier", 1, 1, 1, 0, 1, 0, datetime("now"))';
var insertFrame2SQL = 'INSERT INTO frame (name, nb_defensive, nb_movement, nb_surveillance_communication, nb_hand_to_hand, nb_direct_fire, nb_artillery_range, dt_created) VALUES ("The Commando", 1, 0, 2, 1, 0, 0, datetime("now"))';
var insertFrame3SQL = 'INSERT INTO frame (name, nb_defensive, nb_movement, nb_surveillance_communication, nb_hand_to_hand, nb_direct_fire, nb_artillery_range, dt_created) VALUES ("The Support Soldier", 0, 1, 2, 0, 1, 0, datetime("now"))';
var insertFrame4SQL = 'INSERT INTO frame (name, nb_defensive, nb_movement, nb_surveillance_communication, nb_hand_to_hand, nb_direct_fire, nb_artillery_range, dt_created) VALUES ("The Mobile Cannon", 1, 1, 0, 0, 0, 2, datetime("now"))';
var insertFrame5SQL = 'INSERT INTO frame (name, nb_defensive, nb_movement, nb_surveillance_communication, nb_hand_to_hand, nb_direct_fire, nb_artillery_range, dt_created) VALUES ("The Brawler", 2, 0, 0, 2, 0, 0, datetime("now"))';
var insertFrame6SQL = 'INSERT INTO frame (name, nb_defensive, nb_movement, nb_surveillance_communication, nb_hand_to_hand, nb_direct_fire, nb_artillery_range, dt_created) VALUES ("The Stalker", 0, 1, 0, 0, 0, 2, datetime("now"))';
var insertFrame7SQL = 'INSERT INTO frame (name, nb_defensive, nb_movement, nb_surveillance_communication, nb_hand_to_hand, nb_direct_fire, nb_artillery_range, dt_created) VALUES ("The Spotter", 0, 0, 2, 0, 0, 0, datetime("now"))';
var insertFrame8SQL = 'INSERT INTO frame (name, nb_defensive, nb_movement, nb_surveillance_communication, nb_hand_to_hand, nb_direct_fire, nb_artillery_range, dt_created) VALUES ("The Closer", 1, 0, 0, 2, 1, 0, datetime("now"))';
var insertFrame9SQL = 'INSERT INTO frame (name, nb_defensive, nb_movement, nb_surveillance_communication, nb_hand_to_hand, nb_direct_fire, nb_artillery_range, dt_created) VALUES ("The Tank", 2, 0, 0, 0, 2, 0, datetime("now"))';
var insertFrame10SQL = 'INSERT INTO frame (name, nb_defensive, nb_movement, nb_surveillance_communication, nb_hand_to_hand, nb_direct_fire, nb_artillery_range, dt_created) VALUES ("The Armored Spotter", 1, 0, 2, 0, 0, 0, datetime("now"))';
var insertFrame11SQL = 'INSERT INTO frame (name, nb_defensive, nb_movement, nb_surveillance_communication, nb_hand_to_hand, nb_direct_fire, nb_artillery_range, dt_created) VALUES ("The Artillerist", 2, 0, 0, 0, 0, 2, datetime("now"))';
var insertFrame12SQL = 'INSERT INTO frame (name, nb_defensive, nb_movement, nb_surveillance_communication, nb_hand_to_hand, nb_direct_fire, nb_artillery_range, dt_created) VALUES ("The Sniper", 1, 1, 0, 0, 0, 1, datetime("now"))';
var insertFrame13SQL = 'INSERT INTO frame (name, nb_defensive, nb_movement, nb_surveillance_communication, nb_hand_to_hand, nb_direct_fire, nb_artillery_range, dt_created) VALUES ("The Grunt", 1, 1, 0, 1, 1, 0, datetime("now"))';
var insertFrame14SQL = 'INSERT INTO frame (name, nb_defensive, nb_movement, nb_surveillance_communication, nb_hand_to_hand, nb_direct_fire, nb_artillery_range, dt_created) VALUES ("The Berserker A.K.A. The Swarmer", 1, 0, 1, 2, 0, 0, datetime("now"))';
var insertFrame15SQL = 'INSERT INTO frame (name, nb_defensive, nb_movement, nb_surveillance_communication, nb_hand_to_hand, nb_direct_fire, nb_artillery_range, dt_created) VALUES ("The Battering Ram", 2, 0, 1, 1, 0, 0, datetime("now"))';
var dropCompanySQL = 'DROP TABLE IF EXISTS company';
var createCompanySQL = 'CREATE TABLE IF NOT EXISTS company (id INTEGER PRIMARY KEY AUTOINCREMENT, name, dt_created DATETIME, dt_modified DATETIME)';
var dropCompanyFrameSQL = 'DROP TABLE IF EXISTS company_frame';
var createCompanyFrameSQL = 'CREATE TABLE IF NOT EXISTS company_frame (id INTEGER PRIMARY KEY AUTOINCREMENT, id_company INTEGER NOT NULL, id_frame INTEGER NOT NULL, nb_rockets INT, dt_created DATETIME, dt_modified DATETIME)';
var alterFrame1SQL = 'ALTER TABLE frame ADD frame_picture_url';
var alterCompany1SQL = 'ALTER TABLE company ADD company_picture_url';

function getBackButtonMarkup(applicationTitle) {
	//return '<a class="backButton" href="./menu.html"><img src="./img/moF0LittleGuy/MoF0LittleGuy_50_57.png" class="img-responsive" alt="' + applicationTitle + '"></a>';
	return '<a class="backButton" href="./menu.html" title="' + applicationTitle + '"><span>&lsaquo;</span></a>';
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
			//console.log('localStorage.getItem("localStorageDbVersion")' + localStorage.getItem("localStorageDbVersion"));
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
				tx.executeSql(insertFrame2SQL);
				tx.executeSql(insertFrame3SQL);
				tx.executeSql(insertFrame4SQL);
				tx.executeSql(insertFrame5SQL);
				tx.executeSql(insertFrame6SQL);
				tx.executeSql(insertFrame7SQL);
				tx.executeSql(insertFrame8SQL);
				tx.executeSql(insertFrame9SQL);
				tx.executeSql(insertFrame10SQL);
				tx.executeSql(insertFrame11SQL);
				tx.executeSql(insertFrame12SQL);
				tx.executeSql(createCompanySQL);
				tx.executeSql(createCompanyFrameSQL);
				localStorage.setItem("localStorageDbVersion", "1.0");
				localStorageDbVersion = "1.0";
				//console.log('Database initialised');
			} // if
			
			if (localStorageDbVersion === "1.0") {
				tx.executeSql(insertFrame13SQL);
				tx.executeSql(insertFrame14SQL);
				tx.executeSql(insertFrame15SQL);
				
				tx.executeSql(alterFrame1SQL);
				tx.executeSql(alterCompany1SQL);
				
				localStorage.setItem("localStorageDbVersion", "1.1");
				localStorageDbVersion = "1.1";
			} // if
			
			if (localStorageDbVersion === "1.1") {
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
							tx.executeSql(dropFrameSQL);
							tx.executeSql(createFrameSQL);
							tx.executeSql(alterFrame1SQL);
							tx.executeSql(insertFrame1SQL);
							tx.executeSql(insertFrame2SQL);
							tx.executeSql(insertFrame3SQL);
							tx.executeSql(insertFrame4SQL);
							tx.executeSql(insertFrame5SQL);
							tx.executeSql(insertFrame6SQL);
							tx.executeSql(insertFrame7SQL);
							tx.executeSql(insertFrame8SQL);
							tx.executeSql(insertFrame9SQL);
							tx.executeSql(insertFrame10SQL);
							tx.executeSql(insertFrame11SQL);
							tx.executeSql(insertFrame12SQL);
							tx.executeSql(insertFrame13SQL);
							tx.executeSql(insertFrame14SQL);
							tx.executeSql(insertFrame15SQL);
							tx.executeSql(dropCompanySQL);
							tx.executeSql(createCompanySQL);
							tx.executeSql(alterCompany1SQL);
							tx.executeSql(dropCompanyFrameSQL);
							tx.executeSql(createCompanyFrameSQL);
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

