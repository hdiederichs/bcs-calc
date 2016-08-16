var app = angular.module('app', []);

app.controller('mainCtrl', function ($scope, Calculator) {
    $scope.values = {
        d1: 0,
        h1: 0,
        m1: 0,
        d2: 0,
        h2: 0,
        m2: 0
    };

    //TODO
    /*$scope.ops = [{
      days : 0,
      hours : 0,
      minutes : 0,
      operator: '+'
    }, {
      days : 0,
      hours : 0,
      minutes : 0,
      operator: '+'
    }];*/

    $scope.sign = '+';
    $scope.result = 0;

    $scope.doCalculations = function(){
        switch($scope.sign){
            case '+': $scope.result = Calculator.add(Calculator.transformToMinutes($scope.values.d1, $scope.values.h1, $scope.values.m1), Calculator.transformToMinutes($scope.values.d2, $scope.values.h2, $scope.values.m2)); break;
            case '-': $scope.result = Calculator.sub(Calculator.transformToMinutes($scope.values.d1, $scope.values.h1, $scope.values.m1), Calculator.transformToMinutes($scope.values.d2, $scope.values.h2, $scope.values.m2)); break;
        }
    };
});

app.service('Calculator', function(){

    this.transformToMinutes = function(d, h, m){
        return d*8*60 + h*60 + m;
    };

    this.add = function(t1, t2){
        var sum = t1 + t2;
        var result = [];
        result.d = Math.floor((Math.floor(sum /60))/8);
        result.h = Math.floor(sum/60) % 8;
        result.m = sum - (this.betrag(result.d) * 60 * 8) - (this.betrag(result.h) * 60);
        return result;
    };

    this.sub = function(t1, t2){
        var sub = t1 - t2;
        var result = [];
        result.d = Math.floor((Math.floor(sub/60)) / 8);
        result.h = this.betrag(Math.floor(sub/60)) % 8;
        result.m = this.betrag(sub) % 60;
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
