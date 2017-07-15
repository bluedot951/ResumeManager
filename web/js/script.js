document.onkeydown = checkKey;

function checkKey(e) {

	e = e || window.event;

	if (e.keyCode == '37') {
       $("#resume").fadeOut(500, function() {
       	document.getElementById("resume").src = getNextImage();
       	$("#resume").fadeIn(500, null);
       });

       $("#cross").fadeIn(500, function() {
       		$("#cross").fadeOut(500, null);
       });

	}
	else if (e.keyCode == '39') {
       // document.getElementById("resume").src = "shantanu.jpg";
       // fade();
       $("#resume").fadeOut(500, function() {
       	document.getElementById("resume").src = getNextImage();
       	$("#resume").fadeIn(500, null);
       });

       $("#check").fadeIn(500, function() {
       		$("#check").fadeOut(500, null);
       });
   }

}

function getNextImage() {
	if(document.getElementById("resume").src === "http://localhost:8000/web/shantanu.jpg") return "http://localhost:8000/web/sandeep.jpg";
	if(document.getElementById("resume").src === "http://localhost:8000/web/sandeep.jpg") return "http://localhost:8000/web/shantanu.jpg";

	return "hello.jpg";

}

// function fade() {
// 	$("#resume").fadeOut(1000, function() {
//         document.getElementById("resume").src = "shantanu.jpg";
//     }).fadeIn(1000);
//     return false;
// }


