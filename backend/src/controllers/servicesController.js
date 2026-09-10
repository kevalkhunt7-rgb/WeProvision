const mongoose = require('mongoose');
const Service = require('../models/Service');
const { readDb, writeDb } = require('../config/db');
const { seedServices } = require('../util/seedServices');

// Helper to safely build query without Mongoose CastError on _id
const getServiceQuery = (id) => {
  if (!id) return {};
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ id }, { _id: id }] };
  }
  return { id };
};

// Get all services
exports.getAllServices = async (req, res) => {
  try {
    let services = [];

    // 1. Query MongoDB Database if connected
    if (Service.db && Service.db.readyState === 1) {
      services = await Service.find().sort({ createdAt: 1 }).lean();
    }

    // 2. Fallback or Initial Seed check if DB is empty
    if (!services || services.length === 0) {
      const db = readDb();
      services = db.services || [];

      // Attempt to seed MongoDB if connected now
      if (Service.db && Service.db.readyState === 1) {
        await seedServices();
        services = await Service.find().sort({ createdAt: 1 }).lean();
      }
    }

    res.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error('❌ Error fetching services:', error.message);
    // Safe Fallback to local DB store
    const db = readDb();
    res.json({
      success: true,
      count: db.services ? db.services.length : 0,
      data: db.services || [],
      fallback: true,
    });
  }
};

// Get single service by ID
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = getServiceQuery(id);
    let service = null;

    if (Service.db && Service.db.readyState === 1) {
      service = await Service.findOne(query).lean();
    }

    if (!service) {
      const db = readDb();
      service = (db.services || []).find((s) => s.id === id || s._id === id);
    }

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.json({ success: true, data: service });
  } catch (error) {
    console.error('❌ Error fetching service by ID:', error.message);
    res.status(500).json({ success: false, message: 'Server error fetching service' });
  }
};

// Create new Service
exports.createService = async (req, res) => {
  try {
    const { id, title, category, model, tagline, items, color, active, projectsCount } = req.body;

    if (!title || !category || !tagline) {
      return res.status(400).json({
        success: false,
        message: 'Title, category, and tagline are required fields.',
      });
    }

    const serviceId = id || title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const newServiceData = {
      id: serviceId,
      title,
      category,
      model: model || '',
      tagline,
      items: items || [],
      color: color || '#8B5CF6',
      active: active !== undefined ? active : true,
      projectsCount: Number(projectsCount) || 0,
      status: active !== false ? 'Active' : 'Inactive',
    };

    let createdService = newServiceData;

    // Save to MongoDB Database
    if (Service.db && Service.db.readyState === 1) {
      createdService = await Service.create(newServiceData);
    }

    // Sync with local db.json store
    const db = readDb();
    if (!db.services) db.services = [];
    db.services.push(newServiceData);
    writeDb(db);

    res.status(201).json({
      success: true,
      message: 'Service created successfully in database',
      data: createdService,
    });
  } catch (error) {
    console.error('❌ Error creating service:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Error creating service' });
  }
};

// Update Service
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const query = getServiceQuery(id);
    const updateFields = req.body;

    if (updateFields.active !== undefined) {
      updateFields.status = updateFields.active ? 'Active' : 'Inactive';
    }

    let updatedService = null;

    // Update in MongoDB Database
    if (Service.db && Service.db.readyState === 1) {
      updatedService = await Service.findOneAndUpdate(
        query,
        { $set: updateFields },
        { returnDocument: 'after', runValidators: true }
      );
    }

    // Sync with local db.json store
    const db = readDb();
    if (db.services) {
      const idx = db.services.findIndex((s) => s.id === id || s._id === id);
      if (idx !== -1) {
        db.services[idx] = { ...db.services[idx], ...updateFields };
        writeDb(db);
        if (!updatedService) updatedService = db.services[idx];
      }
    }

    if (!updatedService) {
      return res.status(404).json({ success: false, message: 'Service not found for update' });
    }

    res.json({
      success: true,
      message: 'Service updated successfully in database',
      data: updatedService,
    });
  } catch (error) {
    console.error('❌ Error updating service:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Error updating service' });
  }
};

// Toggle Service Status (Active / Inactive)
exports.toggleServiceStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const query = getServiceQuery(id);

    let service = null;
    if (Service.db && Service.db.readyState === 1) {
      service = await Service.findOne(query);
    }

    const db = readDb();
    const localIdx = (db.services || []).findIndex((s) => s.id === id || s._id === id);

    if (!service && localIdx === -1) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const currentActive = service ? service.active : db.services[localIdx].active;
    const newActive = !currentActive;
    const newStatus = newActive ? 'Active' : 'Inactive';

    // Update MongoDB Database
    if (Service.db && Service.db.readyState === 1) {
      service = await Service.findOneAndUpdate(
        query,
        { $set: { active: newActive, status: newStatus } },
        { returnDocument: 'after', upsert: true }
      );
    }

    // Sync with local db.json
    if (localIdx !== -1) {
      db.services[localIdx].active = newActive;
      db.services[localIdx].status = newStatus;
      writeDb(db);
    }

    const resultData = service || (localIdx !== -1 ? db.services[localIdx] : null);

    res.json({
      success: true,
      message: `Service status toggled to ${newStatus}`,
      data: resultData,
    });
  } catch (error) {
    console.error('❌ Error toggling service status:', error.message);
    res.status(500).json({ success: false, message: error.message || 'Error toggling service status' });
  }
};

// Delete Service
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const query = getServiceQuery(id);

    if (Service.db && Service.db.readyState === 1) {
      await Service.findOneAndDelete(query);
    }

    const db = readDb();
    if (db.services) {
      db.services = db.services.filter((s) => s.id !== id && s._id !== id);
      writeDb(db);
    }

    res.json({ success: true, message: 'Service deleted successfully from database' });
  } catch (error) {
    console.error('❌ Error deleting service:', error.message);
    res.status(500).json({ success: false, message: 'Error deleting service' });
  }
};

// Seed Services manually
exports.seedServicesToDb = async (req, res) => {
  try {
    const success = await seedServices();
    if (success) {
      const services = await Service.find().sort({ createdAt: 1 });
      return res.json({
        success: true,
        message: 'Successfully seeded all services into MongoDB database!',
        count: services.length,
        data: services,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Database connection inactive or seeding failed.',
      });
    }
  } catch (error) {
    console.error('❌ Seed API error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
