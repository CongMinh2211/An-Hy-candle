export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'GET') {
    return res.status(200).json([]);
  }

  if (req.method === 'POST') {
    return res.status(201).json({ key: req.body?.key || '', name: req.body?.name || '' });
  }

  if (req.method === 'DELETE') {
    return res.status(200).json({ message: 'Catalog product unhidden.' });
  }

  res.setHeader('Allow', 'GET, POST, DELETE');
  return res.status(405).json({ message: 'Method not allowed' });
}
