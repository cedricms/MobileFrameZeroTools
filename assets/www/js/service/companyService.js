function CompanyService(pDb) {
  var self = this;
  self.db = pDb;
   
  self.getById = function(pCompanyId, callback) {
	var companyModel = new CompanyModel();
	companyModel.setId(pCompanyId);
    
    self.db.transaction(function queryCompanyId(tx) {
    	companyQuery = 'SELECT c.id AS companyId, c.name AS companyName, c.company_picture_url AS companyPictureUrl, count(cf.id_frame) AS nbFrames, ifnull(sum(f.nb_defensive + f.nb_movement + f.nb_surveillance_communication + f.nb_hand_to_hand + f.nb_direct_fire + f.nb_artillery_range), 0) AS nbSystems FROM company c LEFT OUTER JOIN company_frame cf ON c.id = cf.id_company LEFT OUTER JOIN frame f ON cf.id_frame = f.id WHERE c.id=? GROUP BY cf.id_company ORDER BY upper(c.name) asc';
    	
        tx.executeSql(companyQuery, [pCompanyId], function queryCompanyIdSuccess(tx, companyResults) {
            var len = companyResults.rows.length;
                        
            for (var i=0; i<len; i++){
            	var companyRow = companyResults.rows.item(i);
            	
            	companyId = companyRow.companyId;
            	companyModel.setId(companyId)
            	
            	companyName = companyRow.companyName;
            	companyModel.name(companyName);
            	
            	nbFrames = companyRow.nbFrames;
            	companyModel.nbFrames(nbFrames);
            	
            	nbSystems = companyRow.nbSystems;
            	companyModel.nbSystems(nbSystems);
            	
            	companyPictureUrl = companyRow.companyPictureUrl;
            	if ((typeof companyPictureUrl != 'undefined') && (companyPictureUrl != null) && (companyPictureUrl != '') && (companyPictureUrl !== '')) {
            		companyModel.setCompanyPictureUrl(companyPictureUrl);
            	} // if
            	
            	/*
            	if ((typeof companyPictureUrl != 'undefined') && (companyPictureUrl != null) && (companyPictureUrl != '') && (companyPictureUrl !== '')) {
            		loadCompanyPhoto(companyPictureUrl);
            	} // if
            	*/
            	tx.executeSql('SELECT f2.id AS frameId, f2.name AS frameName, f2.frame_picture_url AS framePictureUrl, f2.nb_defensive AS nbDefensive, f2.nb_movement AS nbMovement, f2.nb_surveillance_communication AS nbSurveillanceCommunication, f2.nb_hand_to_hand AS nbHandToHand, f2.nb_direct_fire AS nbDirectFire, f2.nb_artillery_range AS nbArtilleryRange, cf2.nb_rockets AS nbRockets FROM company_frame cf2, frame f2 WHERE cf2.id_company=? AND cf2.id_frame=f2.id ORDER BY f2.name', [companyId], function queryFrameForRowSuccess(tx, frameResults) {
            		var len = frameResults.rows.length;
            		            	    
            	    var companyFrames = companyModel.getFrames();
            	    for (var i=0; i<len; i++){
            	    	var frameRow = frameResults.rows.item(i);
            	    	
            	    	var frameModel = new FrameModel(companyModel);
            	    	frameModel.id(frameRow.frameId);
            	    	frameModel.name(frameRow.frameName);
            	    	frameModel.framePictureUrl(frameRow.framePictureUrl);
            	    	frameModel.nbDefensive(frameRow.nbDefensive);
            	    	frameModel.nbMovement(frameRow.nbMovement);
            	    	frameModel.nbSurveillanceCommunication(frameRow.nbSurveillanceCommunication);
            	    	frameModel.nbHandToHand(frameRow.nbHandToHand);
            	    	frameModel.nbDirectFire(frameRow.nbDirectFire);
            	    	frameModel.nbArtilleryRange(frameRow.nbArtilleryRange);
            	    	frameModel.nbRockets(frameRow.nbRockets);
            	    	            	    	
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
	alert("Error processing SQL: " + err.message);
}