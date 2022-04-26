const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');
const { validateJWT } = require('../middlewares/validar-jwt');


const createUser = async(req, res = response ) => {

    const { email, password } = req.body;

    try {
        let userExists = await User.findOne({ email: email });

        if ( userExists ) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con ese correo'
            })
        }
        
        const user = new User(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );
        
        await user.save();

        // Generar JWT
        const token = await generateJWT(user.id, user.name);

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador'
        })
    }
}

const userLogin = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if ( !user ) {
            res.status(400).json({
                ok: false,
                msg: 'Email o contraseña incorrectos (email)'
            });
        }

        // Confirmar contraseña
        const validPassword = bcrypt.compareSync( password, user.password );
        if ( !validPassword ) {
            res.status(400).json({
                ok: false,
                msg: 'Email o contraseña incorrectos (psswd)'
            })
        }

        // Generar JWT
        const token = await generateJWT(user.id, user.name);

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Por favor, hable con el administrador'
        });
    }
}

const renewToken = async(req, res = response) => {

    const { uid, name } = req;
    
    const token = await generateJWT(uid, name)
    
    res.json({
        ok: true,
        token
    });
}


module.exports = {
    createUser,
    userLogin,
    renewToken
};