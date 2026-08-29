import React, { useEffect, useRef } from "react";

interface NeuralNode {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  baseAlpha: number;
  pulsePhase: number;
  pulseSpeed: number;
  color: string;
}

interface PulseParticle {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  color: string;
}

export const NeuralCanvas: React.FC<{
  className?: string;
  nodeCount?: number;
}> = ({ className = "", nodeCount = 28 }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0.5,
    y: 0.5,
    targetX: 0.5,
    targetY: 0.5,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Responsive node count - rich, visible, elegant across the whole screen
    const count = width < 640 ? 28 : width < 1024 ? 42 : nodeCount;

    const colors = [
      "rgba(59, 130, 246, ",  // MoSPI Blue
      "rgba(99, 102, 241, ",  // Indigo Neural
      "rgba(56, 189, 248, ",  // Cyan Data
      "rgba(245, 158, 11, ",  // Amber Audit
      "rgba(168, 85, 247, ",  // Purple Policy
    ];

    // Distribute nodes across the entire 3D box [width x height x depth]
    const nodes: NeuralNode[] = [];
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * width * 1.4,
        y: (Math.random() - 0.5) * height * 1.4,
        z: Math.random() * 700 - 350,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        vz: (Math.random() - 0.5) * 0.2,
        radius: 2.0 + Math.random() * 2.8,
        baseAlpha: 0.4 + Math.random() * 0.5,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.018 + Math.random() * 0.025,
        color: colors[i % colors.length],
      });
    }

    const pulses: PulseParticle[] = [];
    const maxPulses = 16;

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      mouseRef.current.targetX = clientX / width;
      mouseRef.current.targetY = clientY / height;
    };

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });

    let lastTime = performance.now();
    const fov = 480;

    const render = (time: number) => {
      lastTime = time;
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.03;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.03;

      const angleY = (mouseRef.current.x - 0.5) * 0.35 + Math.sin(time * 0.0003) * 0.1;
      const angleX = (mouseRef.current.y - 0.5) * 0.25 + Math.cos(time * 0.00025) * 0.08;

      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);

      const centerX = width / 2;
      const centerY = height / 2;

      interface Projected {
        projX: number;
        projY: number;
        scale: number;
        alpha: number;
        radius: number;
        color: string;
        index: number;
      }

      const projected: Projected[] = [];

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Drift slowly
        n.x += n.vx;
        n.y += n.vy;
        n.z += n.vz;
        n.pulsePhase += n.pulseSpeed;

        // Wrap around boundary bounds seamlessly
        const boundX = width * 0.75;
        const boundY = height * 0.75;
        const boundZ = 350;

        if (n.x > boundX) n.x = -boundX;
        if (n.x < -boundX) n.x = boundX;
        if (n.y > boundY) n.y = -boundY;
        if (n.y < -boundY) n.y = boundY;
        if (n.z > boundZ) n.z = -boundZ;
        if (n.z < -boundZ) n.z = boundZ;

        // 3D rotation
        const x1 = n.x * cosY - n.z * sinY;
        const z1 = n.z * cosY + n.x * sinY;

        const y1 = n.y * cosX - z1 * sinX;
        const z2 = z1 * cosX + n.y * sinX + 500;

        if (z2 <= 20) continue;

        const scale = fov / (fov + z2);
        const projX = centerX + x1 * scale;
        const projY = centerY + y1 * scale;

        const depthFade = Math.max(0.12, Math.min(0.85, (scale - 0.3) / 0.5));
        const pulse = 1 + Math.sin(n.pulsePhase) * 0.25;

        projected.push({
          projX,
          projY,
          scale,
          alpha: n.baseAlpha * depthFade,
          radius: Math.max(1, n.radius * scale * pulse),
          color: n.color,
          index: i,
        });
      }

      // Draw synaptic connections
      const maxDist = Math.min(width, height) * 0.42;

      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          const dx = p1.projX - p2.projX;
          const dy = p1.projY - p2.projY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const lineOpacity = (1 - dist / maxDist) * 0.35 * Math.min(p1.alpha, p2.alpha);
            if (lineOpacity > 0.01) {
              const gradient = ctx.createLinearGradient(p1.projX, p1.projY, p2.projX, p2.projY);
              gradient.addColorStop(0, `${p1.color}${lineOpacity})`);
              gradient.addColorStop(1, `${p2.color}${lineOpacity})`);

              ctx.beginPath();
              ctx.moveTo(p1.projX, p1.projY);
              ctx.lineTo(p2.projX, p2.projY);
              ctx.strokeStyle = gradient;
              ctx.lineWidth = Math.max(0.7, 1.25 * Math.min(p1.scale, p2.scale));
              ctx.stroke();

              // Spawn neural data pulses
              if (pulses.length < maxPulses && Math.random() < 0.0035) {
                pulses.push({
                  fromNode: i,
                  toNode: j,
                  progress: 0,
                  speed: 0.01 + Math.random() * 0.015,
                  color: p1.color,
                });
              }
            }
          }
        }
      }

      // Animate and render pulses
      for (let k = pulses.length - 1; k >= 0; k--) {
        const p = pulses[k];
        p.progress += p.speed;

        if (p.progress >= 1 || !projected[p.fromNode] || !projected[p.toNode]) {
          pulses.splice(k, 1);
          continue;
        }

        const p1 = projected[p.fromNode];
        const p2 = projected[p.toNode];
        const cx = p1.projX + (p2.projX - p1.projX) * p.progress;
        const cy = p1.projY + (p2.projY - p1.projY) * p.progress;
        const scale = p1.scale + (p2.scale - p1.scale) * p.progress;

        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(1, 2.2 * scale), 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}0.85)`;
        ctx.shadowColor = "#38BDF8";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Render Nodes with subtle soft glow
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];

        // Soft outer aura
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, p.radius * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha * 0.18})`;
        ctx.fill();

        // Node core
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();

        // Central pinpoint
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, p.radius * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha * 0.8})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
    };
  }, [nodeCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ touchAction: "none" }}
    />
  );
};
