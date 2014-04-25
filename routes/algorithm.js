var neo = require('neo4j');
var db = new neo.GraphDatabase('http://localhost:7474');

exports.predictor = function(Master, fn) {
	var counter = 0,
      log = [];
		  total = 0;
	forEach(Master, function (sentence) {
		var multiples = [];
		forEach(sentence, function (word, i) { //create an array of indexes of words with multiple possible p.o.s
			if(word.parts.length > 1) {
				multiples.push(i);
				total += 1; // keep count of how many words we will check, example log: [[1,2,3,5],[3,4,6]]
			}
		})
		log.push(multiples);
	})

	forEach(log, function(sentenceLog, a) {
		forEach(sentenceLog, function(index, b) {
    var word = Master[a][b];
    if(b === 0) {
      var second = Master[a][1].parts;
      wordMatchFirst(word, a, second, function (x) {
        console.log(x)
        if(!!x) {
        Master[a][0].parts = x[0];
        Master[a][1].parts = x[1];
        counter += 2;
        }
        if(counter >= total) {
          return end(fn);
        } 
        return;
      });
    }
    else if(b === Master[a].length-1) {
      var prev = Master[a][Master[a].length-2].parts;
      wordMatchLast(word, a, prev, function (x) {
        console.log(x)
        if(!!x) {
          Master[a][Master[a].length-1].parts = x[0];
          counter +=1;
          if(Master[a][Master[a].length-2].parts.length > 1){ 
            Master[a][Master[a].length-2].parts = x[1];
            counter +=1
          }
        }
        if(counter >= total) {
          return end(fn);
        } 
        return;
      });
    } else {
      var schema = [ Master[a][b-1].parts, Master[a][b+1].parts]
      wordMatchMiddle(word, a, b, schema, function (x) {
        if(!!x) {
          if(Master[a][b-1].parts.length > 1){
            Master[a][b-1].parts = x[0];
            counter += 1;
          }
        Master[a][b].parts = x[1];
        Master[a][b+1].parts = x[2];
        counter += 2;
        } 
      if(counter >= total) {
        end(fn);
      }
      return;
      });
    }
    })
  })

  function end(fn) {
    return fn(Master);
  }
}

var wordMatchMiddle = function(word, a, b, schema, fn) { //need separate function for first and last.
  var schema = schema;
	var params = {word: word.word};
  var results = [];
	if(word.parts.length > 1) {
		db.query('MATCH (n:Word)\nWHERE n.value = ({word})\nRETURN n', params, function (err, check) {
      console.log(err);
			if(check.length > 0) {
				db.query('MATCH (a:Env)<-[:FOLLOWS]-(n:Word)-[:PRECEDES]->(b:Env)\nWHERE n.value = ({word})\nRETURN a,b,n',params, function (err, data) {
					if(schema[0].indexOf(data[0].a._data.data.pos) !== -1 && schema[1].indexOf(data[0].b._data.data.pos) !== -1) {
            results.push(data[0].a._data.data.pos);
            results.push(data[0].n._data.data.pos);
            results.push(data[0].b._data.data.pos);
            return fn(results);
          } else {
            return fn(false);
          }
				})
			} else {
				return fn(false);
			}
		})	
	} else { 
		return fn(false); 
  }
}

var wordMatchFirst = function(word, a, second, fn) {
  var secondWord = second
  var params = {word: word.word};
  var results = [];
  if(word.parts.length > 1) {
    db.query('MATCH (n:Word)-[:PRECEDES]->(l:Env)\nWHERE n.value = ({word})\nRETURN n, l', params, function (err, check) {
      console.log(err);
      if(check.length > 0) {
        if(secondWord.indexOf(check[0].l._data.data.pos !== -1)) {
          results.push(check[0].n._data.data.pos);
          results.push(check[0].l._data.data.pos);
          return fn(results);
        } else {
          return fn(false);
        }
      } else {
        return fn(false);
      }
    })
  } else {
    return fn(false);
  }
}

var wordMatchLast = function(word, a, prev, fn) {
  var previousWord = prev;
  var params = {word: word.word};
  var results = [];
  if(word.parts.length > 1) {
    db.query('MATCH (n:Word)-[:FOLLOWS]->(l:Env)\nWHERE n.value = ({word})\nRETURN n, l', params, function (err, check) {
      console.log(err);
      if(check.length > 0) {
        if(previousWord.indexOf(check[0].l._data.data.pos !== -1)) {
          results.push(check[0].n._data.data.pos);
          results.push(check[0].l._data.data.pos);
          return fn(results);
        } else {
          return fn(false);
        }
      } else {
        return fn(false);
      }
    })
  } else {
    return fn(false);
  }
}

function forEach(array, fn) {
  for(var i = 0; i < array.length; i++) {
    fn(array[i], i);
  }
}
