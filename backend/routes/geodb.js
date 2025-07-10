const express = require('express');
const router = express.Router();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const GEONAMES_USERNAME = process.env.GEONAMES_USERNAME || "TU_USUARIO_GEONAMES";
const allowedCodes = ["US", "GT", "SV", "HN", "NI", "BZ", "CR", "PA"];

// Listar países permitidos
router.get('/countries', async (req, res) => {
  try {
    const fetches = allowedCodes.map(code =>
      fetch(`http://api.geonames.org/countryInfoJSON?country=${code}&username=${GEONAMES_USERNAME}`)
        .then(r => r.json())
    );
    const results = await Promise.all(fetches);
    const countries = results
      .map(r => r.geonames && r.geonames[0])
      .filter(Boolean)
      .map(({ countryCode, countryName }) => ({ code: countryCode, name: countryName }));
    res.json(countries);
  } catch (err) {
    console.error("GeoNames API error (countries):", err);
    res.status(500).json({ error: "Error al obtener países", details: err.toString() });
  }
});

// Listar departamentos/estados de un país
router.get('/regions/:countryCode', async (req, res) => {
  const { countryCode } = req.params;
  try {
    // 1. Obtener geonameId del país
    const countryInfo = await fetch(`http://api.geonames.org/countryInfoJSON?country=${countryCode}&username=${GEONAMES_USERNAME}`)
      .then(r => r.json());
    const geonameId = countryInfo.geonames[0]?.geonameId;
    if (!geonameId) return res.json([]);
    // 2. Obtener hijos (departamentos/estados)
    const regionsResp = await fetch(`http://api.geonames.org/childrenJSON?geonameId=${geonameId}&username=${GEONAMES_USERNAME}`)
      .then(r => r.json());
    const regions = (regionsResp.geonames || []).map(region => ({
      code: region.adminCode1,
      name: region.name,
      geonameId: region.geonameId
    }));
    res.json(regions);
  } catch (err) {
    console.error("GeoNames API error (regions):", err);
    res.status(500).json({ error: "Error al obtener regiones/estados", details: err.toString() });
  }
});

// Listar ciudades de un departamento/estado
router.get('/cities/:countryCode/:adminCode1', async (req, res) => {
  const { countryCode, adminCode1 } = req.params;
  try {
    const url = `http://api.geonames.org/searchJSON?country=${countryCode}&adminCode1=${adminCode1}&featureClass=P&maxRows=1000&username=${GEONAMES_USERNAME}`;
    const citiesResp = await fetch(url).then(r => r.json());
    const cities = (citiesResp.geonames || []).map(city => ({
      name: city.name,
      geonameId: city.geonameId
    }));
    res.json(cities);
  } catch (err) {
    console.error("GeoNames API error (cities):", err);
    res.status(500).json({ error: "Error al obtener ciudades", details: err.toString() });
  }
});

module.exports = router;
