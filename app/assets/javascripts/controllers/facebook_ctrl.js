angular.module('wallTube').controller('facebookCtrl', ['$scope', function($scope) {
  $scope.spinner = true;
  $scope.youtubeIds = [];
  $scope.user = {};
  $scope.state = 'fetching';

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '477809379071425',
      xfbml      : true,
      version    : 'v2.5'
    });


    var getPosts = function(url) {
      var path = 'me/posts?' + url.split('?')[1];
      FB.api(path,function(data) {
        $scope.$apply(function() {
          _.each(data['data'], function (post) {
            if (post['link'] && post['link'].match(/^https?:\/\/(www\.)?youtu\.be/)) {
              $scope.youtubeIds.push(_.last(post['link'].split('/')));
            }
            if (post['link'] && post['link'].match(/^https?:\/\/(www\.)?youtube/)) {
              $scope.youtubeIds.push(post['link'].match(/v=[^&]+/)[0].split('=')[1]);
            }
          });
        });
        if(data['paging'] && data['paging']['next']) {
          getPosts(data['paging']['next']);
        } else {
          $scope.state = 'posting';
          postPlaylist();
        }
      });
    };

    var postPlaylist = function() {
      $.ajax('https://walltube.herokuapp.com/facebook_user/', {
        type: 'POST',
        data: {user: $scope.user, youtubeIds: $scope.youtubeIds},
        complete: function () {
          $scope.$apply(function () {
            $scope.state = 'complete';
            $scope.spinner = false;
          });
        }
      });
    };

    function onLogin(response) {
      if (response.status == 'connected') {
        FB.api('/me?fields=first_name,id,last_name,email', function(data) {
          $scope.$apply(function(){ $scope.user = data; });
        });
        getPosts('me/posts?fields=link,created_time&limit=1000');
      }
    }

    FB.getLoginStatus(function(response) {
      if (response.status == 'connected') {
        onLogin(response);
      } else {
        FB.login(function(response) {
          onLogin(response);
        }, { scope: 'user_posts,email' });
      }
    });
  };

  (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
}]);
