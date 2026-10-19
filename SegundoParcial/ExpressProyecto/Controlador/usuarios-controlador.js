const bcrypt = require('bcryptjs');

const usuariosModel = require('../Modelo/usuarios');

const {validarCorreo, validarBoleta, validarContraseña} = require('../validaciones')

//que pasa si el correo y la boleta se duplica

function esduplicado(error){
    return error.code === 'ER_DUP_ENTRY' || error.code ==='23505';
}

async function listarUsuarios(req, res) {
    try{
        const usuarios = await usuariosModel.listar();
        res.json(usuarios);
    }catch(error){
        res.status(500).json({error: error.message});
    }

}

async function obtenerUsuario(req, res) {
    try{
        const usuario = await usuariosModel.obtenerPorID(req.params.id);
        if(!usuario) return res.status(404).json({error: 'Usuario no encontrado'});  
    }catch(error){
        res.status(500).json({error: error.message});
    }
}

async function CrearUsuario(req, res) {
    const {nombre, correo, contrasena, boleta, rol} = req.body;
    if(!nombre ||!correo ||!contrasena ||!boleta){
        return res.status(400).json({error : `nombre, correo, contraseña y boleta son obligatorios, favor de verificar los datos`})
    }
    if(validarCorreo(correo)) return res.status(400).json({error : `El correo no tiene formato valido`});
    if(!validarBoleta(boleta)) return res.status(400).json({error: `La boleta debe de tener 10 dígitos`});
    if(!validarContraseña(contrasena)) res.status(400).json({error: `LA contraseña no es valida`});

    try{
        const contrasenaHash = await bcrypt.hash(contrasena, 10);
        const usuario = await usuariosModel.crear({nombre, correo, contrasenaHash, boleta, rol});
    }catch(error){
        if(esduplicado(error)) return res.status(409).json({error : `Ya existe un usuario con esa boleta o ese correo`});
        res.status(500).json({error: error.message});
    }

}