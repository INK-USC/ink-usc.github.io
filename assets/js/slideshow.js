
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  var i;
  var slides_container = document.getElementsByClassName("mySlides")[0];
  var slides = slides_container.getElementsByClassName("fade");
  //var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
  }
  //for (i = 0; i < dots.length; i++) {
  //    dots[i].className = dots[i].className.replace(" active", "");
  //}
  
  slides[slideIndex-1].style.display = "block";  

  var img_container = slides[slideIndex-1].getElementsByClassName("img-container")[0]
  var img = img_container.getElementsByTagName('img')[0]
  img.style.paddingTop =  (img_container.clientHeight - img.height) / 2 + 'px'

  //dots[slideIndex-1].className += " active";
}

