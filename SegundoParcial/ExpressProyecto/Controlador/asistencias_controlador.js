import { registrarAsistenciaEnElTaller as _registrarAsistenciaEnElTaller, consultarListaDeAsistencias as _consultarListaDeAsistencias } from '../Modelo/asistencias';

async function registrarAsistenciaEnElTaller(req, res) {
    const { usuarioId, tallerId } = req.body;

    if (!usuarioId || !tallerId) {
        return res.status(400).json({ error: 'usuarioId y tallerId son obligatorios' });
    }

    try {
        const asistencia = await _registrarAsistenciaEnElTaller(usuarioId, tallerId);
        res.status(201).json(asistencia);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function consultarListaDeAsistencias(req, res) {
    try {
        const tallerId = req.query.tallerId || null; // opcional: /asistencias?tallerId=1
        const lista = await _consultarListaDeAsistencias(tallerId);
        res.json(lista);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export default { registrarAsistenciaEnElTaller, consultarListaDeAsistencias };