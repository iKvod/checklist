(function (){
    'use Strict'
    angular
        .module('checklist')
        .constant("baseURL", "https://localhost:8080")
        .factory('WebcamService', WebcamService)
        .factory('ChecklistService', ChecklistService)
        .factory('CheckinService', CheckinService)
        .factory('CheckoutService', CheckoutService)
        .factory('ReportService', ReportService);

        WebcamService.$inject = ['$http', 'baseURL'];
        ChecklistService.$inject = ['$resource', 'baseURL'];
        CheckinService.$inject = ['$resource', 'baseURL'];
        CheckoutService.$inject = ['$resource', 'baseURL'];
        ReportService.$inject = ['$resource', 'baseURL'];

        function ReportService($resource, baseURL) {
            return $resource(baseURL + '/api/checklist/upload/:id', { id: "@id"}, {
                query: {
                    method: "POST",
                    params: {"id":"@id"},
                    isArray: false,
                    cache: false,
                }
            });
        };

        function CheckoutService($resource, baseURL){

            return $resource(baseURL + '/api/checklist/checkout/:id', { id: '@id'}, {
                query: {
                    method: "PUT",
                    params: { "id":"@id" },
                    isArray: false, 
                    cache: false,
                    //transformRequest, 
                    //interceptor
                }, 
                get: {
                    method: "GET",
                    params: {"id": "@id"},
                    isArray: false,
                    cache: false,
                },
                update: {
                    method: 'PUT',
                    params:{"id":"@id"},
                    isArray:false,
                    cache:false,
                }
            })

        }
        
        function CheckinService($resource, baseURL){
            return $resource(baseURL + '/api/checklist/checkin/:id', { id: "@id" }, {
                query: {
                    method: 'POST',
                    params: {"id": "@id"},
                    isArray: false,
                    cache: false,
                }
            });
        }

        function ChecklistService($resource, baseURL){
           //return $resource("/api/checklist/:id", { id: "@id" });
           return $resource(baseURL + '/api/checklist/:id', { id: '@id'}, {
                query: {
                    method: "GET",
                    params: {},
                    isArray: false, 
                    cache: false,
                    //transformRequest, 
                    //interceptor
                }, 
                get: {
                    method: "GET",
                    params: {"id": "@id"},
                    isArray: false,
                    cache: false,
                }
            })
        } 

        function WebcamService ($http, baseURL) {
            var webcam = {};
            webcam.isTurnOn = false;
            webcam.patData = null;
            var _video = null;
            var _stream = null;
            webcam.patOpts = {x: 0, y: 0, w: 25, h: 25};
            webcam.channel = {};
            webcam.webcamError = false;

            var getVideoData = function getVideoData(x, y, w, h) {
                var hiddenCanvas = document.createElement('canvas');
                hiddenCanvas.width = _video.width;
                hiddenCanvas.height = _video.height;
                var ctx = hiddenCanvas.getContext('2d');
                ctx.drawImage(_video, 0, 0, _video.width, _video.height);
                return ctx.getImageData(x, y, w, h);
            };

            var sendSnapshotToServer = function sendSnapshotToServer(imgBase64) {
                webcam.snapshotData = imgBase64;    
            };

            webcam.makeSnapshot = function() {
                if (_video) {
                    var patCanvas = document.querySelector('#snapshot');
                    if (!patCanvas) return;

                    patCanvas.width = _video.width;
                    patCanvas.height = _video.height;
                    var ctxPat = patCanvas.getContext('2d');

                    var idata = getVideoData(webcam.patOpts.x, webcam.patOpts.y, webcam.patOpts.w, webcam.patOpts.h);
                    ctxPat.putImageData(idata, 0, 0);
                    //console.log(patCanvas);
                    //console.log(patCanvas.toDataURL());
                    sendSnapshotToServer(patCanvas.toDataURL('image/jpeg', 1.0));

                    webcam.patData = idata;

                    webcam.success(webcam.snapshotData.substr(webcam.snapshotData.indexOf('base64,') + 'base64,'.length), 'image/jpeg');
                    webcam.turnOff();
                }
            };

            webcam.onSuccess = function () {
                _video = webcam.channel.video;
                webcam.patOpts.w = _video.width;
                webcam.patOpts.h = _video.height;
                webcam.isTurnOn = true;
            };

            webcam.onStream = function (stream) {
                activeStream = stream;
                return activeStream;
            };

            webcam.downloadSnapshot = function downloadSnapshot(dataURL) {
                window.location.href = dataURL;
            };

            webcam.onError = function (err) {
                webcam.webcamError = err;
            };

            webcam.turnOff = function () {
                webcam.isTurnOn = false;
                if (activeStream && activeStream.getVideoTracks) {
                    const checker = typeof activeStream.getVideoTracks === 'function';
                    if (checker) {
                        return activeStream.getVideoTracks()[0].stop();
                    }
                    return false;
                }
                return false;
            };


            var service = {
                webcam: webcam
            };

            return service;
        }

})();

// factory.("Post", function($recorse){
//     return $resource(url, {}, {
//         query: {
//             method: "GET",
//             params: {},
//             isArray: true, 
//             cache: true,
//             //transformRequest, 
//             //interceptor
//         }, 
//         get: {
//             method: "GET",
//             //params: {"id": @id},
//             isArray: true,
//             cache: true,
//         }
//     })
// })


// Post.query();
// Post.get();

