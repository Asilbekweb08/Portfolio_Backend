const express = require('express')
const { UserReg, VerifyCode, Login } = require('../controllers/AuthController')
const  mongoose  = require('mongoose')
const router = express.Router()

router.post('/register',UserReg)
router.post('/verify',VerifyCode)
router.post('/login',Login)
// router.post('/login')

module.exports = router