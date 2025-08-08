let canvas;
let cardImages = [];

function preload() {
}

function setup() {
  canvas = createCanvas(1000, 400);
  canvas.parent('canvas-container');
  background(0);
}

function renderCards(cards) {
  clear();
  background(0);

  let imgWidth = 100;
  let spacing = 120;
  let numCards = cards.length;
  let totalWidth = (numCards - 1) * spacing + imgWidth;
  let startX = (width - totalWidth) / 2;
  let y = 100;

  cards.forEach((card, i) => {
    loadImage(card.image, img => {
      image(img, startX + i * spacing, y, imgWidth, imgWidth * 1.4);
    });
  });
}