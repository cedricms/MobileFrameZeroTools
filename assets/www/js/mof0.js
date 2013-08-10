var dbVersion = "1.0";

function getBackButtonMarkup(applicationTitle) {
  return '<a href="./menu.html"><img src="./img/moF0LittleGuy/MoF0LittleGuy_50_57.png" class="img-responsive backButton" alt="' + applicationTitle + '"></a>';
}

function initLanguages() {
  var userLang = navigator.language || navigator.userLanguage;
  userLang = userLang.substring(0,2);
  loadBundles(userLang);
}

function initDb() {
  // Wait for PhoneGap to load
  document.addEventListener("deviceready", onDeviceReady, false);

  // PhoneGap is ready
  function onDeviceReady() {
    var db = window.openDatabase("mof0DB", dbVersion, "Mobile Frame Zero Tools", 200000);
    db.transaction(populateDB, errorDB, successDB);
  }

  // Populate the database 
  function populateDB(tx) {
//    tx.executeSql('DROP TABLE IF EXISTS DEMO');
//    tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
//    tx.executeSql('INSERT INTO DEMO (id, data) VALUES (1, "First row")');
//    tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
  }

  // Transaction error callback
  function errorDB(tx, err) {
    alert("Error processing SQL: "+err);
  }

  // Transaction success callback
  function successDB() {
    //alert("success!");
  }
}

function getDbVersion() {
  return dbVersion;
}

