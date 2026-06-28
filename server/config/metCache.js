let paintingIDs = [];

async function loadPaintingIDs() {
  const departmentIds = [11, 21, 15];

  const results = await Promise.all(
    departmentIds.map(id =>
      fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&medium=Paintings&dateBegin=1300&dateEnd=1950&departmentId=${id}&q=*`
      )
        .then(res => res.json())
        .then(json => json.objectIDs || [])
    )
  );

  paintingIDs = [...new Set(results.flat())];
  console.log(`Loaded ${paintingIDs.length} painting IDs`);
}
function getPaintingIDs() {
  return paintingIDs;
}

module.exports = { loadPaintingIDs, getPaintingIDs };
