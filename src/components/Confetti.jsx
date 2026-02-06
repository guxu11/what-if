import { useEffect, useRef } from "react";

export function Confetti({ trigger }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width, height;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const colors = ["#3498db", "#e74c3c", "#27ae60", "#9b59b6", "#f39c12", "#1abc9c"];

    class ConfettiPiece {
      constructor(x, y) {
        this.x = x || Math.random() * width;
        this.y = y || -20;
        this.size = Math.random() * 8 + 4;
        this.speedX = (Math.random() - 0.5) * 10;
        this.speedY = Math.random() * 5 + 5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        this.opacity = 1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.speedY += 0.3; // Gravity
        this.opacity -= 0.008;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
      }
    }

    const pieces = [];
    for (let i = 0; i < 150; i++) {
      pieces.push(new ConfettiPiece(width / 2, height / 3));
    }

    let animationId;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const alivePieces = pieces.filter(p => p.opacity > 0);
      alivePieces.forEach(p => {
        p.update();
        p.draw();
      });

      if (alivePieces.length > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      className="confetti-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 2000,
        pointerEvents: "none",
      }}
    />
  );
}
