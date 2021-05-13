const express = require('express')
const router = new express.Router()
const auth = require('../../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail, sendCancellationEmail} = require('../../emails/account')

// Models
const User = require('../../models/user')

router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body)
        const token = await user.generateAuthToken()

        await user.save()
        sendWelcomeEmail(user.email, user.name)
        console.log(user.email, user.name)
        res.status(201).send({user, token})
    } catch (err) {
        res.status(400).send({err: `Server Error: ${err}`})
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (err) {
        res.status(500).send({err: `Server Error: ${err}`})
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)

        await req.user.save()
        res.send()
    } catch (err) {
        res.status(500).send({error: 'Server error'})
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []

        await req.user.save()
        res.send()
    } catch (err) {
        send.status(500).send({err: 'Server error'})
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return callback(new Error('File must be (JPG, PNG, JPEG).'))
        }

        callback(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch (err) {
        res.send(500).send({ error: `Server error - ${err}` })
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'age', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        res.send(req.user)
    } catch (err) {
        res.status(400).send({err: `Server Error: ${err}`})
    }
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        console.log(user)

        if(!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (err) {
        res.status(404).send({ error: `Server error - ${err}` })
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (err) {
        res.status(500).send({err: `Server Error: ${err}`})
    }
})

module.exports = router



