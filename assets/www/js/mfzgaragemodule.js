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
  
  /* Calculate init */
  
  self.calcInit = function() {
    // Compare number of frames and systems on teams, then recalculate asset value
    console.log('******* Comparing team asset values *******');
    var teamstatus = [];
    var hasmostframes = [];
    var hasleastframes = [];
    var hasmostsystems = [];
    var hasleastsystems = [];
    for (var t in self.squadrons()) {
      var frames = self.squadrons()[t].frames().length;
      var systems = 0;
      for (var f in self.squadrons()[t].frames()) {
        systems = systems + self.squadrons()[t].frames()[f].systems().length;
      };
      teamstatus.push({team: self.squadrons()[t], frames: frames, systems: systems});
    };
    for (var t in teamstatus) { 
      // See which teams have the most and least frames
      if (hasmostframes[0] == undefined) {
        hasmostframes.push({team: teamstatus[t].team, frames: teamstatus[t].frames});
      } else if (hasmostframes[0].frames > teamstatus[t].frames) {
        hasleastframes.push({team: teamstatus[t].team, frames: teamstatus[t].frames});
      } else if (hasmostframes[0].frames < teamstatus[t].frames) {
        if (hasleastframes[0] == undefined || hasleastframes[0].frames >= hasmostframes[0].frames) {
          for (var f in hasmostframes) {
            hasleastframes.push(hasmostframes[f]);  
          };
        };
        if (hasleastframes[0].frames > hasmostframes[0].frames) {
          hasleastframes = [];
        };
        hasmostframes = [];
        hasmostframes.push({team: teamstatus[t].team, frames: teamstatus[t].frames});
      } else if (hasmostframes[0].frames === teamstatus[t].frames) {
        hasmostframes.push({team: teamstatus[t].team, frames: teamstatus[t].frames});
      } else {
        hasleastframes.push({team: teamstatus[t].team, frames: teamstatus[t].frames});
      };
      // See which teams have the most and least systems
      if (hasmostsystems[0] == undefined) {
        hasmostsystems.push({team: teamstatus[t].team, systems: teamstatus[t].systems});
      } else if (hasmostsystems[0].systems > teamstatus[t].systems) {
        hasleastsystems.push({team: teamstatus[t].team, systems: teamstatus[t].systems});
      } else if (hasmostsystems[0].systems < teamstatus[t].systems) {
        if (hasleastsystems[0] == undefined || hasleastsystems[0].systems >= hasmostsystems[0].systems) {
          for (var f in hasmostsystems) {
            hasleastsystems.push(hasmostsystems[f]);  
          };
        };
        if (hasleastsystems[0].systems > hasmostsystems[0].systems) {
          hasleastsystems = [];
        };
        hasmostsystems = [];
        hasmostsystems.push({team: teamstatus[t].team, systems: teamstatus[t].systems});
      } else if (hasmostsystems[0].systems === teamstatus[t].systems) {
        hasmostsystems.push({team: teamstatus[t].team, systems: teamstatus[t].systems});
      } else {
        hasleastsystems.push({team: teamstatus[t].team, systems: teamstatus[t].systems});
      };
    };
    // Adjust asset values of teams accordingly
    for (var t in hasmostframes) {
      var val = hasmostframes[t].team.assetValue();
      val--;
      hasmostframes[t].team.assetValue(val);
    };
    for (var t in hasleastframes) {
      var val = hasleastframes[t].team.assetValue();
      val++;
      hasleastframes[t].team.assetValue(val);
    };
    for (var t in hasmostsystems) {
      var val = hasmostsystems[t].team.assetValue();
      val--;
      hasmostsystems[t].team.assetValue(val);
    };
    for (var t in hasleastsystems) {
      var val = hasleastsystems[t].team.assetValue();
      val++;
      hasleastsystems[t].team.assetValue(val);
    };
    console.log('Asset values:');
    for (var t in self.squadrons()) {
      console.log(self.squadrons()[t].name() + ' (' + self.squadrons()[t].assetValue() + ') ');
    };
    console.log('******* End of asset value adjustment *******');
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
      var mydice = '';
      var directfire = 0;
      var closerange = 0;
      var artillerypiece = 0;
      for (var sys in self.frameFocus().systems()) {
        var type = self.frameFocus().systems()[sys].type().split(' ')[0];
        if (type === 'hull') {
          mydice += '<span class="whited"></span>';
        } else if (type === 'defense') {
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
  };
  
  self.viewFrameDetailsPlay = function(squadron, frame) {
    self.squadronFocus(squadron);
    self.frameFocus(frame);
    self.nav('frameDetails');
  };
  
  self.addFrame = function() {
    var newFrame = new FrameModel();
    newFrame.name('Unknown pilot');
    newFrame.systems.push(new SystemModel('hull'));
    newFrame.systems.push(new SystemModel('hull'));
    newFrame.systems.push(new SystemModel('direct'));
    newFrame.systems.push(new SystemModel('closerange'));
    newFrame.systems.push(new SystemModel('spotting'));
    newFrame.systems.push(new SystemModel('defense'));
    this.frames.push(newFrame);
    self.saveSquadrons();
  };

  self.delFrame = function(frame) {
    if (confirm('Do you really want to dismiss this pilot?')) {
      self.nav('squadronDetails');
      self.squadronFocus().frames.remove(frame);
    };
  };
  
  self.killFrame = function(frame) {
    if (confirm('Boom?')) {
      self.nav('squadronOverview');
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
    $('.page').hide();
    $('#' + pageId).show();
    self.saveSquadrons();
  };
  
  
  /* Gameplay methods */
  
  self.rounds = ko.observable(11);
  
  // Count down to doomsday, check for game over
  self.countDown = function() {
    var bestTeam = [];
    var rounds = self.rounds();
    rounds--;
    for (var s in self.squadrons()) {
      var answer = confirm(self.squadrons()[s].name() + ': Count down to doomsday?');
      if (answer == true) {
        rounds--;
      };
      if (bestTeam[0] == undefined) {
        bestTeam.push(self.squadrons()[s]);
      } else {
        if (self.squadrons()[s].initiative() >= bestTeam[0].initiative()) {
          console.log(self.squadrons()[s].initiative());
          bestTeam.unshift(self.squadrons()[s]);
        }
      }
    };
    self.rounds(rounds);
    if (self.rounds() <= 0) {
      if (bestTeam.length === 1) {
        alert(bestTeam[0].name() + ' WINS');
      } else {
        alert('It is a tie');
      };
    };
    for (var s in self.squadrons()) {
      for (var f in self.squadrons()[s].frames()) {
        self.squadrons()[s].frames()[f].hadTurn(false);
      };  
    };
    
  };
  
};


/************************************************/
/* The Squadron model */
/************************************************/

function SquadronModel() {
  
  this.name = ko.observable('Unknown Team');
  
  this.frames = ko.observableArray();
  
  this.assetValue = ko.observable(5);
  
  this.stations = ko.observable(3);
  
  this.initiative = ko.computed(function() {
    return (this.frames().length + parseInt(this.stations())) * this.assetValue(); 
  }, this);
  
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
    if (this.systems().length < 6) {
      return true;
    } else {
      return false;
    }
  }, this);
  
  this.hadTurn = ko.observable(false);
  
  this.status = ko.computed(function() {
    if (this.systems().length < 1) {
      return 'Dead';
    } else if (this.hadTurn() === true) {
      return 'Done';
    } else {
      return 'Ready'; 
    }
  }, this);
  
  this.toggleStatus = function() {
    if (this.hadTurn()) {
      this.hadTurn(false);
      console.log('now it is false');
    } else {
      this.hadTurn(true);
      console.log('now it is true');
    };
  };

};



/************************************************/
/* The System model */
/************************************************/

function SystemModel(system) {
  
  this.type = ko.observable(system);
  
  this.systemNotHull = ko.computed(function() {
    if (this.type() === 'hull') {
      return false;
    } else {
      return true;
    }
  }, this);
  
};



/************************************************/
/* Rules Library module */
/************************************************/

function RulesLib() {
  
  this.hull = {
    desc: 'Your frame just needs this to work.',
    specRuleLevel1: ['Add <span class="whited">White 1d6</span> Frame hull is at 50% capacity'],
    specRuleLevel2: ['Add another <span class="whited">White 1d6</span> Frame hull is at 100% capacity']
  };
  
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
