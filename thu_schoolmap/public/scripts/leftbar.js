/**
 * Created by xuyi on 4/29/15.
 */

var indoor_act=[];
var indoor_act_num=0;
var outdoor_act=[];
var outdoor_act_num=0;
var school_match=[];
var school_match_num=0;
var school_exhibition=[];
var school_exhibition_num=0;
var school_meeting=[];
var school_meeting_num=0;
var currentMarker=[];
var currentMarkrt_num=0;


var recommendRoute = new BMap.Polyline([
    new BMap.Point(116.322074,40.005778),
    new BMap.Point(116.325469,40.005889),
    new BMap.Point(116.32511,40.006677),
    new BMap.Point(116.325236,40.007975),
    new BMap.Point(116.325416,40.008348),
    new BMap.Point(116.326404,40.008556),
    new BMap.Point(116.328039,40.008514),
    new BMap.Point(116.328254,40.009163),
    new BMap.Point(116.328712,40.009429),
    new BMap.Point(116.329682,40.009492),
    new BMap.Point(116.329943,40.009146),
    new BMap.Point(116.331452,40.009046),
    new BMap.Point(116.331533,40.007986),
    new BMap.Point(116.331021,40.006694),
    new BMap.Point(116.328883,40.005899),
    new BMap.Point(116.322739,40.005644),
    new BMap.Point(116.321858,40.005796)
], {strokeColor:"red", strokeWeight:6, strokeOpacity:0.5});

$(document).ready(function(){

});

function createMenuScence(){
    $.each(scence_info, function(index, info) {
        $("#activitymenu5").append("<li onclick=\"moveToJingDian(" + index + ")\" class=\"listItem\">▪" + info["title"] + "</li>");
    });
}

function createMenuActivity() {
    console.log(school_exhibition);
    var num = [0, 0, 0, 0, 0];
    $.each(activity_info, function(index, info) {
        if(info["name"]=="indoor_act"){
            $("#activitymenu0").append("<li onclick=\"addActivityMarker(0," +  num[0] + ")\" class=\"listItem\">▪" + info["title"] + "</li>");
            num[0]++;
        } else if (info["name"]=="outdoor_act") {
            $("#activitymenu1").append("<li onclick=\"addActivityMarker(1," +  num[1] + ")\" class=\"listItem\">▪" + info["title"] + "</li>");
            num[1]++;
        } else if (info["name"]=="match") {
            $("#activitymenu2").append("<li onclick=\"addActivityMarker(2," +  num[2] + ")\" class=\"listItem\">▪" + info["title"] + "</li>");
            num[2]++;
        } else if (info["name"]="exhibition") {
            $("#activitymenu3").append("<li onclick=\"addActivityMarker(3," +  num[3] + ")\" class=\"listItem\">▪" + info["title"] + "</li>");
            num[3]++;
        } else if (info["name"]="meeting") {
            $("#activitymenu4").append("<li onclick=\"addActivityMarker(4," +  num[4] + ")\" class=\"listItem\">▪" + info["title"] + "</li>");
            num[4]++;
        }
    });
}

function filterActivity(data){
    $.each(data,function(infoIndex, info){
        var point = new BMap.Point(info["longitude"],info["latitude"]);
        var marker = addSMarker(point,info["type"],"<span class = 'infostyle'>" + info["title"] + "</span>",info["content"]);
        if(info["name"]=="indoor_act"){
            indoor_act.push(marker);
            indoor_act_num++;
        }
        else if(info["name"]=="outdoor_act"){
            outdoor_act.push(marker);
            outdoor_act_num++;
        }
        else if(info["name"]=="match"){
            school_match.push(marker);
            school_match_num++;
        }
        else if(info["name"]="exhibition"){
            school_exhibition.push(marker);
            school_exhibition_num++;
        }
        else if(info["name"]="meeting"){
            school_meeting.push(marker);
            school_meeting_num++;
        }
    });
}

function showRecommendRoute(){
    var m_point=new BMap.Point(116.326952,40.007364);
    map.panTo(m_point);
    map.zoomTo(16);
    map.addOverlay(recommendRoute);
}

function hideRecommendRoute(){
    map.removeOverlay(recommendRoute);
}