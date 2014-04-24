
var processInput = require('./functions.js').process;
var cookData = require('./functions.js').cook;
var library = require('./functions.js').getLib;

var neo = require('neo4j');
var db = new neo.GraphDatabase('http://localhost:7474');

exports.index = function(req, res){
  res.render('index');
};

exports.partials = function(req, res) {
	var name = req.params.name;
	res.render('partials/'+name);
};

exports.returnData = function(req, res){
	var text = req.body.text;
	var data = processInput(text);
//	var rawData = raw.data;
//	var sentences = raw.sentences;
//	var data = cookData(rawData);
	res.json({data: data});
}

exports.getLibrary = function(req, res) {
	var data = library(function (data) {
		res.json(data);
	});
}

exports.analyze = function(req, res) {
	var Master = req.body;
	var log = [];
	forEach(Master, function (sentence) {
		var multiples = [];
		forEach(sentence, function (word, i) {
			if(word.parts.length > 1) {
				multiples.push(i);
			}
		})
		log.push(multiples);
	})
	forEach(log, function(sentenceLog, a) {
		forEach(sentenceLog, function(variable, b) {

		})
	})

}

exports.storeData = function(req, res) {
	var first = 'CREATE (n:Word {value: ({word}), pos: ({pos})})-[:PRECEDES]->(:Env {value:({wordTwo}), pos:({posTwo})})';
	var last = 'CREATE (n:Word {value: ({word}), pos:({pos})})-[:FOLLOWS]->(:Env {value:({wordTwo}), pos:({posTwo})})';
	var middle = 'CREATE (:Env {value:({wordPre}), pos:({posPre})})<-[:FOLLOWS]-(:Word {value:({word}), pos:({pos})})-[:PRECEDES]->(:Env {value:({wordTwo}), pos:({posTwo})})'
	var data = req.body;
	console.log(data);
	var params;
	forEach(data, function(sentence, a){
		var type = [];
		forEach(sentence, function(word, b) {
			if( b-1 === -1) {
				params = {word: word.word, pos: word.part, wordTwo: data[a][b+1].word, posTwo: data[a][b+1].part};
				db.query(first,params, function (err) { if (err) { console.log(err); } return; } );
				type.push(word.part);
			} 
			else if( b === data[a].length-1) {
				params = {word: word.word, pos: word.part, wordTwo: data[a][b-1].word, posTwo: data[a][b-1].part};
				db.query(last,params, function (err) { if (err) { console.log(err); } return; } );
				type.push(word.part);
				params = {type: type};
				db.query('CREATE (n:SentenceType {pattern: ({type})})', params, function (err) { if (err) { console.log(err); } return; } );
			} else {
				params = {word: word.word, pos: word.part, wordTwo: data[a][b+1].word, posTwo: data[a][b+1].part, wordPre: data[a][b-1].word, posPre: data[a][b-1].part};
				db.query(middle, params, function (err) { if (err) {console.log(err); } return; } );
				type.push(word.part);
			}
		})
	})
	res.json(true);
}

function forEach(array, fn) {
  for(var i = 0; i < array.length; i++) {
    fn(array[i], i);
  }
}

var wordMatchMiddle = function(a,b) { //need separate function for first and last.
	var word = Master[a][b],
      schema = [ Master[a][b-1].parts, Master[a][b+1].parts];
	var params = {word: word.word};
	var Env = [];
	if(word.parts.length > 1) {
		dq.query('MATCH (n:Word)\nWHERE n.value = ({word})\nRETURN n', params, function (err, check) {
			if(!!check.n) {
				dq.query('MATCH (a:Env)<-[:FOLLOWS]-(n:Word)-[:PRECEDES]->(b:Env)\nWHERE n.value = ({word})\nRETURN a,b,n',params, function (err, data) {
					if(schema[0].indexOf(data.a._data.data.pos) !== -1 && schema[1].indexOf(data.b._data.data.pos) !== -1) {
            Master[a][b].parts = data.n._data.data.pos;
            Master[a][b-1].parts = data.a._data.data.pos;
            Master[a][b+1].parts = data.b._data.data.pos;
            return;
          }
				})
			} else {
				return;
			}
		})	
	} else { 
		return; 
  }
}