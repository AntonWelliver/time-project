const express = require('express')
const router = express.Router()
const Race = require('../models/Race')

//Getting All
router.get('/', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    try {
        const information = await Race.find()
        res.json(information)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//Getting One
router.get('/:id', getInformation, (req, res) => {
    res.send(res.information)
})

//Creating One
router.post('/', async (req, res) => {
    const information = new Race({
        name: req.body.name,
        distance: req.body.distance,
        date: req.body.date,
        capacity: req.body.capacity,
        location: req.body.location,
        displayOption: req.body.displayOption,
        message: req.body.message
    })

    try {
        const newInformation = await information.save()
        res.status(201).json(newInformation)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

//Updating One
router.patch('/:id', getInformation, async (req, res) => {
    if (req.body.name != null) {
        res.information.name = req.body.name
    }
    if (req.body.distance != null) {
        res.information.distance = req.body.distance
    }
    if (req.body.date != null) {
        res.information.date = req.body.date
    }
    if (req.body.capacity != null) {
        res.information.capacity = req.body.capacity
    }
    if (req.body.location != null) {
        res.information.location = req.body.location
    }
    if (req.body.message != null) {
        res.information.message = req.body.message
    }
    if (req.body.displayOption != null) {
        res.information.displayOption = req.body.displayOption
    }
    try {
        const updatedInformation = await res.information.save()
        res.json(updatedInformation)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

//Deleting One
router.delete('/:id', getInformation, async (req, res) => {
    try {
        await res.information.remove()
        res.json({ message: 'Deleted' })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

async function getInformation(req, res, next) {
    let information
    try {
        information = await Race.findById(req.params.id)
        if (information == null) {
            return res.status(404).json({ message: 'Cannot find information' })
        }
    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

    res.information = information
    next()
}

module.exports = router