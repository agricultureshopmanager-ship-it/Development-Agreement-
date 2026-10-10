/**
 * ShopSteward 3D Cyber Spatial HUD Scene
 * Scroll-Driven 3D Transformation with Three.js
 * Optimized for Desktop & Mobile (60-120 FPS)
 */

(function () {
  const container = document.getElementById('webgl-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  // 1. SCENE, CAMERA, RENDERER
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x05080b, 0.045);

  let width = window.innerWidth;
  let height = window.innerHeight;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 7.5);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  container.appendChild(renderer.domElement);

  // 2. ROOT GROUPS
  const masterGroup = new THREE.Group();
  scene.add(masterGroup);

  const coreGroup = new THREE.Group();
  masterGroup.add(coreGroup);

  const explodedPanelsGroup = new THREE.Group();
  masterGroup.add(explodedPanelsGroup);

  // 3. LIGHTS
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const acidLight = new THREE.PointLight(0xc8ff3d, 4.0, 18);
  acidLight.position.set(4, 3, 3);
  scene.add(acidLight);

  const cyanLight = new THREE.PointLight(0x55e6ff, 3.5, 18);
  cyanLight.position.set(-4, -2, 3);
  scene.add(cyanLight);

  const topRimLight = new THREE.DirectionalLight(0xeef4ee, 1.5);
  topRimLight.position.set(0, 8, 4);
  scene.add(topRimLight);

  // 4. SHADER / MATERIALS
  const darkObsidianMaterial = new THREE.MeshStandardMaterial({
    color: 0x070b0e,
    metalness: 0.9,
    roughness: 0.15,
  });

  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x243e30,
    wireframe: true,
    transparent: true,
    opacity: 0.4
  });

  const acidNeonMaterial = new THREE.MeshStandardMaterial({
    color: 0xc8ff3d,
    emissive: 0xc8ff3d,
    emissiveIntensity: 0.85,
    roughness: 0.1,
    metalness: 0.2
  });

  const cyanNeonMaterial = new THREE.MeshStandardMaterial({
    color: 0x55e6ff,
    emissive: 0x55e6ff,
    emissiveIntensity: 0.8,
    roughness: 0.15
  });

  const glassPanelMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x0e171c,
    metalness: 0.2,
    roughness: 0.1,
    transparent: true,
    opacity: 0.88,
    reflectivity: 0.9,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1
  });

  // 5. CYBER SPATIAL BACKGROUND WAVE / PARTICLES
  const waveParticleCount = 450;
  const waveGeo = new THREE.BufferGeometry();
  const wavePositions = new Float32Array(waveParticleCount * 3);
  const waveOriginalY = new Float32Array(waveParticleCount);

  let pIdx = 0;
  for (let x = -15; x <= 15; x += 1.5) {
    for (let z = -15; z <= 15; z += 1.5) {
      if (pIdx < waveParticleCount * 3) {
        wavePositions[pIdx] = x;
        const initialY = -2.5 + Math.sin(x * 0.3) * 0.4;
        wavePositions[pIdx + 1] = initialY;
        waveOriginalY[pIdx / 3] = initialY;
        wavePositions[pIdx + 2] = z;
        pIdx += 3;
      }
    }
  }

  waveGeo.setAttribute('position', new THREE.BufferAttribute(wavePositions, 3));
  const waveMat = new THREE.PointsMaterial({
    size: 0.055,
    color: 0xc8ff3d,
    transparent: true,
    opacity: 0.45,
    blending: THREE.AdditiveBlending
  });
  const waveGrid = new THREE.Points(waveGeo, waveMat);
  scene.add(waveGrid);

  // Floating ambient neon dust
  const dustCount = 180;
  const dustGeo = new THREE.BufferGeometry();
  const dustPositions = new Float32Array(dustCount * 3);
  for (let i = 0; i < dustCount * 3; i += 3) {
    dustPositions[i] = (Math.random() - 0.5) * 16;
    dustPositions[i + 1] = (Math.random() - 0.5) * 12;
    dustPositions[i + 2] = (Math.random() - 0.5) * 10;
  }
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
  const dustMat = new THREE.PointsMaterial({
    size: 0.04,
    color: 0x55e6ff,
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending
  });
  const dustParticles = new THREE.Points(dustGeo, dustMat);
  scene.add(dustParticles);

  // 6. CENTRAL 3D OBSIDIAN TERMINAL MONOLITH
  const monolithGeo = new THREE.BoxGeometry(2.4, 3.2, 0.45);
  const monolith = new THREE.Mesh(monolithGeo, darkObsidianMaterial);
  coreGroup.add(monolith);

  // Glowing Outer Chamfer Bevel Wireframe
  const wireGeo = new THREE.BoxGeometry(2.44, 3.24, 0.47);
  const wireMesh = new THREE.Mesh(wireGeo, wireframeMaterial);
  coreGroup.add(wireMesh);

  // Monolith Neon Edge Bars
  const topBarGeo = new THREE.BoxGeometry(2.3, 0.05, 0.48);
  const topBar = new THREE.Mesh(topBarGeo, acidNeonMaterial);
  topBar.position.y = 1.55;
  coreGroup.add(topBar);

  const botBarGeo = new THREE.BoxGeometry(2.3, 0.05, 0.48);
  const botBar = new THREE.Mesh(botBarGeo, cyanNeonMaterial);
  botBar.position.y = -1.55;
  coreGroup.add(botBar);

  // 7. 3D EMBODIED HOLOGRAPHIC STEWARD KEY (SIGNATURE LOGO)
  const keyGroup = new THREE.Group();
  keyGroup.position.set(0, 0, 0.38);
  coreGroup.add(keyGroup);

  // Key Head Torus
  const keyHeadGeo = new THREE.TorusGeometry(0.52, 0.09, 18, 48);
  const keyHead = new THREE.Mesh(keyHeadGeo, acidNeonMaterial);
  keyHead.position.y = 0.55;
  keyGroup.add(keyHead);

  // Key Stem
  const keyStemGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.3, 24);
  const keyStem = new THREE.Mesh(keyStemGeo, acidNeonMaterial);
  keyStem.position.y = -0.45;
  keyGroup.add(keyStem);

  // Key Cut 1
  const cut1Geo = new THREE.BoxGeometry(0.32, 0.12, 0.09);
  const cut1 = new THREE.Mesh(cut1Geo, acidNeonMaterial);
  cut1.position.set(0.16, -0.65, 0);
  keyGroup.add(cut1);

  // Key Cut 2
  const cut2Geo = new THREE.BoxGeometry(0.24, 0.1, 0.09);
  const cut2 = new THREE.Mesh(cut2Geo, acidNeonMaterial);
  cut2.position.set(0.12, -0.9, 0);
  keyGroup.add(cut2);

  // 8. CYBERNETIC ORBITAL LASER RINGS
  const ring1Geo = new THREE.TorusGeometry(2.8, 0.016, 16, 96);
  const ring1 = new THREE.Mesh(ring1Geo, acidNeonMaterial);
  ring1.rotation.x = Math.PI / 2.3;
  coreGroup.add(ring1);

  const ring2Geo = new THREE.TorusGeometry(2.3, 0.012, 16, 96);
  const ring2 = new THREE.Mesh(ring2Geo, cyanNeonMaterial);
  ring2.rotation.x = Math.PI / 1.7;
  ring2.rotation.y = 0.4;
  coreGroup.add(ring2);

  // 9. EXPLODED 3D SPATIAL DATA PANELS (FOR SCROLL TRANSFORMATION)
  // Panel 1: POS Billing Live HUD (Left Wing)
  const posPanelGeo = new THREE.BoxGeometry(2.2, 1.4, 0.08);
  const posPanel = new THREE.Mesh(posPanelGeo, glassPanelMaterial);
  posPanel.position.set(-3.2, 0.8, -0.5);
  posPanel.rotation.y = 0.35;
  explodedPanelsGroup.add(posPanel);

  // Panel 2: AI Neural Telemetry HUD (Right Wing)
  const aiPanelGeo = new THREE.BoxGeometry(2.2, 1.4, 0.08);
  const aiPanel = new THREE.Mesh(aiPanelGeo, glassPanelMaterial);
  aiPanel.position.set(3.2, -0.4, -0.5);
  aiPanel.rotation.y = -0.35;
  explodedPanelsGroup.add(aiPanel);

  // Panel 3: Udhaar Khaata / Ledger (Top Floating)
  const ledgerPanelGeo = new THREE.BoxGeometry(2.6, 0.9, 0.08);
  const ledgerPanel = new THREE.Mesh(ledgerPanelGeo, glassPanelMaterial);
  ledgerPanel.position.set(0, 2.5, -1.0);
  ledgerPanel.rotation.x = 0.25;
  explodedPanelsGroup.add(ledgerPanel);

  // Dynamic Canvas Texture for POS Panel
  const posCanvas = document.createElement('canvas');
  posCanvas.width = 512;
  posCanvas.height = 320;
  const pCtx = posCanvas.getContext('2d');
  pCtx.fillStyle = '#080d11';
  pCtx.fillRect(0, 0, 512, 320);
  pCtx.fillStyle = '#c8ff3d';
  pCtx.font = 'bold 22px monospace';
  pCtx.fillText('// POS BILLING MATRIX', 24, 45);
  pCtx.fillStyle = '#8e9995';
  pCtx.font = '16px monospace';
  pCtx.fillText('INVOICE #9482', 24, 90);
  pCtx.fillText('ITEM: IFFCO UREA 45KG', 24, 130);
  pCtx.fillStyle = '#55e6ff';
  pCtx.font = 'bold 36px monospace';
  pCtx.fillText('TOTAL: ₹ 2,250.00', 24, 200);
  pCtx.fillStyle = '#c8ff3d';
  pCtx.font = '14px monospace';
  pCtx.fillText('● THERMAL PRINTER LINKED', 24, 260);

  const posTexture = new THREE.CanvasTexture(posCanvas);
  const posScreenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.1, 1.3),
    new THREE.MeshBasicMaterial({ map: posTexture, transparent: true, opacity: 0.92 })
  );
  posScreenMesh.position.set(-3.2, 0.8, -0.45);
  posScreenMesh.rotation.y = 0.35;
  explodedPanelsGroup.add(posScreenMesh);

  // Initial Explosion State: tucked tightly inside the monolith
  let explosionFactor = 0; // 0 = closed/monolith, 1 = fully exploded

  // 10. SCROLL PROGRESSION ENGINE
  let currentScroll = 0;
  let targetScroll = 0;

  function updateScroll() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
    targetScroll = Math.min(Math.max(scrollY / maxScroll, 0), 1);
  }
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  // 11. POINTER INTERACTION (MOUSE / TOUCH / GYRO)
  let mouseX = 0;
  let mouseY = 0;
  let targetRotX = 0;
  let targetRotY = 0;

  function onPointerMove(e) {
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    mouseX = (clientX / window.innerWidth) * 2 - 1;
    mouseY = -(clientY / window.innerHeight) * 2 + 1;

    targetRotY = mouseX * 0.45;
    targetRotX = -mouseY * 0.35;
  }
  window.addEventListener('mousemove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  // Optional Gyroscope for Mobile Devices
  if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') {
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma !== null && e.beta !== null) {
        targetRotY = (e.gamma / 45) * 0.3;
        targetRotX = ((e.beta - 45) / 45) * 0.2;
      }
    }, { passive: true });
  }

  // 12. RESIZE HANDLER
  function onResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (width < 768) {
      camera.position.set(0, 0, 9.5);
    } else {
      camera.position.set(0, 0, 7.5);
    }
  }
  window.addEventListener('resize', onResize);
  onResize();

  // 13. VISIBILITY OBSERVER
  let isVisible = true;
  document.addEventListener('visibilitychange', () => {
    isVisible = !document.hidden;
  });

  // 14. ANIMATION LOOP
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    // Smooth scroll interpolation
    currentScroll += (targetScroll - currentScroll) * 0.08;

    // SCROLL STAGES BEHAVIOR:
    // Stage 1 (0.0 to 0.25): Hero view - Monolith centered, subtle float
    // Stage 2 (0.25 to 0.65): Explodes outward into 3D Spatial Wings (POS + AI HUDs)
    // Stage 3 (0.65 to 1.0): Rotates to side view to frame pricing & contact HUD

    if (currentScroll < 0.2) {
      explosionFactor += (0 - explosionFactor) * 0.08;
    } else if (currentScroll >= 0.2 && currentScroll < 0.75) {
      const stageProgress = (currentScroll - 0.2) / 0.55;
      explosionFactor += (Math.min(stageProgress * 1.3, 1) - explosionFactor) * 0.08;
    } else {
      explosionFactor += (0.3 - explosionFactor) * 0.08;
    }

    // Apply Explosion Spread to spatial panels
    posPanel.position.x = -1.2 - explosionFactor * 2.2;
    posScreenMesh.position.x = posPanel.position.x;
    posPanel.position.z = -0.2 - explosionFactor * 0.6;
    posScreenMesh.position.z = posPanel.position.z + 0.05;

    aiPanel.position.x = 1.2 + explosionFactor * 2.2;
    aiPanel.position.z = -0.2 - explosionFactor * 0.6;

    ledgerPanel.position.y = 1.7 + explosionFactor * 1.0;
    ledgerPanel.position.z = -0.5 - explosionFactor * 0.7;

    // Master rotation driven by scroll + pointer
    const baseRotY = (currentScroll * Math.PI * 1.8);
    const baseRotX = (currentScroll * 0.4);

    masterGroup.rotation.y += ((baseRotY + targetRotY) - masterGroup.rotation.y) * 0.06;
    masterGroup.rotation.x += ((baseRotX + targetRotX) - masterGroup.rotation.x) * 0.06;

    // Lateral translation on desktop when scrolled
    if (width >= 1024) {
      const targetPosX = (currentScroll < 0.2) ? 1.6 : (currentScroll < 0.7 ? 0 : -1.8);
      masterGroup.position.x += (targetPosX - masterGroup.position.x) * 0.06;
    } else {
      masterGroup.position.x += (0 - masterGroup.position.x) * 0.06;
    }

    // Subtle idle floating
    coreGroup.position.y = Math.sin(elapsed * 1.8) * 0.09;
    keyGroup.position.y = Math.sin(elapsed * 2.4) * 0.06;

    // Laser rings rotation
    ring1.rotation.z += 0.009;
    ring2.rotation.z -= 0.012;

    // Wave particles dynamic wave effect
    const wavePos = waveGeo.attributes.position.array;
    for (let i = 0; i < waveParticleCount; i++) {
      const idx = i * 3;
      const x = wavePos[idx];
      const z = wavePos[idx + 2];
      wavePos[idx + 1] = waveOriginalY[i] + Math.sin(elapsed * 2.2 + x * 0.4 + z * 0.3) * 0.35;
    }
    waveGeo.attributes.position.needsUpdate = true;

    // Dust particles drift
    const dustArray = dustGeo.attributes.position.array;
    for (let i = 1; i < dustCount * 3; i += 3) {
      dustArray[i] += 0.004;
      if (dustArray[i] > 6) dustArray[i] = -6;
    }
    dustGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  animate();
})();
