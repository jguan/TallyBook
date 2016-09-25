'use strict';

angular.module('app').factory('appMyCategories', function($resource) {
  var CategoryResource = $resource('/api/mycategories/:uid');

  return CategoryResource;
});

angular.module('app').factory('appCategory', function($resource) {
  var CategoryResource = $resource('/api/categories/:id', {}, {
    update: {method:'PUT',isArray:false}
  });

  return CategoryResource;
});

angular.module('app').factory('appMyTransactions', function($resource) {
  var TransactionResource = $resource('/api/mytransactions/:uid/:year/:month');

  return TransactionResource;
});

angular.module('app').factory('appTransaction', function($resource) {
  var TransactionResource = $resource('/api/transactions/:id', {}, {
    update: {method:'PUT',isArray:false}
  });

  return TransactionResource;
});

angular.module('app').controller('appTallybookCtrl', function($scope, $filter, $http, appNotifier, $location, appIdentity, appMyCategories, appCategory, appMyTransactions, appTransaction) {
  console.log(appIdentity.currentUser);
  appMyCategories.query({uid:appIdentity.currentUser._id}, function(categories) {
    console.log(categories);
    $scope.categories = categories;
    $scope.category = $scope.categories[0];
  });

  var currentDate = new Date();
  $scope.format = 'mediumDate';
  $scope.dt = currentDate;
  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  var year = currentDate.getFullYear();
  var month = currentDate.getMonth();
  // Day 0 is the last day in the previous month
  var totalDays = new Date(year, month+1, 0).getDate();
  var daysByMonth = [];
  for (var i = 0; i < totalDays; i++) {
    daysByMonth[i] = new Date(year, month, i+1);
  }
  $scope.getDateLabels = function() {
    return daysByMonth;
  };

  $scope.currentMonth = currentDate;
  $scope.previousMonth = function() {
    $scope.currentMonth = new Date($scope.currentMonth.getFullYear(), $scope.currentMonth.getMonth() - 1, 1);
  };
  $scope.nextMonth = function() {
    $scope.currentMonth = new Date($scope.currentMonth.getFullYear(), $scope.currentMonth.getMonth() + 1, 1);
  };
  $scope.formattedMonth = $filter("date")($scope.currentMonth, 'yyyy-MM');

  $scope.addCategory = function() {
    var newEmptyCategory = {name:'', type:'expense'};
    $scope.categories.push(newEmptyCategory);
  };
  $scope.removeCategory = function(category) {
    if (!confirm("Are you sure you want do delete this category?")) return;

    var index = $scope.categories.indexOf(category);
    if (index !== -1) {
      $scope.categories.splice(index, 1);
    }

    if (category._id) {
      appCategory.delete({id: category._id}).$promise.then(function() {
          console.log('Category Deleted');
      } , function(response) {
        console.log(response);
      });
    }
  };

  $scope.save = function(category) {
    // remove empty category
    /*for(var i = $scope.categories.length - 1; i >= 0; i--) {
      if(!$scope.categories[i].name) {
        //$scope.categories.splice(i, 1);
        appNotifier.error('Category name is empty!');
        return;
      }
    }

    angular.forEach($scope.categories, function(category){
      if (category._id) {
        category.$update().then(function() {
          console.log('Category Updated');
        }, function(response) {
          console.log(response);
        });
      } else {
        var newCategory = new appCategory(category);
        newCategory.user = appIdentity.currentUser._id;
        newCategory.$save().then(function() {
          console.log('Category Created');
        }, function(response) {
          console.log(response);
        });
      }
    });*/

    //Storage.saveObject($scope.categories,'categories');

    console.log(category);
    if (category._id) {
      appCategory.update({id: category._id}, category).$promise.then(function() {
      //category.update({_id: category._id}).$promise.then(function() {
        console.log('Category Updated');
      }, function(response) {
        console.log(response);
      });
    } else {
      var newCategory = new appCategory(category);
      newCategory.user = appIdentity.currentUser._id;
      newCategory.$save().then(function() {
        appNotifier.notify('Category Created');
      }, function(response) {
        appNotifier.error(response);
      });
    }
  };

  $scope.addRecord = function() {
    var newRecord = {};
    newRecord.date = $filter('date')($scope.dt, "yyyy-MM-dd");
    //var formattedMonth = $filter('date')($scope.dt, "yyyy-MM");
    newRecord.category = $scope.category._id;
    newRecord.amount = $scope.amount;
    newRecord.user = appIdentity.currentUser._id;
    //if (angular.isUndefined($scope.allRecords[formattedMonth])) {
    //  $scope.allRecords[formattedMonth] = [];
    //}
    //$scope.allRecords[formattedMonth].push(newRecord);
    //$scope.allRecords[formattedMonth] = $scope.records;

    //Storage.saveObject($scope.allRecords,'records');


    var record = new appTransaction(newRecord);
    record.$save().then(function() {
      getCurrentRecords();
      appNotifier.notify('Record Created');
    }, function(response) {
      appNotifier.error(response);
    });

  };

  $scope.deleteRecord = function(record) {
    //console.log(record);
    //console.log($scope.records);
    if (!confirm("Are you sure you want do delete this record?")) return;

    var index = $scope.records.indexOf(record);
    if (index !== -1) {
      $scope.records.splice(index, 1);
    }

    if (record._id) {
      appTransaction.delete({id: record._id}).$promise.then(function() {
        appNotifier.notify('Record Deleted');
      } , function(response) {
        appNotifier.error(response);
      });
    }
  };

  $scope.total = function(type) {
    var total = 0;
    if ($scope.records) {
      //console.log($scope.records);
      var filtered = $filter('filter')($scope.records, {category: {type: type}});
      //console.log('filtered');
      //console.log(filtered);

      for (var i = 0, len = filtered.length; i < len; i++) {
        total += filtered[i].amount;
      }
    }

    return total;
  };

  $scope.monthTabs = [
    { title:"Jan", MM:"01" },
    { title:"Feb", MM:"02" },
    { title:"Mar", MM:"03" },
    { title:"Apr", MM:"04" },
    { title:"May", MM:"05" },
    { title:"Jun", MM:"06" },
    { title:"Jul", MM:"07" },
    { title:"Aug", MM:"08" },
    { title:"Sep", MM:"09" },
    { title:"Oct", MM:"10" },
    { title:"Nov", MM:"11" },
    { title:"Dec", MM:"12" }
  ];
  $scope.monthTabs[$scope.currentMonth.getMonth()].active = true;

  $scope.setCurrentMonth = function ($index) {
    $scope.currentMonth = new Date($scope.currentMonth.getFullYear(), $index, 1);
    //$scope.formattedMonth = $filter("date")($scope.currentMonth, 'yyyy-MM');
    $scope.monthTabs[$index].active = true;
    getCurrentRecords();
  };

  function getCurrentRecords() {
    /*var formattedMonth = $scope.formattedMonth;
    //$scope.records = $filter('filter')($scope.allRecords, {date:formattedMonth});
    if (angular.isUndefined($scope.allRecords[formattedMonth])) {
      $scope.allRecords[formattedMonth] = [];
    }
    $scope.records = $scope.allRecords[formattedMonth];*/

    console.log($scope.currentMonth);
    appMyTransactions.query({uid:appIdentity.currentUser._id, year:$scope.currentMonth.getFullYear(), month:$scope.currentMonth.getMonth()}, function(transactions) {
      console.log(transactions);
      $scope.records = transactions;
    });
  }

  getCurrentRecords();

});