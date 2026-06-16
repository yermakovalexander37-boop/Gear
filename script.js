gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("sequence");
const context = canvas.getContext("2d");

const frameCount = 250; // поменять на свое количество кадров
const currentFrame = index =>
  `frames/frame_${String(index + 1).padStart(4, "0")}.jpg`;

const images = [];
const sequence = { frame: 0 };

const hotspots = [
  {
    frameStart: 128,
    frameEnd: 251,
    x: 0.820,
    y: 0.529,
    title: "Подшипниковый узел"
  },
  {
    frameStart: 120,
    frameEnd: 251,
    x: 0.220,
    y: 0.530,
    title: "Вал"
  }
];

canvas.width = 1000;
canvas.height = 1000;

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

images[0].onload = render;

gsap.to(sequence, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "bottom top",
    scrub: true,
    pin: ".viewer"
  },
  onUpdate: render
});

function render() {
  const frameIndex = Math.min(
    frameCount - 1,
    Math.max(0, Math.round(sequence.frame))
  );

  const img = images[frameIndex];

  if (!img || !img.complete || img.naturalWidth === 0) {
    console.warn("Frame not loaded:", frameIndex, currentFrame(frameIndex));
    return;
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(img, 0, 0, canvas.width, canvas.height);

  updateHotspots(frameIndex);
}

const hotspotLayer = document.getElementById("hotspots");

function updateHotspots(frameIndex) {
  hotspotLayer.innerHTML = "";

  hotspots.forEach(hotspot => {
    if (frameIndex >= hotspot.frameStart && frameIndex <= hotspot.frameEnd) {
      const el = document.createElement("div");
      el.className = "hotspot";
      el.style.left = `${hotspot.x * 100}%`;
      el.style.top = `${hotspot.y * 100}%`;
      el.textContent = hotspot.title;

      hotspotLayer.appendChild(el);
    }
  });
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();

  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;

  console.log({
    frame: sequence.frame,
    x: Number(x.toFixed(3)),
    y: Number(y.toFixed(3))
  });
});
