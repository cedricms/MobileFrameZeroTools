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
    	query = 'SELECT c.id AS companyId, c.name AS companyName, c.company_picture_url AS companyPictureUrl, count(cf.id_frame) AS nbFrames, ifnull(sum(f.nb_defensive + f.nb_movement + f.nb_surveillance_communication + f.nb_hand_to_hand + f.nb_direct_fire + f.nb_artillery_range), 0) AS nbSystems FROM company c LEFT OUTER JOIN company_frame cf ON c.id = cf.id_company LEFT OUTER JOIN frame f ON cf.id_frame = f.id GROUP BY cf.id_company ORDER BY upper(c.name) asc';
        tx.executeSql(query, [], querySuccess, errorDB);
    }

    // Query the success callback
    function querySuccess(tx, results) {
        var len = results.rows.length;
        
        var companyPhotoIdMap = new Object();
        for (var i=0; i<len; i++){
        	var row = results.rows.item(i);

			var companyId = row.companyId;
            $('#companyTable').append('<tr><td class="tableData"><input type="checkbox" name="selectedCompanies" value="' + row.companyId + '"></td>' +
            	'<td class="tableData text-center">' +
            	'<div><a href="./companyDetail.html?companyId=' + companyId + '">' +
	            '<img alt="Company picture" class="mf0CompanyThumbnail" data-rel="external" id="companyPicture_' + companyId + '" src="./img/moF0LittleGuy/TwoMoF0LittleGuies_200_117.png"/>' +
    	        '</a></div>' +
    	        '<div><a class="companyNameLink" href="./companyDetail.html?companyId=' + companyId + '">' + 
            	row.companyName + '</a></div></td><td class="tableData">' + row.nbFrames + '</td><td class="tableData">' + row.nbSystems + '</td><td><a href="Javascript:deleteCompany(' + companyId + ');"><img alt="Delete" src="./img/icons/cross.png"/></a></td></tr>' );
            	
            var companyPictureUrl = row.companyPictureUrl;
            if ((typeof companyPictureUrl != 'undefined') && (companyPictureUrl != null) && (companyPictureUrl != '') && (companyPictureUrl !== '')) {
            	companyPhotoIdMap[companyPictureUrl.substring('/MobileFrameZeroTools/company/'.length, companyPictureUrl.length)] = companyId;
            	
            	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
            		function (fileSystem) {
						fileSystem.root.getDirectory('MobileFrameZeroTools', null, 
							function (mfztDirectory) {
								mfztDirectory.getDirectory('company', null, 
									function onGetCompanyDirectoryLoadCompanyPhoto(companyDirectory) {
										companyImageName = companyPictureUrl.substring('/MobileFrameZeroTools/company/'.length, companyPictureUrl.length);
										companyDirectory.getFile(companyImageName, null, 
											function (fileEntry) {
    											fileEntry.file(function (file){
													var reader = new FileReader();
    												reader.onloadend = function(evt) {
       	 													companyImageData = evt.target.result;
        
    														// Get image handle
	        												var companyPicture = document.getElementById('companyPicture_' + companyPhotoIdMap[file.name]);
    	    												// Show the captured photo
        													// The inline CSS rules are used to resize the image
        													companyPicture.src = "data:image/jpeg;base64," + companyImageData;
   														};
    													reader.readAsBinaryString(file);
													}, 
    												function (error) {
  														alert('Unable to load the following file : companyPictureUrl (' + error.code + ')');
													});
											}, 
											function (error) {
  												alert('Unable to find the following file : companyImageName (' + error.code + ')');
											});
									}, 
									function (error) {
  										alert('Unable to find the following directory : company (' + error.code + ')');
									});
							}, 
							function (error) {
  								alert('Unable to find the following directory : MobileFrameZeroTools (' + error.code + ')');
							});
					}, 
	            	function (error) {
  						alert('Unable to load  : ' + companyPictureUrl + ' (' + error.code + ')');
					});
			} // if
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
