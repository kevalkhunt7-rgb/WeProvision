import React from 'react';
import HeroSection from '../components/Hero';
import GameDevCom from '../components/GameDevCom';
import WebDevCom from '../components/WebDevCom';
import ThreeDModelingCom from '../components/ThreeDModelingCom';
import VrCom from '../components/VrCom';
import GraphicsCom from '../components/GraphicsCom';
import ToolsTechCom from '../components/ToolsTechCom';
import WhyChooseUs from '../components/WhyChooseUs';
import TestimonialsCom from '../components/TestimonialsCom';
import Footer from '../components/Footer';
import { useServices } from '../context/ServicesContext';

const Home = () => {
  const { isServiceActive } = useServices();

  return (
    <div className="relative bg-[#07050e] text-white selection:bg-[#F472B6] min-h-screen overflow-x-hidden">
      <HeroSection />
      {isServiceActive('game-dev') && <GameDevCom />}
      {isServiceActive('web-dev') && <WebDevCom />}
      {isServiceActive('3d-modeling') && <ThreeDModelingCom />}
      {isServiceActive('vr-dev') && <VrCom />}
      {isServiceActive('graphics-designing') && <GraphicsCom />}
      <ToolsTechCom />
      <TestimonialsCom/>
      <WhyChooseUs />
      <Footer/>
    </div>
  );
};

export default Home;