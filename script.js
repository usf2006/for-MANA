/* ============================================
   MESHMESHA – Interactive Story Engine
   ============================================ */

(function () {
  'use strict';

  /* ---------- Story Data ---------- */
  const STORY_STEPS = [
    {
      text: "Meow… My name is Meshmesha 🐱 and I have a story about someone really special...",
      image: "idle",
      blur: false,
    },
    {
      text: "Not so long ago… in a place that felt pretty normal…",
      image: "curious",
      blur: true,
    },
    {
      text: "There was a cat who was really special in her own way… she was born in Nasr City",
      image: "happy",
      blur: true,
    },
    {
      text: "She grew up… and became someone everyone enjoyed being around…",
      image: "walking",
      blur: false,
    },
    {
      text: "Until 2020… when she met… someone a bit annoying at first 😅",
      image: "shy",
      blur: false,
    },
    {
      text: "They didn’t talk often… but they still made some really nice memories together…",
      image: "happy",
      blur: false,
    },
    {
      text: " But life got busy… and they slowly stopped talking for a while…",
      image: "sad",
      blur: true,
    },
    {
      text: "And after a while… they found their way back… and started talking every day again… like they never stopped…",
      image: "walking",
      blur: false,
    },
    {
      text: "And today… is not just any day… it’s a special one…",
      image: "curious",
      blur: false,
    },
    {
      text: "Because Meshmesha… was never just a cat… it was always about you…",
      image: "shy",
      blur: false,
      fadeTransition: true,
    },
  ];

  const TOTAL_STEPS = STORY_STEPS.length;

  /* ---------- State ---------- */
  let currentStep = 0;
  let isTyping = false;
  let typingTimeout = null;
  let musicPlaying = false;

  /* ---------- DOM References ---------- */
  const catImg = document.getElementById('cat-image');
  const storyText = document.getElementById('story-text');
  const catWrapper = document.getElementById('cat-wrapper');
  const storyCard = document.getElementById('story-card');
  const storySection = document.getElementById('story-section');
  const revealSection = document.getElementById('reveal-section');
  const fadeOverlay = document.getElementById('fade-overlay');
  const tapHint = document.getElementById('tap-hint');
  const stepDots = document.getElementById('step-dots');
  const musicBtn = document.getElementById('music-btn');
  const loveBtn = document.getElementById('love-btn');
  const loveResponse = document.getElementById('love-response');

  /* ---------- Preload Images ---------- */
  const imageCache = {};
  const CAT_POSES = ['idle', 'happy', 'curious', 'shy', 'sad', 'walking', 'sleeping'];

  function preloadImages() {
    CAT_POSES.forEach((pose) => {
      const img = new Image();
      img.src = `assets/meshmesha/${pose}.png`;
      imageCache[pose] = img;
    });
    // Also preload Mana.jpg
    const manaImg = new Image();
    manaImg.src = 'assets/MANA.jpg';
    imageCache['mana'] = manaImg;
  }

  /* ---------- Step Dots ---------- */
  function createStepDots() {
    stepDots.innerHTML = '';
    for (let i = 0; i < TOTAL_STEPS; i++) {
      const dot = document.createElement('div');
      dot.classList.add('step-dot');
      if (i === 0) dot.classList.add('active');
      stepDots.appendChild(dot);
    }
  }

  function updateStepDots() {
    const dots = stepDots.querySelectorAll('.step-dot');
    dots.forEach((dot, i) => {
      dot.classList.remove('active', 'completed');
      if (i === currentStep) {
        dot.classList.add('active');
      } else if (i < currentStep) {
        dot.classList.add('completed');
      }
    });
  }

  /* ---------- Typing Effect ---------- */
  function typeText(text, callback) {
    isTyping = true;
    storyText.textContent = '';
    storyText.classList.add('typing-cursor');
    let i = 0;

    function typeChar() {
      if (i < text.length) {
        storyText.textContent += text[i];
        i++;
        typingTimeout = setTimeout(typeChar, 40 + Math.random() * 25);
      } else {
        isTyping = false;
        storyText.classList.remove('typing-cursor');
        if (callback) callback();
      }
    }

    typeChar();
  }

  function skipTyping(text) {
    clearTimeout(typingTimeout);
    isTyping = false;
    storyText.classList.remove('typing-cursor');
    storyText.textContent = text;
  }

  /* ---------- Change Cat Image ---------- */
  function setCatImage(pose) {
    catImg.style.opacity = '0';
    setTimeout(() => {
      catImg.src = `assets/meshmesha/${pose}.png`;
      catImg.alt = `Meshmesha – ${pose}`;
      catImg.style.opacity = '1';
    }, 200);
  }

  /* ---------- Bounce Animation ---------- */
  function bounceCat() {
    catImg.classList.remove('bounce');
    // Trigger reflow
    void catImg.offsetWidth;
    catImg.classList.add('bounce');
  }

  /* ---------- Meow Sound ---------- */
  function playMeow() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.08);
      osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // Audio not available – silent fallback
    }
  }

  /* ---------- Confetti ---------- */
  function launchConfetti() {
    const colors = ['#fb6f92', '#ff8fab', '#ffb3c6', '#ffd6e0', '#ffc09f', '#ffee93', '#a0ced9', '#fcf5c7'];
    const shapes = ['circle', 'rect'];

    for (let i = 0; i < 80; i++) {
      const piece = document.createElement('div');
      piece.classList.add('confetti-piece');

      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = 6 + Math.random() * 8;

      piece.style.width = size + 'px';
      piece.style.height = shape === 'circle' ? size + 'px' : size * 1.6 + 'px';
      piece.style.borderRadius = shape === 'circle' ? '50%' : '2px';
      piece.style.background = color;
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.top = '-20px';
      piece.style.animationDuration = (2 + Math.random() * 3) + 's';
      piece.style.animationDelay = Math.random() * 1.5 + 's';

      document.body.appendChild(piece);

      setTimeout(() => piece.remove(), 6000);
    }
  }

  /* ---------- Floating Hearts ---------- */
  function launchFloatingHearts() {
    const hearts = ['❤️', '💕', '💗', '💖', '🩷', '💘'];
    let count = 0;

    function spawnHeart() {
      if (count >= 25) return;
      const heart = document.createElement('div');
      heart.classList.add('floating-heart');
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.left = (10 + Math.random() * 80) + 'vw';
      heart.style.bottom = '-30px';
      heart.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
      heart.style.animationDuration = (3 + Math.random() * 3) + 's';

      document.body.appendChild(heart);
      count++;

      setTimeout(() => heart.remove(), 7000);
      setTimeout(spawnHeart, 200 + Math.random() * 400);
    }

    spawnHeart();
  }

  /* ---------- Background Particles ---------- */
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = 1 + Math.random() * 3;
        this.speedY = -(0.2 + Math.random() * 0.5);
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = 0.1 + Math.random() * 0.3;
        this.color = Math.random() > 0.5 ? '251,111,146' : '255,179,198';
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (this.y < -10) { this.reset(); this.y = canvas.height + 10; }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
        ctx.fill();
      }
    }

    function init() {
      resize();
      particles = [];
      const count = Math.min(50, Math.floor((canvas.width * canvas.height) / 15000));
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => { p.update(); p.draw(); });
      animId = requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animId);
      init();
      animate();
    });

    init();
    animate();
  }

  /* ---------- Show the Final Reveal ---------- */
  function showFinalReveal() {
    // Fade overlay
    fadeOverlay.classList.add('active');

    setTimeout(() => {
      // Hide story section
      storySection.style.display = 'none';

      // Show reveal
      revealSection.classList.add('show');

      // Remove overlay
      fadeOverlay.classList.remove('active');

      // Celebration effects
      setTimeout(() => {
        launchConfetti();
        launchFloatingHearts();
      }, 600);

      // Another burst of confetti after a moment
      setTimeout(() => {
        launchConfetti();
      }, 3000);
    }, 900);
  }

  /* ---------- Go to Step ---------- */
  function goToStep(step) {
    if (step >= TOTAL_STEPS) {
      // Final reveal
      showFinalReveal();
      return;
    }

    const data = STORY_STEPS[step];
    currentStep = step;

    // Update cat image
    setCatImage(data.image);
    bounceCat();

    // Play meow
    playMeow();

    // Blur effect
    if (data.blur) {
      storyCard.classList.add('blurred-bg');
    } else {
      storyCard.classList.remove('blurred-bg');
    }

    // Type text
    if (isTyping) {
      skipTyping(STORY_STEPS[currentStep - 1]?.text || '');
    }

    // Small delay for image swap
    setTimeout(() => {
      typeText(data.text);
    }, 250);

    // Update dots
    updateStepDots();

    // Fade transition for plot twist step
    if (data.fadeTransition) {
      // Will trigger final on next click
    }
  }

  /* ---------- Handle Cat Click ---------- */
  function handleCatClick() {
    if (isTyping) {
      // Skip current typing
      skipTyping(STORY_STEPS[currentStep].text);
      return;
    }

    const nextStep = currentStep + 1;
    goToStep(nextStep);
  }

  /* ---------- Music Toggle ---------- */
  let bgMusic = null;
  let bgAudioCtx = null;

  function createBgMusic() {
    try {
      bgAudioCtx = new (window.AudioContext || window.webkitAudioContext)();

      function playNote(freq, startTime, duration) {
        const osc = bgAudioCtx.createOscillator();
        const gain = bgAudioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.06, startTime + 0.05);
        gain.gain.linearRampToValueAtTime(0.04, startTime + duration * 0.7);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);
        osc.connect(gain);
        gain.connect(bgAudioCtx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      }

      // Simple romantic melody loop
      const melody = [
        523.25, 587.33, 659.25, 698.46, 783.99, 698.46, 659.25, 587.33,
        523.25, 493.88, 440.00, 493.88, 523.25, 587.33, 523.25, 440.00
      ];
      const noteLen = 0.45;
      const totalLen = melody.length * noteLen;

      function playLoop() {
        if (!musicPlaying) return;
        const now = bgAudioCtx.currentTime;
        melody.forEach((freq, i) => {
          playNote(freq, now + i * noteLen, noteLen * 0.9);
        });
        setTimeout(playLoop, totalLen * 1000);
      }

      playLoop();
    } catch (e) {
      // Audio not available
    }
  }

  function toggleMusic() {
    musicPlaying = !musicPlaying;

    if (musicPlaying) {
      musicBtn.classList.add('playing');
      musicBtn.textContent = '🎵';
      createBgMusic();
    } else {
      musicBtn.classList.remove('playing');
      musicBtn.textContent = '🔇';
      if (bgAudioCtx) {
        bgAudioCtx.close();
        bgAudioCtx = null;
      }
    }
  }

  /* ---------- Love Button ---------- */
  function handleLoveClick() {
    loveBtn.style.display = 'none';
    loveResponse.classList.add('show');
    launchConfetti();
    launchFloatingHearts();
    playMeow();
  }

  /* ---------- Init ---------- */
  function init() {
    preloadImages();
    createStepDots();
    initParticles();

    // Set initial step
    goToStep(0);

    // Event listeners
    catWrapper.addEventListener('click', handleCatClick);
    catWrapper.addEventListener('touchend', (e) => {
      e.preventDefault();
      handleCatClick();
    });

    musicBtn.addEventListener('click', toggleMusic);
    loveBtn.addEventListener('click', handleLoveClick);
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
