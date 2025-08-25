function renderCards(cards) {
  if (!cards || !cards.length) return;
  background(0);
  let imgWidth = window.innerWidth < 700 ? Math.max(window.innerWidth * 0.12, 48) : 100;
  let spacing = window.innerWidth < 700 ? Math.max(window.innerWidth * 0.14, 56) : 120;
  let numCards = cards.length;
  let totalWidth = (numCards - 1) * spacing + imgWidth;
  let startX = (width - totalWidth) / 2;
  let y = window.innerHeight < 500 ? 24 : 100;

  cards.forEach((card, i) => {
    loadImage(card.image, img => {
      image(img, startX + i * spacing, y, imgWidth, imgWidth * 1.4);
    });
  });
}
let canvas;
let cardImages = [];

function preload() {
}

function setup() {
  let w = window.innerWidth < 700 ? window.innerWidth * 0.95 : 1000;
  let h = window.innerHeight < 500 ? window.innerHeight * 0.32 : 400;
  canvas = createCanvas(w, h);
  canvas.parent('canvas-container');
  background(0);
}

function windowResized() {
  let w = window.innerWidth < 700 ? window.innerWidth * 0.95 : 1000;
  let h = window.innerHeight < 500 ? window.innerHeight * 0.32 : 400;
  resizeCanvas(w, h);
  background(0);
  if (typeof renderCards === "function" && cards && cards.length) {
    renderCards(cards);
  }
}

