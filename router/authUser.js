const express = require('express');
const controller = require('../controllers/authController');
const verify = require('../router/verifyToken');
const router = express.Router();

router.post('/registration', controller.registration);
router.post('/login', controller.login);
router.get('/authUser', controller.authUser);

router.post('/postTask', controller.postTask);
router.get('/getTasks/:name', controller.getTasks);
router.delete('/deleteTask/:user/:id', controller.deleteTask);
router.put('/updateTask/:user/:id', controller.updateTask);
router.put('/updateCheckStatus/:user/:id', controller.updateCheckStatus);

module.exports = router;