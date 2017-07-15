document.onkeydown = checkKey;
document.onload = fetchAllKeys();

var allData = [];
var pos;
function checkKey(e) {
	if (pos >= allData.length) {
		return
	}
	e = e || window.event;

	if (e.keyCode == '37') {
       $("#resume").fadeOut(500, function() {
				addLeft(allData[pos]["key"]);
       	setNextImage();
       });

       $("#cross").fadeIn(500, function() {
       		$("#cross").fadeOut(500, null);
       });

	}
	else if (e.keyCode == '39') {
       // document.getElementById("resume").src = "shantanu.jpg";
       // fade();
       $("#resume").fadeOut(500, function() {
				addRight(allData[pos]["key"]);
       	setNextImage()
       });

       $("#check").fadeIn(500, function() {
       		$("#check").fadeOut(500, null);
       });
   }

}

function fetchAllKeys() {
	var ref = firebase.database().ref();
	ref.orderByChild("timestamp").once('value').then(function(snapshot) {
		snapshot.forEach(function(childSnap) {
				allData.push({"key": childSnap.key, "value": childSnap.val()})
		})
	});
	pos = 0;
}


function setNextImage() {
	if (pos >= allData.length - 1) {
		document.getElementById("resume").src = "done.jpg";
		++pos;
	}
	else {
		document.getElementById("resume").src = allData[++pos]["value"]["imageName"];
	}
	$("#resume").one("load", function() {
		$("#resume").fadeIn(500, null);
	})
}
// function fade() {
// 	$("#resume").fadeOut(1000, function() {
//         document.getElementById("resume").src = "shantanu.jpg";
//     }).fadeIn(1000);
//     return false;
// }
