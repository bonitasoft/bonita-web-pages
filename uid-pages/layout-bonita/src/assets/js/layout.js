"use strict";

function initMessageListener() {

  var postMessageListener = function(event) {
    var eventData = event.data || null;
    if (eventData) {
      try {
        var jsonEventData = JSON.parse(eventData);
        //Handle the message here (default behavior is to redirect to the target URL on success)
        if (jsonEventData.message === 'success') {
            //avoid redirecting to the portal when we are in an app
            if (jsonEventData.action === 'Start process' || jsonEventData.action === 'Submit task') {
                window.location.reload();
            } else if (jsonEventData.targetUrlOnSuccess && jsonEventData.targetUrlOnSuccess != "/bonita") {
                window.location.assign(jsonEventData.targetUrlOnSuccess);
            }
        }
      } catch (e) {
        //The message is not json, so not for us 
      }
    }
  };

  // Listen to message from child window
  if (window.addEventListener) {
    window.addEventListener('message', postMessageListener, false);
  } else if (window.attachEvent) {
    //For IE
    window.attachEvent('onmessage', postMessageListener, false);
  }
};

initMessageListener();

window.addEventListener('load', function() {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.href = '../theme/icons/default/favicon.ico';
    document.getElementsByTagName('head')[0].appendChild(link);
})
