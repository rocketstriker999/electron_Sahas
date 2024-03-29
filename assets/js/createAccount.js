import { requestHelper } from './helper.js';


let createAccountHandler = {};

createAccountHandler.deviceId = document.getElementById("DEVICE_ID");

createAccountHandler.etxUserName = document.getElementById("ETX_USERNAME");
createAccountHandler.etxEmail = document.getElementById("ETX_EMAIL");
createAccountHandler.etxPassWord = document.getElementById("ETX_PASSWORD");
createAccountHandler.etxPhone = document.getElementById("ETX_PHONE");

createAccountHandler.btnGoogleLogin = document.getElementById("BTN_GOOGLE_LOGIN");

createAccountHandler.counterUserName = document.getElementById("COUNTER_USERNAME");
createAccountHandler.counterEmail = document.getElementById("COUNTER_EMAIL");
createAccountHandler.counterPassWord = document.getElementById("COUNTER_PASSWORD");
createAccountHandler.counterPhone = document.getElementById("COUNTER_PHONE");

createAccountHandler.validationUsername = document.getElementById('VALIDATION_USERNAME');
createAccountHandler.validationEmail = document.getElementById('VALIDATION_EMAIL');
createAccountHandler.validationPassword = document.getElementById('VALIDATION_PASSWORD');
createAccountHandler.validationPhone = document.getElementById('VALIDATION_PHONE');

createAccountHandler.error = document.getElementById("ERROR");

createAccountHandler.btnLogin = document.getElementById("BTN_LOGIN");
createAccountHandler.btnCreateAccout = document.getElementById("BTN_SIGNUP");

//Set Device Id From Storage Initially
createAccountHandler.deviceId.innerHTML = `Your Device Id : ${requestHelper.getData("DEVICEID")}`;

createAccountHandler.etxUserName.addEventListener("input", (e) => {
    createAccountHandler.counterUserName.innerText = e.target.value.length + " / 22 characters";
});

createAccountHandler.etxEmail.addEventListener("input", (e) => {
    createAccountHandler.counterEmail.innerText = e.target.value.length + " / 32 characters";
});

createAccountHandler.etxPassWord.addEventListener("input", (e) => {
    createAccountHandler.counterPassWord.innerText = e.target.value.length + " / 16 characters";
});

createAccountHandler.etxPhone.addEventListener("input", (e) => {
    createAccountHandler.counterPhone.innerText = e.target.value.length + " / 10 characters";
});


createAccountHandler.btnLogin.addEventListener("click", (e) => {
    e.preventDefault(); //Stop Form Submission
    window.location.href = 'login.html'
});

createAccountHandler.setSignUpError=(error)=>{
    createAccountHandler.error.style.display="block";
    createAccountHandler.error.innerHTML=error;
}

createAccountHandler.setInputError=(error,validationArea,etx)=>{
    validationArea.textContent=error;
    validationArea.style.display='block'
    etx.classList.add('invalid_edittext');
}

createAccountHandler.validateInputs = () => {

    // Reset previous validation messages
    createAccountHandler.validationUsername.style.display = "none";
    createAccountHandler.validationEmail.style.display = "none"
    createAccountHandler.validationPassword.style.display = "none"
    createAccountHandler.validationPhone.style.display = "none"

    createAccountHandler.etxUserName.classList.remove('invalid_edittext');
    createAccountHandler.etxEmail.classList.remove('invalid_edittext');
    createAccountHandler.etxPassWord.classList.remove('invalid_edittext');
    createAccountHandler.etxPhone.classList.remove('invalid_edittext');

    // Perform validation

    if (createAccountHandler.etxUserName.value == '') {
        createAccountHandler.setInputError('Please enter your Full name',createAccountHandler.validationUsername,createAccountHandler.etxUserName);
        return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createAccountHandler.etxEmail.value)) {
        createAccountHandler.setInputError('Please enter a valid email address',createAccountHandler.validationEmail,createAccountHandler.etxEmail);
        return false;
    }

    if (createAccountHandler.etxPassWord.value.length < 8) {
        createAccountHandler.setInputError('Password must be at least 8 characters long',createAccountHandler.validationPassword,createAccountHandler.etxPassWord);
        return false;
    }

    if (createAccountHandler.etxPhone.value.length < 10) {
        createAccountHandler.setInputError('Please enter valid phone number', createAccountHandler.validationPhone, createAccountHandler.etxPhone);
        return false;
    }

   
    return true;

}


createAccountHandler.btnCreateAccout.addEventListener("click", (e) => {
    e.preventDefault(); //Stop Form Submission

    if (createAccountHandler.validateInputs()) {

        requestHelper.requestServer({
            requestPath: "userAccNew.php", requestMethod: "POST", requestPostBody: {
                user_name: createAccountHandler.etxUserName.value,
                user_email: createAccountHandler.etxEmail.value,
                user_pass: createAccountHandler.etxPassWord.value,
                user_phone: createAccountHandler.etxPhone.value,
                user_device: requestHelper.getData("DEVICEID")
            }
        }).then(response=> response.json()).then(jsonResponse => {
            if (jsonResponse.isTaskSuccess=='true') {
                window.electron.setCurrentUser(jsonResponse.userAccData);
                window.location.href = 'dashBoard.html';
            }
            else {
                throw new Error(jsonResponse.response_msg);
            }
        }).catch(error => {
            createAccountHandler.setSignUpError(error);
        });
    }
});

