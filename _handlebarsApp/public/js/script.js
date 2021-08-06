document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("hangout JS imported successfully!");
  },
  false
);

//BURGER BUTTON FUNCTION
var burgerButton = document.getElementById("clickBurger");
var sideBar = document.getElementById("hiddenNav");
if(burgerButton){
  burgerButton.addEventListener("click", () => {
      if (sideBar.style.display === "block") {
        sideBar.style.display = "none";
      } else {
      sideBar.style.display = "block";
      }
  })
}


//SLIDESHOW FUNCTION
let slideIndex = 0;
let frameId = 0;
showSlides();

function showSlides() {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  if(frameId % 300 === 0) slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex-1].style.display = "block";
  frameId = requestAnimationFrame(showSlides);
}


/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "200px";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}