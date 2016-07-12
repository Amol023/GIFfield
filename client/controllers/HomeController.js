appPlayer.controller('HomeController', ['$scope', 'socket',
  function($scope, socket) {
    // Sound manager is a audio player library with hundreds of methods available,
    // The setup we have should be enough for a MVP.
    /// chat controller stuff
    $scope.user = false;
    $scope.typing = false;
    $scope.TYPING_TIMER_LENGTH = 2000; // this is how quick the "[other user] is typing" message will go away

    $scope.chatSend = function() {
      socket.emit('chat message', $scope.chatMsg);
      $scope.chatMsg = "";
      return false;
    }

    $scope.chatMessages = [];

    socket.on('chat message', function(msg) {
      console.log('on is listening');
      $scope.chatMessages.push(msg);
    });

    $scope.setName = function() {
      $scope.user = true;
      socket.emit('username', $scope.screenName);
    };

    socket.on("playNpause", function(obj) {
      console.log('we heard you', obj);
    });

    $scope.updateTyping = function() {
      $scope.typing = true;
      socket.emit('typing', $scope.name);
      var lastTypingTime = (new Date()).getTime();

      setTimeout(function() {
          var typingTimer = (new Date()).getTime();
          var timeDiff = typingTimer - lastTypingTime;
          if (timeDiff >= $scope.TYPING_TIMER_LENGTH && $scope.typing) {
              socket.emit('stop typing');
              $scope.typing = false;
          }
      }, $scope.TYPING_TIMER_LENGTH);
    };

    // Whenever the server emits 'typing', show the typing message
    socket.on('typing', function(data) {
      data.typing = true;
      $scope.typingMessage = data.name + " is typing";

      if (!$scope.chatMessages.includes($scope.typingMessage)) {
          $scope.chatMessages.push($scope.typingMessage);
      }
    });

    // Whenever the server emits 'stop typing', kill the typing message
    socket.on('stop typing', function(data) {
      data.typing = false;
      var i = $scope.chatMessages.indexOf($scope.typingMessage);
      $scope.chatMessages.splice(i, 1);
    });

    // SoundCloud
    SC.initialize({
      client_id: '8af4a50e36c50437ca44cd59756301ae'
    });
    for (var i = 290; i < 295; i++) {
      SC.stream('/tracks/' + i, function(player){
        console.log("player")
        // $scope.list.url = player.url;
      });
    }
    //Playlist
    $scope.list = [
      { 
        track: 'First Song',
        url : "http://api.soundcloud.com/tracks/293/stream?client_id=8af4a50e36c50437ca44cd59756301ae"
      },
      {
        track: 'Second Song',
        url: "http://api.soundcloud.com/tracks/291/stream?client_id=8af4a50e36c50437ca44cd59756301ae"
      },
      {
        track: 'Third Song',
        url: "http://api.soundcloud.com/tracks/292/stream?client_id=8af4a50e36c50437ca44cd59756301ae"
      }
    ]
    
    soundManager.setup({
      onready: function() {
        var mySound;
        $scope.plusOne = function(index) {
          mySound = soundManager.createSound({
            url: $scope.list[index].url
          });
          mySound.play();
        }
        // $('.pipi').on('click', function() {
        //   console.log('Let us see');
        //   mySound = soundManager.createSound({
        //   url: "http://api.soundcloud.com/tracks/293/stream?client_id=8af4a50e36c50437ca44cd59756301ae"
        // });
        //   mySound.play();
        // })
        // $('.showPlay').on('click', function() {
        //   mySound.play();
        //   $('.showPlay').hide();
        //   $('.showPause').click(function() {
        //     $('.showPlay').show();
        //     mySound.pause();
        //   });
        // });
      }
    })

  }])
  .factory('socket', function($rootScope) {
    var socket = io.connect();
    return {
      on: function(eventName, callback) {
        socket.on(eventName, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            callback.apply(socket, args);
          });
        });
      },
      emit: function(eventName, data, callback) {
        socket.emit(eventName, data, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            if (callback) {
              callback.apply(socket, args);
            }
          })
        })
      }
    };
  });
  // .factory('player', function($rootScope, audio) {
  //   var player;
  //   var playlist = [];
  //   var paused = false;
  //   var current = {
  //     album: 0,
  //     track: 0
  //   };

  //   player = {
  //     playlist: playlist,
  //     current: current,
  //     playing: false,
  //     play: function(track, album) {
  //       if(!playlist.length) {return;}
  //       if(angular.isDefined(track)) {current.track = track;}
  //       if(angular.isDefined(album)) {current.album = album;}

  //       if(!paused) {
  //         audio.src = playlist[current.album].tracks[current.track].url;
  //         audio.play();
  //         player.playing = true;
  //         paused = false;
  //       }
  //     },
  //     pause: function() {
  //       if(player.playing) {
  //         audio.pause();
  //         player.playing = false;
  //         paused = true;
  //       }
  //     },
  //     reset: function() {
  //       player.pause();
  //       current.album = 0;
  //       current.track = 0;
  //     },
  //     next: function() {
  //       if(!playlist.length) {return;}
  //       paused = false;
  //       if(playlist[current.album].tracks.length > (current.track + 1)) {
  //         current.track++;
  //       } else {
  //         current.track = 0;
  //         current.album = (current.album + 1) % playlist.length;
  //       }
  //       if (player.playing) {player.play();}
  //     },
  //     previous: function() {
  //       if(!playlist.length) {return;}
  //       paused = false;
  //       if(current.track > 0) {
  //         current.track--;
  //       } else {
  //         current.album = (current.album - 1 + playlist.length) % playlist.length;
  //         current.track = playlist[current.album].tracks.length - 1;
  //       }
  //       if(player.playing) {player.play();}
  //     }
  //   };

  //   playlist.add = function(track) {
  //     playlist.push(track);
  //   };
  //   playlist.remove = function(track) {
  //     var index = playlist.indexOf(track);
  //     playlist.splice(index, 1);
  //   };

  //   audio.addEventListener('ended', function() {
  //     $rootScope.$apply(player.next);
  //   }, false);

  //   return player;
  // })
  // .factory('audio', function($document) {
  //   var audio = $document[0].createElement('audio');
  //   return audio;
  // });

