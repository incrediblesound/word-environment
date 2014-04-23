
angular.module('myApp.factory',[]).factory('Warehouse', ['$http', function ($http) {
	var Data;
	var PoS = {
		"Noun": 'N',
		"Plural": 'p',
		"Noun Phrase": 'h',
		"Verb": 'V',
		"Verb Transitive": 't',
		"Verb Intransitive": 'i',
		"Adjective": 'A',
		"Adverb": 'v',
		"Conjunction": 'C',
		"Preposition": 'P',
		"Interjection": '!',
		"Pronoun": 'r',
		"Definite Article": 'D',
    };
	var getLib = function(fn) {
		$http.get('/library/').success(function (data) {
			return fn(data);
		})
	};
	var forEach = function(array, fn) {
		for(var i = 0; i<array.length;i++) {
			fn(array[i], i);
		}
	};
	return {
		getData: function(fn) {
			return fn(Data);
		},
		setData: function(data) {
			Data = data;
		},
		getLibrary: function(fn) {
			$http.get('/library/').success(function (data) {
				fn(data);
			})
		},
		partChange: function(key) {
			for(var x in PoS) {
				if(key === PoS[x]) {
					return x;
				}
			}
		},
		partsList: function(array, fn) {
			getLib(function (data) {
				forEach(array, function(sentence, a){
					forEach(sentence, function(word, b) {
						var result = {word: word, parts: [], location:[a,b]};
						for(var x in data) {
							if(data[x].indexOf(word) !== -1) {
								result.parts.push(x);
							}
						}
						if (result.parts.length == 0 && word[word.length-1] === 's') {
							word = word.substring(0, word.length-1);
							for(var x in data) {
								if(data[x].indexOf(word) !== -1) {
								result.parts.push(x);
                }
						  }
            }
            if (result.parts.length == 0 && (/[A-Z]/).test(word[0])) {
              word = word.toLowerCase();
              for(var x in data) {
                if(data[x].indexOf(word) !== -1) {
                result.parts.push(x);
                }
              }
            }
						array[a][b] = result;
					})
				})
				return fn(array);
			})
		}
	}
}])