import { Op } from 'sequelize';
import { Jugador } from '../models/index.js';

export async function listarJugadores({ rol, estado, search }) {
  const where = {};
  if (rol) where.rol = rol;
  if (estado) where.estado = estado;
  if (search) where.nickname = { [Op.like]: `%${String(search).trim()}%` };
  return Jugador.findAll({ where, order: [['nickname', 'ASC']] });
}
export async function obtenerJugador(id) { return Jugador.findByPk(id); }
export async function crearJugador(datos) {
  return Jugador.create({ nickname: String(datos.nickname).trim(), nombre_real: datos.nombre_real ?? null, pais: datos.pais ?? null, rol: datos.rol, estado: datos.estado ?? 'activo' });
}
export async function actualizarJugador(jugador, datos) {
  const { nickname, nombre_real, pais, rol, estado } = datos;
  await jugador.update({ ...(nickname !== undefined && { nickname: String(nickname).trim() }), ...(nombre_real !== undefined && { nombre_real }), ...(pais !== undefined && { pais }), ...(rol !== undefined && { rol }), ...(estado !== undefined && { estado }) });
  return jugador;
}
export async function eliminarJugador(jugador) {
  const { RosterJugador } = await import('../models/index.js');
  await RosterJugador.destroy({ where: { id_jugador: jugador.id } });
  return jugador.destroy();
}
