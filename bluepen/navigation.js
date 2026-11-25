(() => {
  const nav = document.querySelector('.page-contents');
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links.map(link => ({link, target:document.querySelector(link.getAttribute('href'))}));
  document.querySelectorAll('.resource-placeholder').forEach(link => link.addEventListener('click',event => event.preventDefault()));
  let scheduled = false;
  function updateCurrent() {
    scheduled = false;
    const threshold = Math.max(100, nav.getBoundingClientRect().height + 24);
    let current = sections[0];
    for (const section of sections) {
      if(section.target && section.target.getBoundingClientRect().top <= threshold) current = section;
    }
    links.forEach(link => {
      if(link === current.link) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
  }
  function schedule() {if(!scheduled){scheduled=true;requestAnimationFrame(updateCurrent);}}
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  window.addEventListener('load',schedule);
  window.addEventListener('hashchange',schedule);
  updateCurrent();
})();
