import {inject} from 'aurelia-framework';

import {Ros} from '../../lib/ros';
import {Point} from './point';
import $ from 'jquery';

@inject(Ros)
export class MapNavigation {

  waypoints = [];
  borderpoints = [];
  colorWaypoints = "green";
  colorBorderpoints = "red";

  constructor(ros, point) {
    this.ros = ros;
    this.point = point;
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

    var ctx = document.querySelector("#path").getContext("2d");
    var canvas = document.querySelector("#path");
    ctx.canvas.width  = 400;
    ctx.canvas.height = 400;

    $("#path").contextmenu((event)=> {
        this.deleteWaypoint(event, canvas, ctx);
        this.deleteBorderpoint(event, canvas, ctx);
        this.draw(canvas, ctx);
    });
    $("#path").click((event)=> {
        if(!event.shiftKey) {
            this.setWaypoint(event, canvas);
            this.draw(canvas, ctx);
        }
    });
    $("#path").click((event)=> {
        if(event.shiftKey) {
            this.setBorderpoint(event, canvas);
            this.draw(canvas, ctx);
        }
    });
  }

  //waypoint-stuff
  setWaypoint(e, canvas) {
    var pos = this.getMousePos(canvas, e);
    this.waypoints.push(new Point(pos.x, pos.y));
  }
  
  deleteWaypoint(e, canvas) {
    var pos = this.getMousePos(canvas, e);
    var blur = 3;
    this.waypoints.forEach( (point)=> {
      if (Math.abs(pos.x - point.x) < blur && Math.abs(pos.y - point.y) < blur)
        this.waypoints.splice(this.waypoints.indexOf(point), 1);
    });
  }
  /****************************
  //borders
  ****************************/
  setBorderpoint(e, canvas) {
    var pos = this.getMousePos(canvas, e);
    this.borderpoints.push(new Point(pos.x, pos.y));
  }
  
  deleteBorderpoint(e, canvas) {
    var pos = this.getMousePos(canvas, e);
    var blur = 3;
    this.borderpoints.forEach( (point) => {
      if (Math.abs(pos.x - point.x) < blur && Math.abs(pos.y - point.y) < blur)
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
    ctx.fillStyle = this.colorWaypoints;
    ctx.strokeStyle = this.colorWaypoints;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    //waypoints
    ctx.beginPath();
    for (var i = 0; i < this.waypoints.length; i++) {
        ctx.fillRect(this.waypoints[i].x, this.waypoints[i].y, 4, 4);
        ctx.fillText("Waypoint " + i, this.waypoints[i].x, this.waypoints[i].y);
        ctx.lineTo(this.waypoints[i].x, this.waypoints[i].y);
    }
    ctx.stroke();
    ctx.closePath();

    //border
    ctx.fillStyle = this.colorBorderpoints;
    ctx.strokeStyle = this.colorBorderpoints;
    ctx.beginPath();
    for (var i = 0; i < this.borderpoints.length; i++) {
        ctx.fillRect(this.borderpoints[i].x, this.borderpoints[i].y, 4, 4);
        ctx.fillText("Border " + i, this.borderpoints[i].x, this.borderpoints[i].y);
        ctx.lineTo(this.borderpoints[i].x, this.borderpoints[i].y);
    }
    ctx.stroke();
    ctx.closePath();
  }

  btnSave(){
    this.savePatrol();
  }
    
  /****************************
  //save and load
  ****************************/
  savePatrol(){
    //schedule
    //create Days and Time JSON object
    alert("yo");
    this.getDays();
    this.getTime();
    this.getName();
    //alert("concat: "+JSON.stringify(this.days.getDay().concat(this.time, this.names)));
    alert(JSON.stringify("days "+this.days));
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
}