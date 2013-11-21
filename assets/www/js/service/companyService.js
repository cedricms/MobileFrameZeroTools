function CompanyService() {
  var self = this;
   
  self.getById = function(pCompanyId) {
    var companyModel = new CompanyModel();
    companyModel.setId(pCompanyId);
    
    return companyModel;
  };
}