let dashBoardHandler = {};

dashBoardHandler.allCoursesRadio = document.getElementById('allCoursesRadio');
dashBoardHandler.myCoursesRadio = document.getElementById('myCoursesRadio');
dashBoardHandler.myCoursesRadioData = document.getElementById('myCoursesRadioData');
dashBoardHandler.allCoursesData = document.getElementById('allCoursesData')

let slideIndex = 1;

document.getElementById('prevs').addEventListener('click', () => {
  plusSlides(-1);
});
document.getElementById('nexts').addEventListener('click', () => {
  plusSlides(1);
});
document.getElementById('currentSlide(1)').addEventListener('click', () => {
  currentSlide(1);
});
document.getElementById('currentSlide(2)').addEventListener('click', () => {
  currentSlide(2);
});
document.getElementById('currentSlide(3)').addEventListener('click', () => {
  currentSlide(3);
});

showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}


function showSlides(n) {
  let i;
  const slides = document.getElementsByClassName("mySlides");
  const dots = document.getElementsByClassName("dot");

  if (n > slides.length) {
    slideIndex = 1;
  }

  if (n < 1) {
    slideIndex = slides.length;
  }

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

// Auto slide change
setInterval(() => {
  plusSlides(1);
}, 5000); // Change slide every 5 seconds


dashBoardHandler.allCoursesRadio.addEventListener('click', () => {
  showData(allCoursesRadio);
});

dashBoardHandler.myCoursesRadio.addEventListener('click', () => {
  showData(myCoursesRadio);
});
function showData(category) {

  if(category == allCoursesRadio){
    dashBoardHandler.myCoursesRadioData.style.display = "none"
    dashBoardHandler.allCoursesData.style.display = "block"
  }

  else if(category == myCoursesRadio){
    dashBoardHandler.myCoursesRadioData.style.display = "block"
    dashBoardHandler.allCoursesData.style.display = "none"
  }

}

