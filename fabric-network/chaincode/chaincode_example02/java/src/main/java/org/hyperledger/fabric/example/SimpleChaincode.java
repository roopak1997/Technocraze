/*
Copyright IBM Corp., DTCC All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/
package org.hyperledger.fabric.example;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;

import com.google.protobuf.ByteString;
import io.netty.handler.ssl.OpenSsl;
//import netscape.javascript.JSObject;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hyperledger.fabric.shim.ChaincodeBase;
import org.hyperledger.fabric.shim.ChaincodeStub;
import org.hyperledger.fabric.shim.ledger.KeyModification;
import org.hyperledger.fabric.shim.ledger.QueryResultsIterator;

import static java.nio.charset.StandardCharsets.UTF_8;

public class SimpleChaincode extends ChaincodeBase {

    private static Log _logger = LogFactory.getLog(SimpleChaincode.class);

    private String[] params = {  "organizationtype", "drugid" , "batchid", "batchexpected" ,"datereceived" ,"datedispatched","filename","filehash" };

    private String[] param = {  "taskid" ,"phase","reportid",  "date", "empid" ,"filename","fileid", "scene","summary" };

    @Override
    public Response init(ChaincodeStub stub) {
        try {
            _logger.info("Init java simple chaincode");
            String func = stub.getFunction();
            if (!func.equals("init")) {
                return newErrorResponse("function other than init is not supported");
            }
            List<String> args = stub.getParameters();
            if (args.size() != 1) {
                newErrorResponse("Incorrect number of arguments. Expecting 1 : Phase <num>");
            }
            // Initialize the chaincode
            _logger.info("Param count = " + args.size());

            _logger.info(String.format("Phase %s", "phase1"));

            stub.putStringState("phase", "phase1");
            stub.putStringState("tasklist","");
            stub.putStringState("drugslist","");

            return newSuccessResponse();
        } catch (Throwable e) {
            return newErrorResponse(e);
        }
    }

    @Override
    public Response invoke(ChaincodeStub stub) {
        try {
            _logger.info("Invoke java simple chaincode");
            String func = stub.getFunction();
            List<String> params = stub.getParameters();

            if (func.equals("setphase")) {
                return setphase(stub, params);
            }

            if (func.equals("getphase")) {
                return getphase(stub, params);
            }

            if (func.equals("setrecord")) {
                return setrecord(stub, params);
            }

            if (func.equals("gettask")) {
                return getTask(stub, params);
            }

            if (func.equals("gettaskhistory")){
                return getTaskHistory(stub, params);
            }

            if (func.equals("report")) {
                return report(stub, params);
            }

            if (func.equals("track")) {
                return track(stub, params);
            }
            //if (func.equals(getTrackHistoy)){
            //    return getTrackHistory(stub, params);
            //}
            return newErrorResponse("Invalid invoke function name. Expecting one of: [\"setphase\", \"getphase\", \"setrecord\",\"gettask\",\"gettaskhistory\",\"track\",\"report\"]");
        } catch (Throwable e) {
            return newErrorResponse(e);
        }
    }

    private Response setrecord (ChaincodeStub stub, List<String> args){

        if (args.size() != 7) {
            return newErrorResponse("Incorrect number of arguments. Expecting : \"taskid\", \"reportid\", \"empid\" ,\"filename\",\"fileid\",\"scene\",\"summary\" ");
        }

        Calendar cal = Calendar.getInstance();
        String d = cal.getTime().toString();

        String response;
        String taskIdStatus = stub.getStringState(args.get(0));

        if (taskIdStatus == null) {
            response = "New task created";
        }
        else
            response = "Updated existing task";

        String record = args.get(0) + ","
                + stub.getStringState("phase") + ","
                + args.get(1) + ","
                + d + ","
                + args.get(2) + ","
                + args.get(3) + ","
                + args.get(4) + ","
                + args.get(5) + ","
                + args.get(6);

        stub.putStringState(args.get(0),record);

        String tasklist = stub.getStringState("tasklist");
        tasklist = tasklist.concat( "," + args.get(0) );
        stub.putStringState("tasklist",tasklist);

        return newSuccessResponse("Record saved successfully : " + response + " for task : " + args.get(0),ByteString.copyFrom(record.toString(),UTF_8).toByteArray());
    }

    private Response getTaskHistory(ChaincodeStub stub, List<String> args) {

        ArrayList<String> history = new ArrayList<>();

        String tasklist = stub.getStringState("tasklist");
        String[] tasks = tasklist.split(",");

        for (String t : tasks) {

            QueryResultsIterator<KeyModification> it = stub.getHistoryForKey(t);
            for (KeyModification v : it) {


                String record;
                record = v.getStringValue() + "," + v.getTxId() + "," +v.getTimestamp().toString();

                history.add(record);


            }
        }

        return newSuccessResponse("History is", ByteString.copyFrom(history.toString(), UTF_8).toByteArray());
    }


    private Response getTask(ChaincodeStub stub, List<String> args) {

        String r = stub.getStringState(args.get(0));


        _logger.info(String.format("Query Response:%s\n", r));


        return newSuccessResponse("History is ", ByteString.copyFrom(r, UTF_8).toByteArray());
    }

    private Response getphase(ChaincodeStub stub, List<String> args) {

        String r = stub.getStringState("phase");
        //_logger.info(String.format("Query Response:%s\n", r));
        return newSuccessResponse("Phase is", ByteString.copyFrom(r, UTF_8).toByteArray());
    }

    private Response setphase(ChaincodeStub stub, List<String> args) {

        stub.putStringState("phase",args.get(0));
        _logger.info(String.format("Query Response:%s\n", args.get(0)));
        return newSuccessResponse("success : Phase updated as ", ByteString.copyFrom(args.get(0), UTF_8).toByteArray());
    }

    private Response report(ChaincodeStub stub, List<String> args){



        Calendar cal = Calendar.getInstance();
        String d = cal.getTime().toString();

        String response;
        String drugIdStatus = stub.getStringState(args.get(1));

        if (drugIdStatus == null) {
            response = "New track report created";
        }
        else
            response = "Updated existing track report";

        String record = args.get(0) + ","
                + args.get(1) + ","
                + args.get(2) + ","
                + args.get(3) + ","
                + args.get(4) + ","
                + args.get(5) + ","
                + args.get(6) + ","
                + args.get(7) ;

        stub.putStringState(args.get(1),record);

        String drugslist = stub.getStringState("drugslist");
        drugslist = drugslist.concat( "," + args.get(1) );
        stub.putStringState("drugslist",drugslist);

        return newSuccessResponse("Track record saved successfully : " + response + " for drug : " + args.get(1),ByteString.copyFrom(record.toString(),UTF_8).toByteArray());
    }

    private Response track(ChaincodeStub stub, List<String> args) {

        ArrayList<String> history = new ArrayList<>();

        String drugslist = stub.getStringState("drugslist");
        String[] drugs = drugslist.split(",");

        for (String t : drugs) {

            //if(t==args.get(0)) {

                QueryResultsIterator<KeyModification> it = stub.getHistoryForKey(t);
                for (KeyModification v : it) {

                    String record;
                    record = v.getStringValue() + "," + v.getTxId() + "," + v.getTimestamp().toString();
                    history.add(record);
                }
            //}
        }
        //_logger.info(String.format("Query Response:%s\n", history.toString()));


        return newSuccessResponse("History is ", ByteString.copyFrom(history.toString(), UTF_8).toByteArray());
    }

    public static void main(String[] args) {
        System.out.println("OpenSSL avaliable: " + OpenSsl.isAvailable());
        new SimpleChaincode().start(args);
    }

}
