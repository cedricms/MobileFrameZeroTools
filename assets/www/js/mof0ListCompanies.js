function listCompanies() {
	// Wait for PhoneGap to load
	document.addEventListener("deviceready", onDeviceReady, false);

	// PhoneGap is ready
	function onDeviceReady() {
		var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", 200000);
		db.transaction(populateDB, errorDB, successDB);
	}
	
    // Query the database
    function queryDB(tx) {
        tx.executeSql('SELECT * FROM company ORDER BY upper(name) asc', [], querySuccess, errorDB);
    }

    // Query the success callback
    function querySuccess(tx, results) {
        var len = results.rows.length;
        
        for (var i=0; i<len; i++){
        	var row = results.rows.item(i);
            
            $('#companyTable').append('<tr><td><a class="companyNameLink" href="./companyDetail.html?companyId=' + row.id + '">' + 
            	row.name + '</a></td><td><a href="Javascript:deleteCompany(' + row.id + ');"><img alt="Delete" src="./img/icons/cross.png"/></a></td></tr>' );
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
