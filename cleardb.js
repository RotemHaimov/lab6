let mongo = require("mongoose");
(async () => {
  try {
      let db = await mongo.createConnection('mongodb://localhost/lab-mongo-5778');
      await db.dropDatabase();
      logandexit('DB cleared');
  } catch (err) {
      logandexit("Failed: " + err);
  }
})();
function logandexit(str) {
    console.log(str);
    process.exit(0);
}