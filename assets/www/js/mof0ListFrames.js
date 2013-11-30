function listFrames() {
	// Wait for PhoneGap to load
	document.addEventListener("deviceready", onDeviceReady, false);

	// PhoneGap is ready
	function onDeviceReady() {
		var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", dbSize);
		db.transaction(populateDB, errorDB, successDB);
	}
	
    // Query the database
    function queryDB(tx) {
        tx.executeSql('SELECT * FROM frame ORDER BY upper(name) asc', [], querySuccess, errorDB);
    }

    // Query the success callback
    function querySuccess(tx, results) {
        var len = results.rows.length;
        
        var framePhotoIdMap = new Object();
        for (var i=0; i<len; i++){
        	var row = results.rows.item(i);
        
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
            
            var frameId = row.id;
            $('#frameTable').append('<tr><td class="tableData text-center">' +
            	'<div><a href="./frameDetail.html?frameId=' + frameId + '">' +
	            '<img alt="Frame picture" class="mf0FrameThumbnail" data-rel="external" id="framePicture_' + frameId + '" src="./img/moF0LittleGuy/MoF0LittleGuy_200_225.png"/>' +
    	        '</a></div>' +
        	    '<div><a class="frameNameLink" href="./frameDetail.html?frameId=' + frameId + '">' + 
            	tooManySystems + ' ' + row.name + ' ' + tooManySystems + '</a><div>' +
            	'</td><td class="tableData">' + tooManySystems + ' ' + nbSystems + '/4 ' + 
            	tooManySystems + '</td><td class="tableData"><div class="systemDiceList">' + dice + '</div></td><td class="tableData"><a href="Javascript:deleteFrame(' + frameId + ');"><img alt="Delete" src="./img/icons/cross.png"/></a></td></tr>' );
            	
            var framePictureUrl = row.frame_picture_url;
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

function deleteFrame(frameId) {
	jQuery.i18n.prop('areYouSureToWantToDeleteThisFrameMessage');
	var deleteAction=confirm(areYouSureToWantToDeleteThisFrameMessage);
	if (deleteAction == true) {
		sqlDeleteCompanyFrame = 'DELETE FROM company_frame WHERE id_frame=?';
		sqlDeleteFrame = 'DELETE FROM frame WHERE id=?';
		var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", dbSize);
		db.transaction(function(tx) {
			tx.executeSql(sqlDeleteCompanyFrame,[frameId]);
			tx.executeSql(sqlDeleteFrame,[frameId]);
		}, errorDB, successDB);
		
		window.location.href = "./listFrames.html";
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
