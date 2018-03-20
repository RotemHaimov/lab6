const debug=require('debug')('mongo:mongo')
const mongo=require('mongoose')

let db=mongo.createConnection('mongodb://localhost/myfirstdatabase11');

db.on('open', function() {debug("On open DB")});
db.on('error', function() {debug("Error connection to DB")});
db.on('connecting', () => {debug("On connecting to MongoDB: ")});
db.on('connected', function() {debug("On connected to MongoDB: ")});
db.on('disconnecting', function() {debug("On disconnecting from MongoDB: ")});
db.on('disconnected', function() {debug("On disconnected from MongoDB: ")});
db.on('reconnected', function() {debug("On reconnected to MongoDB: ")});
db.on('error', err => {debug("On error in MongoDB: "+err)});
db.on('close', () => {debug("On MongoDB close: ")});
console.log('Pending DB connection');
db.then(async db1=>{
	debug('Creating model');
	let Test = db.model("Test", new mongo.Schema({}), "Empties");
	debug('Creating a document');
	await Test.create({});
	debug('Query');
	let tests = await Test.find({}).exec();
	debug(tests);
	debug(await Test.findOne({}).exec());
	let close = db1.close();
	debug('Closing');
	await close;
	debug('Closed');
});