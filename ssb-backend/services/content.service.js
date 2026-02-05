const { query } = require('../utils/db');

async function getWAT() {
  const { rows } = await query(
    `SELECT id, word
     FROM content.wat_words
     WHERE is_active = true
     ORDER BY RANDOM()
     LIMIT 60`
  );
  return rows;
}

async function getSRT() {
  const { rows } = await query(
    `SELECT id, situation
     FROM content.srt_situations
     WHERE is_active = true
     ORDER BY RANDOM()
     LIMIT 60`
  );
  return rows;
}

async function getTAT() {
  const { rows } = await query(`
    (
      SELECT id, code, is_blank
      FROM content.tat_images
      WHERE is_blank = false
      ORDER BY RANDOM()
      LIMIT 11
    )
    UNION ALL
    (
      SELECT id, code, is_blank
      FROM content.tat_images
      WHERE is_blank = true
      LIMIT 1
    )
  `);

  return rows;
}

async function getLecturette() {
  const { rows } = await query(
    `SELECT id, topic
     FROM content.lecturette_topics
     WHERE is_active = true
     ORDER BY RANDOM()
     LIMIT 4`
  );
  return rows;
}

function getSDT() {
  return ["Parents", "Teachers", "Friends", "Self", "Others"];
}

module.exports = {
  getWAT,
  getSRT,
  getTAT,
  getLecturette,
  getSDT,
};
