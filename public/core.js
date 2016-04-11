var amanFood = angular.module('amanFood', []);

function mainController($scope, $http) {
    $scope.formData = {};
    $http.get('/api/foods')
        .success(function(data) {
            $scope.foods = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });   
        
    var total = function(){
        $http.get('/api/totals')
            .success(function(data){
                $scope.total = data.total;
            })
            .error(function(data){
                console.log('Error: ' + data);
            });
    }
    
    $scope.createFood = function() {
        $http.post('/api/foods', $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.foods = data;
                console.log(data);
                total();
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.deleteFood = function(id) {
        $http.delete('/api/foods/' + id)
            .success(function(data) {
                $scope.foods = data;
                console.log(data);
                total();
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
}