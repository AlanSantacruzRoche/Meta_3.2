import { UniqueConstraintError, ValidationError, ForeignKeyConstraintError } from 'sequelize';

export function handleError(err, res) {
  if (err instanceof UniqueConstraintError) {
    const fields = Object.keys(err.fields || {});
    if (fields.includes('nickname') || fields.includes('uq_jugadores_nickname')) return res.status(409).json({ error: 'El nickname ya está registrado.' });
    if (fields.includes('id_roster') || fields.includes('id_jugador') || fields.includes('uq_jugador_por_roster')) return res.status(409).json({ error: 'El jugador ya está asignado a este roster.' });
    return res.status(409).json({ error: 'Conflicto de unicidad.' });
  }
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: 'Datos inválidos.',
      detalles: err.errors.map(e => e.message)
    });
  }
  if (err instanceof ForeignKeyConstraintError) {
    return res.status(404).json({ error: 'No se encontró el recurso relacionado.' });
  }
  console.error(err);
  return res.status(500).json({ error: 'Error interno del servidor.' });
}

export function validarCampos(body, campos) {
  const faltantes = campos.filter(c => body[c] === undefined || body[c] === null || body[c] === '');
  return faltantes;
}
