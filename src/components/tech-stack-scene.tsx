"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A slowly rotating 3D cloud of DVT's tech-stack logos (bundled in
 * /public/tech-stack). Logos are placed on a fibonacci sphere, fade with depth
 * and drift toward the pointer for a subtle parallax effect. Rendered on a
 * transparent canvas so the navy page background shows through.
 */

const LOGOS = [
  "android-studio",
  "angular",
  "bitbucket",
  "bootstrap",
  "bower",
  "c",
  "chef",
  "docker",
  "git",
  "github",
  "grunt",
  "html5",
  "ionic",
  "jasmine",
  "jenkins",
  "java",
  "jquery",
  "kotlin",
  "maven",
  "ms-sql",
  "ms-azure",
  "node-js",
  "nginx",
  "npm",
  "objective-c",
  "postgre",
  "sass",
  "spring",
  "subversion",
  "swift",
  "teamcity",
  "xamarin",
  "xcode",
];

const RADIUS = 3.4;

export default function TechStackScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    );
    camera.position.z = 8.5;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const loader = new THREE.TextureLoader();
    const sprites: THREE.Sprite[] = [];
    const disposables: { dispose: () => void }[] = [];

    // Fibonacci-sphere distribution keeps the logos evenly spaced.
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    LOGOS.forEach((logo, i) => {
      const y = 1 - (i / (LOGOS.length - 1)) * 2; // 1 -> -1
      const ringRadius = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;

      const position = new THREE.Vector3(
        Math.cos(theta) * ringRadius,
        y,
        Math.sin(theta) * ringRadius,
      ).multiplyScalar(RADIUS);

      loader.load(`/tech-stack/${logo}.svg`, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        texture.minFilter = THREE.LinearMipmapLinearFilter;

        const material = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          opacity: 0.85,
          depthTest: false,
          depthWrite: false,
        });

        const sprite = new THREE.Sprite(material);
        sprite.position.copy(position);
        sprite.scale.setScalar(0.95);
        group.add(sprite);
        sprites.push(sprite);

        disposables.push(texture, material);
      });
    });

    // Pointer parallax (normalised -1..1), lerped for smoothness.
    const pointer = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", handlePointerMove);

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    const worldPosition = new THREE.Vector3();
    let frameId = 0;
    let isVisible = true;

    const handleVisibility = () => {
      isVisible = document.visibilityState === "visible";
      if (isVisible && !prefersReducedMotion) {
        frameId = requestAnimationFrame(animate);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    const animate = () => {
      if (!prefersReducedMotion) {
        group.rotation.y += 0.0016;

        targetRotation.x += (pointer.y * 0.25 - targetRotation.x) * 0.05;
        targetRotation.y += (pointer.x * 0.25 - targetRotation.y) * 0.05;
        group.rotation.x = targetRotation.x + Math.sin(Date.now() * 0.0002) * 0.05;
      }

      group.updateMatrixWorld();

      // Fade + scale each logo by its depth so the back of the cloud recedes.
      for (const sprite of sprites) {
        sprite.getWorldPosition(worldPosition);
        const depth = (worldPosition.z + RADIUS) / (RADIUS * 2); // 0 back -> 1 front
        (sprite.material as THREE.SpriteMaterial).opacity =
          0.12 + depth * 0.78;
        sprite.scale.setScalar(0.72 + depth * 0.5);
      }

      renderer.render(scene, camera);

      if (isVisible && !prefersReducedMotion) {
        frameId = requestAnimationFrame(animate);
      }
    };

    // Kick off (or render a single static frame for reduced-motion users).
    if (prefersReducedMotion) {
      group.rotation.set(0.2, 0.6, 0);
      const renderOnce = () => {
        group.updateMatrixWorld();
        for (const sprite of sprites) {
          sprite.getWorldPosition(worldPosition);
          const depth = (worldPosition.z + RADIUS) / (RADIUS * 2);
          (sprite.material as THREE.SpriteMaterial).opacity = 0.12 + depth * 0.78;
          sprite.scale.setScalar(0.72 + depth * 0.5);
        }
        renderer.render(scene, camera);
      };
      // Re-render as textures finish loading in.
      const interval = setInterval(renderOnce, 200);
      const stop = setTimeout(() => clearInterval(interval), 4000);
      disposables.push({ dispose: () => clearTimeout(stop) });
      disposables.push({ dispose: () => clearInterval(interval) });
    } else {
      frameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      for (const item of disposables) item.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
