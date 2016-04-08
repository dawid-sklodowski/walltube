angular.module('wallTube').controller('youtubeCtrl', ['$scope', function($scope) {
  $scope.spinner = false;
  $scope.authorized = null;
  $scope.playlist = {
    name: 'Some Playlist',
    id: null
  };
  $scope.state = null;
  var OAUTH2_CLIENT_ID = '220836602834-ebgiur1ll9i8hfke1vsg2bv7et917n15.apps.googleusercontent.com';
  var OAUTH2_SCOPES = ['https://www.googleapis.com/auth/youtube'];

  $scope.init = function(youtubeIds) {
    $scope.youtubeIds = youtubeIds;
  };

  window.youtubeCtrlGoogleApiReady = function() {
    gapi.auth.init(function() {
      window.setTimeout(checkAuth, 1);
    });
  };

  function checkAuth() {
    $scope.$apply(function(){ $scope.spinner = true });
    gapi.auth.authorize({
      client_id: OAUTH2_CLIENT_ID,
      scope: OAUTH2_SCOPES,
      immediate: true
    }, handleAuthResult);
  };

  function handleAuthResult(authResult) {
    $scope.$apply(function() {
      if (authResult && !authResult.error) {
        $scope.authorized = 'yes';
        loadAPIClientInterfaces();
      } else {
        $scope.authorized = 'no';
      }
      $scope.spinner = false;
    });
  };

  $scope.auth = function() {
    gapi.auth.authorize({
      client_id: OAUTH2_CLIENT_ID,
      scope: OAUTH2_SCOPES,
      immediate: false
    }, handleAuthResult);
  };

  function loadAPIClientInterfaces() {
    gapi.client.load('youtube', 'v3', function() {
      handleAPILoaded();
    });
  }

  $scope.createPlaylist = function() {
    $scope.state = 'processing';
    $scope.spinner = true;
    var request = gapi.client.youtube.playlists.insert({
      part: 'snippet,status',
      resource: {
        snippet: {
          title: $scope.playlist.name,
          description: 'WallTube Playlist'
        },
        status: {
          privacyStatus: 'public'
        }
      }
    });
    request.execute(function(response) {
      var result = response.result;
      if (result) {
        $scope.playlist.id = result.id;
        addToPlaylist($scope.youtubeIds);
      } else {
        $('#status').html('Could not create playlist');
      }
    });
  }

  function addToPlaylist(ids) {
    $scope.$apply(function(){
      id = ids.shift();
      if(id === undefined) {
        $scope.state = 'done';
        $scope.spinner = false;
        return;
      }
    });
    var request = gapi.client.youtube.playlistItems.insert({
      part: 'snippet',
      resource: {
        snippet: {
          playlistId: $scope.playlist.id,
          resourceId: {
            videoId: id,
            kind: 'youtube#video'
          }
        }
      }
    });
    request.execute(function(response) {
      addToPlaylist(ids)
    });
  }
}]);
