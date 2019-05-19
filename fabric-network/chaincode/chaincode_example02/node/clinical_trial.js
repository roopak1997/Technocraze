/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

const shim = require('fabric-shim');
const util = require('util');

var Chaincode = class {

  // Initialize the chaincode
  async Init(stub) {
    console.info('========== clinical_trial Init =========');
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    let args = ret.params;
    // initialise only if 4 parameters passed.
    console.log("ready")
  }

  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);
    let method = this[ret.fcn];
    if (!method) {
      console.log('no method of name:' + ret.fcn + ' found');
      return shim.success();
    }
    try {
      let payload = await method(stub, ret.params);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }

  async invoke(stub, args) {
    if (args.length != 3) {
      throw new Error('Incorrect number of arguments. Expecting 3');
    }

    let T = args[0]
    
    try { 
    if(T == 'newresearch'){

      let id = args[1]
      let date = args[2]
      let phase = args[3]
      let data = { 'phase':phase ,'date':date}

      return stub.putState(id, Buffer.from(data.toString()))
      .then(()=>{
        console.info('state changed');
        return shim.success();
      },()=>{
        return shim.error();
      });

    }
  }
  catch (err) {
    console.log(err);
    return shim.error(err);
  }

  }

  // Deletes an entity from state
  async delete(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting 1');
    }

    let A = args[0];

    // Delete the key from the state in ledger
    await stub.deleteState(A);
  }

  // query callback representing the query of a chaincode
  async query(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting name of the person to query')
    }

    let jsonResp = {};
    let id = args[0];

    // Get the state from the ledger
    let Avalbytes = await stub.getState(id);
    if (!Avalbytes) {
      jsonResp.error = 'Failed to get state for ' + id;
      throw new Error(JSON.stringify(jsonResp));
    }

    jsonResp.id = id;
    jsonResp.date = Avalbytes.toString().toJSON().date;
    jsonResp.phase = Avalbytes.toString().toJSON().phase;
    console.info('Query Response:');
    console.info(jsonResp);
    return Avalbytes;
  }
};

shim.start(new Chaincode());
