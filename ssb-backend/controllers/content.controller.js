function wat(req, res) {
  res.json({
    test: "WAT",
    count: 60,
    items: []
  });
}

function srt(req, res) {
  res.json({
    test: "SRT",
    count: 60,
    items: []
  });
}

function tat(req, res) {
  res.json({
    test: "TAT",
    items: []
  });
}

function sdt(req, res) {
  res.json({
    test: "SDT",
    headings: []
  });
}

function lecturette(req, res) {
  res.json({
    test: "LECTURETTE",
    count: 4,
    topics: []
  });
}

module.exports = {
  wat,
  srt,
  tat,
  sdt,
  lecturette
};
