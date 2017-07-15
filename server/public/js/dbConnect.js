var db = firebase.database()
function addLeft(user) {
  db.ref(user).child("leftSwipe").transaction(function(currSwipe) {
    console.log("Incremeneting left")
    return ++currSwipe;
  })
}
function addRight(user) {
  db.ref(user).child("rightSwipe").transaction(function(currSwipe) {
    console.log("Incremeneting left")
    return ++currSwipe;
  })
}
