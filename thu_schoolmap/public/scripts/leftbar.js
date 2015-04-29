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

$(document).ready(function(){

});

function createMenuScence(){

}

function createMenuActivity(){

}

function filterActivity(data){
    $.each(data,function(infoIndex,info){
        var point = new BMap.Point(info["longitude"],info["latitude"]);
        var marker = addSMarker(point,info["type"],info["title"],info["content"]);
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