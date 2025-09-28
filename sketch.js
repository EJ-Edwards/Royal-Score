// Make these globally accessible
window.cardPositions = [];
window.animatingCards = false;
window.animationProgress = 0;
window.cardImages = {};

let cardPositions = window.cardPositions;
let animatingCards = window.animatingCards;
let animationProgress = window.animationProgress;
let cardImages = window.cardImages;

function renderCards(cards) {
  if (!cards || !cards.length) return;
  
  // Create gradient background
  for (let i = 0; i <= height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color(0, 20, 0), color(0, 40, 20), inter);
    stroke(c);
    line(0, i, width, i);
  }
  
  let imgWidth = window.innerWidth < 700 ? Math.max(window.innerWidth * 0.12, 48) : 100;
  let spacing = window.innerWidth < 700 ? Math.max(window.innerWidth * 0.14, 56) : 120;
  let numCards = cards.length;
  let totalWidth = (numCards - 1) * spacing + imgWidth;
  let startX = (width - totalWidth) / 2;
  let y = window.innerHeight < 500 ? 24 : 100;

  // Initialize card positions for animation only when we have new cards
  if (window.cardPositions.length !== cards.length) {
    window.cardPositions = [];
    window.animatingCards = true;
    window.animationProgress = 0;
    for (let i = 0; i < cards.length; i++) {
      window.cardPositions.push({
        currentX: startX + i * spacing - 200, // Start from left side
        targetX: startX + i * spacing,
        currentY: y,
        targetY: y
      });
    }
  }

  // Animate cards sliding in
  if (window.animatingCards) {
    window.animationProgress += 0.12; // Faster animation
    if (window.animationProgress >= 1) {
      window.animatingCards = false;
      window.animationProgress = 1;
    }
  }

  cards.forEach((card, i) => {
    let pos = window.cardPositions[i];
    if (pos) {
      // Smooth animation using easing
      let easedProgress = window.animatingCards ? easeOutCubic(window.animationProgress) : 1;
      let currentX = lerp(pos.currentX, pos.targetX, easedProgress);
      
      // Add glow effect
      push();
      translate(currentX + imgWidth/2, pos.currentY + (imgWidth * 1.4)/2);
      
      // Glow effect
      drawingContext.shadowBlur = 15;
      drawingContext.shadowColor = 'rgba(255, 215, 0, 0.4)';
      
      // Load and display card image immediately
      if (!window.cardImages[card.code]) {
        loadImage(card.image, img => {
          window.cardImages[card.code] = img;
          // Redraw when image loads
          if (typeof renderCards === "function") {
            renderCards(cards);
          }
        });
        
        // Show placeholder while loading
        fill(100);
        stroke(255, 215, 0);
        strokeWeight(2);
        rect(-imgWidth/2, -(imgWidth * 1.4)/2, imgWidth, imgWidth * 1.4, 8);
        
        // Show card info
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(12);
        text(card.value, 0, -10);
        text(card.suit, 0, 10);
      } else {
        image(window.cardImages[card.code], -imgWidth/2, -(imgWidth * 1.4)/2, imgWidth, imgWidth * 1.4);
      }
      
      // Reset shadow
      drawingContext.shadowBlur = 0;
      pop();
    }
  });
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
let canvas;

function preload() {
}

function setup() {
  let w, h;
  
  if (window.innerWidth <= 700) {
    // Mobile: use more of the screen width and adjust height
    w = window.innerWidth * 0.95;
    h = window.innerHeight < 600 ? window.innerHeight * 0.25 : 300;
  } else {
    // Desktop
    w = 1000;
    h = 400;
  }
  
  canvas = createCanvas(w, h);
  canvas.parent('canvas-container');
  
  // Create gradient background initially
  for (let i = 0; i <= height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color(0, 20, 0), color(0, 40, 20), inter);
    stroke(c);
    line(0, i, width, i);
  }
}

function draw() {
  // Only redraw if we're animating cards
  if (window.animatingCards && typeof cards !== 'undefined' && cards && cards.length > 0) {
    renderCards(cards);
  }
}

function windowResized() {
  let w, h;
  
  if (window.innerWidth <= 700) {
    // Mobile: use more of the screen width and adjust height
    w = window.innerWidth * 0.95;
    h = window.innerHeight < 600 ? window.innerHeight * 0.25 : 300;
  } else {
    // Desktop
    w = 1000;
    h = 400;
  }
  
  resizeCanvas(w, h);
  
  // Reset card positions to recalculate for new size
  window.cardPositions = [];
  window.animatingCards = false;
  
  // Clear and redraw
  background(0);
  if (typeof renderCards === "function" && typeof cards !== 'undefined' && cards && cards.length) {
    renderCards(cards);
  }
}

