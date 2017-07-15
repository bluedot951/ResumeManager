document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '37') {
       // alert('left arrow');
       document.getElementById("resume").src = "sandeep.jpg";
    }
    else if (e.keyCode == '39') {
       document.getElementById("resume").src = "shantanu.jpg";
    }

}
