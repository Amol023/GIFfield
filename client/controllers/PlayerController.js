appPlayer.controller('PlayerController', ['$scope',
<<<<<<< 4d253078a7ac1e6f7e872ccd92b87e5a0756efca
    function($scope) {
        // Sound manager is a audio player library with hundreds of methods available,
        // The setup we have should be enough for a MVP.
        soundManager.setup({
            onready: function() {
                var mySound,
                    showHidePlay;

                mySound = soundManager.createSound({
                    url: 'http://users.skynet.be/fa046054/home/P22/track22.mp3'
                });
                $('.showPlay').on('click', function() {
                    mySound.play();
                    $('.showPlay').hide();
                    $('.showPause').click(function() {
                        $('.showPlay').show();
                        mySound.pause();
                    });
                });
            }
        });
    }
]);
