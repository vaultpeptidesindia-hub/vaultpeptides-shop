"use client";

import { useEffect, useRef } from "react";

export function SpineBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let animFrameId: number;
    let renderer: import("three").WebGLRenderer;
    let scene: import("three").Scene;
    let camera: import("three").PerspectiveCamera;

    const init = async () => {
      const THREE = await import("three");
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const container = containerRef.current!;

      // ── Scene ───────────────────────────────────────────
      scene = new THREE.Scene();
      scene.background = new THREE.Color("#F2EBE1");
      scene.fog = new THREE.FogExp2("#F2EBE1", 0.02);

      camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 0, 40);

      renderer = new THREE.WebGLRenderer({ antialias: window.innerWidth > 768, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1 : 1.25));
      renderer.shadowMap.enabled = window.innerWidth > 768;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);

      // ── Lighting ────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0xfff5e6, 0.6));

      const dirLight = new THREE.DirectionalLight(0xfff0dd, 1.2);
      dirLight.position.set(10, 20, 15);
      dirLight.castShadow = renderer.shadowMap.enabled;
      scene.add(dirLight);

      const backLight = new THREE.DirectionalLight(0x8c6239, 0.8);
      backLight.position.set(-10, -10, -10);
      scene.add(backLight);

      const greenLight = new THREE.PointLight(0x50c878, 1.5, 50);
      greenLight.position.set(15, 5, 5);
      scene.add(greenLight);

      const orangeLight = new THREE.PointLight(0xff8c00, 1.5, 50);
      orangeLight.position.set(-15, -5, 5);
      scene.add(orangeLight);

      // ── Spine ───────────────────────────────────────────
      const mainSpineObj = new THREE.Group();
      scene.add(mainSpineObj);

      const numVertebrae = 26;
      const spineHeight = 42;

      const boneMaterial = new THREE.MeshStandardMaterial({ color: 0x2a1c14, roughness: 0.6, metalness: 0.3 });
      const discMaterial = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7, metalness: 0.1, transparent: true, opacity: 0.95 });
      const nerveMaterial = new THREE.MeshStandardMaterial({ color: 0xfff0d4, roughness: 0.4, metalness: 0.1, emissive: 0x5a4a1a, emissiveIntensity: 0.8 });
      const muscleMaterial = new THREE.MeshStandardMaterial({ color: 0x7a1c11, roughness: 0.7, metalness: 0.15 });
      const bloodMaterial = new THREE.MeshStandardMaterial({ color: 0xcc0000, roughness: 0.3, metalness: 0.2, emissive: 0x220000 });

      const bodyGeo = new THREE.CylinderGeometry(1, 1.05, 1.2, 12);
      const spinousGeo = new THREE.ConeGeometry(0.4, 2.5, 6);
      const transGeo = new THREE.CylinderGeometry(0.3, 0.2, 3.5, 6);
      const discGeo = new THREE.CylinderGeometry(1.05, 1.05, 0.35, 12);
      const cordGeo = new THREE.CylinderGeometry(0.45, 0.45, 2.0, 10);
      const rootGeo = new THREE.CylinderGeometry(0.06, 0.18, 4.0, 6);
      const muscleGeo = new THREE.SphereGeometry(0.5, 8, 8);
      const arteryGeo = new THREE.CylinderGeometry(0.06, 0.06, 2.0, 5);
      const capGeo = new THREE.CylinderGeometry(0.02, 0.04, 1.5, 4);

      for (let i = 0; i < numVertebrae; i++) {
        const vertGroup = new THREE.Group();
        const t = i / (numVertebrae - 1);
        const scale = 1.0 + t * 1.2;

        const bodyMesh = new THREE.Mesh(bodyGeo, boneMaterial);
        bodyMesh.scale.set(1.5 * scale, 1, 1.5 * scale);
        bodyMesh.castShadow = true;
        bodyMesh.receiveShadow = true;

        const spinousMesh = new THREE.Mesh(spinousGeo, boneMaterial);
        spinousMesh.scale.set(scale, scale, scale);
        spinousMesh.rotation.x = Math.PI / 2;
        spinousMesh.position.set(0, 0, 2 * scale);
        spinousMesh.castShadow = true;

        const transMesh = new THREE.Mesh(transGeo, boneMaterial);
        transMesh.scale.set(scale, 1, scale);
        transMesh.rotation.z = Math.PI / 2;
        transMesh.position.set(0, 0, 0.8 * scale);
        transMesh.castShadow = true;

        if (i < numVertebrae - 1) {
          const discMesh = new THREE.Mesh(discGeo, discMaterial);
          discMesh.scale.set(1.45 * scale, 1, 1.45 * scale);
          discMesh.position.y = -0.8;
          vertGroup.add(discMesh);
        }

        const cordMesh = new THREE.Mesh(cordGeo, nerveMaterial);
        cordMesh.scale.set(scale, 1, scale);
        cordMesh.position.set(0, 0, 1.1 * scale);

        const leftRoot = new THREE.Mesh(rootGeo, nerveMaterial);
        leftRoot.scale.set(scale, scale, scale);
        leftRoot.rotation.z = Math.PI / 2;
        leftRoot.rotation.y = -Math.PI / 6;
        leftRoot.position.set(-1.6 * scale, -0.1, 1.1 * scale);

        const rightRoot = new THREE.Mesh(rootGeo, nerveMaterial);
        rightRoot.scale.set(scale, scale, scale);
        rightRoot.rotation.z = -Math.PI / 2;
        rightRoot.rotation.y = Math.PI / 6;
        rightRoot.position.set(1.6 * scale, -0.1, 1.1 * scale);

        const leftInnerMuscle = new THREE.Mesh(muscleGeo, muscleMaterial);
        leftInnerMuscle.position.set(-0.6 * scale, 0, 1.6 * scale);
        leftInnerMuscle.scale.set(0.8 * scale, 2.4 * scale, 0.9 * scale);
        leftInnerMuscle.castShadow = true;

        const rightInnerMuscle = new THREE.Mesh(muscleGeo, muscleMaterial);
        rightInnerMuscle.position.set(0.6 * scale, 0, 1.6 * scale);
        rightInnerMuscle.scale.set(0.8 * scale, 2.4 * scale, 0.9 * scale);
        rightInnerMuscle.castShadow = true;

        const leftOuterMuscle = new THREE.Mesh(muscleGeo, muscleMaterial);
        leftOuterMuscle.position.set(-1.2 * scale, 0, 0.5 * scale);
        leftOuterMuscle.scale.set(0.8 * scale, 2.6 * scale, 0.7 * scale);
        leftOuterMuscle.castShadow = true;

        const rightOuterMuscle = new THREE.Mesh(muscleGeo, muscleMaterial);
        rightOuterMuscle.position.set(1.2 * scale, 0, 0.5 * scale);
        rightOuterMuscle.scale.set(0.8 * scale, 2.6 * scale, 0.7 * scale);
        rightOuterMuscle.castShadow = true;

        const antArtery = new THREE.Mesh(arteryGeo, bloodMaterial);
        antArtery.scale.set(scale, 1, scale);
        antArtery.position.set(0, 0, 0.7 * scale);

        const leftCap = new THREE.Mesh(capGeo, bloodMaterial);
        leftCap.scale.set(scale, scale, scale);
        leftCap.rotation.z = Math.PI / 2.5;
        leftCap.position.set(-0.7 * scale, 0.2, 0.9 * scale);

        const rightCap = new THREE.Mesh(capGeo, bloodMaterial);
        rightCap.scale.set(scale, scale, scale);
        rightCap.rotation.z = -Math.PI / 2.5;
        rightCap.position.set(0.7 * scale, 0.2, 0.9 * scale);

        vertGroup.add(bodyMesh, spinousMesh, transMesh, cordMesh, leftRoot, rightRoot,
          leftInnerMuscle, rightInnerMuscle, leftOuterMuscle, rightOuterMuscle,
          antArtery, leftCap, rightCap);

        const yPos = spineHeight / 2 - t * spineHeight;
        const zPos = Math.sin(t * Math.PI * 2.5) * 2.5;
        const xRot = Math.cos(t * Math.PI * 2.5) * 0.2;

        vertGroup.position.set(0, yPos, zPos);
        vertGroup.rotation.x = xRot;
        mainSpineObj.add(vertGroup);
      }

      mainSpineObj.position.y = 2;

      // Mobile scale/offset
      if (window.innerWidth < 768) {
        mainSpineObj.position.x = -2;
        mainSpineObj.scale.set(0.65, 0.65, 0.65);
      }

      // ── Blood cell particles ─────────────────────────────
      const bloodCellCount = 150;
      const bloodCellGeo = new THREE.BufferGeometry();
      const bloodCellPos = new Float32Array(bloodCellCount * 3);
      for (let i = 0; i < bloodCellCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 2.5;
        bloodCellPos[i * 3] = Math.cos(angle) * radius;
        bloodCellPos[i * 3 + 1] = (Math.random() - 0.5) * 45;
        bloodCellPos[i * 3 + 2] = Math.sin(angle) * radius + 1;
      }
      bloodCellGeo.setAttribute("position", new THREE.BufferAttribute(bloodCellPos, 3));
      const bloodCellMat = new THREE.PointsMaterial({ color: 0xdd0000, size: 0.2, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending });
      const bloodCellParticles = new THREE.Points(bloodCellGeo, bloodCellMat);
      scene.add(bloodCellParticles);

      // ── Background particles ─────────────────────────────
      const particleCount = 400;
      const particleGeo = new THREE.BufferGeometry();
      const defaultPositions = new Float32Array(particleCount * 3);
      const currentPositions = new Float32Array(particleCount * 3);
      const colorArray = new Float32Array(particleCount * 3);
      const particlePalette = [
        new THREE.Color("#50C878"), new THREE.Color("#FFD700"),
        new THREE.Color("#FF8C00"), new THREE.Color("#00CED1"),
      ];

      for (let i = 0; i < particleCount; i++) {
        defaultPositions[i * 3] = (Math.random() - 0.5) * 60;
        defaultPositions[i * 3 + 1] = (Math.random() - 0.5) * 60;
        defaultPositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
        currentPositions[i * 3] = defaultPositions[i * 3];
        currentPositions[i * 3 + 1] = defaultPositions[i * 3 + 1];
        currentPositions[i * 3 + 2] = defaultPositions[i * 3 + 2];
        const c = particlePalette[Math.floor(Math.random() * particlePalette.length)];
        colorArray[i * 3] = c.r;
        colorArray[i * 3 + 1] = c.g;
        colorArray[i * 3 + 2] = c.b;
      }

      particleGeo.setAttribute("position", new THREE.BufferAttribute(currentPositions, 3));
      particleGeo.setAttribute("color", new THREE.BufferAttribute(colorArray, 3));
      const particleMat = new THREE.PointsMaterial({ size: 0.35, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending });
      const particleMesh = new THREE.Points(particleGeo, particleMat);
      scene.add(particleMesh);

      // ── GSAP scroll: rotate spine ────────────────────────
      gsap.to(mainSpineObj.rotation, {
        y: Math.PI * 4,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      // ── Animate ─────────────────────────────────────────
      const clock = new THREE.Clock();

      const animate = () => {
        animFrameId = requestAnimationFrame(animate);
        if (document.hidden) return;

        const elapsed = clock.getElapsedTime();

        mainSpineObj.position.y = 2 + Math.sin(elapsed * 1.5) * 0.002;
        particleMesh.rotation.y = elapsed * 0.05;
        bloodCellParticles.rotation.y = elapsed * 0.05;

        const bPos = bloodCellParticles.geometry.attributes.position.array as Float32Array;
        for (let i = 1; i < bloodCellCount * 3; i += 3) {
          bPos[i] += 0.06;
          if (bPos[i] > 22) bPos[i] = -22;
        }
        bloodCellParticles.geometry.attributes.position.needsUpdate = true;

        const positions = particleGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount * 3; i++) {
          positions[i] += (defaultPositions[i] - positions[i]) * 0.03;
        }
        particleGeo.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
      };

      animate();

      // ── Resize ──────────────────────────────────────────
      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener("resize", onResize);

      // Store cleanup
      (container as HTMLDivElement & { _cleanup?: () => void })._cleanup = () => {
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(animFrameId);
        ScrollTrigger.getAll().forEach((t) => t.kill());
        renderer.dispose();
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      };
    };

    init();

    return () => {
      const el = containerRef.current as (HTMLDivElement & { _cleanup?: () => void }) | null;
      if (el?._cleanup) el._cleanup();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
