/**
 * Created by Yue Dayu on 2015/4/4.
 */
(function(){
    function load_script(xyUrl, callback){
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = xyUrl;
        script.onload = script.onreadystatechange = function(){
            if((!this.readyState || this.readyState === "loaded" || this.readyState === "complete")){
                callback && callback();
                script.onload = script.onreadystatechange = null;
                if ( head && script.parentNode ) {
                    head.removeChild( script );
                }
            }
        };
        // Use insertBefore instead of appendChild  to circumvent an IE6 bug.
        head.insertBefore( script, head.firstChild );
    }
    function translate(point, callback){
        var callbackName = 'cbk_' + Math.round(Math.random() * 10000);    //随机函数名
        var xyUrl = "http://api.map.baidu.com/ag/coord/convert?from=0&to=4&x=" + point.lng + "&y=" + point.lat + "&callback=BMap.Convertor." + callbackName;
        load_script(xyUrl);
        BMap.Convertor[callbackName] = function(xyResult){
            delete BMap.Convertor[callbackName];
            var point = new BMap.Point(xyResult.x, xyResult.y);
            callback && callback(point);
        }
    }

    pointTranslate = translate;
})();