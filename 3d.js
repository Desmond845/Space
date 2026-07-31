import * as THREE from "/node_modules/three/build/three.module.js";
import { OrbitControls } from "/node_modules/three/examples/jsm/controls/OrbitControls.js";

/* -----------------------------
   SCENE SETUP
------------------------------*/

const scene = new THREE.Scene();

/* -----------------------------
   CAMERA
------------------------------*/

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

function createStarField() {

  const starGeometry = new THREE.BufferGeometry();
  const starCount = 3000;

  const positions = [];
  
  for (let i = 0; i < starCount; i++) {

    positions.push(
      (Math.random() - 0.5) * 200,
      (Math.random() - 0.5) * 200,
      (Math.random() - 0.5) * 200
    );
  }

  starGeometry.setAttribute(
      "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );

  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7
  });

  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}

createStarField();

// scene.fog = new THREE.FogExp2(0x000000, 0.02);
camera.position.set(0, 4, 8);

/* -----------------------------
   RENDERER
------------------------------*/

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

// Enable shadows
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

/* -----------------------------
   CONTROLS
------------------------------*/

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;
controls.enablePan = true;
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI;

/* -----------------------------
   LIGHTING
------------------------------*/

// Main Sun Light
const sunlight = new THREE.DirectionalLight(0xffffff, 3);
sunlight.position.set(5, 8, 5);

sunlight.castShadow = true;

// Improve shadow quality
sunlight.shadow.mapSize.width = 2048;
sunlight.shadow.mapSize.height = 2048;
sunlight.shadow.camera.left = -20;
sunlight.shadow.camera.right = 20;

sunlight.shadow.camera.top = 20;
sunlight.shadow.camera.bottom = -20;

sunlight.shadow.camera.near = 1;
sunlight.shadow.camera.far = 60;

scene.add(sunlight);
const helper = new THREE.CameraHelper(sunlight.shadow.camera);
// scene.add(helper);
/* -----------------------------
   GROUND PLANE
------------------------------*/

// const planeGeometry = new THREE.PlaneGeometry(60, 60);
// const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });

// const plane = new THREE.Mesh(planeGeometry, planeMaterial);

// plane.rotation.x = -Math.PI / 2;
// plane.position.y = -2;

// plane.receiveShadow = true;
// 
// scene.add(plane);

/* -----------------------------
   SUN
------------------------------*/

const sunGeometry = new THREE.SphereGeometry(1, 32, 32);
// const sunMaterial = new THREE.MeshStandardMaterial({
//   color: "yellow",
//   emissive: "orange",
//   emissiveIntensity: 0.6,
// });
const sunMaterial = new THREE.MeshStandardMaterial({
  color: 0xffdd55,
  emissive: 0xff8800,
  emissiveIntensity: 1.5
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);

sun.castShadow = true;


const auraGeometry = new THREE.SphereGeometry(1.3, 32, 32);

const auraMaterial = new THREE.MeshBasicMaterial({
  color: 0xffaa33,
  transparent: true,
  opacity: 0.4
});

const aura = new THREE.Mesh(auraGeometry, auraMaterial);
// sun.add(aura);
scene.add(sun);
const flareParticles = new THREE.BufferGeometry();

const flareCount = 500;

const positions = [];

for(let i=0; i<flareCount; i++){
  const radius = 1.3 + Math.random() * 0.4;

  const theta = Math.random() * Math.PI * 2;
  const phi = Math.random() * Math.PI;

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);

  positions.push(x, y, z);
}

flareParticles.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(positions, 3)
);
const flareMaterial = new THREE.PointsMaterial({
  color: "orange",
  size: 0.05,
  transparent: true,
  opacity: 0.8
});
const flares = new THREE.Points(flareParticles, flareMaterial);
sun.add(flares);
flares.rotation.y += 0.002;
flares.rotation.x += 0.001;
/* -----------------------------
   PLANET DATA
------------------------------*/
function createLabel(name){
  const div = document.createElement("div");
  div.textContent = name;
  div.style.color = "white";
  div.style.position = "absolute";
  div.style.fontSize = "12px";
  div.style.pointerEvents = "none";

//   document.body.appendChild(div);

  return div;
}

const planetsData = [
  { name: "Mercury", a: 2, b: 1.8, radius: 0.15, color: "gray", speed: 0.03, spinSpeed: 0.02 },

  { name: "Venus", a: 3, b: 2.7, radius: 0.35, color: "orange", speed: 0.022, spinSpeed: 0.018 },

  { name: "Earth", a: 4, b: 3.9, radius: 0.38, color: "blue", speed: 0.018, spinSpeed: 0.03, tilt:23.5 },

  { name: "Mars", a: 5, b: 4.6, radius: 0.25, color: "red", speed: 0.015, spinSpeed: 0.025 },

  { name: "Jupiter", a: 7, b: 6.4, radius: 0.9, color: "#d2b48c", speed: 0.009, spinSpeed: 0.04 },

  { name: "Saturn", a: 9, b: 8.3, radius: 0.75, color: "#f5deb3", speed: 0.007, spinSpeed: 0.038 },

  { name: "Uranus", a: 11, b: 10.4, radius: 0.55, color: "#87ceeb", speed: 0.005, spinSpeed: 0.03 },

  { name: "Neptune", a: 13, b: 12.1, radius: 0.5, color: "#4169e1", speed: 0.004, spinSpeed: 0.032 }
];
// const planetsData = [
//   {
//     name: "Mercury",
//     // distance: 2,
//     a: 2,
//     b: 1.6,
//     radius: 0.2,
//     color: "gray",
//     speed: 0.02,
//     spinSpeed: 0.02,
//   },
//   {
//     name: "Venus",
//     // distance: 3.5,
//     a: 4,
//     b: 3.6,
//     radius: 0.4,
//     color: "orange",
//     speed: 0.015,
//     spinSpeed: 0.015,
//   },
//   {
//     name: "Earth",
//     // distance: 5,
//     a: 6,
//     b: 5.5,
//     radius: 0.6,
//     color: "blue",
//     speed: 0.012,
//     spinSpeed: 0.02,
//   },
//   {
//     name: "Mars",
//     // distance: 6.5,
//     a: 8,
//     b: 7.2,
//     radius: 0.5,
//     color: "red",
//     speed: 0.01,
//     spinSpeed: 0.018,
//   },
// ];

const planets = [];

const MAX_TAIL_LENGTH = 50;
/* -----------------------------
   CREATE PLANETS
------------------------------*/

planetsData.forEach((data) => {
  const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
//   const material = new THREE.MeshStandardMaterial({ color: data.color });
const material = new THREE.MeshStandardMaterial({
  color: data.color,
  roughness: 0.7,
  metalness: 0.1
});
  const planet = new THREE.Mesh(geometry, material);

  planet.castShadow = true;
  planet.receiveShadow = true;
  // Store movement data
  planet.userData = {
    // distance: data.distance,
    a: data.a,
    b: data.b,
    name: data.name,
    angle: Math.random() * Math.PI * 2,
    orbitSpeed: data.speed,
    spinSpeed: data.spinSpeed,
    trailPoints: [],
    tail: []
  };
  planet.userData.trailPoints = []
  const trailGeometry = new THREE.BufferGeometry();
const trailMaterial = new THREE.PointsMaterial({
    size: 0.07,
    transparent: true,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    color: data.color
            // color: `hsl(${Math.random() * 360}, 70%, 60% )`

})
const trailLine = new THREE.Points(trailGeometry, trailMaterial);
scene.add(trailLine);
// planet.userData,trail = trailLine
planet.userData.trailLine = trailLine;
planet.userData.trailLine.frustumCulled = false;
if(data.tilt)
{
    planet.rotation.z = THREE.MathUtils.degToRad(data.tilt)

}   
planet.userData.label = createLabel(data.name);
document.body.appendChild(planet.userData.label)
// Initial placement
  planet.position.set(data.a, 0, 0);
if(data.name === "Saturn") {
    const ringGeometry = new THREE.RingGeometry(
  data.radius * 1.3,
  data.radius * 2,
  64
);

const ringMaterial = new THREE.MeshBasicMaterial({
  color: 0xf5deb3,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.7
});

const ring = new THREE.Mesh(ringGeometry, ringMaterial);

ring.rotation.x = Math.PI / 2;

planet.add(ring);
}
if(data.name === "Earth") {
    // ---- MOON ----
const moonGeo = new THREE.SphereGeometry(0.1, 32, 32);
const moonMat = new THREE.MeshStandardMaterial({ color: "lightgray" });

const moon = new THREE.Mesh(moonGeo, moonMat);

moon.castShadow = true;
moon.receiveShadow = true;

// Store moon orbit data
moon.userData = {
  distance: 0.8,
  angle: 0,
  speed: 0.05
};

// Attach moon to Earth
planet.add(moon);

// Save reference
planet.userData.moon = moon;
}
  scene.add(planet);
  planets.push(planet);

const atmosphereGeometry = new THREE.SphereGeometry(data.radius * 1.15, 32, 32);

const atmosphereMaterial = new THREE.MeshBasicMaterial({
  color: data.color,
  transparent: true,
  opacity: 0.2
});

const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);

planet.add(atmosphere);

});

/* -----------------------------
   ANIMATION LOOP
------------------------------*/
function updatePlanetOrbit (planet) {
    // Orbit
    planet.userData.angle += planet.userData.orbitSpeed;

    const x = Math.cos(planet.userData.angle) * planet.userData.a;
    const z = Math.sin(planet.userData.angle) * planet.userData.b;
// const distance = Math.sqrt(x*x + z*z);
//  const dynamicSpeed = planet.userData.speed * (6 / distance);
//  planet.userData.angle += dynamicSpeed;
    planet.position.set(x, 0, z);

    // Planet self spin
    planet.rotation.y += planet.userData.spinSpeed;
if(planet.userData.moon){

  const moon = planet.userData.moon;

  moon.userData.angle += moon.userData.speed;

  moon.position.set(
    Math.cos(moon.userData.angle) * moon.userData.distance,
    0,
    Math.sin(moon.userData.angle) * moon.userData.distance
  );
}
    // const trailPoints = 
    // planet.userData.trailPoints;
    // trailPoints.push(
    //     // new THREE.Vector3(
    //     //     planet.position.x,
    //     //     planet.position.y,
    //     //     planet.position.z
    //     // )
    //     planet.position.clone()
    // )
    
    // if(trailPoints.length > 150) {
    //     planet.userData.trailPoints.shift()
    // }
    // if(trailPoints.length > 1) {

    //     planet.userData.trailLine.geometry.setFromPoints(
    //         trail
    //     )
    // }
    const trailPoints = planet.userData.trailPoints;

// Add newest position
trailPoints.push(planet.position.clone());

// Limit tail length
const maxLength = 80;
if (trailPoints.length > maxLength) {
  trailPoints.shift();
}

// Convert positions
const positions = [];
const colors = [];

trailPoints.forEach((point, index) => {

  positions.push(point.x, point.y, point.z);

  // Fade older points
  const alpha = index / trailPoints.length;

  const color = new THREE.Color(planet.userData.color);
  color.multiplyScalar(alpha);

  colors.push(color.r, color.g, color.b);
});
// console.log(planet.userData.trailLine.geometry);
planet.userData.trailLine.geometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(positions, 3)
);

planet.userData.trailLine.geometry.setAttribute(
  "color",
  new THREE.Float32BufferAttribute(colors, 3)
);
planet.userData.tail.push(planet.position.clone());

if (planet.userData.tail.length > MAX_TAIL_LENGTH) {
  planet.userData.tail.shift();
}


if (planet.userData.tailLine) {
  scene.remove(planet.userData.tailLine);
}

const tailGeometry = new THREE.BufferGeometry().setFromPoints(
  planet.userData.tail
);

const tailMaterial = new THREE.LineBasicMaterial({
  color: planet.material.color,
  transparent: true,
  opacity: 0.5
});

const tailLine = new THREE.Line(tailGeometry, tailMaterial);


planet.userData.tailLine = tailLine;
scene.add(tailLine);

const vector = planet.position.clone();
  vector.project(camera);

  const Vx = (vector.x * 0.5 + 0.5) * window.innerWidth;
  const Vy = (-vector.y * 0.5 + 0.5) * window.innerHeight;
console.log(planet.userData.label);
  planet.userData.label.style.transform =
    `translate(-50%, -50%) translate(${Vx}px, ${Vy}px)`;



  }
function animate() {
  requestAnimationFrame(animate);

  // Rotate Sun
  const sunRotation = 0.01
  sun.rotation.y += sunRotation;

  // Planet movement
  planets.forEach(
    updatePlanetOrbit
);

  controls.update();
  renderer.render(scene, camera);
}

animate();
/* -----------------------------
   CAMERA VIEW BUTTONS
------------------------------*/

function setCameraView(x, y, z) {
  camera.position.set(x, y, z);
  camera.lookAt(0, 0, 0);
  controls.update();
}

document.getElementById("topView").onclick = () => setCameraView(0, 8, 0);
document.getElementById("frontView").onclick = () => setCameraView(0, 2, 8);
document.getElementById("sideView").onclick = () => setCameraView(8, 2, 0);
document.getElementById("backView").onclick = () => setCameraView(0, 2, -8);

/* -----------------------------
   RESPONSIVE FIX
------------------------------*/

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});
