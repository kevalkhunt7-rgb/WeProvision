const mongoose = require('mongoose');
const Portfolio = require('../models/Portfolio');
const { readDb, writeDb } = require('../config/db');

// Safe query builder without Mongoose CastError on _id
const getPortfolioQuery = (id) => {
  if (!id) return {};
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ id }, { _id: id }] };
  }
  return { id };
};

// Get all portfolio items
exports.getAllPortfolio = async (req, res) => {
  try {
    let projects = [];

    // 1. Query MongoDB Database if connected
    if (Portfolio.db && Portfolio.db.readyState === 1) {
      projects = await Portfolio.find().sort({ createdAt: -1 }).lean();
    } else {
      const db = readDb();
      projects = db.portfolio || [];
    }

    res.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error('❌ Error fetching portfolio items:', error.message);
    const db = readDb();
    res.json({
      success: true,
      count: db.portfolio ? db.portfolio.length : 0,
      data: db.portfolio || [],
      fallback: true,
    });
  }
};

// Get portfolio item by ID
exports.getPortfolioById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = getPortfolioQuery(id);
    let project = null;

    if (Portfolio.db && Portfolio.db.readyState === 1) {
      project = await Portfolio.findOne(query).lean();
    }

    if (!project) {
      const db = readDb();
      project = (db.portfolio || []).find((p) => p.id === id || p._id === id);
    }

    if (!project) {
      return res.status(404).json({ success: false, message: 'Portfolio item not found' });
    }

    res.json({ success: true, data: project });
  } catch (error) {
    console.error('❌ Error fetching portfolio item by ID:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching portfolio item' });
  }
};

// Create new Portfolio Item
exports.createPortfolio = async (req, res) => {
  try {
    const {
      title,
      category,
      subtitle,
      description,
      client,
      image,
      techStack,
      metrics,
      features,
      status,
      featured,
    } = req.body;

    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title and category are required fields.',
      });
    }

    const projId = req.body.id || `proj-${Date.now()}`;
    const newProjectData = {
      id: projId,
      title,
      category,
      subtitle: subtitle || '',
      description: description || '',
      client: client || 'Client',
      image: image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      techStack: Array.isArray(techStack) ? techStack : (techStack ? String(techStack).split(',').map(s => s.trim()) : []),
      metrics: metrics || [],
      features: features || [],
      status: status || 'Published',
      featured: featured !== undefined ? featured : false,
    };

    let createdProject = newProjectData;

    // Save to MongoDB Database
    if (Portfolio.db && Portfolio.db.readyState === 1) {
      createdProject = await Portfolio.create(newProjectData);
    }

    // Sync with local db.json store
    const db = readDb();
    if (!db.portfolio) db.portfolio = [];
    db.portfolio.unshift(newProjectData);
    writeDb(db);

    res.status(201).json({
      success: true,
      message: 'Portfolio item stored successfully in database',
      data: createdProject,
    });
  } catch (error) {
    console.error('❌ Error creating portfolio item:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Error creating portfolio item' });
  }
};

// Update Portfolio Item
exports.updatePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    const query = getPortfolioQuery(id);
    const updateFields = { ...req.body };

    if (typeof updateFields.techStack === 'string') {
      updateFields.techStack = updateFields.techStack.split(',').map((s) => s.trim()).filter(Boolean);
    }

    let updatedProject = null;

    // Update in MongoDB Database
    if (Portfolio.db && Portfolio.db.readyState === 1) {
      updatedProject = await Portfolio.findOneAndUpdate(
        query,
        { $set: updateFields },
        { returnDocument: 'after', runValidators: true, upsert: true }
      );
    }

    // Sync with local db.json store
    const db = readDb();
    if (db.portfolio) {
      const idx = db.portfolio.findIndex((p) => p.id === id || p._id === id);
      if (idx !== -1) {
        db.portfolio[idx] = { ...db.portfolio[idx], ...updateFields };
        writeDb(db);
        if (!updatedProject) updatedProject = db.portfolio[idx];
      }
    }

    res.json({
      success: true,
      message: 'Portfolio item updated successfully in database',
      data: updatedProject,
    });
  } catch (error) {
    console.error('❌ Error updating portfolio item:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Error updating portfolio item' });
  }
};

// Delete Portfolio Item
exports.deletePortfolio = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === 'undefined') {
      return res.status(400).json({ success: false, message: 'Valid portfolio item ID is required for deletion' });
    }

    let deletedDoc = null;

    // 1. Delete from MongoDB Database
    if (Portfolio.db && Portfolio.db.readyState === 1) {
      const query = getPortfolioQuery(id);
      deletedDoc = await Portfolio.findOneAndDelete(query);
      if (!deletedDoc) {
        deletedDoc = await Portfolio.findOneAndDelete({ id });
      }
      if (!deletedDoc && mongoose.Types.ObjectId.isValid(id)) {
        deletedDoc = await Portfolio.findOneAndDelete({ _id: id });
      }
    }

    // 2. Also remove from local db.json store
    const db = readDb();
    if (db.portfolio && Array.isArray(db.portfolio)) {
      const initialCount = db.portfolio.length;
      db.portfolio = db.portfolio.filter((p) => String(p.id) !== String(id) && String(p._id) !== String(id));
      if (db.portfolio.length !== initialCount) {
        writeDb(db);
      }
    }

    res.json({
      success: true,
      message: 'Portfolio item deleted successfully from database',
      id,
    });
  } catch (error) {
    console.error('❌ Error deleting portfolio item:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Error deleting portfolio item' });
  }
};
