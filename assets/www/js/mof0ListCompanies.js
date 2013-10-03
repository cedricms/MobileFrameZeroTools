function listCompanies() {
	// Wait for PhoneGap to load
	document.addEventListener("deviceready", onDeviceReady, false);

	// PhoneGap is ready
	function onDeviceReady() {
		var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", dbSize);
		db.transaction(populateDB, errorDB, successDB);
	}
	
    // Query the database
    function queryDB(tx) {
    	//query = 'SELECT c.id AS companyId, c.name AS companyName, count(cf.id_frame) AS nbFrames, ifnull(f.nb_defensive + f.nb_movement + f.nb_surveillance_communication + f.nb_hand_to_hand + f.nb_direct_fire + f.nb_artillery_range, 0) AS nbSystems FROM company c LEFT OUTER JOIN company_frame cf ON c.id = cf.id_company LEFT OUTER JOIN frame f ON cf.id_frame = f.id GROUP BY cf.id_frame ORDER BY upper(c.name) asc';
    	query = 'SELECT c.id AS companyId, c.name AS companyName, count(cf.id_frame) AS nbFrames FROM company c LEFT OUTER JOIN company_frame cf ON c.id = cf.id_company GROUP BY c.id ORDER BY upper(c.name) asc';
    	//query = 'SELECT c.id AS companyId, c.name AS companyName, (SELECT count(*) FROM company_frame cf WHERE cf.id_company = c.id) AS nbFrames, 0 AS nbSystems FROM company c ORDER BY upper(c.name) asc';
        tx.executeSql(query, [], querySuccess, errorDB);
    }

    // Query the success callback
    function querySuccess(tx, results) {
        var len = results.rows.length;
        //alert('len : ' + len);
        
        for (var i=0; i<len; i++){
        	var row = results.rows.item(i);
            
            $('#companyTable').append('<tr><td><input type="checkbox" name="selectedCompanies" value="' + row.companyId + '"></td><td><a class="companyNameLink" href="./companyDetail.html?companyId=' + row.companyId + '">' + 
            	row.companyName + '</a></td><td>' + row.nbFrames + '</td><td>' + row.nbSystems + '</td><td><a href="Javascript:deleteCompany(' + row.companyId + ');"><img alt="Delete" src="./img/icons/cross.png"/></a></td></tr>' );
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
		var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", dbSize);
        db.transaction(queryDB, errorDB);
	}
}

function deleteCompany(companyId) {
	jQuery.i18n.prop('areYouSureToWantToDeleteThisCompanyMessage');
	var deleteAction=confirm(areYouSureToWantToDeleteThisCompanyMessage);
	if (deleteAction == true) {
		sqlDeleteCompanyFrame = 'DELETE FROM company_frame WHERE id_company=?';
		sqlDeleteCompany = 'DELETE FROM company WHERE id=?';
		
		var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", dbSize);
		
		db.transaction(function(tx) {
							tx.executeSql(sqlDeleteCompanyFrame,[companyId]);
							tx.executeSql(sqlDeleteCompany,[companyId]);
						}, errorDB, successDB);
		
		window.location.href = "./listCompanies.html";
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
