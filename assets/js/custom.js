

// Register before the theme's DOM-ready handler so clicks use the site's offset.
new SmoothScroll('a[href*="#"]', {
  speed: 400,
  offset: () => 80 + (parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0),
  speedAsDuration: true,
  durationMax: 500,
});
