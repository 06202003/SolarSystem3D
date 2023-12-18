import React, { useEffect, useRef } from 'react';
import NET from 'vanta/dist/vanta.net.min.js';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/all';
import '../styles/main.css';
import ThreeScene from '../components/solarsystem_scene.jsx';

gsap.registerPlugin(TextPlugin);

const HeroSection = () => {
  const vantaRef = useRef();
  const titleRef = useRef();
  const subtitleRef = useRef();
  const descriptionRef = useRef();

  useEffect(() => {
    // Vanta.js initialization
    const vantaEffect = NET({
      el: vantaRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      scale: 1.0,
      scaleMobile: 1.0,
      backgroundColor: 0x000000,
      color: 0xffffff,
      points: 5.0,
      maxDistance: 19.0,
      spacing: 25.0,
    });

    gsap.to(titleRef.current, {
      duration: 1,
      delay: 0,
      text: 'Solar System',
    });

    gsap.to(subtitleRef.current, {
      duration: 3,
      delay: 1.5,
      text: "let's explore the Cosmos together",
    });

    gsap.to(descriptionRef.current, {
      duration: 8,
      delay: 5,
      text: 'An immersive digital experience understanding the structure and characteristics of each planet.',
    });

    // Cleanup Vanta.js effect on component unmount
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []); // Empty dependency array ensures useEffect runs only once on mount

  return (
    <div className="hero bg-black" ref={vantaRef}>
      <div className="container-fluid">
        <div className="row d-flex justify-content-center align-items-center minheight">
          <div className="col-md-3 text-white ms-2">
            <h1 ref={titleRef} className="judul"></h1>
            <h5 ref={subtitleRef} className="subjudul"></h5>
            <p ref={descriptionRef} className="keterangan"></p>
          </div>
          <div className="col-md-8 pe-2" id="canvas">
            <ThreeScene />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
