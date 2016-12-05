var app = angular.module('app', []);

app.controller('mainCtrl', function ($scope, Calculator, focus) {
    $scope.ops = [{
      days : 0,
      hours : 0,
      minutes : 0,
      operator: 1
    }];

    $scope.resultinminutes = 0;
    $scope.result = {
      minutes_raw : 0,
      d: 0,
      h: 0,
      m: 0,
	  dStr: "0",
	  hStr: "00",
	  mStr: "00",
      sign: ""
    };

    $scope.doCalculations = function(){
        $scope.resultinminutes = Calculator.transformToMinutes($scope.ops[0].days, $scope.ops[0].hours, $scope.ops[0].minutes);
        for(var i = 1; i < $scope.ops.length && $scope.ops.length > 1; i++) {
          $scope.resultinminutes += $scope.ops[i-1].operator * Calculator.transformToMinutes($scope.ops[i].days, $scope.ops[i].hours, $scope.ops[i].minutes);
        }
        $scope.result = Calculator.toResultObject($scope.resultinminutes);
    };

    $scope.keyPressed = function(event) {
      if(event.keyCode == 187 || event.keyCode == 107) {
        $scope.add();
      } else if (event.keyCode == 189 || event.keyCode == 109) {
        $scope.subtract();
      }
    };

    $scope.add = function() {
      $scope.ops.push({
        days : 0,
        hours : 0,
        minutes : 0,
        operator: 1
      });
      $scope.doCalculations();
      focus('days_last');
    };
    $scope.subtract = function() {
      var t = $scope.ops.pop();
      t.operator = t.operator * -1;
      $scope.ops.push(t);

      $scope.ops.push({
        days : 0,
        hours : 0,
        minutes : 0,
        operator: 1
      });
      $scope.doCalculations();
      focus('days_last');
    };
    $scope.reset = function() {
		$scope.ops = [{
			days : 0,
			hours : 0,
			minutes : 0,
			operator: 1
		}];
		$scope.resultinminutes = 0;
		$scope.result = {
			minutes_raw : 0,
			d: 0,
			h: 0,
			m: 0,
			dStr: "0",
			hStr: "00",
			mStr: "00",
			sign: ""
		};
	};

    focus('days_last');
});

app.service('Calculator', function(){

    this.transformToMinutes = function(d, h, m){
        return parseInt(d)*8*60 + parseInt(h)*60 + parseInt(m);
    };

    this.toResultObject = function(minutes) {
      result = {};
      result.minutes_raw = minutes;
      if(minutes < 0) {
        result.sign = '-';
        minutes = minutes * -1;
      } else {
        result.sign = '';
      }
      result.d = Math.floor((Math.floor(minutes /60))/8);
      result.h = Math.floor(this.betrag(minutes /60)) % 8;
      result.m = this.betrag(minutes) % 60;

	  result.dStr = "" + result.d;
	  result.hStr = "0" + result.h;
	  result.mStr = result.m < 10 ? "0" + result.m : "" + result.m;
      return result;
    };

    this.betrag = function(num) {
      if(num < 0) {
        return -1 * num;
      } else {
        return num;
      }
    };
});


app.factory('focus', function($timeout, $window) {
    return function(id) {
      // timeout makes sure that is invoked after any other event has been triggered.
      // e.g. click events that need to run before the focus or
      // inputs elements that are in a disabled state but are enabled when those events
      // are triggered.
      $timeout(function() {
        var element = $window.document.getElementById(id);
        if (element) {
			element.focus();
			element.select();
		}

      });
    };
  });

app.directive('eventFocus', function(focus) {
    return function(scope, elem, attr) {
      elem.on(attr.eventFocus, function() {
        focus(attr.eventFocusId);
      });

      // Removes bound events in the element itself
      // when the scope is destroyed
      scope.$on('$destroy', function() {
        element.off(attr.eventFocus);
      });
    };
  });

app.directive('onlyNumbers', function(){
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
       modelCtrl.$parsers.push(function (inputValue) {
         var transformedInput = inputValue.toLowerCase().replace(/[^0-9]/g, '');
         if (transformedInput != inputValue) {
           modelCtrl.$setViewValue(transformedInput);
           modelCtrl.$render();
         }
        return transformedInput;
      });
    }
  };
});
