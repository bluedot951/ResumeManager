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
			 var email = allData[pos]["value"]["email"]
       sendRejectEmail(email);

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
			 var email = allData[pos]["value"]["email"]
       sendAcceptEmail(email);
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

function sendAcceptEmail(toEmail) {
	var url = "http://localhost:3000/sendMailAccept?email=" + toEmail
	$.ajax({
	  url:url,
	  method:"GET",
	  success: function(result){
	    console.log("Sent")
	  }
	})
}

function sendRejectEmail(toEmail) {
	var url = "http://localhost:3000/sendMailReject?email=" + toEmail
	$.ajax({
	  url:url,
	  type:"GET",
	  success: function(){
	    console.log("Sent")
	  }
	})
}
