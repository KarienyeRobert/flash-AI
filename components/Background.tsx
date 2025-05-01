"use client"

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const Background: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = window.innerWidth;
        let height = window.innerHeight;

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        window.addEventListener('resize', resize);
        resize();

        const particles: Array<{
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            color: string;
        }> = [];

        // Create particles
        const createParticles = () => {
            for (let i = 0; i < 50; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 5 + 1,
                    speedX: (Math.random() - 0.5) * 0.3,
                    speedY: (Math.random() - 0.5) * 0.3,
                    color: `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(
                        Math.random() * 100 + 155
                    )}, ${Math.floor(Math.random() * 255)}, ${Math.random() * 0.3 + 0.1})`,
                });
            }
        };

        createParticles();

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                p.x += p.speedX;
                p.y += p.speedY;

                if (p.x > width) p.x = 0;
                if (p.x < 0) p.x = width;
                if (p.y > height) p.y = 0;
                if (p.y < 0) p.y = height;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
            }

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <>
            <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700" />
            <div className="fixed inset-0 opacity-30">
                <canvas ref={canvasRef} className="w-full h-full" />
            </div>
            <motion.div
                className="fixed inset-0 bg-white opacity-10 backdrop-blur-[100px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ duration: 1 }}
            />
        </>
    );
};

export default Background;