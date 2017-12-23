/// Resources.js
// This is simple an image loading utility. called engine.js
(function() {
    var MyresourceCache = {};
    var readyForCallbacks = [];

    /// This is the public image loading function. 
    function load(urlOrArray) {
        if(urlOrArray instanceof Array)
         {
            urlOrArray.forEach(function(url) 
            {
                _load(url);
            });
        } else {
            _load(urlOrArray);
        }
    }

    // This is our private image loader function.
    function _load(url) {
        if(MyresourceCache[url]) {
            // chcek for  If this URL has been  loaded  before  then 
            //it will exist with on the
            // our MyresourceCache array. 
            //Just return for that image not 
            // our re-loading the image.
            
            return MyresourceCache[url];
        } else {
            // This URL is not before loaded and is not present.
            var img = new Image();
            img.onload = function() {
                // Once our image has properly loaded.
                MyresourceCache[url] = img;

                // When the image is  loaded and  cached,
                // call all of the onReady functions.
                if(Ready()) {

                    //Check for each

                    readyForCallbacks.forEach(function(func) { func(); });
                }
            };

            // Set initial value to false.
            MyresourceCache[url] = false;
            img.src = url;
        }
    }

    // This is used for grab  some referances.
    function get(url) {
        return MyresourceCache[url];
    }

    // This function determines if all of the images that have been requested.
     
    function Ready() {
        var ready = true;
        for(var k in MyresourceCache) {
            
            //Check for property

            if(MyresourceCache.hasOwnProperty(k) &&
               !MyresourceCache[k]) { ready = false;
            }
        }
        return ready;
    }

    // This function will add a function to the callback stack.
    function onReady(func) {
        readyForCallbacks.push(func);
    }

    // This object defines the publicly accessible functions.
    window.Resources = {
        load: load,
        get: get,
        onReady: onReady,
        Ready: Ready
    };
})();
