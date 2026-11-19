function crearModeloTokens(pool) {
    // La funcion para rebocar un token 
    async function revocar(jto, usuario, exp) {
        await pool.query(
            'INSERT INTO tokens_revocados(jti, usuario, exp) VALUES (?, ?, FROM_UNIXTIME(?))',  [jti, usuario, exp]
        );
    }

    // Vamos a consultar cuales eestan revocados 
    async function estaRevocado(jti) {
        const [filas] =  await pool.query('SELECT 1 FROM tokens_revocados WHERE jti = ?', [String (jti || '')]);
        return filas.length > 0;
    }

    // necesitamos consultar el estado de diagnostico de los tokens 
    async function listar() {
        const [filas] = await pool.query('SELECT jti, usuario, expira, revocado_en FROM tokens_revocados ORDER BY revocado_en DESC, jti');
        return filas;
    }

    return {revocar, estaRevocado, listar};
}

export default {crearModeloTokens}