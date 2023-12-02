import { requestHelper } from './helper.js';


let profileDetailsHandler = {};

profileDetailsHandler.deviceId = document.getElementById("DEVICE_ID");
profileDetailsHandler.emailId = document.getElementById("EMAIL_ID");
profileDetailsHandler.extUsername = document.getElementById("ETX_USERNAME");
profileDetailsHandler.extPhone = document.getElementById("ETX_PHONE");
profileDetailsHandler.extPassword = document.getElementById("ETX_PASSWORD");
profileDetailsHandler.btnAppyDetails = document.getElementById("BTN_APPLYDETAILS");
profileDetailsHandler.btnWallet = document.getElementById("BTN_WALLET");




//Set Device Id From Storage Initially
profileDetailsHandler.deviceId.innerHTML = `Your Device Id : ${requestHelper.getData("DEVICEID")}`;