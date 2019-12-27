
var slideIndex = 0;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

var timer = setInterval("plusSlides(1)", 7000);

function reset_timer(){
  clearInterval(timer);
  //timer = setInterval("plusSlides(1)", 5000);
  // users may now stop to read slides
}

function initialize_slides(){
  var i;
  var slides_container = document.getElementsByClassName("mySlides")[0];
  var slides = slides_container.getElementsByClassName("fade");
  for (i = 0; i < slides.length; ++i){
    slides[i].getElementsByClassName("numbertext")[0].innerHTML = (i + 1) + " / " + slides.length;
  }

  // var intro = document.getElementById("div-intro");
  // var slides = document.getElementById("div-slides");
  // slides.style.marginTop = (intro.clientHeight - slides.clientHeight) / 2 + 'px';

}

function showSlides(slideIndex) {
  var i;
  var slides_container = document.getElementsByClassName("mySlides")[0];
  var slides = slides_container.getElementsByClassName("fade");
  //var dots = document.getElementsByClassName("dot");
  slideIndex = slideIndex % slides.length;
  //if (n > slides.length) {slideIndex = 1}    
  //if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  //for (i = 0; i < dots.length; i++) {
  //    dots[i].className = dots[i].className.replace(" active", "");
  //}
  
  slides[slideIndex].style.display = "block";  

  var img_container = slides[slideIndex].getElementsByClassName("img-container")[0]
  var img = img_container.getElementsByTagName('img')[0]
  img.style.paddingTop =  (img_container.clientHeight - img.height) / 2 + 'px'
  img.style.paddingLeft =  (img_container.clientWidth - img.width) / 2 + 'px'
  //dots[slideIndex-1].className += " active";
}

$(document).ready(function() {
  initialize_slides();
  var _leftheight = $("#div-intro").height();
  var _rightheight = $("#div-slides").height();
  if (_leftheight > _rightheight) {
      $("#div-slides").height(_leftheight);
  } else {
      $("#div").height(_rightheight);
  }
});