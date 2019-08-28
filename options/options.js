window.onload = function() {
    document.getElementById("buttons").onclick = function fun() {
  
  if (document.getElementById("status_none").checked) {
    console.log("none");
    chrome.storage.sync.set({"status": "none"});
  }
  if (document.getElementById("status_medium").checked) {
    console.log("medium");
    chrome.storage.sync.set({"status": "medium"});
  }
  if (document.getElementById("status_high").checked) {
    console.log("high");
    chrome.storage.sync.set({"status": "high"});
  }
  if (!document.getElementById("status_high").checked && !document.getElementById("status_medium").checked && !document.getElementById("status_none").checked) {
    chrome.storage.sync.set({"status": "high"});
  }
}


}


chrome.storage.sync.get(['status'], function(status) {
  var data = status.status;
  if (data == "none"){
    document.getElementById("status_none").checked = true;
  }
  if (data == "medium"){
    document.getElementById("status_medium").checked = true;
  }
  if (data == "high"){
    document.getElementById("status_high").checked = true;
  }
  if (data === "undefined") {
    document.getElementById("status_high").checked = true;
  }
});
