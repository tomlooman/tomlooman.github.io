

document.addEventListener("DOMContentLoaded", () => {
  const scroll = new SmoothScroll('a[href*="#"]', {
    speed: 400,
    offset: 80,
    speedAsDuration: true,
    durationMax: 500,
  });
});