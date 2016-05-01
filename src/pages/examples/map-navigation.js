import {inject} from 'aurelia-framework';

import {Ros} from 'lib/ros';
import {DOM} from 'aurelia-pal'
import $ from 'jquery';

@inject(Ros)
export class MapNavigation {

	waypoints = [];
	borderpoints = [];
	days = [];
	time = [];
	names = [];
	colorWaypoints = "#FF0000";
	colorBorderpoints = "#3b0000";
	/*img = new Image();
	img.src = "map.jpg";*/

  constructor(ros, dom) {
    this.ros = ros;
    this.dom = dom;
  }

  attached() {
    // Create the main viewer.
    var viewer = new ROS2D.Viewer({
      divID : 'nav',
      width : 400,
      height : 400
    });

    // Setup the nav client.
    var nav = NAV2D.OccupancyGridClientNav({
      ros : this.ros,
      rootObject : viewer.scene,
      viewer : viewer,
      serverName : '/move_base'
    });

    // example map click listener
    viewer.scene.addEventListener('click', (event) => {
      var coords = viewer.scene.getStage().globalToRos(event.stageX, event.stageY);
      var pose = new ROSLIB.Pose({
        position : new ROSLIB.Vector3(coords)
      });
      console.log("Coords:\nx: " + coords.x + "\ny: " + coords.y + "\nz: " + coords.z);
    });
  }

	bind() {
    	$(document).ready(function () {
    		alert("jQuery ready");
            //var ctx = document.querySelector("canvas").getContext("2d");
            /*img.onload = function () {
                ctx.drawImage(img, 0, 0);
            };*/

            $("#path").contextmenu(function (event) {
                deleteWaypoint(event, document.querySelector("canvas"), ctx);
                draw(document.querySelector("canvas"), ctx);
            });
            $("#path").click(function (event) {
                if(!event.shiftKey)
                {
                    setWaypoint(event, document.querySelector("canvas"));
                    draw(document.querySelector("canvas"), ctx);
                }
            });
            $("#path").click(function (event) {
                if(event.shiftKey)
                {
                    setBorderpoint(event, document.querySelector("canvas"));
                    draw(document.querySelector("canvas"), ctx);
                }
            });
        });
  	}

  	//waypoint-stuff
  	setWaypoint(e, canvas) {
    	var pos = getMousePos(canvas, e);
    	this.waypoints.push(new Point(pos.x, pos.y));
	}
	deleteWaypoint(e, canvas) {
	    var pos = getMousePos(canvas, e);
	    var blur = 3;
	    this.waypoints.forEach(function (point) {
	        if (Math.abs(pos.x - point.x) < blur || Math.abs(pos.y - point.y) < blur)
	            this.waypoints.splice(this.waypoints.indexOf(point), 1);
	    });
	}
	/****************************
	//borders
	****************************/
	setBorderpoint(e, canvas) {
	    var pos = getMousePos(canvas, e);
	    this.borderpoints.push(new Point(pos.x, pos.y));
	}
	deleteBorderpoint(e, canvas) {
	    var pos = getMousePos(canvas, e);
	    var blur = 3;
	    this.borderpoints.forEach(function (point) {
	        if (Math.abs(pos.x - point.x) < blur || Math.abs(pos.y - point.y) < blur)
	            this.borderpoints.splice(this.borderpoints.indexOf(point), 1);
	    });
	}

	/****************************
	//misc
	****************************/
	getMousePos(canvas, evt) {
	    var rect = canvas.getBoundingClientRect();
	    return {
	        x: evt.clientX - rect.left,
	        y: evt.clientY - rect.top
	    };
	}
	draw(canvas, ctx) {
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    //ctx.drawImage(img, 0, 0);
		attached();
	    ctx.fillStyle = this.colorWaypoints;
	    ctx.strokeStyle = this.colorWaypoints + Math.floor((Math.random() * 9) + 1);
	    ctx.lineWidth = 1;
	    ctx.setLineDash([5, 5]);

	    //waypoints
	    ctx.beginPath();
	    for (var i = 0; i < this.waypoints.length; i++) {
	        ctx.fillRect(this.waypoints[i].x, this.waypoints[i].y, 4, 4);
	        ctx.fillText("Waypoint " + i + 1, this.waypoints[i].x, this.waypoints[i].y);
	        ctx.lineTo(this.waypoints[i].x, this.waypoints[i].y);
	    }
	    ctx.stroke();
	    ctx.closePath();

	    //border
	    ctx.fillStyle = colorBorderpoints;
	    ctx.beginPath();
	    for (var i = 0; i < this.borderpoints.length; i++) {
	        ctx.fillRect(borderpoints[i].x, this.borderpoints[i].y, 4, 4);
	        ctx.fillText("Border " + i + 1, this.borderpoints[i].x, this.borderpoints[i].y);
	        ctx.lineTo(this.borderpoints[i].x, this.borderpoints[i].y);
	    }
	    ctx.stroke();
	    ctx.closePath();
	}
  	point(x, y) {
    this.x = x;
    this.y = y;
	}
	day(dayNo){
	    this.day = dayNo;
	}
	time(time){
	    this.time = time;
	}
	name(name){
	    this.name = name;
	}
    btnSave(){
	    getDays();
	    getTime();
	    getName();
	    savePatrol();
	}
	btnLoad(){
    	loadPatrol();
	}
	/****************************
	//save and load
	****************************/
	savePatrol(){
	    //schedule
	    //create Days and Time JSON object
	    alert("yo");
	    getDays();
	    getTime();
	    getName();
	    alert("concat: "+JSON.stringify(this.days.concat(this.time, this.names)));
	    $.ajax({
	        type: "POST",
	        url: "localhost:9998/schdule",
	        data: JSON.stringify(this.days.concat(this.time, this.names)),
	        contentType: "application/json; charset=utf-8",
	        //crossDomain: true,
	        dataType: "json",
	        success: function (data, status, jqXHR) {

	            alert("everything ok!");
	        },
	        error: function (jqXHR, status) {
	        // error handler
	        console.log(jqXHR);
	        alert("failed: " + status.code);
	        }
	    });
	    //waypoints
	    alert("saving waypoints: \n"+JSON.stringify(this.waypoints));
	    $.ajax({
	        type: "POST",
	        url: "localhost:9998/waypoints",
	        data: JSON.stringify(this.waypoints),
	        contentType: "application/json; charset=utf-8",
	        //crossDomain: true,
	        dataType: "json",
	        success: function (data, status, jqXHR) {

	            alert("everything ok!");
	        },
	        error: function (jqXHR, status) {
	        // error handler
	        console.log(jqXHR);
	        alert("failed: " + status.code);
	        }
	    });
	    //border
	    alert("saving borderpoints: \n"+JSON.stringify(this.borderpoints));
	    $.ajax({
	        type: "POST",
	        url: "localhost:9998/borderpoints",
	        data: JSON.stringify(this.borderpoints),
	        contentType: "application/json; charset=utf-8",
	        //crossDomain: true,
	        dataType: "json",
	        success: function (data, status, jqXHR) {

	            alert("everything ok!");
	        },
	        error: function (jqXHR, status) {
	        // error handler
	        console.log(jqXHR);
	        alert("failed: " + status.code);
	        }
	    });
	}
	loadPatrol(){
	    alert("loading:");
	     $.ajax({
	        type: "GET",
	        url: "localhost:9998",
	        contentType: "application/json; charset=utf-8",
	        //crossDomain: true,
	        dataType: "json",
	        success: function (data, status, jqXHR) {

	            alert("success");
	        },
	        error: function (jqXHR, status) {
	            // error handler
	            console.log(jqXHR);
	            alert("failed: " + status.code);
	        }
	    }).then(function(data){
	        alert("data read: "+data.toString());
	    });
	}
	/*************************************
	//getters for additional informations
	*************************************/
	getDays(){
	    $("input:checkbox[name=days]:checked").each(function(){
	        this.days.push(new day(${this.days}));
	    });
	}
	getTime(){
	    this.time.push(new time(${this.time}));
	}
	getName(){
	    this.names.push(new name(${this.patrolName}));
	}
}