class Starfield {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouse = { x: this.width / 2, y: this.height / 2 };

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    // specific palette for "love/romantic" vibe (pinks, purples, soft blues)
    this.colors = ['#ff5ea8', '#7c5cff', '#4aaeff', '#ffffff'];

    this.createStars();
    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createStars() {
    const count = 150;
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        alpha: Math.random(),
        pulseSpeed: 0.02 + Math.random() * 0.02
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.stars.forEach(star => {
      // Move
      star.x += star.speedX;
      star.y += star.speedY;

      // Mouse interaction (gentle push)
      const dx = star.x - this.mouse.x;
      const dy = star.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        const force = (200 - dist) / 200;
        star.x += dx * force * 0.05;
        star.y += dy * force * 0.05;
      }

      // Wrap around screen
      if (star.x < 0) star.x = this.width;
      if (star.x > this.width) star.x = 0;
      if (star.y < 0) star.y = this.height;
      if (star.y > this.height) star.y = 0;

      // Twinkle
      star.alpha += star.pulseSpeed;
      if (star.alpha > 1 || star.alpha < 0.2) star.pulseSpeed *= -1;

      // Draw
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fillStyle = star.color;
      this.ctx.globalAlpha = Math.abs(star.alpha);
      this.ctx.fill();
    });

    // Draw connecting lines for nearby stars (constellations effect)
    this.ctx.globalAlpha = 0.15;
    this.ctx.strokeStyle = '#c9cbe7';
    this.ctx.lineWidth = 0.5;

    for (let i = 0; i < this.stars.length; i++) {
      for (let j = i + 1; j < this.stars.length; j++) {
        const dx = this.stars[i].x - this.stars[j].x;
        const dy = this.stars[i].y - this.stars[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.stars[i].x, this.stars[i].y);
          this.ctx.lineTo(this.stars[j].x, this.stars[j].y);
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// Typewriter
async function typeWriter(element, text, speed = 50) {
  element.textContent = '';
  element.classList.add('cursor');

  for (let i = 0; i < text.length; i++) {
    element.textContent += text.charAt(i);
    await new Promise(r => setTimeout(r, speed + Math.random() * 30));
  }

  element.classList.remove('cursor');
}

// Intersection Observer for Scrolls
const observerOptions = {
  threshold: 0.3
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Optional: stop observing once revealed? 
      // observer.unobserve(entry.target); 
      // Use this only if you want it to trigger once. 
      // Leaving it keeps it triggering if they scroll back up/down which feels responsive.
    }
  });
}, observerOptions);


document.addEventListener('DOMContentLoaded', async () => {
  // 1. Background
  new Starfield('bg-canvas');

  // 2. Start Intro Animation Sequence
  const eyebrow = document.querySelector('.eyebrow');
  eyebrow.classList.add('visible');

  await new Promise(r => setTimeout(r, 800));

  document.querySelector('h1').classList.remove('hidden');

  const line1 = document.querySelector('.typewriter:nth-child(1)');
  await typeWriter(line1, line1.dataset.text);

  await new Promise(r => setTimeout(r, 200));
  const line2 = document.querySelector('.typewriter:nth-child(3)');
  await typeWriter(line2, line2.dataset.text);

  // Show scroll hint
  document.querySelector('.scroll-hint').classList.add('visible');

  // 3. Observe all other fade-in elements for scroll
  document.querySelectorAll('.fade-in').forEach(el => {
    // Skip the ones we already handled manually if needed, or just let observer handle subsequent viewings
    if (!el.classList.contains('eyebrow')) {
      observer.observe(el);
    }
  });
});
