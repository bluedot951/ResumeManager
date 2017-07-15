var db = firebase.database()
function addLeft(user) {
  db.ref(user).child("leftSwipe").transaction(function(currSwipe) {
    console.log("Incrementing left")
    return ++currSwipe;
  })
}
function addRight(user) {
  db.ref(user).child("rightSwipe").transaction(function(currSwipe) {
    console.log("Incrementing rightSwipe")
    return ++currSwipe;
  })
}

function getLeft(user, cb) {
	db.ref("Shantanu/leftSwipe").once('value', function(snap) {
		cb(snap.val());
	});
}