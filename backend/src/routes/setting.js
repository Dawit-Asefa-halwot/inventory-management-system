const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET user settings
router.get('/', auth, (req, res) => {
     res.json({
          notifications: true,
          language: 'English',
          // Add other settings here
     });
});

// UPDATE settings
router.put('/', auth, (req, res) => {
     const { notifications, language } = req.body;

     // In a real app, you would save to database here
     console.log('Updating settings:', { notifications, language });

     res.json({
          success: true,
          message: 'Settings updated successfully',
          settings: { notifications, language }
     });
});

module.exports = router;