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
    $scope.sign = '+';
    $scope.result = 0;

    $scope.doCalculations = function(sign, d1, h1, m1, d2, h2, m2){
        switch(sign){
            case '+': $scope.result = Calculator.add(Calculator.transformToMinutes(d1, h1, m1), Calculator.transformToMinutes(d2, h2, m2)); break;
            case '-': $scope.result = Calculator.sub(Calculator.transformToMinutes(d1, h1, m1), Calculator.transformToMinutes(d2, h2, m2)); break;
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
        result.m = sum - (result.d * 60 * 8) - (result.h * 60);
        return result;
    };

    this.sub = function(t1, t2){
        var sub = t1 - t2;
        var result = [];
        result.d = Math.floor((Math.floor(sub /60))/8);
        result.h = Math.floor(sub/60) % 8;
        result.m = sub - (result.d * 60 * 8) - (result.h * 60);
        return result;
    };

});
