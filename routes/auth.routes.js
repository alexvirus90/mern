const {Router} = require('express')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()

// /api/auth/register
router.post(
    '/register',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов').isLength({min: 6})
    ],
    async (req, res) => {
    try {
        const errors = validationResult(req)

        if (errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректные данные при регистрации!'
            })
        }

        const {email, password} = req.body
        const candidate = await User.findOne({email})

        if (candidate) {
            return res.status(400).json({message: `Пользователь с таким ${email} существует!`})
        }

        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({email, password: hashedPassword})

        await  user.save()
        res.status(201).json({message: 'Пользователь создан!'})

    } catch (e) {
        res.status(500).json({message: 'Error'})
    }
})

// /api/auth/login
router.post('/login', async (req, res) => {

})

module.exports = router
