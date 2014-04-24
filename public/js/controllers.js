function IndexCtrl($scope, $http, $location, Warehouse) {
	$scope.form = {};
	$scope.enter = function() {
		$http.post('/cooker/',$scope.form).success(function (data) {
			Warehouse.setData(data);
			$location.url('/process/');
		})
	}
  $scope.analyze = function() {
    var data = {data: []};
    var text = $scope.form.text.split('.')
    text = rejectEmpty(text);
    forEach(text, function (sentence) {
      var words = sentence.split(' ');
      words = rejectEmpty(words);
      data.data.push(words);
    })
    Warehouse.partsList(data.data, function (data) {
      data.data = data;
      $http.post('/analyze/', data).success(function (data) {
        Warehouse.setData(data);
        $location.url('/view/');
      })
    });
  }
}

function ProcessCtrl($scope, $http, $location, Warehouse) {
	$scope.data = {};
  Warehouse.getData(function (data) {
    $scope.data.s = data.data.s;
    Warehouse.partsList(data.data.w, function (array){
      $scope.data.w = array;
      return
    })
  });


  //if($scope.position[0] === $scope.max) {
  //  $location.url('/enter/');
  //}

  $scope.select = function(part, location) {
    var x = location[0],
        y = location[1];
    $scope.data.w[x][y].part = part;
    delete $scope.data.w[x][y].parts;
    delete $scope.data.w[x][y].location;
  };
  $scope.change = function(part) {
    return Warehouse.partChange(part);
  }
  $scope.finish = function() {
    $http.post('/storeData/', $scope.data.w).success(function(){
      $location.url('/');
    });
  }
} // end of controller

function forEach(array, fn) {
  for(var i = 0; i < array.length; i++) {
    fn(array[i], i);
  }
}

function findIn(obj, item) {
  var result = {word:'', parts:[]};
  for(var x in obj) {
    if(obj[x].indexOf(item) !== -1) {
      result.word = item;
      result.parts.push[x];
    }
  }
  return result;
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
