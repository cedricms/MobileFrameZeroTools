/************************************************/
/* The Garage view model */
/************************************************/

function GarageViewModel() {
  
  var self = this;
  
  
  /* Squadron methods and values */
  
  self.squadrons = ko.observableArray();
  
  self.squadronFocus = ko.observable();
  
  self.anySquadrons = ko.computed(function() {
    if (self.squadrons().length < 1) {
      return false;
    } else {
      return true;
    }
  }, this);
  
  self.viewSquadronDetails = function(squadron) {
    self.squadronFocus(squadron);
    self.nav('squadronDetails');
  };
  
  self.addSquadron = function() {
    this.squadrons.push(new SquadronModel());
    self.saveSquadrons();
  };
  
  self.delSquadron = function(squadron) {
    if (confirm('Do you really want to delete this squadron?')) {
      self.squadrons.remove(squadron);
      self.nav('squadronList');
    };
  };
  
  
  /* Frame methods and values */
  
  self.frameFocus = ko.observable();
  
  self.anyFrames = ko.computed(function() {
    if (self.squadronFocus()) {
      if (self.squadronFocus().frames().length < 1) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }, this);
  
  self.frameDice = ko.computed(function() {
    if (self.frameFocus()) {
      var mydice = '<span class="whited"></span><span class="whited"></span>';
      var directfire = 0;
      var closerange = 0;
      var artillerypiece = 0;
      for (var sys in self.frameFocus().systems()) {
        var type = self.frameFocus().systems()[sys].type().split(' ')[0];
        if (type === 'defense') {
          mydice += '<span class="blued"></span>';
        } else if (type === 'movement') {
          mydice += '<span class="greend"></span>';
        } else if (type === 'spotting') {
          mydice += '<span class="yellowd"></span>';
        } else if (type === 'direct') {
          directfire++;
        } else if (type === 'artillery') {
          artillerypiece++;
        } else if (type === 'closerange') {
          closerange++;
        };
      };
      if (artillerypiece === 0 && directfire === 0) {
        mydice += '<span class="greend8"></span>';
      };
      if (closerange > 0) {
        mydice += '<p>Close range: <span class="redd"></span><span class="redd"></span>';
        if (closerange === 2) {
          mydice += '<span class="redd8"></span>';
        };
        mydice += '</p>';
      };
      if (directfire > 0) {
        mydice += '<p>Medium range: <span class="redd"></span><span class="redd"></span>';
        if (directfire === 2) {
          mydice += '<span class="redd8"></span>';
        };
        mydice += '</p>';
      };
      if (artillerypiece > 0) {
        mydice += '<p>Long range: <span class="redd"></span><span class="redd"></span>';
        if (artillerypiece === 2) {
          mydice += '<span class="redd8"></span>';
        };
        mydice += '</p>';
      };
      return mydice;
    } else {
      return false;
    }
  }, this);
  
  self.viewFrameDetails = function(frame) {
    self.frameFocus(frame);
    self.nav('frameDetails');
    
    $('.tab-btn').on("click", function() {
      var tabId = $(this).attr('id');
      var contentId = tabId + '-content';
      console.log(tabId);
      $('.tabs .tab-btn').removeClass('active');
      $('.tabs .tab-content').removeClass('active');
      $('#' + tabId).addClass('active');
      $('#' + contentId).addClass('active');
    });
    
  };
  
  self.addFrame = function() {
    var newFrame = new FrameModel();
    newFrame.name('Unknown pilot');
    this.frames.push(newFrame);
    self.saveSquadrons();
  };

  self.delFrame = function(frame) {
    if (confirm('Do you really want to dismiss this pilot?')) {
      self.nav('squadronDetails');
      self.squadronFocus().frames.remove(frame);
    };
  };
  
  self.getFramePicture = function(frame) {
    self.nav('framePhotoBooth');
    console.log('getting ze pic ' + frame.name());
    frame.imgSrc(getCameraPic());
    console.log(frame.imgSrc());
  };
  
  
  /* System methods */
  
  self.anySystems = ko.computed(function() {
    if (self.frameFocus()) {
      if (self.frameFocus().systems().length < 1) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }, this);
  
  self.viewSystemDetails = function(system) {
    self.frameFocus().systemFocus(system);
    self.nav('systemDetails');
    self.showSystemDesc();
  };
  
  self.addSystem = function(systype) {
    self.frameFocus().systems.push(new SystemModel(systype));
    self.nav('frameDetails');
  };
  
  self.delSystem = function(system) {
    if (confirm('Do you really want to remove this system?')) {
      self.frameFocus().systems.remove(system);
      self.nav('frameDetails');
    };
  };
  
  
  /* Rules and description methods and values */
  
  self.specRules = ko.computed(function() {
    if (self.frameFocus()) {
      var myspecrules = '<ul>';
      var spotlevel = 0;
      var defenselevel = 0;
      for (var sys in self.frameFocus().systems()) {
        var type = self.frameFocus().systems()[sys].type().split(' ')[0];
        if (type === 'spotting' && spotlevel > 0) {
          myspecrules += '<li>' + rules[type].specRuleLevel2[1] + '</li>';  
        } else if (type === 'defense' && defenselevel > 0) {
          myspecrules += '<li>' + rules[type].specRuleLevel2[1] + '</li>';
        } else {
          if (rules[type].specRuleLevel1[1]) {
            myspecrules += '<li>' + rules[type].specRuleLevel1[1] + '</li>';
          };
          if (type === 'spotting') {
            spotlevel++;
          } else if (type === 'defense') {
            defenselevel++;
          };
        };
      };
      myspecrules += '</ul>'
      if (myspecrules.length > 10) {
        myspecrules = '<h2 style="margin-bottom: 1em;">This pilot can:</h2>' + myspecrules;
      } else {
        myspecrules = '<p>No special rules apply.</p>';
      };
      return myspecrules;
    } else {
      return false;
    }
  }, this);
  
  self.showSystemDesc = function() {
    var currentSys = self.frameFocus().systemFocus().type().split(' ');
    $('#systemDetails .systemdescription').html('').append(rules[currentSys[0]].desc + '<h2>1 system:</h2>' + rules[currentSys[0]].specRuleLevel1 + ' <h2>2 systems:</h2>' + rules[currentSys[0]].specRuleLevel2);
  };
  
  
  /* Loading / saving methods */
  
  self.saveSquadrons = function() {
    var storeobj = ko.toJSON(self.squadrons());
    localStorage.setItem('MFZgame', storeobj);
    console.log('Squadrons were saved');
  };
  
  self.loadSquadrons = function() {
    if (localStorage.getItem('MFZgame')) {
      var retrieveobj = JSON.parse(localStorage.getItem('MFZgame'));
      for (var squadron in retrieveobj) {
        var loadedSquadron = new SquadronModel();
        loadedSquadron.name(retrieveobj[squadron].name);
        self.squadrons.push(loadedSquadron);
        for (var frame in retrieveobj[squadron].frames) {
          var loadedFrame = new FrameModel();
          loadedFrame.name(retrieveobj[squadron].frames[frame].name);
          self.squadrons()[squadron].frames.push(loadedFrame);
          for (var system in retrieveobj[squadron].frames[frame].systems) {
            var loadedSystem = new SystemModel(retrieveobj[squadron].frames[frame].systems[system].type);
            self.squadrons()[squadron].frames()[frame].systems.push(loadedSystem);
          };
        };
      };
      console.log('Squadrons were loaded');
    } else {
      console.log('No data was loaded');
    };
  };
  
  
  /* Navigation methods */
  
  self.nav = function(pageId) {
    $('.page').slideUp();
    $('#' + pageId).slideDown();
    self.saveSquadrons();
  };
  
  
};


/************************************************/
/* The Squadron model */
/************************************************/

function SquadronModel() {
  
  this.name = ko.observable('Unknown Team');
  
  this.frames = ko.observableArray();
  
};


/************************************************/
/* The Frame model */
/************************************************/

function FrameModel() {
  
  this.name = ko.observable();
  
  this.systems = ko.observableArray();
  
  this.systemFocus = ko.observable();
  
  this.imgSrc = ko.observable();
  
  this.enoughSystems = ko.computed(function() {
    if (this.systems().length < 4) {
      return true;
    } else {
      return false;
    }
  }, this);

};


/************************************************/
/* The System model */
/************************************************/

function SystemModel(system) {
  
  this.type = ko.observable(system);
  
};



/************************************************/
/* Rules Library module */
/************************************************/

function RulesLib() {
  
  this.direct = {
    desc: 'Assault rifles, grenade launchers, flamethrowers, beam weapons. Enables you to attack at medium range.',
    specRuleLevel1: ['Add <span class="redd">Red 2d6</span><span class="redd"></span> at <strong>medium</strong> range'],
    specRuleLevel2: ['Add another <span class="redd8">Red 1d8</span> at <strong>medium</strong> range']
  };
  
  this.closerange = {
    desc: 'Shock batons, combat knifes, repurposed jackhammers. Gives you an edge when attacking at close range.',
    specRuleLevel1: ['Add <span class="redd">Red 2d6</span><span class="redd"></span> at <strong>close</strong> range'],
    specRuleLevel2: ['Add another <span class="redd8">Red 1d8</span> at <strong>close</strong> range']
  };
  
  this.artillery = {
    desc: 'Mortar, sniper rifles, railguns, cannons. Enables you to attack at long range.',
    specRuleLevel1: ['Add <span class="redd">Red 2d6</span><span class="redd"></span> at <strong>long</strong> range'],
    specRuleLevel2: ['Add another <span class="redd8">Red 1d8</span> at <strong>long</strong> range']
  };
  
  this.defense = {
    desc: 'Armor, a shield, camouflage, stealth composite surfacing, ECM. Gives you protection from incoming attacks.',
    specRuleLevel1: ['Add <span class="blued">Blue 1d6</span>'],
    specRuleLevel2: ['Add another <span class="blued">Blue 1d6</span>', ' <span style="color: #6fabd6;">act as cover for other mobile frames</span>']
  };
  
  this.movement = {
    desc: 'Jumpjets, wings, wheels. Enables you to move faster.',
    specRuleLevel1: ['Add <span class="greend">Green 1d6</span>', ' <span style="color: #9cd66f;">move through cover</span>'],
    specRuleLevel2: ['Add another <span class="greend">Green 1d6</span>']
  };
  
  this.spotting = {
    desc: 'Radio, targeting laser, spotlights, rifle scope. Enables you to spot enemies for your team mates to hit.',
    specRuleLevel1: ['Add <span class="yellowd">Yellow 1d6</span>', ' <span style="color: #d6c244;">spot mobile frames in cover</span>'],
    specRuleLevel2: ['Add another <span class="yellowd">Yellow 1d6</span>', ' <span style="color: #d6c244;">spot mobile frames everywhere</span>']
  };
  
};


/************************************************/
/* Init Garage App */
/************************************************/

var garage = new GarageViewModel();
var rules = new RulesLib();
garage.loadSquadrons();
ko.applyBindings(garage);
