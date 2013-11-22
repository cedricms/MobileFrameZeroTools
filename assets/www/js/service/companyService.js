function CompanyService(pDb) {
  var self = this;
  self.db = pDb;
   
  self.getById = function(pCompanyId, callback) {
	var companyModel = new CompanyModel();
	companyModel.setId(pCompanyId);
    
    self.db.transaction(function queryCompanyId(tx) {        
        tx.executeSql('SELECT * FROM company WHERE id=?', [pCompanyId], function queryCompanyIdSuccess(tx, companyResults) {
            var len = companyResults.rows.length;
                        
            for (var i=0; i<len; i++){
            	var companyRow = companyResults.rows.item(i);
            	
            	name = companyRow.name;
            	companyModel.setName(name);
            	
            	companyPictureUrl = companyRow.company_picture_url;
            	if ((typeof companyPictureUrl != 'undefined') && (companyPictureUrl != null) && (companyPictureUrl != '') && (companyPictureUrl !== '')) {
            		companyModel.setCompanyPictureUrl(companyPictureUrl);
            	} // if
            	
            	/*
            	if ((typeof companyPictureUrl != 'undefined') && (companyPictureUrl != null) && (companyPictureUrl != '') && (companyPictureUrl !== '')) {
            		loadCompanyPhoto(companyPictureUrl);
            	} // if
            	*/
            	tx.executeSql('SELECT f.id AS frameId, f.name AS frameName, f.frame_picture_url AS framePictureUrl, nb_defensive, nb_movement, nb_surveillance_communication, nb_hand_to_hand, nb_direct_fire, nb_artillery_range, nb_rockets FROM company_frame cf, frame f WHERE cf.id_company=? AND cf.id_frame=f.id ORDER BY f.name', [companyRow.id], function queryFrameForRowSuccess(tx, frameResults) {
            		var len = frameResults.rows.length;
            		            	    
            	    var companyFrames = companyModel.getFrames();
            	    for (var i=0; i<len; i++){
            	    	var frameRow = frameResults.rows.item(i);
            	    	
            	    	var frameModel = new FrameModel();
            	    	frameModel.setId(frameRow.frameId);
            	    	frameModel.setName(frameRow.frameName);
            	    	
            			/*addFrameRow(frameRow, framePhotoIdMap);
            	    
            	    	companyForm = document.getElementById("companyForm");
            	    	
            	    	nbFrame = i + 1;
            	    	nbRockets = companyForm.elements["nbRockets_" + nbFrame];
            	    	nbRockets.value = row.nb_rockets;*/
            	    	
            	    	companyFrames.push(frameModel);
            		} // for
            	}, errorDB);
                
                callback(companyModel);
            } // for
        }, errorDB);
    }, errorDB);
  };
}

//Transaction error callback
function errorDB(tx, err) {
	alert("Error processing SQL: "+err);
}