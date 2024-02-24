import { requestHelper } from './helper.js';

let courseHandler = {};

courseHandler.courseImage = document.getElementById("COURSE_IMG");
courseHandler.courseName = document.getElementById("COURSE_NAME");
courseHandler.courseDescription = document.getElementById("COURSE_DESCRIPTION");
courseHandler.courseSubjects = document.getElementById("COURSE_SUBJECTS");
courseHandler.containerSubjects = document.getElementById("CONTAINER_SUBJECTS");
courseHandler.coursePurchaseInfo = document.getElementById("COURSE_PURCHASE_INFO");
courseHandler.btnBack = document.getElementById("BTN_BACK");
courseHandler.btnPurchaseCourse = document.getElementById("BTN_BUY");
courseHandler.containerTabs = document.querySelectorAll('.tab');
courseHandler.containerDemo = document.getElementById("CONTAINER_DEMO");
courseHandler.btnCloseDemo = document.getElementById("BTN_CLOSE_SHEET");
courseHandler.btnCloseModal = document.getElementById("BTN_CLOSE_MODAL");
courseHandler.containerDemoData = document.getElementById("CONTAINER_DEMO_DATA");
courseHandler.containerAdditionalDetails = document.getElementById("CONTAINER_ADDITIONAL_DETAILS");
courseHandler.btnUpdateDetails = document.getElementById("BTN_UPDATE_DETAILS");
courseHandler.counterUserName = document.getElementById("COUNTER_USERNAME");
courseHandler.counterAddress = document.getElementById("COUNTER_ADDRESS");
courseHandler.counterPhone = document.getElementById("COUNTER_PHONE");
courseHandler.counterSecondaryPhone = document.getElementById("COUNTER_SECONDARYPHONE");
courseHandler.Phone = document.getElementById("ETX_PHONE");
courseHandler.secondaryPhone = document.getElementById("ETX_SECONDARY_PHONE");
courseHandler.Address = document.getElementById("ETX_ADDRESS");
courseHandler.Username = document.getElementById("ETX_USERNAME");
courseHandler.Branch = document.getElementById("SELECT_BRANCH");
courseHandler.validationPhone = document.getElementById('VALIDATION_PHONE');
courseHandler.validationSecondaryPhone = document.getElementById('VALIDATION_SECONDARY_PHONE');
courseHandler.validationAddress = document.getElementById('VALIDATION_ADDRESS');
courseHandler.validationUsername = document.getElementById('VALIDATION_USERNAME');


courseHandler.containerPhone = document.getElementById("CONTAINER_ETX_PHONE");
courseHandler.containerSecondaryPhone = document.getElementById("CONTAINER_ETX_SECONDARY_PHONE");
courseHandler.containerAddress = document.getElementById("CONTAINER_ETX_ADDRESS");
courseHandler.containerUsername = document.getElementById("CONTAINER_ETX_USERNAME");
courseHandler.containerBranch = document.getElementById("CONTAINER_SELECT_BRANCH");


//extract and generate get object passed from dashboard
courseHandler.course = Object.fromEntries(new URLSearchParams(window.location.search));

//Set Image For Course
courseHandler.courseImage.src = `${requestHelper.serverAddress}/thumbnails/${courseHandler.course.std_image}`;

//set name
courseHandler.courseName.innerHTML = courseHandler.course.std_name;
//set description
courseHandler.courseDescription.innerHTML = courseHandler.course.std_desc;
//set number of subject
courseHandler.courseSubjects.innerHTML = `${courseHandler.course.sub_count} Subjects`;

//Back Button Click
courseHandler.btnBack.addEventListener("click", (e) => {
    window.electron.back();
});

//Back Button Click
courseHandler.btnCloseModal.addEventListener("click", (e) => {
    courseHandler.containerAdditionalDetails.style.display = 'none';
});

courseHandler.Username.addEventListener("input", (e) => {
    courseHandler.counterUserName.innerText = e.target.value.length + " / 22 characters";
});

courseHandler.Address.addEventListener("input", (e) => {
    courseHandler.counterAddress.innerText = e.target.value.length + " / 148 characters";
});

courseHandler.Phone.addEventListener("input", (e) => {
    courseHandler.counterPhone.innerText = e.target.value.length + " / 10 characters";
});

courseHandler.secondaryPhone.addEventListener("input", (e) => {
    courseHandler.counterSecondaryPhone.innerText = e.target.value.length + " / 10 characters";
});

//Update Details Required Modal Feild Validation
courseHandler.validateInputs = () => {
    window.electron.getCurrentUser((currentUser) => {
        // Reset previous validation messages
        courseHandler.validationUsername.style.display = "none";
        courseHandler.validationAddress.style.display = "none";
        courseHandler.validationPhone.style.display = "none";
        courseHandler.validationSecondaryPhone.style.display = "none";

        courseHandler.Username.classList.remove('invalid_edittext');
        courseHandler.Address.classList.remove('invalid_edittext');
        courseHandler.Phone.classList.remove('invalid_edittext');
        courseHandler.secondaryPhone.classList.remove('invalid_edittext');


        if (courseHandler.Username.value) {
            if (currentUser.user_name == courseHandler.Username.value || courseHandler.Username.value.length == 0) {
                return true;
            }
            else if (courseHandler.Username.value.length < 3) {
                courseHandler.setInputError('Please enter Valid Username', courseHandler.validationUsername, courseHandler.Username)
                return false;
            }
        }
        if (courseHandler.Phone.value) {
            if (currentUser.user_phone == courseHandler.Phone.value || courseHandler.Phone.value.length == 0) {
                return true;
            }
            else if (courseHandler.Phone.value.length < 10) {
                courseHandler.setInputError('Please enter valid phone number', courseHandler.validationPhone, courseHandler.Phone);
                return false;
            }
        }
        if (courseHandler.secondaryPhone.value) {
            if (currentUser.user_secondary_phone == courseHandler.secondaryPhone.value || courseHandler.secondaryPhone.value.length == 0) {
                return true;
            }
            else if (courseHandler.secondaryPhone.value.length < 10) {
                courseHandler.setInputError('Please enter valid secondary phone number', courseHandler.validationSecondaryPhone, courseHandler.secondaryPhone);
                return false;
            }
        }
        if (courseHandler.Address.value) {
            if (currentUser.user_address == courseHandler.Address.value || courseHandler.Address.value.length == 0) {
                return true;
            }
            else if (!/^[a-zA-Z0-9\s,.'-]+$/.test(courseHandler.Address.value)) {
                courseHandler.setInputError('Please enter Valid Address', courseHandler.validationAddress, courseHandler.Address)
                return false;
            }
        }

    });
    return true;
}
courseHandler.setInputError = (error, validationArea, invalid_USERNAME_PHONE_ADDRESS) => {
    validationArea.innerHTML = error;
    validationArea.style.display = 'block'
    invalid_USERNAME_PHONE_ADDRESS.classList.add('invalid_edittext')
}

//Update Details Required Button
courseHandler.btnUpdateDetails.addEventListener("click", (e) => {
    window.electron.getCurrentUser((currentUser) => {
        if (courseHandler.validateInputs()) {
            requestHelper.requestServer({
                requestPath: "userUpdateProfile.php", requestMethod: "POST", requestPostBody: {
                    user_email: currentUser.user_email,
                    user_name: courseHandler.Username.value,
                    user_phone: courseHandler.Phone.value,
                    user_secondary_phone: courseHandler.secondaryPhone.value,
                    user_address: courseHandler.Address.value,
                }
            }).then(response => response.json()).then(jsonResponse => {
                console.log(jsonResponse);
                if (jsonResponse.isTaskSuccess == 'true') {
                    //save into current app memory
                    window.electron.setCurrentUser(jsonResponse.userAccData);
                    courseHandler.containerAdditionalDetails.style.display = 'none';
                }
            }).catch(error => {
                console.log(error);
            });
        }
    });
});

//Tab click Handler
courseHandler.containerTabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
        //Remove Active Class from all tab
        courseHandler.containerTabs.forEach((tab) => {
            tab.classList.remove("active");
        })
        //add active class to selected tab only
        e.target.classList.add("active");

        //Clear the existing Demo Data
        courseHandler.containerDemoData.innerHTML = "";

        switch (e.target.innerHTML) {

            case "Videos":
                courseHandler.showDemoVideos()
                break;

            case "Audios":
                courseHandler.showDemoAudios()
                break;

            case "PDFs":
                courseHandler.showDemoPDFs()
                break;
        }
    });
});

courseHandler.showNoDemoContentFound = () => {
    const noContentFound = document.createElement("p");
    noContentFound.classList.add("title_secondary");
    noContentFound.classList.add("padding_2");
    noContentFound.innerText = "No Content Found Here"
    courseHandler.containerDemoData.appendChild(noContentFound)

}

courseHandler.showDemoVideos = () => {

    if (courseHandler.demoVideos.length > 0) {

        courseHandler.demoVideos.forEach(video => {

            const containerVideo = document.createElement("div");
            containerVideo.classList.add("container_content_item");

            //Image Of The Course
            const videoImage = document.createElement("img");
            videoImage.classList.add("content_item_image");
            videoImage.src = `http://img.youtube.com/vi/${video.vid_file}/0.jpg`;

            //container of video text
            const containerVideoInfo = document.createElement("div");
            containerVideoInfo.classList.add("container_content_item_info");

            //Video Title
            const videoTitle = document.createElement("p");
            videoTitle.classList.add("content_item_title");
            videoTitle.innerText = video.vid_name

            //Video Text
            const videoDescription = document.createElement("p");
            videoDescription.classList.add("margin_top");
            videoDescription.innerText = video.vid_desc

            //Adding text into video text container
            containerVideoInfo.appendChild(videoTitle)
            containerVideoInfo.appendChild(videoDescription)

            containerVideo.appendChild(videoImage);
            containerVideo.appendChild(containerVideoInfo);

            //Add Video To Container
            courseHandler.containerDemoData.appendChild(containerVideo);

            //click handler
            containerVideo.addEventListener("click", (e) => {
                window.location.href = `videoPlayer.html?${new URLSearchParams(video).toString()}`;
            })

        });
    }
    else
        courseHandler.showNoDemoContentFound()
}

courseHandler.showDemoPDFs = () => {
    if (courseHandler.demoPdfs.length > 0) {

        courseHandler.demoPdfs.forEach(pdf => {

            const containerPdf = document.createElement("div");
            containerPdf.classList.add("container_content_item");

            //Image Of The Course
            const pdfImage = document.createElement("img");
            pdfImage.classList.add("content_item_image");
            pdfImage.src = `../img/pdf.png`;

            //container of pdf text
            const containerPdfInfo = document.createElement("div");
            containerPdfInfo.classList.add("container_content_item_info");

            //pdf Title
            const pdfTitle = document.createElement("p");
            pdfTitle.classList.add("content_item_title");
            pdfTitle.innerText = pdf.pdf_name

            //pdf Text
            const pdfDescription = document.createElement("p");
            pdfDescription.classList.add("margin_top");
            pdfDescription.innerText = pdf.pdf_desc

            //Adding text into pdf text container
            containerPdfInfo.appendChild(pdfTitle)
            containerPdfInfo.appendChild(pdfDescription)

            containerPdf.appendChild(pdfImage);
            containerPdf.appendChild(containerPdfInfo);

            //Add pdf To Container
            courseHandler.containerDemoData.appendChild(containerPdf);

            //click handler
            containerPdf.addEventListener("click", (e) => {
                window.location.href = `pdfPlayer.html?${new URLSearchParams(pdf).toString()}`;
            })

        });
    }
    else
        courseHandler.showNoDemoContentFound()
}

courseHandler.showDemoAudios = () => {

    if (courseHandler.demoAudios.length > 0) {

        courseHandler.demoAudios.forEach(audio => {

            const containerAudio = document.createElement("div");
            containerAudio.classList.add("container_content_item");

            //Image Of The Course
            const audioImage = document.createElement("img");
            audioImage.classList.add("content_item_image");
            audioImage.src = `../img/audio.png`;

            //container of audio text
            const containerAudioInfo = document.createElement("div");
            containerAudioInfo.classList.add("container_content_item_info");

            //audio Title
            const audioTitle = document.createElement("p");
            audioTitle.classList.add("content_item_title");
            audioTitle.innerText = audio.aud_name

            //audio Text
            const audioDescription = document.createElement("p");
            audioDescription.classList.add("margin_top");
            audioDescription.innerText = audio.aud_desc

            //Adding text into audio text container
            containerAudioInfo.appendChild(audioTitle)
            containerAudioInfo.appendChild(audioDescription)

            containerAudio.appendChild(audioImage);
            containerAudio.appendChild(containerAudioInfo);

            //Add audio To Container
            courseHandler.containerDemoData.appendChild(containerAudio);

            //click handler
            containerAudio.addEventListener("click", (e) => {

            })

        });
    }
    else
        courseHandler.showNoDemoContentFound()

}

//Close Demo Window
courseHandler.btnCloseDemo.addEventListener("click", (e) => {
    courseHandler.containerDemo.style.left = '100vw'
});

//Set UserName From Storage Initially
window.electron.getCurrentUser((currentUser) => {
    requestHelper.requestServer({
        requestPath: "getStdAuth.php", requestMethod: "POST", requestPostBody: {
            user_email: currentUser.user_email,
            std_name: courseHandler.course.std_name,
            is_combo: courseHandler.course.combo_id
        }
    }).then(response => response.json()).then(jsonResponse => {
        //Check If Course Is Been Purchased By User
        courseHandler.course.isCoursePurchased = jsonResponse.isTaskSuccess == 'true';

        if (courseHandler.course.isCoursePurchased) {
            //User Has Already Purchased This Course
            courseHandler.showPurchaseInfo(jsonResponse.purchaseData);
            courseHandler.btnPurchaseCourse.innerHTML = "Download Receipt"
            courseHandler.btnPurchaseCourse.addEventListener("click", () => courseHandler.downloadPurchaseReceipt(jsonResponse.purchaseData[0].receipt));
            //If course is purchased then check for additional Information
            courseHandler.Username.value = currentUser.user_name;
            courseHandler.Branch.value = (!!currentUser.user_branch) ? currentUser.user_branch : 'Waghodia Road';
            courseHandler.Phone.value = currentUser.user_phone;
            courseHandler.secondaryPhone.value = currentUser.user_secondary_phone;
            courseHandler.Address.value = currentUser.user_address;

            courseHandler.containerUsername.style.display = (!!currentUser.user_name) ? 'none' : 'block';
            courseHandler.counterUserName.style.display = (!!currentUser.user_name) ? 'none' : 'block';
            courseHandler.containerBranch.style.display = (!!currentUser.user_branch) ? 'none' : (jsonResponse.purchaseData[0].study_mode == 'App' ? 'none' : 'flex');
            courseHandler.containerPhone.style.display = (!!currentUser.user_phone) ? 'none' : 'block';
            courseHandler.counterPhone.style.display = (!!currentUser.user_name) ? 'none' : 'block';
            courseHandler.containerSecondaryPhone.style.display = (!!currentUser.user_secondary_phone) ? 'none' : 'block';
            courseHandler.counterSecondaryPhone.style.display = (!!currentUser.user_name) ? 'none' : 'block';
            courseHandler.containerAddress.style.display = (!!currentUser.user_address) ? 'none' : 'block';
            courseHandler.counterAddress.style.display = (!!currentUser.user_name) ? 'none' : 'block';


            if (courseHandler.containerUsername.style.display == 'block' || courseHandler.containerBranch.style.display == 'block' ||
                courseHandler.containerPhone.style.display == 'block' || courseHandler.containerSecondaryPhone.style.display == 'block' ||
                courseHandler.containerAddress.style.display == 'block') {
                courseHandler.containerAdditionalDetails.style.display = 'block'
            }
        }
        else {
            //User Has Not Purchased This Course
            courseHandler.btnPurchaseCourse.innerHTML = "Purchase Course"
            courseHandler.btnPurchaseCourse.addEventListener("click", courseHandler.openPurchaseForm);
        }

        //Pass Parameter if Demo Button is needed To Show Or not
        courseHandler.loadSubjects()

    }).catch(error => {
        console.warn(error);
    })
});

//Get Subject List
courseHandler.loadSubjects = () => {

    requestHelper.requestServer({
        requestPath: "getSubs.php", requestMethod: "POST", requestPostBody: {
            std_name: courseHandler.course.std_name,
            combo_id: courseHandler.course.combo_id,
        }
    })
        .then(response => response.json()).then(jsonResponse => {
            if (jsonResponse.isTaskSuccess == 'true') {
                //Put In Global Varibale To Access Later
                courseHandler.subjectData = jsonResponse.subData;
                //Clear Current Subjects First
                courseHandler.containerSubjects.innerHTML = "";
                //Iterate through all subjects
                courseHandler.subjectData.forEach((subject) => {

                    //generate and add subject element to container
                    const divSubject = document.createElement("div");
                    divSubject.classList.add("card");
                    divSubject.classList.add("card_subject");

                    //container to hold info for subject
                    const divSubjectInfo = document.createElement("div");
                    divSubjectInfo.classList.add("container_subject_info")

                    //Image Of The subject
                    const imgSubject = document.createElement("img");
                    imgSubject.src = `${requestHelper.serverAddress}/thumbnails/${subject.sub_img}`;

                    //Subject Name
                    const subjectName = document.createElement("p");
                    subjectName.classList.add("text_normal");
                    subjectName.classList.add("margin_top");
                    subjectName.classList.add("margin_left");
                    subjectName.classList.add("margin_right");
                    subjectName.classList.add("bold");
                    subjectName.innerHTML = subject.sub_name;

                    //Subject Name
                    const subjectDescription = document.createElement("p");
                    subjectDescription.classList.add("margin_top");
                    subjectDescription.classList.add("margin_left");
                    subjectDescription.classList.add("margin_right");
                    subjectDescription.innerHTML = subject.sub_desc;

                    //Number Of Chapters
                    const chapters = document.createElement("p");
                    chapters.innerHTML = `${subject.chapCount} Chapters`;
                    chapters.classList.add("bold");
                    chapters.classList.add("margin_top");
                    chapters.classList.add("margin_left");
                    chapters.classList.add("margin_right");
                    chapters.classList.add("margin_bottom");
                    chapters.classList.add("chapters");

                    divSubjectInfo.appendChild(imgSubject);
                    divSubjectInfo.appendChild(subjectName);
                    divSubjectInfo.appendChild(subjectDescription);
                    divSubjectInfo.appendChild(chapters);
                    divSubjectInfo.addEventListener("click", e => {
                        subject.isCoursePurchased = courseHandler.course.isCoursePurchased
                        window.location.href = `subject.html?${new URLSearchParams(subject).toString()}`;
                    });

                    divSubject.appendChild(divSubjectInfo);

                    if (!courseHandler.course.isCoursePurchased) {

                        const divider = document.createElement("div");
                        divider.classList.add("divider");

                        const btnShowDemo = document.createElement("button");
                        btnShowDemo.innerHTML = `View Demo`;
                        btnShowDemo.classList.add("bold");
                        btnShowDemo.classList.add("btn_pink");
                        btnShowDemo.classList.add("btn_demo")

                        btnShowDemo.addEventListener("click", e => {
                            courseHandler.demoVideos = subject.demoVideos;
                            courseHandler.demoPdfs = subject.demoPdfs;
                            courseHandler.demoAudios = subject.demoAudios;
                            courseHandler.containerDemo.style.left = 0
                            //Load Demo Video Defaultly
                            courseHandler.containerTabs[0].click();
                        });

                        divSubject.appendChild(divider)
                        divSubject.appendChild(btnShowDemo)
                    }
                    //adding to list itself
                    courseHandler.containerSubjects.appendChild(divSubject);
                });
            }
            else
                throw new Error(jsonResponse.response_msg);
        }).catch(error => console.warn(error));
}

//show purchase info
courseHandler.showPurchaseInfo = (purchaseData) => {
    courseHandler.coursePurchaseInfo.style.display = 'block';
    courseHandler.coursePurchaseInfo.innerHTML = `Your Access To This Course is Valid From ${purchaseData[0].purchase_date} To ${purchaseData[0].expire_date}`;
}

//Start purchase Flow
courseHandler.openPurchaseForm = () =>
    window.location.href = `purchaseForm.html?${new URLSearchParams(courseHandler.course).toString()}`;


courseHandler.downloadPurchaseReceipt = (receipt) =>
    window.electron.downloadPurchaseReceipt(receipt);


