'use strict';

angular.module('transmedApp')

// Video modal configs & actions
.controller('VideoModalCtrl', function ($scope, $log, ngDialog) {

  	$scope.openSecond = function (dataVideo) {
    	ngDialog.close();

	   	ngDialog.open({
		    // url from index.html at the root
		    template: 'app/modal/modalform.html',
		    plain: false,
		    controller: 'FormModalCtrl',
		    className: 'ngdialog-theme-default',
		    data: dataVideo,
		    closeByEscape: false,
		    closeByDocument: false,
		    showClose: false,
		    cache: false
		});

  	};

})

// Form modal configs & actions
 .controller('FormModalCtrl', function ($scope, $log, ngDialog, $rootScope) {

 	$scope.feedback = '';
  var cb = $rootScope.cb;
  //$log.debug(cb);

  	$scope.close = function () {
    	ngDialog.close();
  	};

  	$scope.submitForm = function (answer, video){

  		if (answer.length < 1 || answer.length > 120) {
  			answer = undefined;
  			$scope.feedback = 'Il n\'y a rien à envoyer.';
  		}else{
        // Answer in params
        var params = {
          status: video.hashtag + ' ' + answer
        };

        $log.debug(params);

        // Tweet the answer
        cb.__call(
            "statuses_update",
            params,
            function (reply) {
                // ...
            }
        );

        ngDialog.close();
      }
  	};

})