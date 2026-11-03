
// Home page banner slideshow: fade to the next photo every 3 seconds
var bannerSlides = document.getElementsByClassName("banner-slide");
var bannerIndex = 0;

if (bannerSlides.length > 1) {
  setInterval(function () {
    bannerSlides[bannerIndex].classList.remove("active");
    bannerIndex = (bannerIndex + 1) % bannerSlides.length;
    bannerSlides[bannerIndex].classList.add("active");
  }, 3000);
}
