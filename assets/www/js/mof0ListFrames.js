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
                
        for (var i=0; i<len; i++){
            $( "#frameTable" ).append( "<tr><td>" + results.rows.item(i).id + "</td><td>" + results.rows.item(i).data + "</td></tr>" );
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