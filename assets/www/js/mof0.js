var dbVersion = "1.0";

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
		var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", 200000);
		db.transaction(populateDB, errorDB, successDB);
	}

	// Populate the database 
	function populateDB(tx) {
		var localStorageDbVersion = "0.0";
		if (supportsHtml5Ttorage()) {
			if(localStorage.getItem("localStorageDbVersion") === null){
				localStorage.setItem("localStorageDbVersion", localStorageDbVersion);
			} 
			else {
				localStorageDbVersion = localStorage.getItem("localStorageDbVersion");
				// To reset the initial version
				//localStorage.setItem("localStorageDbVersion", localStorageDbVersion);
			} // if
			
			if (localStorageDbVersion === "0.0") {
				//tx.executeSql('DROP TABLE IF EXISTS frame');
				tx.executeSql('CREATE TABLE IF NOT EXISTS frame (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, nb_defensive INT, nb_movement INT, nb_surveillance_communication INT, nb_hand_to_hand INT, nb_direct_fire INT, nb_artillery_range INT)');
				//tx.executeSql('DROP TABLE IF EXISTS company');
				tx.executeSql('CREATE TABLE IF NOT EXISTS company (id INTEGER PRIMARY KEY AUTOINCREMENT, name)');
				//tx.executeSql('DROP TABLE IF EXISTS company_frame');
				tx.executeSql('CREATE TABLE IF NOT EXISTS company_frame (id INTEGER PRIMARY KEY AUTOINCREMENT, id_company INTEGER NOT NULL, id_frame INTEGER NOT NULL, nb_rockets INT)');
				localStorage.setItem("localStorageDbVersion", "1.0");
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

