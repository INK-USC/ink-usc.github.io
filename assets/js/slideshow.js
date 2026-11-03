
// Home page banner slideshow: fade to the next photo every 3 seconds
var bannerSlides = document.getElementsByClassName("banner-slide");
var bannerIndex = 0;

// Lab name in the black top bar: center it in the free space between the INK logo and the
// menu (or the USC logo when the menu is the ☰ button), as big as fits on one line
function fitHeaderTitle() {
  var title = document.querySelector("#header .header-title");
  if (!title) return;
  var phone = window.innerWidth <= 736;
  var left, right;
  if (phone) {
    // phones: the name has its own line under the logos
    left = 8;
    right = window.innerWidth - 8;
  } else {
    left = document.querySelector("#header .logo img").getBoundingClientRect().right + 16;
    var nav = document.getElementById("nav");
    if (getComputedStyle(nav).display != "none") {
      var link = nav.querySelector("a");
      right = link.getBoundingClientRect().left + parseFloat(getComputedStyle(link).paddingLeft) - 16;
    } else {
      right = document.querySelector(".usclogo").getBoundingClientRect().left - 16;
    }
  }
  var width = right - left;
  title.style.left = left + "px";
  title.style.width = width + "px";

  // Always one line, as big as fits the width (and no taller than the bar:
  // the whole black bar on wider screens, the 40px strip under the logos on phones)
  var barHeight = phone ? 40 : document.getElementById("header").offsetHeight;
  title.style.top = (phone ? 100 : barHeight / 2) + "px";
  title.style.whiteSpace = "nowrap";
  for (var size = barHeight - 4; size > 8; size -= 0.5) {
    title.style.fontSize = size + "px";
    if (title.scrollWidth <= title.clientWidth) break; // no overflow
  }
}

fitHeaderTitle();
window.addEventListener("resize", fitHeaderTitle);
if (window.ResizeObserver) new ResizeObserver(fitHeaderTitle).observe(document.getElementById("header"));
if (document.fonts) document.fonts.ready.then(fitHeaderTitle);

if (bannerSlides.length > 1) {
  setInterval(function () {
    bannerSlides[bannerIndex].classList.remove("active");
    bannerIndex = (bannerIndex + 1) % bannerSlides.length;
    bannerSlides[bannerIndex].classList.add("active");
  }, 3000);
}
