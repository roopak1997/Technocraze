var express = require('express');
var router = express.Router();
var cmd = require('node-cmd');
var login = "";
var dtlogin = "";
var suppliertype = "";

const cred = {
  org:"johnson and johnson",
  orgid:"JnJ",
  trial:"Athena",
  trialid:"JnJ101",
  about:"Enhancement to Drug AT1009",
  date:'May 2019'
};
var drugReports = [
 ['Organization Type','Drug ID','Batch ID','Batch Expected','Arrived On','Dispatched On']
];

var Reports = [

  ['Phase no', 'Report Id', 'Date', 'Employee Identifier', 'Action','File','Scenerio','Report Summary']

];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Express' })
});

router.get('/firstpage.ejs', function(req, res, next) {

    login = "";
    dtlogin = "";
    suppliertype ="";
  res.render('firstpage', { title: 'Express' });
});

router.get('/about.ejs', function(req, res, next) {
  res.render('about', { login:login,dtlogin:dtlogin });
});

router.get('/adddata.ejs', function(req, res, next) {
    res.render('adddata', { phase: req.query.para1 });
});

router.get('/changephaseapi', function(req, res, next) {

    phasedata = req.query.phasedata;
    if(phasedata=="Phase 1"){
        phasedata="phase2";
    }
    else if(phasedata=="Phase 2"){
        phasedata="phase3";
    }
    else if(phasedata=="Phase 3"){
        phasedata="phase4";
    }
    else{
        phasedata="phase1";
    }

    let command = "docker exec cli peer chaincode invoke -o orderer.example.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C athena -n clinicaltrials --peerAddresses peer0.org1.example.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses peer0.org2.example.com:9051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{\"Args\":[\"setphase\",\""+phasedata+"\"]}'";
    cmd.get(
        command,
        function(err, data, stderr) {
            console.log('result : ', data);
            console.log('error : ', stderr);
        }
    )
    res.render('researchhome', { organisation: cred.org, research: cred.trial, desc: cred.about, logintype : login});
});

router.get('/contact.ejs', function(req, res, next) {
  res.render('contact', { login:login,dtlogin:dtlogin});
});

router.get('/cthome.ejs', function(req, res, next) {
    res.render('cthome', { title: 'Express' });
});

router.post('/cthome.ejs', function(req, res, next) {
    res.render('cthome', { title: 'Express' });
});

router.post('/cthome', function(req, res, next) {
  res.render('cthome', { title: 'Express' });
});

router.get('/ctlogin.ejs', function(req, res, next) {
    login = req.query.logintype;
    res.render('ctlogin', { uname: login });
});

router.get('/ctsignup.ejs', function(req, res, next) {
    res.render('ctsignup', { title: 'Express' });
});

router.get('/dthome.ejs', function(req, res, next) {
    suppliertype = req.query.stype;
    res.render('dthome', { uname: dtlogin });
});

router.get('/dtlogin.ejs', function(req, res, next) {
    dtlogin = req.query.logintype;
    res.render('dtlogin', { uname: dtlogin});
});

router.get('/dtlogintype.ejs', function(req, res, next) {
  res.render('dtlogintype', { title: 'Express' });
});

router.get('/dtsignup.ejs', function(req, res, next) {
  res.render('dtsignup', { title: 'Express' });
});

router.get('/fdalogin.ejs', function(req, res, next) {
  res.render('fdalogin', { title: 'Express' });
});

router.post('/newtrial.ejs', function(req, res, next) {
    res.render('newtrial', {organisation: cred.org, trial: cred.trial, about: cred.about});
});

router.get('/researchhome.ejs', function(req, res, next) {
    let para1 = cred.org;
    let para2 = cred.trial;
    let para3 = cred.about;

    res.render('researchhome', {organisation: para1, research: para2, desc: para3,logintype: login});
});

router.get('/researchhomeapi', function(req, res, next) {

  let data = [req.query.para1,req.query.para2,req.query.para4,req.query.file,req.query.para5,req.query.para6]
  Reports.push(data);


  // let ipfs = "ipfs add /home/ashish/Downloads/adddata.ejs ";
    let file_path = req.query.file;
    let file = file_path.split("/");
    let name = file[file.length-1];
    let ipfs = "ipfs add "+ file_path;

  cmd.get(
      ipfs,
      function(err, data, stderr){
        console.log('result : ',data);
        console.log('error : ',stderr);

        data = data.split(" ");
        file_hash = data[1];
        let command = "docker exec cli peer chaincode invoke -o orderer.example.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C athena -n clinicaltrials --peerAddresses peer0.org1.example.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses peer0.org2.example.com:9051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{\"Args\":[\"setrecord\",\""+req.query.para1+"\",\""+req.query.para2+"\",\""+req.query.para4+"\",\""+name+"\",\""+file_hash+"\",\""+req.query.para5+"\",\""+req.query.para6+"\"]}'";

        console.log(command)
        cmd.get(
            command,
            function(err, data, stderr){
              console.log('result : ',data);
              console.log('error : ',stderr);
              res.render('researchhome', { organisation: cred.org, research: cred.trial, desc: cred.about,logintype:login});
            }
        )
      }
  )


});

router.get('/phasedetail.ejs', function(req, res, next) {


    let phasedata = req.query.phasebtn;

    let command = "docker exec cli peer chaincode invoke -o orderer.example.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C athena -n clinicaltrials --peerAddresses peer0.org1.example.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses peer0.org2.example.com:9051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{\"Args\":[\"gettaskhistory\"]}'"

    //let stderr = '2019-05-09 18:46:08.545 UTC [chaincodeCmd] chaincodeInvokeOrQuery -> INFO 001 Chaincode invoke successful. result: status:200 message:"History is" payload:"[task01,phase2,report01,Thu May 09 18:45:11 UTC 2019,emp101,file01,asdaaaaaaaaaaaaaaa,scene01,sum01,dadbbbd250e5dff9b1b3fad7165954667dbf0f6d6bb54724cd77fed3ed6a60b7,2019-05-09T18:44:40.064653163Z, task01,phase1,report01,Thu May 09 18:46:02 UTC 2019,emp101,file01,scene01,sum01,a87542f264a0a30812365f2cdceb8fa5ffa862a6eda5161b733102127c6f4f02,2019-05-09T18:46:02.765933779Z, task02,phase1,report02,Thu May 09 18:45:58 UTC 2019,emp102,file.name,QmaSTXKiyLL6TcNSB5RZxZWk4X5HKKmHE66s2giUP9mYW3,scene02,sum02,8a5f5c4e46b991d99269c95a26f918ddbda590602d132b7457600f50b7b0fe5b,2019-05-09T18:45:58.312279767Z, task01,phase1,report01,Thu May 09 18:45:11 UTC 2019,emp101,file01,asdddddddddddddddddddddddddddddd,scene01,sum01,dadbbbd250e5dff9b1b3fad7165954667dbf0f6d6bb54724cd77fed3ed6a60b7,2019-05-09T18:44:40.064653163Z, task01,phase1,report01,Thu May 09 18:46:02 UTC 2019,emp101,file01,scene01,sum01,a87542f264a0a30812365f2cdceb8fa5ffa862a6eda5161b733102127c6f4f02,2019-05-09T18:46:02.765933779Z]"';

    cmd.get(
        command,
        function (err, data, stderr) {
            console.log('result : ', data);
            console.log('error : ', stderr);

            var data1 = stderr.split("payload:");
            var res1 = data1[1].replace("\"", "");
            var res2 = res1.replace("[", "");
            var res3 = res2.replace("]", "");
            var res4 = res3.split(",");

            let obj = [];
            for (i = 0; i < res4.length; i += 11) {
                obj.push({
                    v1: res4[i + 0],
                    v2: res4[i + 1],
                    v3: res4[i + 2],
                    v4: res4[i + 3],
                    v5: res4[i + 4],
                    v6: res4[i + 5],
                    v7: res4[i + 6],
                    v8: res4[i + 7],
                    v9: res4[i + 8],
                    v10: res4[i + 9],
                    v11: res4[i + 10]
                })
            }
            res.render('phasedetail', {phasedata: phasedata, dataObj: obj, logintype: login});
            //     }
            // )
        });
});

    router.get('/newtrialapi', function (req, res, next) {
        res.render('adddata.ejs', {title: 'Express'});
    });

    router.get('/submitreport.ejs', function (req, res, next) {
        res.render('submitreport', {suptype: suppliertype.toUpperCase()});
    });

    router.get('/trackdrugsearch.ejs', function (req, res, next) {
        res.render('trackdrugsearch', {title: 'Express'});
    });

    router.get('/trackdrug.ejs', function (req, res, next) {
        var drugId = req.query.para1;

        let command = "docker exec cli peer chaincode invoke -o orderer.example.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C athena -n clinicaltrials --peerAddresses peer0.org1.example.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses peer0.org2.example.com:9051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{\"Args\":[\"track\"]}';"

        cmd.get(
            command,
            function (err, data, stderr) {
                console.log('result : ', data);
                console.log('error : ', stderr);

                var data1 = stderr.split("payload:");
                var res1 = data1[1].replace("\"", "");
                var res2 = res1.replace("[", "");
                var res3 = res2.replace("]", "");
                var res4 = res3.split(",");

                let obj = [];
                for (i = 0; i < res4.length; i += 10) {
                    obj.push({
                        v1: res4[i + 0],
                        v2: res4[i + 1],
                        v3: res4[i + 2],
                        v4: res4[i + 3],
                        v5: res4[i + 4],
                        v6: res4[i + 5],
                        v7: res4[i + 6],
                        v8: res4[i + 7],
                        v9: res4[i + 8],
                        v10: res4[i + 9]
                    })
                }

                res.render('trackdrug', {drugId: drugId, dataObj: obj, suptype: suppliertype});
            }
        )

    });

    router.get('/submitReportApi', function (req, res, next) {

        let file_path = req.query.in7;
        let file = file_path.split("/");
        let name = file[file.length - 1];
        console.log(name);

        let ipfs = "ipfs add " + file_path;

        cmd.get(
            ipfs,
            function (err, data, stderr) {
                console.log('result : ', data);
                console.log('error : ', stderr);

                data = data.split(" ");
                file_hash = data[1];
                let command = "docker exec cli peer chaincode invoke -o orderer.example.com:7050 --tls true --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -C athena -n clinicaltrials --peerAddresses peer0.org1.example.com:7051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt --peerAddresses peer0.org2.example.com:9051 --tlsRootCertFiles /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt -c '{\"Args\":[\"report\",\"" + req.query.in1 + "\",\"" + req.query.in2 + "\",\"" + req.query.in3 + "\",\"" + req.query.in4 + "\",\"" + req.query.in5 + "\",\"" + req.query.in6 + "\",\"" + name + "\",\"" + file_hash + "\"]}'";

                console.log(command)
                cmd.get(
                    command,
                    function (err, data, stderr) {
                        console.log('result : ', data);
                        console.log('error : ', stderr);
                        res.render('dthome', {uname: dtlogin});
                    }
                )
            }
        );
    });

    router.get('/home.ejs', function (req, res, next) {
        login = "";
        dtlogin = "";
        suppliertype = "";
        res.render('home', {});
    });

    module.exports = router;
