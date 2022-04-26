const { response } = require('express');
const Event = require('../models/Event');

const getEvents = async (req, res = response) => {

    const events = await Event.find().populate('user', 'name')
    
    res.json({
        ok: true,
        events
    });
}

const createEvent = async (req, res = response) => {

    const event = new Event( req.body );

    try {
        
        event.user = req.uid;
        const savedEvent = await event.save();

        res.json({
            ok: true,
            event: savedEvent
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const upadteEvent = async (req, res = response) => {
    
    const eventId = req.params.id;

    try {
        const event = await Event.findById( eventId );
        const uid = req.uid;

        if ( !event ) {
            res.status(404).json({
                ok: false,
                msg: 'Este evento no existe'
            })
        }

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No puede hacer eso'
            });
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const eventUploaded = await Event.findByIdAndUpdate( eventId, newEvent, { new: true } );
        
        res.json({
            ok: true,
            event: eventUploaded
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}

const deleteEvent = async (req, res = response) => {

    const eventId = req.params.id;
    const uid = req.uid;
    
    try {

        const event = await Event.findById( eventId );

        if ( !event ) {
            res.status(404).json({
                ok: false,
                msg: 'Este evento no existe'
            })
        }

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No puede hacer eso'
            });
        }
        
        await Event.findByIdAndDelete( eventId );
        
        res.json({
            ok: true,
            msg: 'Event Deleted'
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        })
    }
}

module.exports = { getEvents, createEvent, upadteEvent, deleteEvent }