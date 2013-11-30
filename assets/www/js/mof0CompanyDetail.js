var pictureSource;   // picture source
var destinationType; // sets the format of returned value

var companyImageUrl;
var companyImageData;

//Wait for device API libraries to load
//
document.addEventListener("deviceready",onDeviceReadyPhoto,false);

function onDeviceReadyPhoto() {
  pictureSource=navigator.camera.PictureSourceType;
  destinationType=navigator.camera.DestinationType;
}

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
			var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", dbSize);
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

function loadCompany(urlCompanyId) {
	companyForm = document.getElementById("companyForm");
	
	companyId = companyForm.elements["companyId"];
	
	if (urlCompanyId === undefined) {
		// Do nothing
	}
	else {
		companyId.value = urlCompanyId;
		var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", dbSize);
		db.transaction(queryCompanyId, errorDB);
	} // if
}

// Query the database
function queryCompanyId(tx) {
	companyForm = document.getElementById("companyForm");
    companyId = companyForm.elements["companyId"];
    
    tx.executeSql('SELECT * FROM company WHERE id=?', [companyId.value], queryCompanyIdSuccess, errorDB);
}

// Query the success callback
function queryCompanyIdSuccess(tx, results) {
    var len = results.rows.length;
    
    companyForm = document.getElementById("companyForm");
    
    for (var i=0; i<len; i++){
    	var row = results.rows.item(i);
    	
    	companyName = companyForm.elements["companyName"];
    	companyName.value = row.name;
    	
    	companyPictureUrl = row.company_picture_url;
    	if ((typeof companyPictureUrl != 'undefined') && (companyPictureUrl != null) && (companyPictureUrl != '') && (companyPictureUrl !== '')) {
    		loadCompanyPhoto(companyPictureUrl);
    	} // if
    	
    	tx.executeSql('SELECT f.id AS frameId, f.name AS frameName, f.frame_picture_url AS framePictureUrl, nb_defensive, nb_movement, nb_surveillance_communication, nb_hand_to_hand, nb_direct_fire, nb_artillery_range, nb_rockets FROM company_frame cf, frame f WHERE cf.id_company=? AND cf.id_frame=f.id ORDER BY f.name', [row.id], queryFrameForRowSuccess, errorDB);
    	
    	break;
    } // for
}

function queryFrameForRowSuccess(tx, results) {
	var len = results.rows.length;
    
    var framePhotoIdMap = new Object();
    for (var i=0; i<len; i++){
    	var row = results.rows.item(i);
		addFrameRow(row, framePhotoIdMap);
    
    	companyForm = document.getElementById("companyForm");
    	
    	nbFrame = i + 1;
    	nbRockets = companyForm.elements["nbRockets_" + nbFrame];
    	nbRockets.value = row.nb_rockets;
	} // for
}

function createCompany() {
	var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", dbSize);
	db.transaction(function(tx) {
						queryCreateCompany(tx);
					}, errorDB, successDB);
}

function queryCreateCompany(tx) {
	companyForm = document.getElementById("companyForm");

	companyName = companyForm.elements["companyName"].value;
	
    companyPictureURL = companyForm.elements['companyPictureURL'].value;
	
	tx.executeSql('INSERT INTO company (name, company_picture_url, dt_created) VALUES ("' + companyName + '", "' + companyPictureURL + '", datetime("now"))');
	
	// Shitty hack to go around the dreaded SQLite error 23 bug
	nbFrames = parseInt(companyForm.elements["nbFrames"].value);
	
	if (nbFrames > 0) {
		sqlInsertCompanyFrame = 'INSERT INTO company_frame (id_company, id_frame, nb_rockets, dt_created) ';
		
		iFrame = 1;
		while (iFrame <= nbFrames) {
			companyForm = document.getElementById("companyForm");
			frameId = companyForm.elements["frameId_" + iFrame];
			deleted = false;
			if ((typeof frameId === "undefined") || (frameId == '') || (frameId === '')) {
				// Probably a deleted frame
				deleted = true;
			}
			else {
				if (!isNaN(frameId.value)) {
        			frameIdInt = parseInt(frameId.value);
        		
	       			nbRockets = companyForm.elements["nbRockets_" + iFrame];
    	   			nbRocketsInt = 0;
        			if (!isNaN(nbRockets.value)) {
        				nbRocketsInt = parseInt(nbRockets.value);
        			} // if
	       		} // if
			} // if
		
			if (!deleted) {
				if (iFrame > 1) {
					sqlInsertCompanyFrame = sqlInsertCompanyFrame + ' UNION ALL ';
				} // if
			
				sqlInsertCompanyFrame = sqlInsertCompanyFrame + 'SELECT (SELECT MAX(c.id) FROM company c), ' + frameIdInt + ', ' + nbRocketsInt + ', datetime("now")';
			} // if
					
			iFrame++;
		} // while
		
		sqlInsertCompanyFrame = sqlInsertCompanyFrame + ';';
		
		//console.log('sqlInsertCompanyFrame : ' + sqlInsertCompanyFrame);
		
		tx.executeSql(sqlInsertCompanyFrame);
	} // if	
}

function successDB() {
		
}

function modifyCompany() {
	var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", dbSize);
	db.transaction(queryModifyCompany, errorDB);
}

function queryModifyCompany(tx) {
	companyForm = document.getElementById("companyForm");

	companyId = companyForm.elements["companyId"].value;
	
	companyName = companyForm.elements["companyName"].value;

    companyPictureURL = companyForm.elements['companyPictureURL'].value;
	
	updateQuery = 'UPDATE company SET name="' + companyName + '"' +
			', company_picture_url="' + companyPictureURL + '"' +
			' WHERE id=' + companyId;
	
	tx.executeSql(updateQuery);
	
	//console.log('update name : ' + companyName + ' for id : ' + companyId);
	
	deleteQuery = 'DELETE FROM company_frame WHERE id_company = ' + companyId;
	
	tx.executeSql(deleteQuery);
	
	//console.log('deleteQuery : ' + deleteQuery);
	
	// Shitty hack to go around the dreaded SQLite error 23 bug
	nbFrames = parseInt(companyForm.elements["nbFrames"].value);
	
	if (nbFrames > 0) {
		sqlInsertCompanyFrame = 'INSERT INTO company_frame (id_company, id_frame, nb_rockets, dt_created) ';
		
		iFrame = 1;
		while (iFrame <= nbFrames) {
			companyForm = document.getElementById("companyForm");
			frameId = companyForm.elements["frameId_" + iFrame];
			deleted = false;
			if ((typeof frameId === "undefined") || (frameId == '') || (frameId === '')) {
				// Probably a deleted frame
				deleted = true;
			}
			else {
				if (!isNaN(frameId.value)) {
        			frameIdInt = parseInt(frameId.value);
        		
	       			nbRockets = companyForm.elements["nbRockets_" + iFrame];
    	   			nbRocketsInt = 0;
        			if (!isNaN(nbRockets.value)) {
        				nbRocketsInt = parseInt(nbRockets.value);
        			} // if
	       		} // if
			} // if
		
		    if (!deleted) {
			    if (iFrame > 1) {
				    sqlInsertCompanyFrame = sqlInsertCompanyFrame + ' UNION ALL ';
			    } // if
			
			    sqlInsertCompanyFrame = sqlInsertCompanyFrame + 'SELECT ' + companyId + ', ' + frameIdInt + ', ' + nbRocketsInt + ', datetime("now")';
			} // if
			
			iFrame++;
		} // while
		
		sqlInsertCompanyFrame = sqlInsertCompanyFrame + ';';
		
		tx.executeSql(sqlInsertCompanyFrame);
	} // if
}

function populateFrameSelect() {
	var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", dbSize);
	db.transaction(queryPopulateFrameSelect, errorDB);
}

function queryPopulateFrameSelect(tx) {
    tx.executeSql('SELECT * FROM frame WHERE nb_defensive + nb_movement + nb_surveillance_communication + nb_hand_to_hand + nb_direct_fire + nb_artillery_range <= 4 ORDER BY upper(name) asc', [], queryPopulateFrameSelectSuccess, errorDB);
}

function queryPopulateFrameSelectSuccess(tx, results) {
	frameSelectMarkUp = '<select name="frameToAdd" onchange="showFrameInfoOnSelect()">';
	frameSelectMarkUp = frameSelectMarkUp + '<option value=""></option>';
	
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
	var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", dbSize);
	db.transaction(queryAddFrameToCompany, errorDB);
}

function queryAddFrameToCompany(tx) {	
	companyForm = document.getElementById("companyForm");

	frameToAdd = companyForm.elements["frameToAdd"];
	
	frameToAddId = getSelectedOptionIntValue(frameToAdd);
	
    tx.executeSql('SELECT f.id AS frameId, f.name AS frameName, f.frame_picture_url AS framePictureUrl, nb_defensive, nb_movement, nb_surveillance_communication, nb_hand_to_hand, nb_direct_fire, nb_artillery_range FROM frame f WHERE f.id=?', [frameToAddId], queryAddFrameToCompanySuccess, errorDB);
}

function queryAddFrameToCompanySuccess(tx, results) {
    var len = results.rows.length;
       
    var framePhotoIdMap = new Object();
    for (var i=0; i<len; i++){
      	var row = results.rows.item(i);
        
        addFrameRow(row, framePhotoIdMap);
    	
    	break;
   	} // for
}

function addFrameRow(row, framePhotoIdMap) {
	frameToAddMarkUp = '';
    	var nbDefensive = row.nb_defensive;
        var defensiveDice = '';
        if (nbDefensive > 0) {
            defensiveDice = defensiveDice + '<img alt="Defensive" src="./img/dice/Defense.png"/>';
        } // if
        if (nbDefensive > 1) {
            defensiveDice = defensiveDice + '<img alt="Defensive" src="./img/dice/Defense.png"/>';
        } // if
            
        var nbMovement = row.nb_movement;
        var mouvementDice = '';
        if (nbMovement > 0) {
            mouvementDice = mouvementDice + '<img alt="Movement" src="./img/dice/Move.png"/>';
        } // if
        if (nbMovement > 1) {
            mouvementDice = mouvementDice + '<img alt="Movement" src="./img/dice/Move.png"/>';
        } // if
            
        var nbSurveillanceCommunication = row.nb_surveillance_communication;
        var surveillanceCommunicationDice = '';
        if (nbSurveillanceCommunication > 0) {
            surveillanceCommunicationDice = surveillanceCommunicationDice + '<img alt="Surveillance/communication" src="./img/dice/Spotting.png">';
        } // if
        if (nbSurveillanceCommunication > 1) {
            surveillanceCommunicationDice = surveillanceCommunicationDice + '<img alt="Surveillance/communication" src="./img/dice/Spotting.png">';
        } // if
            
        var nbHandToHand = row.nb_hand_to_hand;
        var handToHandDice = '';
        if (nbHandToHand > 0) {
            handToHandDice = handToHandDice + 
                             '<img alt="Hand-to-hand weapon" src="./img/dice/HtH.png">' +
                             '<img alt="Hand-to-hand weapon" src="./img/dice/HtH.png">';
        } // if
        if (nbHandToHand > 1) {
            handToHandDice = handToHandDice + '<img alt="Hand-to-hand weapon" src="./img/dice/HtH D8.png">';
        } // if
            
        var nbDirectFire = row.nb_direct_fire;
        var directFireDice = '';
        if (nbDirectFire > 0) {
            directFireDice = directFireDice + 
                             '<img alt="Direct fire weapon" src="./img/dice/Direct.png">' +
                             '<img alt="Direct fire weapon" src="./img/dice/Direct.png">';
        } // if
        if (nbDirectFire > 1) {
            directFireDice = directFireDice + '<img alt="Direct fire weapon" src="./img/dice/Direct D8.png">';
        } // if
            
        var nbArtilleryRange = row.nb_artillery_range;
        var artilleryRangeDice = '';
        if (nbArtilleryRange > 0) {
            artilleryRangeDice = artilleryRangeDice + 
                             '<img alt="Artillery range weapon" src="./img/dice/Artillery.png">' +
                             '<img alt="Artillery range weapon" src="./img/dice/Artillery.png">';
        } // if
        if (nbArtilleryRange > 1) {
           artilleryRangeDice = artilleryRangeDice + '<img alt="Artillery range weapon" src="./img/dice/Artillery D8.png">';
        } // if
          
        if (nbDirectFire + nbArtilleryRange === 0) {
            mouvementDice = mouvementDice + '<img alt="Movement" src="./img/dice/Move D8.png"/>';
        } // if
            
        var dice = '<img alt="Wild" src="./img/dice/White Die.png">' + 
                   '<img alt="Wild" src="./img/dice/White Die.png">' + 
                   defensiveDice + 
                   mouvementDice + 
                   surveillanceCommunicationDice + 
                   handToHandDice + 
                   directFireDice + 
                   artilleryRangeDice;
         
        var tooManySystems = '';
        var nbSystems = nbDefensive + nbMovement + nbSurveillanceCommunication + nbHandToHand + nbDirectFire + nbArtilleryRange;
        if (nbSystems > 4) {
            tooManySystems = '<img alt="Error" src="./img/icons/error.png"/>';
        } // if
        
        companyForm = document.getElementById("companyForm");

	    nbFrames = parseInt(companyForm.elements["nbFrames"].value);
	    nbFrames++;
	    companyForm.elements["nbFrames"].value = nbFrames;
           
    var frameId = row.frameId;
    frameToAddMarkUp = '<tr id="frame_' + nbFrames + '"><input name="frameId_' + nbFrames + '" type="hidden" value="' + row.frameId + '"/>' +
    	'<td class="tableData">' +
        '<div><a href="./frameDetail.html?frameId=' + frameId + '">' +
	    '<img alt="Frame picture" class="mf0FrameThumbnail" data-rel="external" id="framePicture_' + frameId + '" src="./img/moF0LittleGuy/MoF0LittleGuy_200_225.png"/>' +
    	'</a></div>' +
    	'<div><a class="frameNameLink" href="./frameDetail.html?frameId=' + frameId + '">' + 
      	tooManySystems + ' ' + row.frameName + ' ' + tooManySystems + '</a></div></td><td class="tableData">' + tooManySystems + ' ' + nbSystems + '/4 ' + 
       	tooManySystems + 
       	'</td><td class="tableData"><div class="systemDiceList">' + dice + '</div></td>' +
       	'<td class="tableData"><input class="mf0SmallNumericInput" name="nbRockets_' + nbFrames + '" type="text" value="0"/></td>' +
       	'<td class="tableData"><a href="Javascript:removeFrame(' + nbFrames + ');"><img alt="Delete" src="./img/icons/cross.png"/></a></td></tr>';

	$('#frameTable').append(frameToAddMarkUp);

            var framePictureUrl = row.framePictureUrl;
            if ((typeof framePictureUrl != 'undefined') && (framePictureUrl != null) && (framePictureUrl != '') && (framePictureUrl !== '')) {
            	framePhotoIdMap[framePictureUrl.substring('/MobileFrameZeroTools/frame/'.length, framePictureUrl.length)] = frameId;
            	
            	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
            		function (fileSystem) {
						fileSystem.root.getDirectory('MobileFrameZeroTools', null, 
							function (mfztDirectory) {
								mfztDirectory.getDirectory('frame', null, 
									function onGetFrameDirectoryLoadFramePhoto(frameDirectory) {
										frameImageName = framePictureUrl.substring('/MobileFrameZeroTools/frame/'.length, framePictureUrl.length);
										frameDirectory.getFile(frameImageName, null, 
											function (fileEntry) {
    											fileEntry.file(function (file){
													var reader = new FileReader();
    												reader.onloadend = function(evt) {
       	 													frameImageData = evt.target.result;
        
    														// Get image handle
	        												var framePicture = document.getElementById('framePicture_' + framePhotoIdMap[file.name]);
    	    												// Show the captured photo
        													// The inline CSS rules are used to resize the image
        													framePicture.src = "data:image/jpeg;base64," + frameImageData;
   														};
    													reader.readAsBinaryString(file);
													}, 
    												function (error) {
  														alert('Unable to load the following file : framePictureUrl (' + error.code + ')');
													});
											}, 
											function (error) {
  												alert('Unable to find the following file : frameImageName (' + error.code + ')');
											});
									}, 
									function (error) {
  										alert('Unable to find the following directory : frame (' + error.code + ')');
									});
							}, 
							function (error) {
  								alert('Unable to find the following directory : MobileFrameZeroTools (' + error.code + ')');
							});
					}, 
	            	function (error) {
  						alert('Unable to load  : ' + framePictureUrl + ' (' + error.code + ')');
					});
			} // if
}

function removeFrame(frameNumber) {
  companyForm = document.getElementById("companyForm");
  frameId = companyForm.elements["frameId_" + frameNumber];
  frameId.value = '';
  
  $('#frame_' + frameNumber).remove();
}

function getSelectedOptionIntValue(selectComponent) {
	result = 0;
	
	optionValue = selectComponent.options[selectComponent.selectedIndex].value;
	
	if (!isNaN(optionValue)) {
        result = parseInt(optionValue);
    } // if
  
	return result;
}

function showFrameInfoOnSelect() {
	var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", dbSize);
	db.transaction(queryShowFrameInfoOnSelect, errorDB);
}

function queryShowFrameInfoOnSelect(tx) {	
	companyForm = document.getElementById("companyForm");

	frameToAdd = companyForm.elements["frameToAdd"];
	
	frameToAddId = getSelectedOptionIntValue(frameToAdd);
	
    tx.executeSql('SELECT * FROM frame WHERE id=?', [frameToAddId], queryShowFrameInfoOnSelectSuccess, errorDB);
}

function queryShowFrameInfoOnSelectSuccess(tx, results) {
	frameSelectMarkUp = '<div class="frameInformationZone">';
	
    var len = results.rows.length;
        
    for (var i=0; i<len; i++){
      	var row = results.rows.item(i);
            
    	frameSelectMarkUp = frameSelectMarkUp + row.name;
    	
    	break;
   	} // for
   	
   	frameSelectMarkUp = frameSelectMarkUp + '</div>';
	
	//$('#selectedFrameInformation').text(frameSelectMarkUp);
	
	//$('#selectedFrameInformation').val($("<div/>").html(frameSelectMarkUp).text());
}

function captureCompanyPhoto() {
  navigator.camera.getPicture(onPhotoSuccess, onPhotoFail, { quality: 90, allowEdit: true, destinationType: destinationType.DATA_URL });
}

//A button will call this function
function getPhoto(source) {
  // Retrieve image file location from specified source
  navigator.camera.getPicture(onPhotoSuccess, onPhotoFail, { quality: 90, destinationType: destinationType.DATA_URL , sourceType: source });
}

function onPhotoSuccess(imageData) {
  if ((typeof imageData != 'undefined') && (imageData != null) && (imageData != '') && (imageData !== '')) {
	companyImageData = imageData;
	
    // Get image handle
    var companyPicture = document.getElementById('companyPicture');

    // Show the captured photo
    // The inline CSS rules are used to resize the image
    companyPicture.src = "data:image/jpeg;base64," + companyImageData;
    
	// Init file system
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, onFileSystemFail);
  } // if
}

//Called if something bad happens.
function onPhotoFail(message) {
  alert('Failed because: ' + message);
}

function onFileSystemSuccess(fileSystem) {
	fileSystem.root.getDirectory('MobileFrameZeroTools', {create: true}, onGetMfztDirectory, onGetMfztDirectoryFail);
}

function onGetMfztDirectory(mfztDirectory) {
	mfztDirectory.getDirectory('company', {create: true}, onGetCompanyDirectory, onGetCompanyDirectoryFail);
}

function onGetCompanyDirectory(companyDirectory) {
	currentDate = new Date();
	fileName = 'company_' +
			   currentDate.getFullYear() + '_' + 
			   currentDate.getMonth() + '_' + 
			   currentDate.getUTCDate() + '_' + 
			   currentDate.getUTCHours() + '_' + 
			   currentDate.getUTCMinutes() + '_' + 
			   currentDate.getUTCSeconds() + '_' + 
			   currentDate.getUTCMilliseconds() + '.base64jpg';
	companyDirectory.getFile(fileName, {create: true}, createCompanyImageEntry, createCompanyImageEntryFail);

	companyForm = document.getElementById('companyForm');
	companyPictureURL = companyForm.elements['companyPictureURL'];
	companyPictureURL.value = '/MobileFrameZeroTools/company/' + fileName;
}

function createCompanyImageEntry(imageFileEntry) {
	imageFileEntry.createWriter(writeFrameImage, onFileSystemFail);
}

function writeFrameImage(writer) {
	writer.onwrite = function(evt) {
        // Nothing else to do
    };
    
    writer.write(companyImageData);
}

function onGetMfztDirectoryFail(error) {
    alert('onGetMfztDirectoryFail : ' + error.code);
}

function onGetCompanyDirectoryFail(error) {
    alert('onGetCompanyDirectoryFail : ' + error.code);
}

function createCompanyImageEntryFail(error) {
    alert('createCompanyImageEntryFail : ' + error.code);
}

function onFileSystemFail(error) {
    alert('onFileSystemFail : ' + error.code);
}

function loadCompanyPhoto(companyPictureUrl) {
	companyImageUrl = companyPictureUrl;
	
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, getFileSystemLoadCompanyPhoto, getFileSystemLoadCompanyPhotoFail);
}

function getFileSystemLoadCompanyPhoto(fileSystem) {
	fileSystem.root.getDirectory('MobileFrameZeroTools', null, onGetMfztDirectoryLoadCompanyPhoto, onGetMfztDirectoryLoadCompanyPhotoFail);
}

function onGetMfztDirectoryLoadCompanyPhoto(mfztDirectory) {
	mfztDirectory.getDirectory('company', null, onGetCompanyDirectoryLoadCompanyPhoto, onGetCompanyDirectoryLoadCompanyPhotoFail);
}

function onGetCompanyDirectoryLoadCompanyPhoto(companyDirectory) {
	companyImageName = companyImageUrl.substring('/MobileFrameZeroTools/company/'.length, companyImageUrl.length);
	companyDirectory.getFile(companyImageName, null, getFileEntryLoadCompanyPhoto, getFileEntryLoadCompanyPhotoFail);
}

function onGetCompanyDirectoryLoadCompanyPhotoFail(error) {
    alert('onGetCompanyDirectoryLoadCompanyPhotoFail : ' + error.code);
}

function onGetMfztDirectoryLoadCompanyPhotoFail(error) {
    alert('onGetMfztDirectoryLoadCompanyPhotoFail : ' + error.code);
}

function getFileEntryLoadCompanyPhoto(fileEntry) {
    fileEntry.file(getFileLoadCompanyPhoto, getFileLoadCompanyPhotoFail);
}

function getFileLoadCompanyPhoto(file){
	var reader = new FileReader();
    reader.onloadend = function(evt) {
        companyImageData = evt.target.result;
        
    	// Get image handle
        var companyPicture = document.getElementById('companyPicture');
        // Show the captured photo
        // The inline CSS rules are used to resize the image
        companyPicture.src = "data:image/jpeg;base64," + companyImageData;
    };
    reader.readAsBinaryString(file);
}

function getFileLoadCompanyPhotoFail(error) {
    alert('getFileLoadCompanyPhotoFail : ' + error.code);
}

function getFileEntryLoadCompanyPhotoFail(error) {
    alert('getFileEntryLoadCompanyPhotoFail : ' + error.code);
}

function getFileSystemLoadCompanyPhotoFail(error) {
    alert('getFileSystemLoadCompanyPhotoFail : ' + error.code);
}