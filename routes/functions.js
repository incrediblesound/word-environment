var fs = require('fs');

exports.process = function(text) {
	var results,
		fullText = [];
		sentences = text.split('.');
    sentences = rejectEmpty(sentences);
	forEach(sentences, function(sentence) {
  	var words = sentence.split(' ');
		words = rejectEmpty(words);
		fullText.push(words);
	})
	return ({s: sentences, w: fullText});
}

exports.cook = function(fullText) {
	var dataFull = [],
	    line,
      data;
	forEach(fullText, function(block) {
		line = [];
		forEach(block.ones, function (word, i) {
			data = {word: word};
      if(block.ones.length - i >= 3) {
        if(testDic(block.threes[i])) {
          data.three = block.threes[i]
        }
      }
      if(block.ones.length - i >= 2) {
        if(testDic(block.pairs[i])) {
          data.pair = block.pairs[i]
        }
      }
      line.push(data);
		})
    dataFull.push(line);
	})
  return dataFull;
}

exports.getLib = function(fn) {
  fs.readFile('./posDic.js', 'Utf8', function (err, data) {
    data = data.toString();
    data = JSON.parse(data);
    return fn(data);
  })
}

function testDic(word) {
  var library = getLibrary();
  for(var part in library) {
    if(library[part].indexOf(word) !== -1) {
      return true;
    }
  }
  return false;
}

function getLibrary() {
  fs.readFile('./posDic.js', 'Utf8', function (err, data) {
    data = data.toString();
    data = JSON.parse(data);
    return data;
  })
}

function forEach(array, fn) {
	for(var i = 0; i<array.length;i++) {
		fn(array[i], i);
	}
}

function makeThrees(wordArray) {
	var wA = wordArray;
	var results = [];
	for(var i = 0; i < wA.length - 2; i++) {
		results.push(wA[i] + ' ' + wA[i+1] + ' ' + wA[i+2]);
	}
	return results;
}

function makePairs(wordArray) {
	var wA = wordArray;
	var results = [];
	for(var i = 0; i < wA.length - 1; i++) {
		results.push(wA[i] + ' ' + wA[i+1]);
	}
	return results;	
}

function rejectEmpty(array) {
	var results = [];
	forEach(array, function(element){
		if(element !== '' && element !== ' ') {
			element = noPunc(element);
			results.push(element);
		}
	})
	return results;
}

function noPunc(word) {
  var initial = word[0].match(/\!|\.|\?|\"|\'|\,/),
      Final = word[word.length-1].match(/\!|\.|\?|\"|\'|\,/);
  if(initial !== null) {
    word = word.substring(1, word.length);
  };
  if(Final !== null) {
    word = word.substring(0, word.length-1);
  };
  if(word[0].match(/\!|\.|\?|\"|\'|\,/) !== null || word[word.length-1].match(/\!|\.|\?|\"|\'|\,/) !== null) {
    return noPunc(word);
  } else {
    return word;
  }
}