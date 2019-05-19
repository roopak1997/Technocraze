let ctcredentials = [
    ["fda"],["org"]
]

let dtcredentials = [
    ["org"],["shipper"],["trader"],["hospital"]
]
    
function ctvalidation(){

    var pword = document.getElementById('pword').value;

    for(i=0;i<ctcredentials.length;i++){
        if (pword == ctcredentials[i][0]){
            return true;
        }
    }

    alert('Invalid Credentials !!!');
    return false;
}

function dtvalidation(){

    var pword = document.getElementById('pword').value;

    for(i=0;i<dtcredentials.length;i++){
        if (pword == dtcredentials[i][0]){
            return true;
        }
    }

    alert('Invalid Credentials !!!');
    return false;
}

function addCtCredential() {

    // var fs = require('fs');

    var uname = document.getElementById('uname').value;
    var pword = document.getElementById('pword').value;
    var rpword = document.getElementById('rpword').value;
    window.console.log("das ")

    if (pword != rpword){
        alert('Password do not match!')
        return false;
    }
    for(i=0;i<ctcredentials.length;i++){
        if (uname == ctcredentials[i][0]){
            alert('User already exits. Try login!!!')
            return false;
        }
    }
    ctcredentials.push([uname,pword]);
    window  .console.log(ctcredentials);
    return true
}

function addDtCredential() {

    // var fs = require('fs');

    var uname = document.getElementById('uname').value;
    var pword = document.getElementById('pword').value;
    var rpword = document.getElementById('rpword').value;

    if (pword != rpword){
        alert('Password do not match!')
        return false;
    }
    for(i=0;i<dtcredentials.length;i++){
        if (uname == dtcredentials[i][0]){
            alert('User already exits. Try login!!!')
            return false;
        }
    }
    dtcredentials.push([uname,pword]);
    return true
}