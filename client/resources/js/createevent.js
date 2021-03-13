let dateInput = document.querySelector("input[type=date]");

var today = new Date();
var d = String(today.getDate()).padStart(2, "0");
var m = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
var y = today.getFullYear();

let currentDate = `${y}-${m}-${d}`;

dateInput.setAttribute("min", currentDate);
