var app = angular.module('app', []);

app.controller('mainCtrl', function ($scope, Calculator, focus) {
    $scope.ops = [{
      days : 0,
      hours : 0,
      minutes : 0,
      operator: 1
    }];

    $scope.resultinminutes = 0;
    $scope.result = {};

    $scope.doCalculations = function(){
        $scope.resultinminutes = Calculator.transformToMinutes($scope.ops[0].days, $scope.ops[0].hours, $scope.ops[0].minutes);
        for(var i = 1; i < $scope.ops.length && $scope.ops.length > 1; i++) {
          $scope.resultinminutes += $scope.ops[i-1].operator * Calculator.transformToMinutes($scope.ops[i].days, $scope.ops[i].hours, $scope.ops[i].minutes);
        }
        $scope.result = Calculator.toResultObject($scope.resultinminutes);
    };

    $scope.keyPressed = function(event) {
      if(event.keyCode == 187) {
        $scope.add();
      } else if (event.keyCode == 189) {
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

    focus('days_last');
});

app.service('Calculator', function(){

    this.transformToMinutes = function(d, h, m){
        return d*8*60 + h*60 + m;
    };

    this.toResultObject = function(minutes) {
      result = {};
      result.d = Math.floor((Math.floor(minutes /60))/8);
      result.h = Math.floor(this.betrag(minutes) / (60*8));
      result.m = this.betrag(minutes) % 60;
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
        if(element)
          element.focus();
        if(!$window.getSelection().toString()) {
          // Required for mobile Safari
          element.setSelectionRange(0, element.value.length);
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
