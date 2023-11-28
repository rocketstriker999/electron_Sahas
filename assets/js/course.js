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
courseHandler.btnCloseDemo = document.getElementById("BTN_CLOSE_DEMO");
courseHandler.containerDemoData = document.getElementById("CONTAINER_DEMO_DATA");



//extract and generate get object passed from dashboard
courseHandler.course = Object.fromEntries(new URLSearchParams(window.location.search));

//Set Image For Course
courseHandler.courseImage.src = `${requestHelper.serverAddress}/thumbnails/${courseHandler.course.std_image}`;
//set name
courseHandler.courseName.innerHTML = courseHandler.course.std_name;
courseHandler.courseDescription.innerHTML = courseHandler.course.std_desc;
courseHandler.courseSubjects.innerHTML = `${courseHandler.course.sub_count} Subjects`;

//Back Button Click
courseHandler.btnBack.addEventListener("click", (e) => {
    window.electron.back();
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

        switch(e.target.innerHTML){

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

courseHandler.showDemoVideos=()=>{

    

}

courseHandler.showDemoPDFs=()=>{
    console.log("PDF")

}

courseHandler.showDemoAudios=()=>{
    console.log("AUD")

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
        courseHandler.isCoursePurchased = jsonResponse.isTaskSuccess == 'true';

        if (courseHandler.isCoursePurchased) {
            //User Has Already Purchased This Course
            courseHandler.btnPurchaseCourse.style.display = "none"
            courseHandler.showPurchaseInfo(jsonResponse.purchaseData);
        }
        else {
            //User Has Not Purchased This Course
            courseHandler.btnPurchaseCourse.innerHTML = "Purchase Course"
            courseHandler.btnPurchaseCourse.addEventListener("click", courseHandler.startPurchaseFlow);
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
                //Load Subject List
                console.log(JSON.stringify(jsonResponse));
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

                    //Image Of The Course
                    const imgSubject = document.createElement("img");
                    imgSubject.src = `${requestHelper.serverAddress}/thumbnails/${subject.sub_img}`;

                    const divSubjectInfo = document.createElement("div");
                    divSubjectInfo.classList.add("padding_1");

                    //Subject Name
                    const subjectName = document.createElement("p");
                    subjectName.classList.add("text_normal");
                    subjectName.classList.add("bold");
                    subjectName.innerHTML = subject.sub_name;

                    //Subject Name
                    const subjectDescription = document.createElement("p");
                    subjectDescription.classList.add("margin_top");
                    subjectDescription.innerHTML = subject.sub_desc;

                    const divSubjectManager = document.createElement("div");
                    divSubjectManager.classList.add("margin_top");

                    const btnChapters = document.createElement("a");
                    btnChapters.innerHTML = `${subject.chapCount} Chapters`;
                    btnChapters.classList.add("bold");
                    btnChapters.classList.add("btn_chapters");

                    btnChapters.addEventListener("click", e => {
                        window.location.href = `subject.html?purchase=${courseHandler.isCoursePurchased}`;
                    });

                    const btnShowDemo = document.createElement("a");
                    btnShowDemo.innerHTML = `View Demo`;
                    btnShowDemo.classList.add("bold");
                    btnShowDemo.classList.add("btn_demo");

                    btnShowDemo.addEventListener("click", e => {
                        courseHandler.demoVideos=subject.demoVideos;
                        courseHandler.demoPdfs=subject.demoPdfs;
                        courseHandler.demoAudios=subject.demoAudios;
                        courseHandler.containerDemo.style.left = 0
                    });

                    divSubjectManager.appendChild(btnChapters)
                    divSubjectManager.appendChild(btnShowDemo)

                    divSubjectInfo.appendChild(subjectName);
                    divSubjectInfo.appendChild(subjectDescription);
                    divSubjectInfo.appendChild(divSubjectManager)

                    divSubject.appendChild(imgSubject);
                    divSubject.appendChild(divSubjectInfo);

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
courseHandler.startPurchaseFlow = () => {

}



