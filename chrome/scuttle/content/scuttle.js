var scuttle_version  = "0.3.4";
var scuttle_page_my  = "login.php";
var scuttle_page_add = "bookmarks.php";

var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

function scuttle_my(e, mouse) {
   var scuttle_url = prefs.getCharPref("scuttle.options.url");
   var url = scuttle_url + scuttle_page_my;
   if (mouse) {
      if (e.button == 1) {
         var browser = document.getElementById("content");
         var tab = browser.addTab(url);
         browser.selectedTab = tab;
      }
   } else {
      if (e.ctrlKey) {
         var browser = document.getElementById("content");
         var tab = browser.addTab(url);
         browser.selectedTab = tab;
      } else if (e.shiftKey) {
         window.open(url, "scuttleMy");
      } else {
         loadURI(url);
      }
   }
}

function post_to_url(redirectTo, data) {
  var scuttle_width = prefs.getCharPref("scuttle.options.width");
  var scuttle_height = prefs.getCharPref("scuttle.options.height");
  // POST method requests must wrap the encoded text in a MIME stream
  var stringStream = Components.classes["@mozilla.org/io/string-input-stream;1"].createInstance(Components.interfaces.nsIStringInputStream);
  
  if ("data" in stringStream) {
     // Gecko 1.9 or newer
       stringStream.data = data;
    } else {
       // 1.8 or older
       stringStream.setData(data, data.length);
    }
    
  var postData = Components.classes["@mozilla.org/network/mime-input-stream;1"].createInstance(Components.interfaces.nsIMIMEInputStream);
  postData.addHeader("Content-Type", "application/x-www-form-urlencoded");
  postData.addContentLength = true;
  postData.setData(stringStream);
  window.openDialog('chrome://browser/content', '_blank', "status=0, scrollbars=1, toolbar=0, resizable=1, width="+ scuttle_width +", height="+ scuttle_height +", left="+ (screen.width-scuttle_width) / 2 +", top="+ (screen.height-scuttle_height) / 2, redirectTo, null, null, postData);
}

function scuttle_add(address, title) {
    var scuttle_url = prefs.getCharPref("scuttle.options.url");

    var _address = (address === undefined) ? new Array(window.content.location.href) : address;
    var _title = (title === undefined) ? new Array(window.content.document.title) : title;
    if (typeof _address === 'string') {
        _address = [ _address ];
    }
    if (typeof _title === 'string') {
        _title = [ _title ];
    }
    var description = "";
    
    var params = '';
    for (var i in _address) {
            params += "address["+i+"]=" + encodeURIComponent(_address[i]) + "&";

    }

    for (var i in _title) {
            params += "title["+i+"]=" + encodeURIComponent(_title[i]) + "&";
    }
    params = params.slice(0, - 1);

    var d = encodeURIComponent(description);
    post_to_url(scuttle_url + scuttle_page_add + "?action=add&popup=1" +"&description="+ d +"&src=ffext"+ scuttle_version, params);
}

function scuttle_multiadd() {
  var address = [];
  var title = [];
  var e = 0;
  var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
  var browserEnumerator = wm.getEnumerator("navigator:browser");
 
  while (browserEnumerator.hasMoreElements()) {
    var browserWin = browserEnumerator.getNext();
    var tabbrowser = browserWin.gBrowser;

    // Check each tab of this browser instance
    var numTabs = tabbrowser.browsers.length;
    for (var index = 0; index < numTabs; index++) {
      var currentBrowser = tabbrowser.getBrowserAtIndex(index);
      address[e] = currentBrowser.currentURI.spec;
      title[e] = tabbrowser.tabs[index].label; 
      e++;
    }
  }
  scuttle_add(address, title);
}

function scuttle_menu() {
    document.getElementById("scuttle-context-page").setAttribute("hidden", document.getElementById("context-bookmarkpage").getAttribute("hidden"));
    document.getElementById("scuttle-context-link").setAttribute("hidden", document.getElementById("context-bookmarklink").getAttribute("hidden"));
    document.getElementById("scuttle-context-selection").setAttribute("hidden", document.getElementById("context-searchselect").getAttribute("hidden"));
}
