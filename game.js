import * as THREE from "three";

const overlay = document.getElementById("overlay");
const titleEl = document.getElementById("title");
const messageEl = document.getElementById("message");
const startButton = document.getElementById("start-button");
const initialsWrap = document.getElementById("initials-wrap");
const initialsInput = document.getElementById("initials-input");
const healthEl = document.getElementById("health");
const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const multiplierEl = document.getElementById("multiplier");
const timerEl = document.getElementById("timer");
const weaponEl = document.getElementById("weapon");
const crowdEl = document.getElementById("crowd");
const musicStatusEl = document.getElementById("music-status");
const healthFillEl = document.getElementById("health-fill");
const comboFillEl = document.getElementById("combo-fill");
const furyFillEl = document.getElementById("fury-fill");
const furyStatusEl = document.getElementById("fury-status");
const leaderboardEl = document.getElementById("leaderboard");
const feedList = document.getElementById("feed-list");
const announcerEl = document.getElementById("announcer");
const impactFlashEl = document.getElementById("impact-flash");
const adTitleEls = [
  document.getElementById("ad-title-1"),
  document.getElementById("ad-title-2"),
  document.getElementById("ad-title-3"),
  document.getElementById("ad-title-4"),
];
const adCopyEls = [
  document.getElementById("ad-copy-1"),
  document.getElementById("ad-copy-2"),
  document.getElementById("ad-copy-3"),
  document.getElementById("ad-copy-4"),
];
const touchButtons = document.querySelectorAll("[data-control]");

const LEADERBOARD_KEY = "maczeta-life-ranking-v1";
const LEADERBOARD_LIMIT = 8;
const ENEMY_TARGET_COUNT = 5;
const MAP_HALF = 34;
const PLAYER_MAX_HEALTH = 180;
const ENEMY_MAX_HEALTH = 55;
const PLAYER_EYE_HEIGHT = 1.68;
const ATTACK_FLASH_TIME = 0.12;
const RESPAWN_DELAY = 2.4;
const MOUSE_SENSITIVITY = 0.0023;
const MAX_PITCH = 1.05;
const PLAYER_DAMAGE_MULTIPLIER = 1.2;
const ENEMY_DAMAGE_MULTIPLIER = 0.18;
const PLAYER_HIT_HEAL = 8;
const PLAYER_KILL_HEAL = 40;
const PLAYER_REGEN_DELAY = 2.6;
const PLAYER_REGEN_RATE = 8;
const DASH_SPEED = 19;
const DASH_DURATION = 0.13;
const DASH_COOLDOWN = 1.05;
const COMBO_DECAY_TIME = 4.2;
const FURY_CHARGE_PER_HIT = 10;
const FURY_CHARGE_PER_KILL = 28;
const FURY_DURATION = 8;
const PICKUP_LIFETIME = 12;
const MAX_ENEMY_PLAYER_FOCUS = 2;
const HITSTOP_DURATION = 0.08;
const FINISHER_THRESHOLD = 0.25;
const KILL_SPEED_BOOST = 1.35;
const KILL_SPEED_BOOST_DURATION = 1.2;

const aiNames = [
  "Basia z Nowej Huty",
  "Halina Krakowianka",
  "Grażyna spod Jubilata",
  "Bożena z Azorów",
  "Krysia od Zapiekanek",
  "Jolanta z Kurdwanowa",
  "Danuta z Krowodrzy",
  "Elka z Podgórza",
  "Wiola od Obwarzanków",
  "Andżela spod Wisły",
  "Marlena z Bieńczyc",
  "Teśka Floriańska",
  "Wiesia z Bronowic",
  "Sabina spod Smoka",
  "Renata z Mistrzejowic",
  "Danka z Czyżyn",
];

const outfitPalettes = [
  { blouse: 0xe6ddd1, vest: 0x3a2622, skirt: 0x5a332f, apron: 0xeadfd0, trim: 0xa12d2b, sash: 0x7d332f },
  { blouse: 0xe1d7c9, vest: 0x2c2324, skirt: 0x6a3c35, apron: 0xe9ddcf, trim: 0x8f2d29, sash: 0x6d302b },
  { blouse: 0xe8dfd2, vest: 0x352a28, skirt: 0x53312d, apron: 0xefe4d5, trim: 0xb13e38, sash: 0x7b3f38 },
  { blouse: 0xe4d9cb, vest: 0x302626, skirt: 0x674039, apron: 0xecdfd1, trim: 0x993630, sash: 0x6b352f },
];

const weapons = [
  { name: "Maczeta", instrumental: "maczetą", damage: 19, heavy: 34, reach: 2.25, score: 150, color: 0xbac1cb, blade: "blade" },
  { name: "Nóż", instrumental: "nożem", damage: 14, heavy: 24, reach: 1.8, score: 120, color: 0xd9dde2, blade: "knife" },
  { name: "Tasak", instrumental: "tasakiem", damage: 20, heavy: 36, reach: 2.05, score: 155, color: 0xb4bccc, blade: "cleaver" },
  { name: "Baton", instrumental: "batonem", damage: 12, heavy: 23, reach: 2.0, score: 110, color: 0x2e2f34, blade: "club" },
  { name: "Łom", instrumental: "łomem", damage: 17, heavy: 30, reach: 2.15, score: 140, color: 0xb04d45, blade: "bar" },
  { name: "Rura", instrumental: "rurą", damage: 16, heavy: 28, reach: 2.2, score: 132, color: 0x929ba6, blade: "pipe" },
  { name: "Saperka", instrumental: "saperką", damage: 19, heavy: 32, reach: 2.05, score: 148, color: 0x7d8570, blade: "shovel" },
  { name: "Kij", instrumental: "kijem", damage: 15, heavy: 26, reach: 2.35, score: 126, color: 0x8d6745, blade: "stick" },
];

const music = new Audio("./assets/maczeta-life-theme.mp3");
music.loop = true;
music.volume = 0.24;
music.preload = "auto";

const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

const VOICE_LINES = {
  start: ["./assets/voice/start-1.mp3", "./assets/voice/start-2.mp3", "./assets/voice/start-3.mp3"],
  hurt: ["./assets/voice/hurt-1.mp3", "./assets/voice/hurt-2.mp3", "./assets/voice/hurt-3.mp3", "./assets/voice/hurt-4.mp3"],
  kill: ["./assets/voice/kill-1.mp3", "./assets/voice/kill-2.mp3", "./assets/voice/kill-3.mp3", "./assets/voice/kill-4.mp3", "./assets/voice/kill-5.mp3", "./assets/voice/kill-6.mp3", "./assets/voice/kill-7.mp3", "./assets/voice/kill-8.mp3", "./assets/voice/kill-9.mp3", "./assets/voice/kill-10.mp3"],
  death: ["./assets/voice/death-1.mp3", "./assets/voice/death-2.mp3", "./assets/voice/death-3.mp3"],
  pickup: ["./assets/voice/pickup-1.mp3", "./assets/voice/pickup-2.mp3"],
  miss: ["./assets/voice/miss-1.mp3", "./assets/voice/miss-2.mp3", "./assets/voice/miss-3.mp3"],
  streak: ["./assets/voice/streak-1.mp3", "./assets/voice/streak-2.mp3", "./assets/voice/streak-3.mp3", "./assets/voice/streak-4.mp3", "./assets/voice/streak-5.mp3"],
  fury: ["./assets/voice/fury-1.mp3", "./assets/voice/fury-2.mp3", "./assets/voice/fury-3.mp3"],
  finisher: ["./assets/voice/finisher-1.mp3", "./assets/voice/finisher-2.mp3", "./assets/voice/finisher-3.mp3"],
  weapon: ["./assets/voice/weapon-1.mp3", "./assets/voice/weapon-2.mp3", "./assets/voice/weapon-3.mp3"],
  lowhealth: ["./assets/voice/lowhealth-1.mp3", "./assets/voice/lowhealth-2.mp3", "./assets/voice/lowhealth-3.mp3"],
  dash: ["./assets/voice/dash-1.mp3"],
  taunt: ["./assets/voice/taunt-1.mp3", "./assets/voice/taunt-2.mp3", "./assets/voice/taunt-3.mp3", "./assets/voice/taunt-4.mp3", "./assets/voice/taunt-5.mp3"],
};

const adCampaigns = [
  {
    title: "OBWAR-BANK",
    copy: "Pożyczka na żelazo, haft i szybki powrót na plac. RRSO mniej groźne niż Grażyna.",
  },
  {
    title: "MLECZNY BOOST",
    copy: "Pierogi regeneracyjne. Zjedz trzy, odzyskaj fason i nie pytaj o sos.",
  },
  {
    title: "KOMINIARY.EXE",
    copy: "Haftowane maski premium. Otwory na oczy wycięte z dumą i precyzją.",
  },
  {
    title: "NOWA HUTA FM",
    copy: "Słuchaj plotek, gróźb i osiedlowych hitów bez reklam. No dobra, prawie bez.",
  },
  {
    title: "KRAK-POL STAL",
    copy: "Blachy, tasaki, saperki. Hurt, detal i odbiór własny po zmroku.",
  },
  {
    title: "WIANEK MAX",
    copy: "Kwiaty świeższe niż twoja seria. Wyglądaj godnie nawet po zadymie.",
  },
  {
    title: "BULWAR ENERGY",
    copy: "Napój o smaku Wisły, buntu i przesadnej pewności siebie.",
  },
  {
    title: "AZORY MOBILE",
    copy: "Internet szybki jak dash. Zasięg nawet wtedy, gdy wszyscy uciekają.",
  },
];

const voiceState = {
  enabled: true,
  cooldown: 0,
  cache: new Map(),
  missing: new Set(),
};

const scene = new THREE.Scene();
scene.background = buildSkyTexture();
scene.fog = new THREE.FogExp2(0xc5d8ec, 0.0065);

const camera = new THREE.PerspectiveCamera(
  76,
  window.innerWidth / window.innerHeight,
  0.1,
  280
);
camera.rotation.order = "YXZ";
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
document.body.appendChild(renderer.domElement);

const clock = new THREE.Clock();
const world = new THREE.Group();
scene.add(world);

const cameraLight = new THREE.PointLight(0xffd2b3, 0.65, 12);
cameraLight.position.set(0.2, 0.1, -0.8);
camera.add(cameraLight);

const fighters = [];
const enemies = [];
const particles = [];
const pickups = [];
const feedItems = [];
const viewOffset = new THREE.Vector3();
const cameraPosition = new THREE.Vector3();
const forwardVector = new THREE.Vector3();
const rightVector = new THREE.Vector3();
const scratch = new THREE.Vector3();
const scratch2 = new THREE.Vector3();

const input = {
  up: false,
  down: false,
  left: false,
  right: false,
  sprint: false,
  attackQueued: false,
  heavyQueued: false,
  dashQueued: false,
};

const state = {
  running: false,
  gameOver: false,
  score: 0,
  streak: 0,
  time: 0,
  savedCurrentScore: false,
  pointerLocked: false,
  comboTimer: 0,
  comboCount: 0,
  comboMultiplier: 1,
  furyCharge: 0,
  furyTime: 0,
  announcerTimer: 0,
  flashTimer: 0,
  adTimer: 0,
  hitstop: 0,
  killSpeedBoost: 0,
};

const hemi = new THREE.HemisphereLight(0xf8fbff, 0x8f8a82, 2.15);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xfff0cf, 3.3);
sun.position.set(12, 22, -6);
scene.add(sun);

const rim = new THREE.DirectionalLight(0x7db4ea, 1.1);
rim.position.set(-10, 12, 18);
scene.add(rim);

const balaclavaTexture = buildBalaclavaTexture();

createCity();

const player = createPlayer();
fighters.push(player);
world.add(player.group);

let leaderboard = loadLeaderboard();
renderLeaderboard();
rotateAds(true);
setIntro();
pushFeed("Miasto gotowe. Kliknij Start, złap myszkę i wchodzisz w zadymę.");

animate();

function buildSkyTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#88bff2");
  gradient.addColorStop(0.35, "#dbeeff");
  gradient.addColorStop(0.7, "#f5d6aa");
  gradient.addColorStop(1, "#d5b289");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 260; i += 1) {
    ctx.fillStyle = `rgba(${232 + Math.random() * 18},${236 + Math.random() * 18},${244 + Math.random() * 10},${0.05 + Math.random() * 0.1})`;
    ctx.beginPath();
    ctx.arc(
      Math.random() * canvas.width,
      Math.random() * canvas.height * 0.68,
      10 + Math.random() * 42,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function buildCobbleTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#6a655e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < 32; y += 1) {
    for (let x = 0; x < 32; x += 1) {
      const px = x * 32;
      const py = y * 32;
      const tone = 90 + Math.floor(Math.random() * 30);
      ctx.fillStyle = `rgb(${tone + 10}, ${tone + 4}, ${tone - 2})`;
      ctx.fillRect(px + 2, py + 2, 28, 28);
      ctx.strokeStyle = "rgba(45,38,34,0.42)";
      ctx.strokeRect(px + 2, py + 2, 28, 28);
    }
  }

  return new THREE.CanvasTexture(canvas);
}

function buildRoadTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#2f3034";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 2000; i += 1) {
    const shade = 45 + Math.random() * 22;
    ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade + 4}, ${0.15 + Math.random() * 0.2})`;
    ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
  }

  return new THREE.CanvasTexture(canvas);
}

function buildBalaclavaTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#f5efe8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < 6; y += 1) {
    for (let x = 0; x < 6; x += 1) {
      const cx = 44 + x * 84 + (y % 2) * 16;
      const cy = 40 + y * 84;
      drawFlower(ctx, cx, cy, 22);
    }
  }

  for (let y = 0; y < 12; y += 1) {
    const py = y * 42;
    ctx.fillStyle = y % 2 === 0 ? "rgba(165,33,35,0.14)" : "rgba(33,92,52,0.08)";
    ctx.fillRect(0, py, canvas.width, 6);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function drawFlower(ctx, x, y, radius) {
  ctx.fillStyle = "#af2428";
  for (let i = 0; i < 6; i += 1) {
    const angle = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(
      x + Math.cos(angle) * radius * 0.9,
      y + Math.sin(angle) * radius * 0.9,
      radius * 0.62,
      radius * 0.34,
      angle,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.fillStyle = "#214f34";
  for (let i = 0; i < 4; i += 1) {
    const angle = Math.PI / 4 + (i / 4) * Math.PI * 2;
    ctx.beginPath();
    ctx.ellipse(
      x + Math.cos(angle) * radius * 1.45,
      y + Math.sin(angle) * radius * 1.45,
      radius * 0.32,
      radius * 0.18,
      angle,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.fillStyle = "#1f381f";
  ctx.beginPath();
  ctx.arc(x, y, radius * 0.28, 0, Math.PI * 2);
  ctx.fill();
}

function createCity() {
  const cobbleTexture = buildCobbleTexture();
  cobbleTexture.wrapS = THREE.RepeatWrapping;
  cobbleTexture.wrapT = THREE.RepeatWrapping;
  cobbleTexture.repeat.set(5.5, 5.5);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(140, 140),
    new THREE.MeshStandardMaterial({
      map: cobbleTexture,
      roughness: 1,
      metalness: 0.02,
    })
  );
  ground.rotation.x = -Math.PI / 2;
  world.add(ground);

  const roadTexture = buildRoadTexture();
  roadTexture.wrapS = THREE.RepeatWrapping;
  roadTexture.wrapT = THREE.RepeatWrapping;
  roadTexture.repeat.set(1, 8);

  const northRoad = new THREE.Mesh(
    new THREE.PlaneGeometry(18, 120),
    new THREE.MeshStandardMaterial({ map: roadTexture, roughness: 0.95 })
  );
  northRoad.rotation.x = -Math.PI / 2;
  northRoad.position.set(0, 0.02, -6);
  world.add(northRoad);

  const eastRoad = new THREE.Mesh(
    new THREE.PlaneGeometry(120, 14),
    new THREE.MeshStandardMaterial({ map: roadTexture, roughness: 0.95 })
  );
  eastRoad.rotation.x = -Math.PI / 2;
  eastRoad.position.set(0, 0.03, 12);
  world.add(eastRoad);

  addTramTracks(0, -8, 92, true);
  addTramTracks(0, 12, 96, false);

  const squareBorder = new THREE.Mesh(
    new THREE.RingGeometry(16, 18.5, 4),
    new THREE.MeshStandardMaterial({ color: 0x7b6859, roughness: 0.9, side: THREE.DoubleSide })
  );
  squareBorder.rotation.x = -Math.PI / 2;
  squareBorder.rotation.z = Math.PI / 4;
  squareBorder.position.set(0, 0.04, 2);
  world.add(squareBorder);

  const squareLines = new THREE.Mesh(
    new THREE.PlaneGeometry(26, 26),
    new THREE.MeshStandardMaterial({
      color: 0x8a7565,
      roughness: 0.92,
    })
  );
  squareLines.rotation.x = -Math.PI / 2;
  squareLines.position.set(0, 0.05, 2);
  world.add(squareLines);

  for (let i = 0; i < 3; i += 1) {
    const tenement = createTenement(9 + Math.random() * 3, 12 + Math.random() * 5, 8 + Math.random() * 2);
    tenement.position.set(-24 + i * 10, 0, -28 - Math.random() * 5);
    world.add(tenement);
  }

  for (let i = 0; i < 4; i += 1) {
    const tenement = createTenement(8.5 + Math.random() * 3, 11 + Math.random() * 6, 8 + Math.random() * 2);
    tenement.position.set(-28 + i * 12, 0, 30 + Math.random() * 4);
    tenement.rotation.y = Math.PI;
    world.add(tenement);
  }

  for (let i = 0; i < 4; i += 1) {
    const facade = createTenement(8 + Math.random() * 2, 11 + Math.random() * 4, 8 + Math.random() * 2);
    facade.position.set(29 + Math.random() * 4, 0, -18 + i * 14);
    facade.rotation.y = -Math.PI / 2;
    world.add(facade);
  }

  for (let i = 0; i < 3; i += 1) {
    const block = createBlockBuilding(16 + Math.random() * 4, 13 + Math.random() * 6, 10 + Math.random() * 2);
    block.position.set(-34 - Math.random() * 4, 0, -16 + i * 16);
    block.rotation.y = Math.PI / 2;
    world.add(block);
  }

  const church = createChurchSilhouette();
  church.position.set(0, 0, -45);
  world.add(church);

  const clothHall = createClothHall();
  clothHall.position.set(0, 0, -20);
  world.add(clothHall);

  const kiosk = createKiosk();
  kiosk.position.set(18, 0, 18);
  kiosk.rotation.y = -0.6;
  world.add(kiosk);

  const underpass = createKiosk();
  underpass.position.set(-18, 0, 18);
  underpass.rotation.y = 0.65;
  world.add(underpass);

  for (let i = 0; i < 22; i += 1) {
    const lamp = createLampPost();
    const angle = (i / 22) * Math.PI * 2;
    const radius = 25 + (i % 2) * 4;
    lamp.position.set(Math.cos(angle) * radius, 0, 2 + Math.sin(angle) * radius);
    world.add(lamp);
  }

  for (let i = 0; i < 10; i += 1) {
    const barrier = createBarrier();
    barrier.position.set(-24 + i * 5, 0, -7);
    world.add(barrier);
  }

  addSign("RYNEK", -20, 4.4, -10, "#f7eed8", "#4d2417");
  addSign("FLORIAŃSKA", 22, 4.7, -6, "#d5eff2", "#183d45");
  addSign("NOWA HUTA", -24, 5.1, 25, "#f2d87b", "#452e13");
}

function addTramTracks(x, z, length, vertical) {
  const railMaterial = new THREE.MeshStandardMaterial({
    color: 0x9d9991,
    roughness: 0.32,
    metalness: 0.82,
  });
  const sleeperMaterial = new THREE.MeshStandardMaterial({
    color: 0x5a4336,
    roughness: 0.9,
  });

  for (const offset of [-1.2, 1.2]) {
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(vertical ? 0.16 : length, 0.08, vertical ? length : 0.16),
      railMaterial
    );
    rail.position.set(x + (vertical ? offset : 0), 0.08, z + (vertical ? 0 : offset));
    world.add(rail);
  }

  for (let i = -length / 2; i <= length / 2; i += 2.8) {
    const sleeper = new THREE.Mesh(
      new THREE.BoxGeometry(vertical ? 3.2 : 0.18, 0.06, vertical ? 0.18 : 3.2),
      sleeperMaterial
    );
    sleeper.position.set(x + (vertical ? 0 : i), 0.04, z + (vertical ? i : 0));
    world.add(sleeper);
  }
}

function createTenement(width, height, depth) {
  const group = new THREE.Group();
  const wallColor = new THREE.Color().setHSL(0.06 + Math.random() * 0.04, 0.22, 0.52 + Math.random() * 0.08);

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({
      color: wallColor,
      roughness: 0.9,
    })
  );
  base.position.y = height / 2;
  group.add(base);

  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(width + 0.6, 1.6, depth + 0.6),
    new THREE.MeshStandardMaterial({ color: 0x6d322a, roughness: 0.84 })
  );
  roof.position.y = height + 0.8;
  group.add(roof);

  for (let row = 0; row < 4; row += 1) {
    for (let col = -2; col <= 2; col += 1) {
      if (Math.random() < 0.16) {
        continue;
      }
      const window = new THREE.Mesh(
        new THREE.PlaneGeometry(0.82, 1.22),
        new THREE.MeshBasicMaterial({
          color: Math.random() > 0.55 ? 0xffc889 : 0xf1f7ff,
          transparent: true,
          opacity: 0.92,
        })
      );
      window.position.set(col * (width / 5.6), 2.2 + row * 2.2, depth / 2 + 0.02);
      group.add(window);
    }
  }

  return group;
}

function createBlockBuilding(width, height, depth) {
  const group = new THREE.Group();
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({ color: 0x898987, roughness: 0.96 })
  );
  base.position.y = height / 2;
  group.add(base);

  for (let row = 0; row < 5; row += 1) {
    for (let col = -4; col <= 4; col += 1) {
      const window = new THREE.Mesh(
        new THREE.PlaneGeometry(1.05, 0.72),
        new THREE.MeshBasicMaterial({
          color: Math.random() > 0.5 ? 0xffd69e : 0xe2f0ff,
          transparent: true,
          opacity: 0.86,
        })
      );
      window.position.set(col * 1.7, 2.2 + row * 1.9, depth / 2 + 0.02);
      group.add(window);
    }
  }

  return group;
}

function createChurchSilhouette() {
  const group = new THREE.Group();

  const nave = new THREE.Mesh(
    new THREE.BoxGeometry(16, 15, 10),
    new THREE.MeshStandardMaterial({ color: 0x6e5e52, roughness: 0.9 })
  );
  nave.position.y = 7.5;
  group.add(nave);

  for (const side of [-4.5, 4.5]) {
    const tower = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 26, 4.2),
      new THREE.MeshStandardMaterial({ color: 0x7a695f, roughness: 0.88 })
    );
    tower.position.set(side, 13, 2.4);
    group.add(tower);

    const spire = new THREE.Mesh(
      new THREE.ConeGeometry(2.4, 8, 4),
      new THREE.MeshStandardMaterial({ color: 0x3f241f, roughness: 0.85 })
    );
    spire.rotation.y = Math.PI / 4;
    spire.position.set(side, 30, 2.4);
    group.add(spire);
  }

  return group;
}

function createClothHall() {
  const group = new THREE.Group();

  const hall = new THREE.Mesh(
    new THREE.BoxGeometry(22, 6, 7),
    new THREE.MeshStandardMaterial({ color: 0xbba990, roughness: 0.84 })
  );
  hall.position.y = 3;
  group.add(hall);

  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(23, 2, 8),
    new THREE.MeshStandardMaterial({ color: 0x704138, roughness: 0.78 })
  );
  roof.position.y = 7;
  group.add(roof);

  for (let i = -4; i <= 4; i += 2) {
    const arch = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 2.8, 0.8),
      new THREE.MeshStandardMaterial({ color: 0x8d7358, roughness: 0.82 })
    );
    arch.position.set(i * 2.1, 1.4, 3.85);
    group.add(arch);
  }

  return group;
}

function createKiosk() {
  const group = new THREE.Group();

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 2.6, 3.2),
    new THREE.MeshStandardMaterial({ color: 0x6f4c38, roughness: 0.88 })
  );
  base.position.y = 1.3;
  group.add(base);

  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 0.36, 3.8),
    new THREE.MeshStandardMaterial({ color: 0x9f2d27, roughness: 0.74 })
  );
  roof.position.y = 2.9;
  group.add(roof);

  return group;
}

function createLampPost() {
  const group = new THREE.Group();

  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.12, 4.8),
    new THREE.MeshStandardMaterial({ color: 0x4c4542, roughness: 0.62, metalness: 0.26 })
  );
  pole.position.y = 2.4;
  group.add(pole);

  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.08, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x4c4542, roughness: 0.62, metalness: 0.26 })
  );
  arm.position.set(0.35, 4.6, 0);
  group.add(arm);

  const lamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xffd19a })
  );
  lamp.position.set(0.72, 4.45, 0);
  group.add(lamp);

  return group;
}

function createBarrier() {
  const group = new THREE.Group();
  const postMaterial = new THREE.MeshStandardMaterial({ color: 0x6d6158, roughness: 0.84 });
  const railMaterial = new THREE.MeshStandardMaterial({ color: 0x93867c, roughness: 0.74 });

  for (const side of [-0.8, 0.8]) {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.9, 0.14), postMaterial);
    post.position.set(side, 0.45, 0);
    group.add(post);
  }

  const rail = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.08), railMaterial);
  rail.position.y = 0.55;
  group.add(rail);

  return group;
}

function addSign(text, x, y, z, bg, fg) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 220;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(0,0,0,0.18)";
  ctx.lineWidth = 16;
  ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
  ctx.fillStyle = fg;
  ctx.font = "bold 88px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
    })
  );
  sprite.position.set(x, y, z);
  sprite.scale.set(1.8, 0.8, 1);
  world.add(sprite);
}

function createPlayer() {
  const group = new THREE.Group();
  const viewModel = createViewModel(weapons[0]);
  camera.add(viewModel.root);

  return {
    name: "Ty z Krakowa",
    isPlayer: true,
    group,
    viewModel,
    weapon: weapons[0],
    weaponIndex: 0,
    health: PLAYER_MAX_HEALTH,
    maxHealth: PLAYER_MAX_HEALTH,
    dead: false,
    deathTimer: 0,
    attackTimer: 0,
    attackDuration: 0,
    attackCooldown: 0,
    attackHeavy: false,
    attackHitDone: false,
    flashTimer: 0,
    hitVelocity: new THREE.Vector3(),
    velocity: new THREE.Vector3(),
    moveTime: 0,
    yaw: Math.PI,
    pitch: -0.08,
    invuln: 0,
    cameraKick: 0,
    regenDelay: 0,
    dashCooldown: 0,
    dashTimer: 0,
    dashVector: new THREE.Vector3(),
  };
}

function createFighter({ name, weapon, palette }) {
  const group = new THREE.Group();
  const root = new THREE.Group();
  group.add(root);

  const skirt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.52, 0.96, 1.42, 18),
    new THREE.MeshStandardMaterial({ color: palette.skirt, roughness: 0.94 })
  );
  skirt.position.y = 0.82;
  root.add(skirt);

  const skirtBand = new THREE.Mesh(
    new THREE.TorusGeometry(0.74, 0.03, 8, 28),
    new THREE.MeshStandardMaterial({ color: 0x2f1b19, roughness: 0.74 })
  );
  skirtBand.rotation.x = Math.PI / 2;
  skirtBand.position.y = 0.95;
  root.add(skirtBand);

  const torso = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.34, 0.82, 4, 10),
    new THREE.MeshStandardMaterial({ color: palette.blouse, roughness: 0.82 })
  );
  torso.position.y = 1.58;
  root.add(torso);

  const chestPanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.54, 0.98, 0.08),
    new THREE.MeshStandardMaterial({ color: palette.apron, roughness: 0.8 })
  );
  chestPanel.position.set(0, 1.58, 0.24);
  root.add(chestPanel);

  for (const x of [-0.19, 0, 0.19]) {
    const embroidery = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.9, 0.05),
      new THREE.MeshStandardMaterial({ color: palette.trim, roughness: 0.56 })
    );
    embroidery.position.set(x, 1.6, 0.29);
    root.add(embroidery);
  }

  const sash = new THREE.Mesh(
    new THREE.TorusGeometry(0.54, 0.06, 8, 24),
    new THREE.MeshStandardMaterial({ color: palette.sash, roughness: 0.6 })
  );
  sash.rotation.x = Math.PI / 2;
  sash.position.y = 1.12;
  root.add(sash);

  const sashTail = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.74, 0.08),
    new THREE.MeshStandardMaterial({ color: palette.sash, roughness: 0.66 })
  );
  sashTail.position.set(0.18, 0.86, 0.78);
  root.add(sashTail);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.33, 16, 16),
    new THREE.MeshStandardMaterial({
      map: balaclavaTexture,
      roughness: 0.92,
    })
  );
  head.position.y = 2.5;
  root.add(head);

  const eyeTrim = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.17, 0.28, 4, 10),
    new THREE.MeshStandardMaterial({ color: 0x9d2629, roughness: 0.66 })
  );
  eyeTrim.rotation.z = Math.PI / 2;
  eyeTrim.position.set(0, 2.56, 0.31);
  eyeTrim.scale.set(1.36, 0.58, 0.14);
  root.add(eyeTrim);

  const eyeSlit = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.13, 0.22, 4, 10),
    new THREE.MeshStandardMaterial({ color: 0x151516, roughness: 0.92 })
  );
  eyeSlit.rotation.z = Math.PI / 2;
  eyeSlit.position.set(0, 2.56, 0.34);
  eyeSlit.scale.set(1.3, 0.46, 0.12);
  root.add(eyeSlit);

  for (const eyeX of [-0.1, 0.1]) {
    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.025, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0x121212 })
    );
    eye.position.set(eyeX, 2.56, 0.33);
    root.add(eye);
  }

  const braid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.045, 0.06, 0.94, 10),
    new THREE.MeshStandardMaterial({ color: 0x4a2a1f, roughness: 0.9 })
  );
  braid.rotation.z = -0.46;
  braid.position.set(0.27, 2.02, -0.02);
  root.add(braid);

  const leftArm = new THREE.Group();
  leftArm.position.set(-0.5, 1.78, 0);
  root.add(leftArm);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.5, 1.78, 0);
  root.add(rightArm);

  leftArm.add(createArmMesh(palette.blouse, palette.trim));
  const rightArmMesh = createArmMesh(palette.blouse, palette.trim);
  rightArmMesh.rotation.z = -Math.PI * 0.14;
  rightArm.add(rightArmMesh);

  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.2, 0.25, 0);
  root.add(leftLeg);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.2, 0.25, 0);
  root.add(rightLeg);

  const leftLegMesh = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.12, 0.75, 4, 8),
    new THREE.MeshStandardMaterial({ color: 0x241c1c, roughness: 0.86 })
  );
  leftLegMesh.position.y = -0.46;
  leftLeg.add(leftLegMesh);
  rightLeg.add(leftLegMesh.clone());

  const weaponGroup = createWeaponMesh(weapon, 1);
  weaponGroup.position.set(0, -0.7, 0.08);
  rightArm.add(weaponGroup);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.82, 20),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.16 })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.04;
  group.add(shadow);

  return {
    name,
    isPlayer: false,
    group,
    root,
    shadow,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    weaponGroup,
    weapon,
    weaponIndex: weapons.indexOf(weapon),
    health: ENEMY_MAX_HEALTH,
    maxHealth: ENEMY_MAX_HEALTH,
    dead: false,
    deathTimer: 0,
    attackTimer: 0,
    attackDuration: 0,
    attackCooldown: 0,
    attackHeavy: false,
    attackHitDone: false,
    flashTimer: 0,
    hitVelocity: new THREE.Vector3(),
    velocity: new THREE.Vector3(),
    facing: Math.random() * Math.PI * 2,
    moveTime: 0,
    aiThink: 0,
    target: null,
    roamTarget: new THREE.Vector3(),
    strafeSeed: Math.random() * Math.PI * 2,
    invuln: 0,
    pressureBias: Math.random(),
  };
}

function createArmMesh(blouseColor, trimColor) {
  const group = new THREE.Group();
  const sleeve = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.12, 0.56, 4, 8),
    new THREE.MeshStandardMaterial({ color: blouseColor, roughness: 0.82 })
  );
  sleeve.rotation.z = Math.PI * 0.12;
  sleeve.position.y = -0.35;
  group.add(sleeve);

  const cuff = new THREE.Mesh(
    new THREE.TorusGeometry(0.13, 0.03, 8, 18),
    new THREE.MeshStandardMaterial({ color: trimColor, roughness: 0.56 })
  );
  cuff.rotation.x = Math.PI / 2;
  cuff.position.set(0.06, -0.68, 0);
  group.add(cuff);

  const embroidery = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.46, 0.04),
    new THREE.MeshStandardMaterial({ color: trimColor, roughness: 0.58 })
  );
  embroidery.position.set(0.08, -0.34, 0.09);
  embroidery.rotation.z = 0.12;
  group.add(embroidery);

  return group;
}

function createViewModel(weapon) {
  const root = new THREE.Group();
  root.position.set(0, -0.18, -0.12);

  const bob = new THREE.Group();
  root.add(bob);

  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(0.44, 0.26, 0.24),
    new THREE.MeshStandardMaterial({ color: 0x4c2e29, roughness: 0.92 })
  );
  torso.position.set(0.02, -0.42, -0.24);
  bob.add(torso);

  const sash = new THREE.Mesh(
    new THREE.TorusGeometry(0.18, 0.03, 10, 18),
    new THREE.MeshStandardMaterial({ color: 0x8d312f, roughness: 0.58 })
  );
  sash.rotation.x = Math.PI / 2;
  sash.position.set(0.02, -0.31, -0.15);
  bob.add(sash);

  const leftArm = new THREE.Group();
  leftArm.position.set(-0.22, -0.26, -0.52);
  bob.add(leftArm);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.36, -0.24, -0.56);
  bob.add(rightArm);

  leftArm.add(createViewSleeve(0xe9e0d4, 0xa12d2b));
  rightArm.add(createViewSleeve(0xe9e0d4, 0xa12d2b));

  const weaponAnchor = new THREE.Group();
  weaponAnchor.position.set(0.1, -0.65, -0.06);
  rightArm.add(weaponAnchor);
  const weaponGroup = createWeaponMesh(weapon, 1.55);
  weaponGroup.rotation.set(0.15, -0.12, -0.48);
  weaponAnchor.add(weaponGroup);

  return {
    root,
    bob,
    leftArm,
    rightArm,
    weaponAnchor,
    weaponGroup,
  };
}

function createViewSleeve(blouseColor, trimColor) {
  const group = new THREE.Group();

  const sleeve = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.14, 0.62, 12),
    new THREE.MeshStandardMaterial({ color: blouseColor, roughness: 0.78 })
  );
  sleeve.rotation.z = Math.PI / 2.4;
  group.add(sleeve);

  const cuff = new THREE.Mesh(
    new THREE.TorusGeometry(0.11, 0.025, 8, 18),
    new THREE.MeshStandardMaterial({ color: trimColor, roughness: 0.52 })
  );
  cuff.rotation.x = Math.PI / 2;
  cuff.position.set(0.18, -0.17, 0);
  group.add(cuff);

  const hand = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0xe3c0a8, roughness: 0.72 })
  );
  hand.position.set(0.24, -0.22, 0.02);
  group.add(hand);

  const embroidery = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.24, 0.03),
    new THREE.MeshStandardMaterial({ color: trimColor, roughness: 0.56 })
  );
  embroidery.position.set(0.04, -0.06, 0.1);
  embroidery.rotation.z = 0.18;
  group.add(embroidery);

  return group;
}

function createWeaponMesh(weapon, scale) {
  const group = new THREE.Group();
  group.scale.setScalar(scale);

  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.065, 0.72, 10),
    new THREE.MeshStandardMaterial({ color: 0x4d2d1f, roughness: 0.84 })
  );
  handle.rotation.z = Math.PI / 2;
  group.add(handle);

  let top;
  if (weapon.blade === "blade") {
    top = new THREE.Group();
    const bladeMat = new THREE.MeshStandardMaterial({ color: weapon.color, roughness: 0.18, metalness: 0.9 });
    const mainBlade = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.11, 0.035), bladeMat);
    mainBlade.position.x = 0.82;
    top.add(mainBlade);
    const tip = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.09, 0.03), bladeMat);
    tip.position.set(1.44, -0.02, 0);
    tip.rotation.z = -0.22;
    top.add(tip);
    const spine = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 0.025, 0.04),
      new THREE.MeshStandardMaterial({ color: 0x6a6a70, roughness: 0.3, metalness: 0.85 })
    );
    spine.position.set(0.82, 0.065, 0);
    top.add(spine);
    const guard = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.22, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x3a3028, roughness: 0.7, metalness: 0.4 })
    );
    guard.position.set(0.22, 0, 0);
    top.add(guard);
    const edge = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.015, 0.005),
      new THREE.MeshStandardMaterial({ color: 0xeaeef2, roughness: 0.1, metalness: 0.95 })
    );
    edge.position.set(0.82, -0.06, 0.018);
    top.add(edge);
  } else if (weapon.blade === "knife") {
    top = new THREE.Mesh(
      new THREE.ConeGeometry(0.11, 0.78, 5),
      new THREE.MeshStandardMaterial({ color: weapon.color, roughness: 0.24, metalness: 0.84 })
    );
    top.rotation.z = -Math.PI / 2;
    top.position.x = 0.56;
  } else if (weapon.blade === "cleaver") {
    top = new THREE.Mesh(
      new THREE.BoxGeometry(0.68, 0.3, 0.05),
      new THREE.MeshStandardMaterial({ color: weapon.color, roughness: 0.24, metalness: 0.82 })
    );
    top.position.x = 0.58;
  } else if (weapon.blade === "club") {
    top = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.11, 0.9, 10),
      new THREE.MeshStandardMaterial({ color: 0x2b2b2e, roughness: 0.9 })
    );
    top.rotation.z = Math.PI / 2;
    top.position.x = 0.38;
  } else if (weapon.blade === "bar") {
    top = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.96, 10),
      new THREE.MeshStandardMaterial({ color: weapon.color, roughness: 0.44, metalness: 0.7 })
    );
    top.rotation.z = Math.PI / 2;
    top.position.x = 0.42;
  } else if (weapon.blade === "pipe") {
    top = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.07, 1.02, 12),
      new THREE.MeshStandardMaterial({ color: weapon.color, roughness: 0.34, metalness: 0.8 })
    );
    top.rotation.z = Math.PI / 2;
    top.position.x = 0.44;
  } else if (weapon.blade === "shovel") {
    top = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 0.94, 10),
      new THREE.MeshStandardMaterial({ color: 0x74533d, roughness: 0.82 })
    );
    top.rotation.z = Math.PI / 2;
    top.position.x = 0.28;
    const scoop = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.28, 0.09),
      new THREE.MeshStandardMaterial({ color: weapon.color, roughness: 0.42, metalness: 0.64 })
    );
    scoop.position.x = 0.78;
    group.add(scoop);
  } else {
    top = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.05, 1.12, 10),
      new THREE.MeshStandardMaterial({ color: weapon.color, roughness: 0.76 })
    );
    top.rotation.z = Math.PI / 2;
    top.position.x = 0.48;
  }

  group.add(top);
  return group;
}

function loadLeaderboard() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(LEADERBOARD_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveLeaderboard() {
  try {
    window.localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
  } catch {
    // Storage errors should not stop gameplay.
  }
}

function renderLeaderboard() {
  leaderboardEl.textContent = "";

  if (leaderboard.length === 0) {
    const item = document.createElement("li");
    item.className = "empty";
    item.textContent = "Jeszcze pusto. Zapisz wynik i wrzuć inicjały na tablicę.";
    leaderboardEl.append(item);
    return;
  }

  leaderboard.forEach((entry, index) => {
    const item = document.createElement("li");

    const rank = document.createElement("span");
    rank.className = "rank";
    rank.textContent = `#${index + 1}`;

    const meta = document.createElement("span");
    meta.className = "entry-meta";
    meta.textContent = `${entry.initials} • ${entry.weapon}`;

    const score = document.createElement("span");
    score.className = "entry-score";
    score.textContent = String(entry.score).padStart(5, "0");

    item.append(rank, meta, score);
    leaderboardEl.append(item);
  });
}

function sanitizeInitials(value) {
  const cleaned = value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 3);
  return cleaned || "MZ";
}

function saveCurrentScore() {
  if (state.savedCurrentScore || state.score <= 0) {
    return;
  }

  const initials = sanitizeInitials(initialsInput.value);
  initialsInput.value = initials;
  leaderboard.push({
    initials,
    score: state.score,
    weapon: player.weapon.name,
  });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, LEADERBOARD_LIMIT);
  state.savedCurrentScore = true;
  saveLeaderboard();
  renderLeaderboard();
}

function setIntro() {
  overlay.classList.remove("hidden");
  initialsWrap.classList.add("hidden");
  titleEl.textContent = "Wejdź do zadymy";
  messageEl.textContent =
    "Pierwsza osoba, Kraków i broń biała. Szybki cios, mocny cios, dash na Q, combo i furia za agresywną grę.";
  startButton.textContent = "Start";
}

function pushFeed(text) {
  feedItems.unshift(text);
  feedItems.length = Math.min(feedItems.length, 6);
  feedList.textContent = "";
  feedItems.forEach((line) => {
    const item = document.createElement("li");
    item.textContent = line;
    feedList.append(item);
  });
}

function announce(text, tone = "kill", duration = 1.2) {
  if (!announcerEl) {
    return;
  }
  announcerEl.textContent = text;
  announcerEl.className = `announcer ${tone} show`;
  state.announcerTimer = duration;
}

function rotateAds(force = false) {
  if (!force && state.adTimer > 0) {
    return;
  }

  const shuffled = shuffle([...adCampaigns]).slice(0, adTitleEls.length);
  shuffled.forEach((ad, index) => {
    if (adTitleEls[index]) {
      adTitleEls[index].textContent = ad.title;
    }
    if (adCopyEls[index]) {
      adCopyEls[index].textContent = ad.copy;
    }
  });
  state.adTimer = 6.5;
}

function flashImpact(amount = 1) {
  state.flashTimer = Math.max(state.flashTimer, 0.12 * amount);
}

function formatTime(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

function triggerFury() {
  state.furyCharge = 0;
  state.furyTime = FURY_DURATION;
  announce("FURIA AKTYWNA", "fury", 1.5);
  pushFeed("Furia aktywna. Jedziesz po wszystkich.");
  playVoice("fury");
}

function chooseRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function playVoice(type) {
  if (!voiceState.enabled || voiceState.cooldown > 0) {
    return;
  }

  const candidates = VOICE_LINES[type];
  if (!candidates || candidates.length === 0) {
    return;
  }

  const src = chooseRandom(candidates);
  if (voiceState.missing.has(src)) {
    return;
  }

  let audio = voiceState.cache.get(src);
  if (!audio) {
    audio = new Audio(src);
    audio.preload = "auto";
    audio.addEventListener("error", () => {
      voiceState.missing.add(src);
    });
    voiceState.cache.set(src, audio);
  }

  audio.currentTime = 0;
  audio.volume = 0.96;
  audio.play().catch(() => {});
  voiceState.cooldown = 1.1;
}

function startMusic() {
  music
    .play()
    .then(() => {
      if (musicStatusEl) {
        musicStatusEl.textContent = "Leci";
      }
    })
    .catch(() => {
      if (musicStatusEl) {
        musicStatusEl.textContent = "Zablokowana";
      }
      pushFeed("Przeglądarka przyblokowała autoplay. Kliknij jeszcze raz, jeśli trzeba.");
    });
}

function requestPointerLock() {
  if (isTouchDevice) {
    state.pointerLocked = true;
    return;
  }
  if (renderer.domElement.requestPointerLock) {
    renderer.domElement.requestPointerLock();
  }
}

function startGame() {
  if (state.gameOver) {
    saveCurrentScore();
  }

  resetPlayer();
  resetEnemies();
  state.running = true;
  state.gameOver = false;
  state.score = 0;
  state.streak = 0;
  state.time = 0;
  state.savedCurrentScore = false;
  state.comboTimer = 0;
  state.comboCount = 0;
  state.comboMultiplier = 1;
  state.furyCharge = 0;
  state.furyTime = 0;
  state.announcerTimer = 0;
  state.flashTimer = 0;
  state.hitstop = 0;
  state.killSpeedBoost = 0;
  overlay.classList.add("hidden");
  initialsWrap.classList.add("hidden");
  player.weaponIndex = 0;
  player.weapon = weapons[0];
  replaceWeapon(player);
  weaponEl.textContent = player.weapon.name;
  startMusic();
  if (musicStatusEl) {
    musicStatusEl.textContent = music.readyState >= 2 ? "Leci" : "Ładowanie";
  }
  updateHud();
  pushFeed("Zadyma rozpoczęta. Kliknij ekran i rozglądaj się myszką.");
  announce("ZADYMA!", "pickup", 1.15);
  playVoice("start");
  requestPointerLock();
}

function resetPlayer() {
  player.dead = false;
  player.deathTimer = 0;
  player.health = player.maxHealth;
  player.attackTimer = 0;
  player.attackDuration = 0;
  player.attackCooldown = 0;
  player.attackHitDone = false;
  player.flashTimer = 0;
  player.invuln = 0;
  player.hitVelocity.set(0, 0, 0);
  player.velocity.set(0, 0, 0);
  player.group.position.set(0, 0, 16);
  player.yaw = Math.PI;
  player.pitch = -0.08;
  player.moveTime = 0;
  player.cameraKick = 0;
  player.regenDelay = PLAYER_REGEN_DELAY;
  player.dashCooldown = 0;
  player.dashTimer = 0;
  player.dashVector.set(0, 0, 0);
}

function resetEnemies() {
  enemies.forEach((enemy) => {
    world.remove(enemy.group);
    const index = fighters.indexOf(enemy);
    if (index >= 0) {
      fighters.splice(index, 1);
    }
  });
  enemies.length = 0;
  pickups.forEach((pickup) => world.remove(pickup.mesh));
  pickups.length = 0;

  const names = shuffle([...aiNames]).slice(0, ENEMY_TARGET_COUNT);
  for (let i = 0; i < ENEMY_TARGET_COUNT; i += 1) {
    const weapon = weapons[Math.floor(Math.random() * weapons.length)];
    const palette = outfitPalettes[i % outfitPalettes.length];
    const enemy = createFighter({
      name: names[i],
      weapon,
      palette,
    });

    const angle = (i / ENEMY_TARGET_COUNT) * Math.PI * 2;
    enemy.group.position.set(Math.cos(angle) * 16, 0, Math.sin(angle) * 16);
    enemy.facing = angle + Math.PI;
    enemy.group.rotation.y = enemy.facing;
    enemy.roamTarget.copy(randomMapPoint());
    enemy.pressureBias = Math.random();
    enemies.push(enemy);
    fighters.push(enemy);
    world.add(enemy.group);
  }
}

function replaceWeapon(fighter) {
  if (fighter.isPlayer) {
    fighter.viewModel.weaponAnchor.remove(fighter.viewModel.weaponGroup);
    fighter.viewModel.weaponGroup = createWeaponMesh(fighter.weapon, 1.55);
    fighter.viewModel.weaponGroup.rotation.set(0.15, -0.12, -0.48);
    fighter.viewModel.weaponAnchor.add(fighter.viewModel.weaponGroup);
    return;
  }

  fighter.rightArm.remove(fighter.weaponGroup);
  fighter.weaponGroup = createWeaponMesh(fighter.weapon, 1);
  fighter.weaponGroup.position.set(0, -0.7, 0.08);
  fighter.rightArm.add(fighter.weaponGroup);
}

function shuffle(list) {
  for (let i = list.length - 1; i > 0; i -= 1) {
    const swapIndex = Math.floor(Math.random() * (i + 1));
    [list[i], list[swapIndex]] = [list[swapIndex], list[i]];
  }
  return list;
}

function randomMapPoint() {
  return new THREE.Vector3(
    THREE.MathUtils.randFloatSpread(MAP_HALF * 1.6),
    0,
    THREE.MathUtils.randFloatSpread(MAP_HALF * 1.6)
  ).clamp(
    new THREE.Vector3(-MAP_HALF + 4, 0, -MAP_HALF + 4),
    new THREE.Vector3(MAP_HALF - 4, 0, MAP_HALF - 4)
  );
}

function startAttack(fighter, heavy = false) {
  if (fighter.dead || fighter.attackCooldown > 0 || fighter.attackTimer > 0) {
    return;
  }

  const furyBoost = fighter.isPlayer && state.furyTime > 0 ? 0.82 : 1;
  fighter.attackHeavy = heavy;
  fighter.attackDuration =
    (fighter.isPlayer
    ? heavy
      ? 0.46
      : 0.25
    : heavy
      ? 0.7
      : 0.42) * furyBoost;
  fighter.attackTimer = fighter.attackDuration;
  fighter.attackCooldown =
    (fighter.isPlayer
    ? heavy
      ? 0.62
      : 0.24
    : heavy
      ? 1.45
      : 0.95) * furyBoost;
  fighter.attackHitDone = false;
  if (fighter.isPlayer) {
    player.cameraKick = heavy ? 0.08 : 0.05;
  }
}

function updatePlayer(dt) {
  player.attackCooldown = Math.max(0, player.attackCooldown - dt);
  player.dashCooldown = Math.max(0, player.dashCooldown - dt);
  player.flashTimer = Math.max(0, player.flashTimer - dt);
  player.invuln = Math.max(0, player.invuln - dt);
  player.cameraKick = Math.max(0, player.cameraKick - dt * 0.24);
  player.regenDelay = Math.max(0, player.regenDelay - dt);
  player.dashTimer = Math.max(0, player.dashTimer - dt);
  player.moveTime += dt * (input.sprint ? 8 : 5.4);

  if (player.dead) {
    updateViewModel(dt);
    return;
  }

  const moveForward = Number(input.up) - Number(input.down);
  const moveSide = Number(input.right) - Number(input.left);
  const furySpeedBoost = state.furyTime > 0 ? 1.14 : 1;
  const killBoost = state.killSpeedBoost > 0 ? KILL_SPEED_BOOST : 1;
  const baseSpeed = (input.sprint ? 8.2 : 5.8) * furySpeedBoost * killBoost;

  forwardVector.set(-Math.sin(player.yaw), 0, -Math.cos(player.yaw));
  rightVector.set(Math.cos(player.yaw), 0, -Math.sin(player.yaw));
  scratch.set(0, 0, 0);
  scratch.addScaledVector(forwardVector, moveForward);
  scratch.addScaledVector(rightVector, moveSide);
  if (scratch.lengthSq() > 1) {
    scratch.normalize();
  }

  if (scratch.lengthSq() > 0) {
    player.velocity.lerp(scratch.multiplyScalar(baseSpeed), 0.18);
  } else {
    player.velocity.multiplyScalar(0.82);
  }

  if (input.dashQueued && player.dashCooldown <= 0) {
    const dashDirection = scratch.lengthSq() > 0 ? scratch.clone().normalize() : forwardVector.clone();
    player.dashVector.copy(dashDirection).multiplyScalar(DASH_SPEED * (state.furyTime > 0 ? 1.18 : 1));
    player.dashTimer = DASH_DURATION;
    player.dashCooldown = DASH_COOLDOWN;
    player.invuln = Math.max(player.invuln, 0.16);
    player.cameraKick = 0.16;
    spawnSlash(player.group.position.clone().setY(1.16), 0xfff1be);
    announce("DASH", "pickup", 0.45);
    playVoice("dash");
  }
  input.dashQueued = false;

  if (player.dashTimer > 0) {
    player.velocity.lerp(player.dashVector, 0.62);
  }

  player.velocity.addScaledVector(player.hitVelocity, dt * 2.6);
  player.hitVelocity.multiplyScalar(0.78);
  player.group.position.addScaledVector(player.velocity, dt);
  clampToMap(player.group.position);

  if (input.attackQueued) {
    startAttack(player, false);
  }
  if (input.heavyQueued) {
    startAttack(player, true);
  }
  input.attackQueued = false;
  input.heavyQueued = false;

  if (player.attackTimer > 0) {
    player.attackTimer = Math.max(0, player.attackTimer - dt);
    const progress = 1 - player.attackTimer / player.attackDuration;
    if (!player.attackHitDone && progress >= (player.attackHeavy ? 0.52 : 0.44)) {
      performAttack(player);
      player.attackHitDone = true;
    }
  }

  if (player.regenDelay <= 0 && player.health < player.maxHealth && !state.gameOver) {
    player.health = Math.min(player.maxHealth, player.health + PLAYER_REGEN_RATE * dt);
  }

  updateViewModel(dt);
}

function updateEnemy(enemy, dt) {
  enemy.attackCooldown = Math.max(0, enemy.attackCooldown - dt);
  enemy.flashTimer = Math.max(0, enemy.flashTimer - dt);
  enemy.invuln = Math.max(0, enemy.invuln - dt);
  enemy.aiThink -= dt;
  enemy.moveTime += dt * 4.4;

  if (enemy.dead) {
    enemy.deathTimer -= dt;
    enemy.group.rotation.z = Math.min(enemy.group.rotation.z + dt * 1.4, 1.1);
    enemy.root.position.y = Math.max(enemy.root.position.y - dt * 0.52, -0.18);
    if (enemy.deathTimer <= 0 && state.running) {
      respawnEnemy(enemy);
    }
    updateEnemyAnimation(enemy);
    return;
  }

  if (enemy.aiThink <= 0) {
    enemy.aiThink = 0.22 + Math.random() * 0.2;
    enemy.target = pickEnemyTarget(enemy);
    if (!enemy.target || enemy.target.dead) {
      enemy.roamTarget.copy(randomMapPoint());
    }
  }

  enemy.velocity.multiplyScalar(0.84);

  const target = enemy.target && !enemy.target.dead ? enemy.target : null;
  if (target) {
    scratch.subVectors(getFighterPosition(target), enemy.group.position);
    const distance = scratch.length();
    if (distance > 0.001) {
      scratch.normalize();
    }
    enemy.facing = Math.atan2(scratch.x, scratch.z);

    const desiredDistance = enemy.weapon.reach + 0.85;
    const strafe = Math.sin(state.time * 2.1 + enemy.strafeSeed) * 0.74;
    if (distance > desiredDistance) {
      rightVector.set(Math.cos(enemy.facing), 0, -Math.sin(enemy.facing));
      scratch.addScaledVector(rightVector, strafe * 0.25);
      scratch.normalize();
      enemy.velocity.addScaledVector(scratch, dt * 2.85);
    }

    if (distance <= desiredDistance + 0.22 && enemy.attackCooldown <= 0 && enemy.attackTimer <= 0) {
      startAttack(enemy, Math.random() > 0.82);
    }
  } else {
    scratch.subVectors(enemy.roamTarget, enemy.group.position);
    if (scratch.lengthSq() < 4) {
      enemy.roamTarget.copy(randomMapPoint());
    } else {
      scratch.normalize();
      enemy.facing = Math.atan2(scratch.x, scratch.z);
      enemy.velocity.addScaledVector(scratch, dt * 2.4);
    }
  }

  applySeparation(enemy);
  enemy.velocity.addScaledVector(enemy.hitVelocity, dt * 2.6);
  enemy.hitVelocity.multiplyScalar(0.78);
  enemy.group.position.addScaledVector(enemy.velocity, dt);
  clampToMap(enemy.group.position);

  if (enemy.attackTimer > 0) {
    enemy.attackTimer = Math.max(0, enemy.attackTimer - dt);
    const progress = 1 - enemy.attackTimer / enemy.attackDuration;
    if (!enemy.attackHitDone && progress >= (enemy.attackHeavy ? 0.53 : 0.46)) {
      performAttack(enemy);
      enemy.attackHitDone = true;
    }
  }

  updateEnemyAnimation(enemy);
}

function updateEnemyAnimation(enemy) {
  const speed = enemy.velocity.length();
  const walk = Math.sin(enemy.moveTime * 6.2) * Math.min(speed * 0.06, 0.3);
  enemy.group.rotation.y = enemy.facing;

  if (enemy.dead) {
    enemy.leftArm.rotation.x = 0.3;
    enemy.rightArm.rotation.x = -0.3;
    enemy.leftLeg.rotation.x = 0.2;
    enemy.rightLeg.rotation.x = -0.1;
    enemy.shadow.material.opacity = 0.1;
    return;
  }

  enemy.shadow.material.opacity = 0.17;
  enemy.root.position.y = enemy.flashTimer > 0 ? 0.06 : 0;
  enemy.leftLeg.rotation.x = walk;
  enemy.rightLeg.rotation.x = -walk;
  enemy.leftArm.rotation.x = -walk * 0.7;

  if (enemy.attackTimer > 0) {
    const progress = 1 - enemy.attackTimer / enemy.attackDuration;
    const swing = progress < 0.5 ? progress / 0.5 : 1 - (progress - 0.5) / 0.5;
    enemy.rightArm.rotation.x = enemy.attackHeavy ? -1.9 + swing * 2.8 : -1.2 + swing * 1.9;
    enemy.rightArm.rotation.z = enemy.attackHeavy ? -0.24 : -0.12;
    enemy.leftArm.rotation.z = 0.18;
    enemy.root.rotation.y = Math.sin(progress * Math.PI) * (enemy.attackHeavy ? 0.3 : 0.18);
  } else {
    enemy.rightArm.rotation.x = walk * 0.7;
    enemy.rightArm.rotation.z = -0.14;
    enemy.leftArm.rotation.z = 0.1;
    enemy.root.rotation.y = 0;
  }
}

function updateViewModel(dt) {
  const speed = player.velocity.length();
  const bob = Math.sin(player.moveTime * 7.2) * Math.min(speed * 0.018, 0.05);
  const sway = Math.sin(player.moveTime * 3.6) * Math.min(speed * 0.01, 0.04);

  if (player.dead) {
    player.viewModel.root.position.set(0.18, -0.44, -0.08);
    player.viewModel.root.rotation.set(0.32, 0, -0.42);
    return;
  }

  player.viewModel.root.position.set(0.02 + sway, -0.18 + bob - player.cameraKick * 0.2, -0.12);
  player.viewModel.root.rotation.set(0, 0, -sway * 1.4);

  if (player.attackTimer > 0) {
    const progress = 1 - player.attackTimer / player.attackDuration;
    const windup = progress < 0.45 ? progress / 0.45 : 1 - (progress - 0.45) / 0.55;
    player.viewModel.rightArm.rotation.x = player.attackHeavy ? -2.3 + windup * 3.2 : -1.6 + windup * 2.1;
    player.viewModel.rightArm.rotation.y = player.attackHeavy ? -0.6 : -0.32;
    player.viewModel.rightArm.rotation.z = player.attackHeavy ? -0.7 : -0.45;
    player.viewModel.leftArm.rotation.x = -0.45;
    player.viewModel.leftArm.rotation.z = 0.15;
  } else {
    player.viewModel.rightArm.rotation.x = -0.44 + bob * 2.4;
    player.viewModel.rightArm.rotation.y = -0.18;
    player.viewModel.rightArm.rotation.z = -0.28;
    player.viewModel.leftArm.rotation.x = -0.3 + bob * 1.2;
    player.viewModel.leftArm.rotation.z = 0.08;
  }
}

function pickEnemyTarget(enemy) {
  let best = null;
  let bestScore = Infinity;
  const playerHunters = enemies.filter(
    (candidate) => candidate !== enemy && !candidate.dead && candidate.target === player
  ).length;
  for (const candidate of fighters) {
    if (candidate === enemy || candidate.dead) {
      continue;
    }
    let score = enemy.group.position.distanceToSquared(getFighterPosition(candidate));
    if (candidate.isPlayer) {
      score *= playerHunters >= MAX_ENEMY_PLAYER_FOCUS ? 1.28 : 1.04 + enemy.pressureBias * 0.12;
    }
    if (score < bestScore) {
      bestScore = score;
      best = candidate;
    }
  }
  return best;
}

function getFighterPosition(fighter) {
  return fighter.isPlayer ? fighter.group.position : fighter.group.position;
}

function applySeparation(fighter) {
  for (const other of fighters) {
    if (other === fighter || other.dead) {
      continue;
    }
    scratch.subVectors(fighter.group.position, getFighterPosition(other));
    const distance = scratch.length();
    if (distance > 0 && distance < 1.25) {
      scratch.normalize().multiplyScalar((1.25 - distance) * 0.045);
      fighter.velocity.add(scratch);
    }
  }
}

function performAttack(attacker) {
  if (attacker.isPlayer) {
    forwardVector.set(Math.sin(player.yaw), 0, Math.cos(player.yaw));
  } else {
    forwardVector.set(Math.sin(attacker.facing), 0, Math.cos(attacker.facing));
  }

  const range =
    attacker.weapon.reach +
    (attacker.attackHeavy ? 0.35 : 0) +
    (attacker.isPlayer ? 0.95 + (state.furyTime > 0 ? 0.24 : 0) : 0);
  let hitSomeone = false;

  for (const target of fighters) {
    if (target === attacker || target.dead) {
      continue;
    }

    scratch.subVectors(getFighterPosition(target), getFighterPosition(attacker));
    const distance = scratch.length();
    if (distance > range) {
      continue;
    }

    scratch.normalize();
    const arc = scratch.dot(forwardVector);
    const minArc = attacker.isPlayer
      ? attacker.attackHeavy
        ? -0.42
        : -0.24
      : attacker.attackHeavy
        ? -0.08
        : 0.14;
    if (arc < minArc) {
      continue;
    }

    const damage = attacker.attackHeavy ? attacker.weapon.heavy : attacker.weapon.damage;
    if (applyDamage(target, attacker, damage)) {
      hitSomeone = true;
    }
  }

  const slashOrigin = scratch2
    .copy(getFighterPosition(attacker))
    .addScaledVector(forwardVector, attacker.weapon.reach * 0.55)
    .setY(1.3);
  spawnSlash(slashOrigin, attacker.attackHeavy ? 0xffdcaf : 0xff6e5c);

  if (!hitSomeone && attacker.isPlayer) {
    if (Math.random() > 0.55) {
      pushFeed("Machnąłeś w powietrze. Podejdź bliżej albo użyj dasha.");
      playVoice("miss");
    }
  }
}

function applyDamage(target, attacker, damage) {
  if (target.invuln > 0 || target.dead) {
    return false;
  }

  let appliedDamage = target.isPlayer
    ? Math.round(damage * ENEMY_DAMAGE_MULTIPLIER)
    : attacker.isPlayer
      ? Math.round(damage * PLAYER_DAMAGE_MULTIPLIER * (state.furyTime > 0 ? 1.28 : 1))
      : damage;

  const isFinisher = attacker.isPlayer && !target.isPlayer && target.health > 0 && target.health <= target.maxHealth * FINISHER_THRESHOLD;
  if (isFinisher) {
    appliedDamage = target.health + 1;
  }
  target.health -= appliedDamage;
  target.invuln = target.isPlayer ? 0.34 : 0.18;
  target.flashTimer = ATTACK_FLASH_TIME;

  if (attacker.isPlayer) {
    forwardVector.set(Math.sin(player.yaw), 0, Math.cos(player.yaw));
  } else {
    forwardVector.set(Math.sin(attacker.facing), 0, Math.cos(attacker.facing));
  }
  target.hitVelocity.addScaledVector(forwardVector, attacker.attackHeavy ? 3.8 : 2.4);
  if (!target.isPlayer) {
    target.attackTimer = 0;
    target.attackCooldown = Math.max(target.attackCooldown, attacker.attackHeavy ? 0.85 : 0.65);
  }
  spawnBlood(getFighterPosition(target).clone().setY(1.28), 14 + Math.floor(Math.random() * 9));
  flashImpact(target.isPlayer ? 0.85 : 0.45);

  if (attacker.isPlayer && !target.isPlayer) {
    state.comboCount += attacker.attackHeavy ? 2 : 1;
    state.comboTimer = COMBO_DECAY_TIME;
    state.comboMultiplier = 1 + Math.min(state.comboCount * 0.08, 2.5);
    state.score += Math.round((attacker.attackHeavy ? 18 : 10) * state.comboMultiplier);
    player.health = Math.min(player.maxHealth, player.health + PLAYER_HIT_HEAL);
    state.furyCharge = Math.min(100, state.furyCharge + FURY_CHARGE_PER_HIT + (attacker.attackHeavy ? 4 : 0));
    if (state.furyCharge >= 100 && state.furyTime <= 0) {
      triggerFury();
    }
    if (isFinisher) {
      announce("WYKOŃCZENIE", "fury", 0.7);
      spawnBlood(getFighterPosition(target).clone().setY(1.4), 18);
      playVoice("finisher");
    } else if (target.health > 0 && appliedDamage >= 24) {
      announce("MOCNE TRAFIENIE", "kill", 0.55);
    }
  }

  if (target.isPlayer) {
    state.streak = 0;
    state.comboCount = 0;
    state.comboTimer = 0;
    state.comboMultiplier = 1;
    player.cameraKick = 0.12;
    player.regenDelay = PLAYER_REGEN_DELAY;
    player.pitch = THREE.MathUtils.clamp(player.pitch + (Math.random() - 0.5) * 0.06, -MAX_PITCH, MAX_PITCH);
    pushFeed(`${attacker.name} trafiła cię ${attacker.weapon.instrumental}.`);
    if (target.health > 0 && target.health <= target.maxHealth * 0.3) {
      playVoice("lowhealth");
    } else {
      playVoice("hurt");
    }
  }

  if (target.health <= 0) {
    handleDefeat(target, attacker);
  }

  return true;
}

function handleDefeat(target, attacker) {
  target.dead = true;
  target.health = 0;
  target.attackTimer = 0;
  target.attackCooldown = 0.4;
  target.deathTimer = RESPAWN_DELAY;
  target.hitVelocity.set(0, 0, 0);

  if (attacker.isPlayer && !target.isPlayer) {
    state.streak += 1;
    state.comboCount += 3;
    state.comboTimer = COMBO_DECAY_TIME;
    state.comboMultiplier = 1 + Math.min(state.comboCount * 0.08, 2.5);
    state.score += Math.round((attacker.weapon.score + 45 + state.streak * 20) * state.comboMultiplier);
    player.health = Math.min(player.maxHealth, player.health + PLAYER_KILL_HEAL);
    state.furyCharge = Math.min(100, state.furyCharge + FURY_CHARGE_PER_KILL);
    state.hitstop = HITSTOP_DURATION;
    state.killSpeedBoost = KILL_SPEED_BOOST_DURATION;
    spawnBlood(getFighterPosition(target).clone().setY(1.18), 36 + Math.floor(Math.random() * 16));
    pushFeed(`Wybebeszyłeś ${target.name} ${attacker.weapon.instrumental}.`);
    if (state.streak >= 6) {
      announce(`MASAKRA x${state.streak}`, "fury", 1.3);
      playVoice("streak");
    } else if (state.streak >= 4) {
      announce(`RZEŹ x${state.streak}`, "kill", 1.05);
      playVoice("streak");
    } else {
      announce(`${target.name} PADŁA`, "kill", 1.05);
      playVoice("kill");
    }
    flashImpact(1.4);
    if (state.streak % 4 === 0 && state.furyTime <= 0) {
      triggerFury();
    } else if (state.furyCharge >= 100 && state.furyTime <= 0) {
      triggerFury();
    }
    const roll = Math.random();
    if (roll > 0.68) {
      spawnPickup("health", getFighterPosition(target).clone());
    } else if (roll > 0.42) {
      spawnPickup("fury", getFighterPosition(target).clone());
    } else if (roll > 0.18) {
      spawnPickup("weapon", getFighterPosition(target).clone());
    }
    if (Math.random() > 0.54) {
      cyclePlayerWeapon();
    }
  } else if (!attacker.isPlayer && target.isPlayer) {
    state.running = false;
    state.gameOver = true;
    if (document.pointerLockElement === renderer.domElement && document.exitPointerLock) {
      document.exitPointerLock();
    }
    overlay.classList.remove("hidden");
    initialsWrap.classList.remove("hidden");
    titleEl.textContent = "Koniec zadymy";
    messageEl.textContent = `${attacker.name} wybebeszyła cię ${attacker.weapon.instrumental}. Wpisz inicjały i wracaj do zadymy.`;
    startButton.textContent = "Zapisz i wracaj do zadymy";
    pushFeed(`${attacker.name} zjebała cię ${attacker.weapon.instrumental}.`);
    announce("KONIEC RUNDY", "kill", 1.4);
    playVoice("death");
    initialsInput.focus();
    initialsInput.select();
  } else if (!attacker.isPlayer && !target.isPlayer && Math.random() > 0.4) {
    spawnBlood(getFighterPosition(target).clone().setY(1.18), 20 + Math.floor(Math.random() * 10));
    pushFeed(`${attacker.name} zjebała ${target.name} ${attacker.weapon.instrumental}.`);
    if (Math.random() > 0.65) {
      playVoice("taunt");
    }
  }

  updateHud();
}

function cyclePlayerWeapon() {
  const nextIndex = (player.weaponIndex + 1 + Math.floor(Math.random() * 3)) % weapons.length;
  player.weaponIndex = nextIndex;
  player.weapon = weapons[nextIndex];
  replaceWeapon(player);
  pushFeed(`Nowa broń: ${player.weapon.name}. Zaraz kogoś jebniesz.`);
  weaponEl.textContent = player.weapon.name;
  playVoice("weapon");
}

function spawnPickup(type, position) {
  const colorMap = {
    health: 0xff6d66,
    fury: 0xffd34d,
    weapon: 0x74b6ff,
  };
  const mesh = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.22, 0),
    new THREE.MeshStandardMaterial({
      color: colorMap[type],
      emissive: colorMap[type],
      emissiveIntensity: 0.5,
      roughness: 0.38,
      metalness: 0.28,
    })
  );
  mesh.position.copy(position).setY(0.7);
  world.add(mesh);
  pickups.push({
    type,
    mesh,
    life: PICKUP_LIFETIME,
    baseY: 0.7,
    spin: 1.8 + Math.random(),
  });
}

function collectPickup(pickup) {
  if (pickup.type === "health") {
    player.health = Math.min(player.maxHealth, player.health + 26);
    announce("APTECZKA", "pickup", 0.75);
    pushFeed("Apteczka złapana. Wracasz do jatki.");
  } else if (pickup.type === "fury") {
    state.furyCharge = Math.min(100, state.furyCharge + 34);
    announce("ŁADUNEK FURII", "pickup", 0.85);
    pushFeed("Furia rośnie. Jeszcze chwila i odpalisz tryb masakry.");
  } else {
    cyclePlayerWeapon();
    announce(`BROŃ: ${player.weapon.name.toUpperCase()}`, "pickup", 0.85);
  }
  flashImpact(0.55);
}

function updatePickups(dt) {
  for (let i = pickups.length - 1; i >= 0; i -= 1) {
    const pickup = pickups[i];
    pickup.life -= dt;
    pickup.mesh.rotation.y += dt * pickup.spin * 2.4;
    pickup.mesh.position.y = pickup.baseY + Math.sin(state.time * pickup.spin * 3.2) * 0.12;

    if (pickup.mesh.position.distanceTo(player.group.position) < 1.35 && state.running && !player.dead) {
      collectPickup(pickup);
      world.remove(pickup.mesh);
      pickups.splice(i, 1);
      continue;
    }

    if (pickup.life <= 0) {
      world.remove(pickup.mesh);
      pickups.splice(i, 1);
    }
  }
}

function respawnEnemy(enemy) {
  enemy.dead = false;
  enemy.deathTimer = 0;
  enemy.health = enemy.maxHealth;
  enemy.attackTimer = 0;
  enemy.attackCooldown = 0.45 + Math.random() * 0.4;
  enemy.attackHitDone = false;
  enemy.invuln = 0.25;
  enemy.flashTimer = 0;
  enemy.root.position.y = 0;
  enemy.group.rotation.z = 0;
  enemy.group.position.copy(randomMapPoint());
  enemy.facing = Math.random() * Math.PI * 2;
  enemy.group.rotation.y = enemy.facing;
  enemy.hitVelocity.set(0, 0, 0);
  enemy.velocity.set(0, 0, 0);
  enemy.roamTarget.copy(randomMapPoint());
  enemy.target = null;
  enemy.pressureBias = Math.random();
  enemy.weaponIndex = Math.floor(Math.random() * weapons.length);
  enemy.weapon = weapons[enemy.weaponIndex];
  replaceWeapon(enemy);
}

function clampToMap(position) {
  position.x = THREE.MathUtils.clamp(position.x, -MAP_HALF, MAP_HALF);
  position.z = THREE.MathUtils.clamp(position.z, -MAP_HALF, MAP_HALF);
}

function spawnBlood(position, count) {
  for (let i = 0; i < count; i += 1) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.06 + Math.random() * 0.1, 6, 6),
      new THREE.MeshBasicMaterial({
        color: Math.random() > 0.3 ? 0x921116 : 0xd11c26,
        transparent: true,
        opacity: 0.88,
      })
    );
    mesh.position.copy(position);
    world.add(mesh);
    particles.push({
      mesh,
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 4.4,
        1.9 + Math.random() * 2.2,
        (Math.random() - 0.5) * 4.4
      ),
      gravity: 5.2,
      life: 0.72 + Math.random() * 0.48,
      maxLife: 1.2,
    });
  }

  for (let i = 0; i < Math.max(2, Math.floor(count / 6)); i += 1) {
    const pool = new THREE.Mesh(
      new THREE.CircleGeometry(0.18 + Math.random() * 0.22, 14),
      new THREE.MeshBasicMaterial({
        color: 0x7d0d11,
        transparent: true,
        opacity: 0.5,
      })
    );
    pool.position.set(
      position.x + (Math.random() - 0.5) * 0.8,
      0.03,
      position.z + (Math.random() - 0.5) * 0.8
    );
    pool.rotation.x = -Math.PI / 2;
    world.add(pool);
    particles.push({
      mesh: pool,
      velocity: new THREE.Vector3(0, 0, 0),
      gravity: 0,
      life: 7 + Math.random() * 5,
      maxLife: 12,
      flatten: true,
    });
  }
}

function spawnSlash(position, color) {
  const mesh = new THREE.Mesh(
    new THREE.RingGeometry(0.18, 0.42, 18),
    new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    })
  );
  mesh.position.copy(position);
  mesh.rotation.x = -Math.PI / 2;
  world.add(mesh);
  particles.push({
    mesh,
    velocity: new THREE.Vector3(0, 0.2, 0),
    gravity: 0,
    life: 0.22,
    maxLife: 0.22,
    scaleUp: true,
  });
}

function updateParticles(dt) {
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const particle = particles[i];
    particle.life -= dt;
    if (particle.life <= 0) {
      world.remove(particle.mesh);
      particles.splice(i, 1);
      continue;
    }

    particle.velocity.y -= particle.gravity * dt;
    particle.mesh.position.addScaledVector(particle.velocity, dt);
    const alpha = Math.max(particle.life / particle.maxLife, 0);
    particle.mesh.material.opacity = alpha * 0.9;
    if (particle.scaleUp) {
      particle.mesh.scale.setScalar(1 + (1 - alpha) * 1.8);
    }
    if (particle.flatten) {
      particle.mesh.scale.setScalar(1 + (1 - alpha) * 0.45);
    }
  }
}

function updateCamera(dt) {
  const moveBob = Math.sin(player.moveTime * 7.2) * Math.min(player.velocity.length() * 0.012, 0.03);
  viewOffset.set(0, PLAYER_EYE_HEIGHT + moveBob - player.cameraKick * 0.25, 0);
  cameraPosition.copy(player.group.position).add(viewOffset);
  camera.position.lerp(cameraPosition, 1 - Math.exp(-dt * 16));
  camera.rotation.y = player.yaw;
  camera.rotation.x = THREE.MathUtils.clamp(player.pitch + player.cameraKick * 0.2, -MAX_PITCH, MAX_PITCH);
  camera.rotation.z = Math.sin(state.time * 9) * player.cameraKick * 0.12;
  camera.fov = THREE.MathUtils.lerp(camera.fov, state.furyTime > 0 ? 80 : 76, 1 - Math.exp(-dt * 8));
  camera.updateProjectionMatrix();
}

function updateHud() {
  healthEl.textContent = Math.max(0, Math.ceil(player.health)).toString().padStart(3, "0");
  scoreEl.textContent = String(state.score).padStart(5, "0");
  streakEl.textContent = `x${state.streak}`;
  multiplierEl.textContent = `x${state.comboMultiplier.toFixed(1)}`;
  timerEl.textContent = formatTime(state.time);
  weaponEl.textContent = player.weapon.name;
  crowdEl.textContent = String(enemies.filter((enemy) => !enemy.dead).length).padStart(2, "0");
  healthFillEl.style.width = `${(player.health / player.maxHealth) * 100}%`;
  comboFillEl.style.width = `${(state.comboTimer / COMBO_DECAY_TIME) * 100}%`;
  furyFillEl.style.width = `${
    (state.furyTime > 0 ? state.furyTime / FURY_DURATION : state.furyCharge / 100) * 100
  }%`;
  furyStatusEl.textContent = state.furyTime > 0 ? "AKTYWNA" : `${Math.round(state.furyCharge)}%`;
}

function animate() {
  requestAnimationFrame(animate);
  const rawDt = Math.min(clock.getDelta(), 0.033);

  if (state.hitstop > 0) {
    state.hitstop -= rawDt;
    renderer.render(scene, camera);
    return;
  }

  const dt = rawDt;
  state.time += dt;
  state.killSpeedBoost = Math.max(0, state.killSpeedBoost - dt);
  voiceState.cooldown = Math.max(0, voiceState.cooldown - dt);
  state.comboTimer = Math.max(0, state.comboTimer - dt);
  state.furyTime = Math.max(0, state.furyTime - dt);
  state.announcerTimer = Math.max(0, state.announcerTimer - dt);
  state.flashTimer = Math.max(0, state.flashTimer - dt);
  state.adTimer = Math.max(0, state.adTimer - dt);

  if (state.comboTimer <= 0 && state.comboCount > 0) {
    state.comboCount = 0;
    state.comboMultiplier = 1;
  }

  if (state.announcerTimer <= 0 && announcerEl) {
    announcerEl.className = "announcer";
  }

  if (impactFlashEl) {
    impactFlashEl.style.opacity = String(Math.min(state.flashTimer * 3.4, 0.42));
  }

  if (state.adTimer <= 0) {
    rotateAds();
  }

  if (state.running) {
    updatePlayer(dt);
    enemies.forEach((enemy) => updateEnemy(enemy, dt));
    updateHud();
  } else {
    updateViewModel(dt);
  }

  updatePickups(dt);
  updateParticles(dt);
  updateCamera(dt);
  renderer.render(scene, camera);
}

function handleKey(event, isDown) {
  const activeElement = document.activeElement;
  if (
    activeElement &&
    (activeElement.tagName === "INPUT" ||
      activeElement.tagName === "TEXTAREA" ||
      activeElement.isContentEditable)
  ) {
    return;
  }

  const key = event.key.toLowerCase();

  if (isDown && (key === "enter" || key === "return") && !state.running) {
    startGame();
    return;
  }

  if (isDown && key === "r" && state.gameOver) {
    startGame();
    return;
  }

  if (key === "w" || key === "arrowup") {
    input.up = isDown;
  } else if (key === "s" || key === "arrowdown") {
    input.down = isDown;
  } else if (key === "a" || key === "arrowleft") {
    input.left = isDown;
  } else if (key === "d" || key === "arrowright") {
    input.right = isDown;
  } else if (key === "shift") {
    input.sprint = isDown;
  } else if (isDown && key === "q") {
    input.dashQueued = true;
  } else if (isDown && key === " ") {
    input.attackQueued = true;
  } else if (isDown && key === "e") {
    input.heavyQueued = true;
  }
}

window.addEventListener("keydown", (event) => {
  if ([" ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
    event.preventDefault();
  }
  handleKey(event, true);
});

window.addEventListener("keyup", (event) => handleKey(event, false));

document.addEventListener("pointerlockchange", () => {
  state.pointerLocked = document.pointerLockElement === renderer.domElement;
});

document.addEventListener("mousemove", (event) => {
  if (!state.pointerLocked || !state.running || player.dead) {
    return;
  }

  player.yaw -= event.movementX * MOUSE_SENSITIVITY;
  player.pitch = THREE.MathUtils.clamp(
    player.pitch - event.movementY * MOUSE_SENSITIVITY,
    -MAX_PITCH,
    MAX_PITCH
  );
});

renderer.domElement.addEventListener("contextmenu", (event) => event.preventDefault());
if (!isTouchDevice) {
  renderer.domElement.addEventListener("pointerdown", (event) => {
    if (!state.running) {
      return;
    }

    if (!state.pointerLocked) {
      requestPointerLock();
      return;
    }

    if (event.button === 2) {
      input.heavyQueued = true;
    } else if (event.button === 0) {
      input.attackQueued = true;
    }
  });
}

touchButtons.forEach((button) => {
  const control = button.dataset.control;
  const onPress = (event) => {
    event.preventDefault();
    if (control === "attack") {
      input.attackQueued = true;
    } else if (control === "heavy") {
      input.heavyQueued = true;
    } else if (control === "dash") {
      input.dashQueued = true;
    } else {
      input[control] = true;
    }
  };
  const onRelease = (event) => {
    event.preventDefault();
    if (control !== "attack" && control !== "heavy" && control !== "dash") {
      input[control] = false;
    }
  };

  button.addEventListener("pointerdown", onPress);
  button.addEventListener("pointerup", onRelease);
  button.addEventListener("pointercancel", onRelease);
  button.addEventListener("pointerleave", onRelease);
});

startButton.addEventListener("click", () => {
  startGame();
});

initialsInput.addEventListener("input", () => {
  initialsInput.value = sanitizeInitials(initialsInput.value);
});

music.addEventListener("canplaythrough", () => {
  if (!state.running && musicStatusEl) {
    musicStatusEl.textContent = "Gotowa";
  }
});

music.addEventListener("error", () => {
  if (musicStatusEl) {
    musicStatusEl.textContent = "Brak pliku";
  }
  pushFeed("Nie udało się wczytać muzyki. Gra działa dalej bez loopa.");
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

if (isTouchDevice) {
  const JOYSTICK_RADIUS = 50;
  const LOOK_SENSITIVITY = 0.006;

  const moveJoystick = {
    zone: document.getElementById("move-joystick-zone"),
    base: document.getElementById("move-joystick-base"),
    knob: document.getElementById("move-joystick-knob"),
    active: false,
    touchId: null,
    originX: 0,
    originY: 0,
    dx: 0,
    dy: 0,
  };

  const lookJoystick = {
    zone: document.getElementById("look-joystick-zone"),
    base: document.getElementById("look-joystick-base"),
    knob: document.getElementById("look-joystick-knob"),
    active: false,
    touchId: null,
    originX: 0,
    originY: 0,
    dx: 0,
    dy: 0,
  };

  function setupJoystick(joystick, onMove) {
    joystick.zone.addEventListener("touchstart", (e) => {
      if (joystick.active) return;
      const touch = e.changedTouches[0];
      joystick.active = true;
      joystick.touchId = touch.identifier;
      joystick.originX = touch.clientX;
      joystick.originY = touch.clientY;
      joystick.dx = 0;
      joystick.dy = 0;
      const rect = joystick.zone.getBoundingClientRect();
      joystick.base.style.left = (touch.clientX - rect.left - 65) + "px";
      joystick.base.style.bottom = "auto";
      joystick.base.style.top = (touch.clientY - rect.top - 65) + "px";
      e.preventDefault();
    }, { passive: false });

    joystick.zone.addEventListener("touchmove", (e) => {
      for (const touch of e.changedTouches) {
        if (touch.identifier !== joystick.touchId) continue;
        let dx = touch.clientX - joystick.originX;
        let dy = touch.clientY - joystick.originY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > JOYSTICK_RADIUS) {
          dx = (dx / dist) * JOYSTICK_RADIUS;
          dy = (dy / dist) * JOYSTICK_RADIUS;
        }
        joystick.dx = dx / JOYSTICK_RADIUS;
        joystick.dy = dy / JOYSTICK_RADIUS;
        joystick.knob.style.transform = `translate(${dx}px, ${dy}px)`;
        onMove(joystick.dx, joystick.dy);
      }
      e.preventDefault();
    }, { passive: false });

    function endTouch(e) {
      for (const touch of e.changedTouches) {
        if (touch.identifier !== joystick.touchId) continue;
        joystick.active = false;
        joystick.touchId = null;
        joystick.dx = 0;
        joystick.dy = 0;
        joystick.knob.style.transform = "translate(0px, 0px)";
        onMove(0, 0);
      }
    }

    joystick.zone.addEventListener("touchend", endTouch, { passive: false });
    joystick.zone.addEventListener("touchcancel", endTouch, { passive: false });
  }

  setupJoystick(moveJoystick, (dx, dy) => {
    const deadzone = 0.15;
    input.up = dy < -deadzone;
    input.down = dy > deadzone;
    input.left = dx < -deadzone;
    input.right = dx > deadzone;
    input.sprint = Math.abs(dx) > 0.75 || Math.abs(dy) > 0.75;
  });

  setupJoystick(lookJoystick, () => {});

  setInterval(() => {
    if (state.running && !player.dead && lookJoystick.active) {
      player.yaw -= lookJoystick.dx * LOOK_SENSITIVITY * 4;
      player.pitch = THREE.MathUtils.clamp(
        player.pitch - lookJoystick.dy * LOOK_SENSITIVITY * 3,
        -MAX_PITCH,
        MAX_PITCH
      );
    }
  }, 16);

}
