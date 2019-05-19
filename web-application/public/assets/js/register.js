function addCredential() {

    // var fs = require('fs');

    var uname = document.getElementById('uname').value;
    var pword = document.getElementById('pword').value;
    var rpword = document.getElementById('rpword').value;

    if (pword != rpword){
        alert('Password do not match!')
        return false;
    }

    // fs.appendFile('./ctData.txt','hello',function (err) {
    //     if (err) {
    //         return false;
    //     }
    //     alert('Saved!');
    //     return true;
    // });

}