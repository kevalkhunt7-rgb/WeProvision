const router = require('express').Router();

const servicesController = require('../controllers/servicesController');
const portfolioController = require('../controllers/portfolioController');
const careersController = require('../controllers/careersController');
const inquiriesController = require('../controllers/inquiriesController');
const authController = require('../controllers/authController');
const { verifyAdminToken } = require('../middleware/authMiddleware');

const settingsController = require('../controllers/settingsController');
const notifyController = require('../controllers/notifyController');

// Authentication API
router.post('/auth/login', authController.login);
router.get('/auth/me', verifyAdminToken, authController.getMe);

// System Settings & Maintenance Mode API
router.get('/settings', settingsController.getSettings);
router.put('/settings/maintenance', verifyAdminToken, settingsController.toggleMaintenanceMode);

// Maintenance / Newsletter Subscription API
router.post('/notify', notifyController.subscribeNotify);

// Services API
router.get('/services', servicesController.getAllServices);
router.get('/services/:id', servicesController.getServiceById);
router.post('/services', verifyAdminToken, servicesController.createService);
router.put('/services/:id', verifyAdminToken, servicesController.updateService);
router.put('/services/:id/toggle', verifyAdminToken, servicesController.toggleServiceStatus);
router.delete('/services/:id', verifyAdminToken, servicesController.deleteService);
router.post('/services/seed', verifyAdminToken, servicesController.seedServicesToDb);

// Portfolio API
router.get('/portfolio', portfolioController.getAllPortfolio);
router.get('/portfolio/:id', portfolioController.getPortfolioById);
router.post('/portfolio', portfolioController.createPortfolio);
router.put('/portfolio/:id', portfolioController.updatePortfolio);
router.delete('/portfolio/:id', portfolioController.deletePortfolio);

// Careers & Applications API
router.get('/jobs', careersController.getAllJobs);
router.post('/jobs', careersController.createJob);
router.put('/jobs/:id', careersController.updateJob);
router.delete('/jobs/:id', careersController.deleteJob);
router.get('/applications', careersController.getAllApplications);
router.post('/applications', careersController.submitApplication);
router.put('/applications/:id/status', careersController.updateApplicationStatus);

// Inquiries API
router.get('/inquiries', inquiriesController.getAllInquiries);
router.post('/inquiries', inquiriesController.submitInquiry);
router.post('/inquiries/:id/reply', inquiriesController.replyToInquiry);
router.put('/inquiries/:id/status', inquiriesController.updateInquiryStatus);
router.delete('/inquiries/:id', inquiriesController.deleteInquiry);

// Health Check
router.get('/health', (req, res) => {
  res.json({ success: true, message: 'WeProvision Backend Service is active', timestamp: new Date() });
});

module.exports = router;
