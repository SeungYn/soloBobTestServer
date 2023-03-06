import * as mapsRepository from '../data/map.js';

export async function getBylocation(req, res) {
  const { location } = req.params;
  const data = await mapsRepository.getAllMaps(location);

  res.status(200).json(data);
}
