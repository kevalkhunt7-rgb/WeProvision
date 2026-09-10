const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'db.json');

const initialDbData = {
  services: [
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
  ],
  portfolio: [],
  jobs: [],
  applications: [],
  inquiries: [],
  settings: {
    maintenanceMode: false,
  },
  users: [
    {
      id: 'user-admin-1',
      name: 'Keval Patel',
      email: 'admin@weprovision.com',
      password: 'admin123',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    }
  ]
};

let inMemoryDb = { ...initialDbData };

const readDb = () => {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf-8');
      inMemoryDb = JSON.parse(data);
    }
  } catch (err) {
    console.warn('⚠️ Could not read db.json, using in-memory store:', err.message);
  }
  if (!inMemoryDb.users || inMemoryDb.users.length === 0) {
    inMemoryDb.users = [...initialDbData.users];
  }
  if (!inMemoryDb.settings) {
    inMemoryDb.settings = { maintenanceMode: false };
  }
  return inMemoryDb;
};

const writeDb = (data) => {
  inMemoryDb = data;
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.warn('⚠️ Could not write to db.json:', err.message);
  }
};

const connectDB = async () => {
  try {
    const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/weprovision';
    const conn = await mongoose.connect(dbUrl);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    
    // Automatically seed services into database upon connection if needed
    try {
      const { seedServices } = require('../util/seedServices');
      await seedServices();
    } catch (seedErr) {
      console.warn('⚠️ Auto-seeding database note:', seedErr.message);
    }

    return conn;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection skipped/failed: ${error.message}`);
  }
};

module.exports = connectDB;
module.exports.readDb = readDb;
module.exports.writeDb = writeDb;