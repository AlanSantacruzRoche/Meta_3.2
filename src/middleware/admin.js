export function requireAdmin(req, res, next) {
  const expected = process.env.ADMIN_TOKEN;
  const header = req.get('authorization') || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';

  if (!expected) {
    return res.status(500).json({ error: 'ADMIN_TOKEN no está configurado en el archivo .env.' });
  }
  if (!token || token !== expected) {
    return res.status(401).json({ error: 'Se requiere un token válido de administrador.' });
  }
  next();
}
