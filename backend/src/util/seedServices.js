const Service = require('../models/Service');
const { readDb } = require('../config/db');

const initialServicesData = [
  {
    id: 'game-dev',
    title: 'GAME DEVELOPMENT',
    category: 'Interactive Gaming & Real-time Engines',
    model: '/3dModels/gameController.glb',
    tagline: 'Immersive gameplay experiences, interactive real-time worlds, and engaging digital games with high-fidelity physics.',
    items: ['Game Architecture & Engine Programming', 'Unreal Engine 5 & Unity Systems', 'Multiplayer & Real-time Networking'],
    color: '#EC4899',
    active: true,
    projectsCount: 14,
    status: 'Active'
  },
  {
    id: 'software-dev',
    title: 'SOFTWARE DEVELOPMENT',
    category: 'Enterprise Infrastructure & Systems',
    model: '/3dModels/futuristic_sci-fi_energy_core.glb',
    tagline: 'Powerful enterprise technology engineered for mission-critical challenges and high-throughput cloud architectures.',
    items: ['Custom Distributed Software', 'High-Performance API Pipelines', 'Cloud Architecture & Microservices'],
    color: '#A855F7',
    active: true,
    projectsCount: 22,
    status: 'Active'
  },
  {
    id: '3d-modeling',
    title: '3D MODELING & CGI',
    category: 'Visual Media & Digital Assets',
    model: '/3dModels/drone.glb',
    tagline: 'From initial concept sketches to fully realized production-ready 3D assets, procedural shaders, and hard-surface models.',
    items: ['3D Hard-Surface & Character Modeling', 'Photorealistic Product Visualization', 'PBR Texture & Custom Shader Design'],
    color: '#C084FC',
    active: true,
    projectsCount: 38,
    status: 'Active'
  },
  {
    id: 'web-dev',
    title: 'WEB DEVELOPMENT',
    category: 'Next-Gen Web & Immersive UI',
    model: '/3dModels/hologram.glb',
    tagline: 'Modern, scalable web applications featuring custom WebGL shaders, fluid motion, and responsive interface architectures.',
    items: ['Full-Stack Web Architectures', 'Three.js & WebGL Visualizations', 'High-Performance React Applications'],
    color: '#06B6D4',
    active: true,
    projectsCount: 45,
    status: 'Active'
  },
  {
    id: 'vr-dev',
    title: 'VR & SPATIAL COMPUTING',
    category: 'Immersive Spatial Environments',
    model: '/3dModels/sci-fi_pedestal.glb',
    tagline: 'Spatial experiences that transcend 2D screens, offering natural interactions, headset integration, and digital twins.',
    items: ['Virtual Reality (VR) Applications', 'Spatial Interface Design & UX', 'Interactive 3D Showrooms'],
    color: '#3B82F6',
    active: true,
    projectsCount: 19,
    status: 'Active'
  },
  {
    id: 'graphics-designing',
    title: 'GRAPHICS & BRANDING',
    category: 'Brand Identity & Visual Design',
    model: '/3dModels/design_cube.glb',
    tagline: 'Striking visual designs, brand identities, UI/UX systems, and marketing collateral for forward-thinking enterprises.',
    items: ['Brand Architecture & Identity Guidelines', 'UI/UX Design Systems', '3D Motion Graphics & Animation'],
    color: '#10B981',
    active: true,
    projectsCount: 29,
    status: 'Active'
  }
];

const seedServices = async () => {
  try {
    if (!Service.db || Service.db.readyState !== 1) {
      console.warn('⚠️ MongoDB not connected yet. Skipping DB seed.');
      return false;
    }

    // Only seed if collection is completely empty
    const count = await Service.countDocuments();
    if (count > 0) {
      return true;
    }

    const localDb = readDb();
    const servicesToSeed = (localDb.services && localDb.services.length > 0) 
      ? localDb.services 
      : initialServicesData;

    for (const service of servicesToSeed) {
      await Service.findOneAndUpdate(
        { id: service.id },
        {
          id: service.id,
          title: service.title,
          category: service.category,
          model: service.model || '',
          tagline: service.tagline,
          items: service.items || [],
          color: service.color || '#8B5CF6',
          active: service.active !== undefined ? service.active : true,
          projectsCount: service.projectsCount || 0,
          status: service.status || (service.active ? 'Active' : 'Inactive')
        },
        { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
      );
    }

    console.log(`✅ Successfully seeded ${servicesToSeed.length} services into MongoDB database.`);
    return true;
  } catch (error) {
    console.error('❌ Error seeding services to MongoDB:', error.message);
    return false;
  }
};

module.exports = {
  initialServicesData,
  seedServices
};
