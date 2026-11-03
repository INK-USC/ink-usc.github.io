
// Home page banner slideshow: fade to the next photo every second
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

  // Biggest size that fits on one line, and on two balanced lines; use whichever is bigger.
  // Caps let the text fill the bar's full height: the whole black bar on wider screens,
  // the 40px strip under the logos on phones (line-height is 1, so size = line height).
  var barHeight = phone ? 40 : document.getElementById("header").offsetHeight;
  title.style.top = (phone ? 100 : barHeight / 2) + "px";
  var oneLine = largestFit("nowrap", barHeight - 4, phone ? 12 : 13, 1);
  var twoLines = largestFit("normal", (barHeight - 4) / 2, 11, 2);
  if (oneLine >= twoLines) {
    title.style.whiteSpace = "nowrap";
    title.style.fontSize = oneLine + "px";
  } else {
    title.style.whiteSpace = "normal";
    title.style.fontSize = twoLines + "px";
  }

  function largestFit(wrap, max, min, lines) {
    title.style.whiteSpace = wrap;
    for (var size = max; size >= min; size -= 0.5) {
      title.style.fontSize = size + "px";
      var lineHeight = parseFloat(getComputedStyle(title).lineHeight);
      // (+3px: scrollHeight rounds up, but a whole extra line would add ~lineHeight)
      if (title.scrollWidth <= title.clientWidth && title.scrollHeight <= lineHeight * lines + 3) return size;
    }
    return 0;
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
  }, 1000);
}
