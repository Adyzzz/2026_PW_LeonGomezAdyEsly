import { query } from '../db-local';

// Consultar todos los talleres
async function listar() {
    const [filas] = await query(`SELECT * FROM talleres ORDER BY id`);
    return filas;
}

// consultarPorTaller (por id)
async function consultarPorTaller(id) {
    const [filas] = await query(`SELECT * FROM talleres WHERE id = ?`, [id]);
    return filas[0];
}

// registrarseEnUnTaller (registra a un usuario en un taller)
// Se inserta en la tabla de asistencias (o en una tabla intermedia si la tienes)
async function registrarseEnUnTaller(usuarioId, tallerId) {
    const [existe] = await query(
        `SELECT id FROM asistencias WHERE usuario_id = ? AND taller_id = ?`,
        [usuarioId, tallerId]
    );
    if (existe.length > 0) {
        throw new Error('El usuario ya está registrado en este taller');
    }

    const [info] = await query(
        `INSERT INTO asistencias (usuario_id, taller_id, fecha) VALUES (?, ?, NOW())`,
        [usuarioId, tallerId]
    );
    return { id: info.insertId, usuario_id: usuarioId, taller_id: tallerId };
}

export default { listar, consultarPorTaller, registrarseEnUnTaller };