document.onkeydown = checkKey;

function checkKey(e) {

	e = e || window.event;

	if (e.keyCode == '37') {
       $("#resume").fadeOut(500, function() {
       	document.getElementById("resume").src = "sandeep.jpg";
       	$("#resume").fadeIn(500, null);
       });

	}
	else if (e.keyCode == '39') {
       // document.getElementById("resume").src = "shantanu.jpg";
       // fade();
       $("#resume").fadeOut(500, function() {
       	document.getElementById("resume").src = "shantanu.jpg";
       	$("#resume").fadeIn(500, null);
       });
   }

}

// function fade() {
// 	$("#resume").fadeOut(1000, function() {
//         document.getElementById("resume").src = "shantanu.jpg";
//     }).fadeIn(1000);
//     return false;
// }


