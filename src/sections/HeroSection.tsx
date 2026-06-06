import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const miniContainerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelRef = useRef<THREE.Group | null>(null);
  const scrollProgressRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!canvasContainerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    );
    camera.position.set(2.5, 0.5, 3);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 3.0; // increased for much brighter appearance
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    canvasContainerRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 0.5;
    controls.maxDistance = 8;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
    controls.enableZoom = false;
    controls.enablePan = false;
    controlsRef.current = controls;

    // ── Environment map (critical for metalness to show up) ──────────────
    // Procedural gradient env so no external HDR file needed
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    // Build a simple gradient sky as env
    const envScene = new THREE.Scene();
    envScene.background = null;
    const envSphere = new THREE.Mesh(
      new THREE.SphereGeometry(50, 32, 32),
      new THREE.MeshBasicMaterial({
        side: THREE.BackSide,
        vertexColors: true,
      })
    );
    // Colour the sphere verts: top = bright blue-white, bottom = warm amber
    const posAttr = envSphere.geometry.attributes.position;
    const colors: number[] = [];
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      const t = (y / 50 + 1) / 2; // 0 (bottom) → 1 (top)
      colors.push(
        0.15 + t * 0.75,  // R - brighter
        0.12 + t * 0.68,  // G - brighter
        0.25 + t * 0.95,  // B - brighter
      );
    }
    envSphere.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    envScene.add(envSphere);
    const envRT = pmremGenerator.fromScene(envScene as THREE.Scene);
    scene.environment = envRT.texture;
    pmremGenerator.dispose();

    // ── Lights ───────────────────────────────────────────────────────────
    // Strong ambient so nothing goes fully black
    const ambient = new THREE.AmbientLight(0xffffff, 3.5); // increased from 2.5
    scene.add(ambient);

    // Key light — front-left, very bright white
    const key = new THREE.DirectionalLight(0xffffff, 7.5); // increased from 6.0
    key.position.set(3, 5, 4);
    key.castShadow = true;
    scene.add(key);

    // Fill light — front-right, cool blue
    const fill = new THREE.DirectionalLight(0x88bbff, 4.0); // increased from 3.0
    fill.position.set(-4, 2, 3);
    scene.add(fill);

    // Rim / back light — warm accent from behind
    const rim = new THREE.DirectionalLight(0xffcc88, 2.8); // increased from 2.0
    rim.position.set(0, 3, -4);
    scene.add(rim);

    // Under-glow — subtle blue from below to lift the base
    const under = new THREE.DirectionalLight(0x4466cc, 1.8); // increased from 1.0
    under.position.set(0, -3, 2);
    scene.add(under);

    // Point lights for local hotspots
    const p1 = new THREE.PointLight(0xaaddff, 5.5, 10); // increased intensity
    p1.position.set(-2, 3, 2);
    scene.add(p1);

    const p2 = new THREE.PointLight(0xffaa44, 3.5, 8); // increased intensity
    p2.position.set(2.5, 1, 2);
    scene.add(p2);

    // Grid ground
    const grid = new THREE.GridHelper(10, 20, 0x111133, 0x111133);
    grid.position.y = -1.2;
    scene.add(grid);

    // Load laptop model
    const loader = new GLTFLoader();
    loader.load(
      '/assets/scene.gltf',
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3.0 / maxDim;
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            (child as THREE.Mesh).castShadow = true;
            (child as THREE.Mesh).receiveShadow = true;
            const mesh = child as THREE.Mesh;

            const applyMaterial = (mat: THREE.MeshStandardMaterial) => {
              const name = (mat.name || '').toLowerCase();
              const meshName = (mesh.name || '').toLowerCase();

              // ── Screen / display panel ─────────────────────────────
              if (
                name.includes('screen') || name.includes('display') ||
                name.includes('lcd') || name.includes('003') ||
                meshName.includes('screen') || meshName.includes('display')
              ) {
                mat.roughness = 0.05;
                mat.metalness = 0.0;
                mat.emissive = new THREE.Color(0x1a3a5e); // brighter emissive color
                mat.emissiveIntensity = 1.2; // increased from 0.8
                mat.envMapIntensity = 0.8; // increased from 0.5
                mat.needsUpdate = true;
              }

              // ── Body / lid / chassis ───────────────────────────────
              else if (
                name.includes('body') || name.includes('chassis') ||
                name.includes('lid') || name.includes('001') ||
                name.includes('case') || name.includes('shell')
              ) {
                // Keep original texture if present — just brighten it
                if (!mat.map) {
                  mat.color = new THREE.Color(0xd0d0d8); // brushed silver fallback
                }
                mat.metalness = 0.6;
                mat.roughness = 0.25;
                mat.envMapIntensity = 1.5;
                mat.needsUpdate = true;
              }

              // ── Frame / hinge / trim ───────────────────────────────
              else if (
                name.includes('frame') || name.includes('hinge') ||
                name.includes('trim') || name.includes('002')
              ) {
                mat.metalness = 0.8;
                mat.roughness = 0.18;
                mat.envMapIntensity = 1.8;
                mat.needsUpdate = true;
              }

              // ── Keyboard / palm rest / dark plastic ───────────────
              else if (
                name.includes('keyboard') || name.includes('key') ||
                name.includes('palm') || name.includes('004') ||
                name.includes('plastic') || name.includes('dark')
              ) {
                if (!mat.map) {
                  mat.color = new THREE.Color(0x1a1a1a);
                }
                mat.metalness = 0.05;
                mat.roughness = 0.6;
                mat.envMapIntensity = 0.5;
                mat.needsUpdate = true;
              }

              // ── Fallback: lift any remaining dark materials ─────────
              else {
                // Boost brightness without changing the hue
                if (mat.color) {
                  const hsl = { h: 0, s: 0, l: 0 };
                  mat.color.getHSL(hsl);
                  // If it's very dark (l < 0.15), lift it so it catches light
                  if (hsl.l < 0.15) {
                    mat.color.setHSL(hsl.h, hsl.s, 0.25);
                  }
                }
                mat.metalness = Math.max(mat.metalness ?? 0, 0.1);
                mat.roughness = Math.min(mat.roughness ?? 1, 0.7);
                mat.envMapIntensity = 1.0;
                mat.needsUpdate = true;
              }
            };

            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => applyMaterial(m as THREE.MeshStandardMaterial));
            } else if (mesh.material) {
              applyMaterial(mesh.material as THREE.MeshStandardMaterial);
            }
          }
        });

        scene.add(model);

        // ── Debug: log all mesh names so you can tune material rules ──
        console.group('🖥 Laptop GLTF mesh/material names');
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            console.log(`Mesh: "${mesh.name}" | Materials: ${mats.map((m: THREE.Material) => m.name || '(unnamed)').join(', ')}`);
          }
        });
        console.groupEnd();

        setLoaded(true);
      },
      undefined,
      (err) => {
        console.error('Error loading laptop model:', err);
      }
    );

    // Animation loop
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      controls.update();

      // Apply scroll-driven transforms
      const p = scrollProgressRef.current;
      const targetScale = 1 - p * 0.85;
      const targetX = p * 3.5;
      const targetY = -p * 0.3;

      scene.scale.setScalar(Math.max(targetScale, 0.15));
      scene.position.x = targetX;
      scene.position.y = targetY;

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // GSAP ScrollTrigger for headset animation
    const proxy = { progress: 0 };
    const tween = gsap.to(proxy, {
      progress: 1,
      duration: 1,
      ease: 'none',
      onUpdate: () => {
        scrollProgressRef.current = proxy.progress;
      },
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: '+=100%',
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Show mini headset after 60% progress
          if (miniContainerRef.current) {
            if (self.progress > 0.6) {
              miniContainerRef.current.style.opacity = '0.6';
            } else {
              miniContainerRef.current.style.opacity = '0';
            }
          }
          // Fade out logo and text as scroll progresses
          if (logoRef.current) {
            logoRef.current.style.opacity = String(Math.max(0, 1 - self.progress * 3));
            logoRef.current.style.transform = `translateY(${self.progress * 50}px)`;
          }
          if (textRef.current) {
            textRef.current.style.opacity = String(Math.max(0, 1 - self.progress * 2));
            textRef.current.style.transform = `translateY(${self.progress * 30}px)`;
          }
        },
      },
    });

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      controls.dispose();
      renderer.dispose();
      if (canvasContainerRef.current && renderer.domElement.parentNode === canvasContainerRef.current) {
        canvasContainerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={heroRef}
        className="hero-section relative w-full overflow-hidden"
        style={{
          height: '100vh',
          background: 'radial-gradient(ellipse at 50% 50%, #001a33 0%, #000D1A 70%, #000508 100%)',
        }}
      >
        {/* 3D Canvas */}
        <div
          ref={canvasContainerRef}
          className="absolute top-0 left-0 w-full h-full z-[1]"
          role="img"
          aria-label="3D laptop model - interactive"
          style={{ cursor: 'grab' }}
        />

        {/* Loading indicator */}
        {!loaded && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div
              className="font-mono-label text-sm uppercase tracking-[3px] animate-pulse"
              style={{ color: 'var(--text-secondary)' }}
            >
              Loading 3D Model...
            </div>
          </div>
        )}

        {/* Logo velixa */}
        <img
          ref={logoRef}
          src="/assets/logo-main.png"
          alt="Velixa Virtual Assistance"
          className="absolute z-[2] transition-opacity duration-300"
          style={{
            top: '500px',
            left: '25px',
            width: '400px',
            opacity: 0.9,
          }}
        />

        {/* Hero text content */}
        <div
          ref={textRef}
          className="absolute bottom-0 left-0 z-[2] flex flex-col justify-end h-full pointer-events-none"
          style={{ padding: '0 0 80px 80px' }}
        >
          <span
            className="font-mono-label text-xs uppercase tracking-[0.08em] mb-4"
            style={{ color: 'var(--text-secondary)' }}
          >

          </span>
          <h1
            className="font-display font-bold leading-[1.1] mb-4"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              color: 'var(--text-primary)',
              maxWidth: '500px',
            }}
          >
            Your Reliable Partner Behind the Scenes
          </h1>
          <p
            className="text-base leading-[1.65] mb-6"
            style={{
              color: 'var(--text-secondary)',
              maxWidth: '420px',
            }}
          >
            Organizing chaos, managing details, and keeping your business running
            smoothly — so you can focus on what matters most.
          </p>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="pointer-events-auto inline-flex items-center justify-center font-medium text-sm text-white rounded-full transition-all duration-300 hover:scale-[1.03]"
            style={{
              backgroundColor: 'var(--accent)',
              padding: '14px 32px',
              width: 'fit-content',
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = 'var(--accent-hover)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = 'var(--accent)';
            }}
          >
            Let&apos;s Work Together
          </a>
        </div>
      </div>

      {/* Mini floating headset */}
      <div
        ref={miniContainerRef}
        className="fixed z-[5] pointer-events-none hidden md:block transition-opacity duration-[600ms] ease-out"
        style={{
          top: '100px',
          right: '24px',
          width: '180px',
          height: '180px',
          opacity: 0,
        }}
      />
    </>
  );
}
