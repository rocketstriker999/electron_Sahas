import { requestHelper } from './helper.js';

let dashBoardHandler = {};
dashBoardHandler.loggedInUserEmail = null;

dashBoardHandler.userName = document.getElementById("USER_NAME");
dashBoardHandler.courseContainer = document.getElementById("CONTAINER_COURSES");
dashBoardHandler.btnLogOut = document.getElementById("BTN_LOG_OUT");
dashBoardHandler.btnProfileInfo = document.getElementById("BTN_PROFILE_INFO");
dashBoardHandler.containerTabs = document.querySelectorAll('.tab');
dashBoardHandler.carouselImages = document.getElementById('CAROUSEL_IMAGES');

//Tab click Handler
dashBoardHandler.containerTabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
        //Remove Active Class from all tab
        dashBoardHandler.containerTabs.forEach((tab) => {
            tab.classList.remove("active");
        })
        //add active class to selected tab only
        e.target.classList.add("active");

        switch (e.target.innerHTML) {

            case "All Courses":
                dashBoardHandler.fetchAllCourses()
                break;

            case "My Courses":
                dashBoardHandler.fetchMyCourses()
                break;
        }
    });
});

//Set UserName From Storage Initially
window.electron.getCurrentUser((currentUser) => {
    dashBoardHandler.userName.innerHTML = `Welcome ${currentUser.user_name}`;
    dashBoardHandler.loggedInUserEmail = currentUser.user_email


    //Set Carousel Images From API
    requestHelper.requestServer({
        requestPath: `getCaroUsels.php?user_email=${dashBoardHandler.loggedInUserEmail}&user_device=${requestHelper.getData("DEVICEID")}`, requestMethod: "GET"
    }).then(response => response.json()).then(jsonResponse => {
        if (jsonResponse.isTaskSuccess) {
            if (!jsonResponse.deviceverified) {
                const userChoice = window.confirm("Looks like you have logged into diffrent account.Do you want to raise the device reset request for this device ?");
                dashBoardHandler.courseContainer.style.display =  'none'
                if (userChoice) {
                    //raise device request
                    requestHelper.requestServer({
                        requestPath: "raiseDeviceResetRequest.php", requestMethod: "POST", requestPostBody: {
                            user_email: dashBoardHandler.loggedInUserEmail,
                        }
                    }).then(response => response.json()).then(jsonResponse => {

                        if (jsonResponse.isTaskSuccess == 'true') {
                            alert("Device Reset Request is raised , Kndly wait for 24-48 hours for admin to respond !")
                        }

                    });


                }

            }
            if (jsonResponse.caroUselData) {
                const data = jsonResponse.caroUselData;
                const slideContainer = dashBoardHandler.carouselImages;
                let slideContainerHtml = '';

                data.forEach((img, index) => {
                    slideContainerHtml += `
                    <div class="carousel_item ${index === 0 ? 'active' : ''}">
                        <img src="${requestHelper.serverAddress}/thumbnails/${img.carousel_img}">
                    </div>`;
                });

                slideContainer.innerHTML = slideContainerHtml;

                let currentSlide = 0;
                const slides = document.querySelectorAll('.carousel_item');
                const totalSlides = slides.length;

                const showSlide = (index) => {
                    slides.forEach((slide, i) => {
                        slide.classList.toggle('active', i === index);
                    });
                };

                const nextSlide = () => {
                    currentSlide = (currentSlide + 1) % totalSlides;
                    showSlide(currentSlide);
                };

                const prevSlide = () => {
                    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                    showSlide(currentSlide);
                };

                setInterval(nextSlide, 10000);

                window.nextSlide = nextSlide;
                window.prevSlide = prevSlide;
            }
        }
        else
            throw new Error(jsonResponse.response_msg);
    }).catch(error => console.warn(error));
});

//User Logout    
dashBoardHandler.btnLogOut.addEventListener("click", (e) => {
    //Logout user from electron window
    window.electron.logOutCurrentUser();
});



//Load All Courses
dashBoardHandler.fetchAllCourses = () => {

    //Set Carousel Images From API
    requestHelper.requestServer({
        requestPath: "getStds.php", requestMethod: "GET"
    })
        .then(response => response.json()).then(jsonResponse => {
            if (jsonResponse.isTaskSuccess == 'true') {
                //Display Courses
                dashBoardHandler.loadCourses(jsonResponse.stdData);
            }
            else
                throw new Error(jsonResponse.response_msg);
        }).catch(error => console.warn(error));

}

//Load My Courses
dashBoardHandler.fetchMyCourses = () => {

    //Fetch Courses From My Courses
    requestHelper.requestServer({
        requestPath: "getStds.php", requestMethod: "POST", requestPostBody: {
            user_email: dashBoardHandler.loggedInUserEmail,
        }
    })
        .then(response => response.json()).then(jsonResponse => {
            //Display Courses
            dashBoardHandler.loadCourses(jsonResponse.stdData);
        }).catch(error => console.warn(error));
}

dashBoardHandler.loadCourses = (coursesData) => {
    //Clear All Content from Container
    dashBoardHandler.courseContainer.innerHTML = "";

    if (coursesData && coursesData.length > 0) {
        coursesData.forEach(course => {
            //Card For Course
            const divCourse = document.createElement("div");
            divCourse.classList.add("card");
            divCourse.classList.add("card_course");

            //Image Of The Course
            const imgCourse = document.createElement("img");
            imgCourse.classList.add("course_img");
            imgCourse.src = `${requestHelper.serverAddress}/thumbnails/${course.std_image}`;

            const divCourseInfo = document.createElement("div");
            divCourseInfo.classList.add("padding_1")

            //Course Name
            const courseName = document.createElement("p");
            courseName.classList.add("text_normal");
            courseName.classList.add("bold");
            courseName.innerHTML = course.std_name;

            //Course Price
            const coursePrice = document.createElement("p");
            coursePrice.classList.add("course_price");
            coursePrice.classList.add("margin_top");
            course.coursePrice = Number(course.coursePrice);
            coursePrice.innerHTML = `${course.std_price} rs.`;

            //Course Number of Subject
            const courseSubjects = document.createElement("p");
            courseSubjects.classList.add("course_price");
            courseSubjects.classList.add("course_subjects");
            courseSubjects.classList.add("margin_top");
            courseSubjects.innerHTML = `<i class="fa fa-tag" aria-hidden="true"></i> ${course.sub_count}`;

            //Add Details To Course Info Div
            divCourseInfo.appendChild(courseName);
            divCourseInfo.appendChild(coursePrice);
            divCourseInfo.appendChild(courseSubjects);

            //Add Image To Course Card
            divCourse.appendChild(imgCourse);
            divCourse.appendChild(divCourseInfo);

            //click on div and redirect to course details
            divCourse.addEventListener("click", (e) => {
                //Redirect To Course Content Page
                window.location.href = `course.html?${new URLSearchParams(course).toString()}`;

            });

            //Add Card For Course In Container
            dashBoardHandler.courseContainer.appendChild(divCourse);
        });
    }
    else {
        dashBoardHandler.showNoCoursesFound()
    }
}

dashBoardHandler.showNoCoursesFound = () => {
    const noContentFound = document.createElement("p");
    noContentFound.classList.add("title_secondary");
    noContentFound.classList.add("padding_2");
    noContentFound.innerText = "No Content Found Here"
    dashBoardHandler.courseContainer.appendChild(noContentFound)
}

//Redirect to User Profile Info    
dashBoardHandler.btnProfileInfo.addEventListener("click", (e) => {
    window.location.href = 'profileInfo.html';
});

//Select All Courses Defaultly
dashBoardHandler.containerTabs[0].click();

//check device
