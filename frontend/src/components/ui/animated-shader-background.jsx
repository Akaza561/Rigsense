import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const AnoAI = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      antialias: false, // turn off heavy antialias
      alpha: true,
    });

    // 🔥 Cap pixel ratio (VERY IMPORTANT)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 🔥 Slightly lower internal resolution for performance
    renderer.setSize(width * 0.9, height * 0.9, false);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    container.appendChild(renderer.domElement);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new THREE.Vector2(width * 0.9, height * 0.9),
        },
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;

        #define NUM_OCTAVES 2

        float rand(vec2 n) {
          return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 u = fract(p);
          u = u*u*(3.0-2.0*u);

          float res = mix(
            mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
            mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
          return res * res;
        }

        float fbm(vec2 x) {
          float v = 0.0;
          float a = 0.4;
          vec2 shift = vec2(100);
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));

          for (int i = 0; i < NUM_OCTAVES; ++i) {
            v += a * noise(x);
            x = rot * x * 2.0 + shift;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 p = (gl_FragCoord.xy - iResolution.xy * 0.5) / iResolution.y * 6.0;

          vec4 o = vec4(0.0);
          float f = 2.0 + fbm(p + vec2(iTime * 3.0, 0.0)) * 0.4;

          // 🔥 Reduced from 35 → 20
          for (float i = 0.0; i < 20.0; i++) {
            vec2 v = p + cos(i * i + (iTime + p.x * 0.05) * 0.02 + i * vec2(13.0, 11.0)) * 3.0;

            vec4 color = vec4(
              0.2 + 0.3 * sin(i * 0.3 + iTime * 0.3),
              0.4 + 0.4 * cos(i * 0.2 + iTime * 0.4),
              0.8 + 0.2 * sin(i * 0.4 + iTime * 0.2),
              1.0
            );

            o += color * exp(-length(v * f) * 0.6);
          }

          o = pow(o / 15.0, vec4(1.3));
          gl_FragColor = vec4(o.rgb, 0.85);
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let frameId;
    const animate = () => {
      material.uniforms.iTime.value += 0.015; // slower + smoother
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      renderer.setSize(w * 0.9, h * 0.9, false);
      material.uniforms.iResolution.value.set(w * 0.9, h * 0.9);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};

export default AnoAI;