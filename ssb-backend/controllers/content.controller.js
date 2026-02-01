const contentService = require('../services/content.service');

async function wat(req, res, next) {
  try {
    const items = await contentService.getWAT();
    res.json({ test: "WAT", count: items.length, items });
    console.log("Sent WAT items:", items.length);
  } catch (err) { next(err); }
}

async function srt(req, res, next) {
  try {
    const items = await contentService.getSRT();
    res.json({ test: "SRT", count: items.length, items });
    console.log("Sent SRT items:", items.length);
  } catch (err) { next(err); }
}

async function tat(req, res, next) {
  try {
    const items = await contentService.getTAT();
    console.log("Sent TAT codes: ",items.length)
    res.json({ test: "TAT", items });
  } catch (err) { next(err); }
}

function sdt(req, res) {
  res.json({ test: "SDT", headings: contentService.getSDT() });
}

async function lecturette(req, res, next) {
  try {
    const topics = await contentService.getLecturette();
    res.json({ test: "LECTURETTE", count: topics.length, topics });
    console.log("Sent Lecturette topics:", topics.length);
  } catch (err) { next(err); }
}

module.exports = { wat, srt, tat, sdt, lecturette };
