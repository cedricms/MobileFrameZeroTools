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
        tx.executeSql('SELECT * FROM frame', [], querySuccess, errorDB);
    }

    // Query the success callback
    function querySuccess(tx, results) {
        var len = results.rows.length;
        //console.log("DEMO table: " + len + " rows found.");
        //alert("len : " + len);
        for (var i=0; i<len; i++){
            console.log("Row = " + i + " ID = " + results.rows.item(i).id + " Data =  " + results.rows.item(i).data);
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