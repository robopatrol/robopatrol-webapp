function Point(x, y) {
    this.x = x;
    this.y = y;
}
function Day(dayNo){
    this.day = dayNo;
}
function Time(time){
    this.time = time;
}
function Name(name){
    this.name = name;
}
var waypoints = [];
var borderpoints = [];
var days = [];
var time = [];
var names = [];
var colorWaypoints = "#FF0000";
var colorBorderpoints = "#3b0000";
var img = new Image();
img.src = "map.jpg";

/****************************
//waypoints
****************************/
function setWaypoint(e, canvas) {
    var pos = getMousePos(canvas, e);
    waypoints.push(new Point(pos.x, pos.y));
}
function deleteWaypoint(e, canvas) {
    var pos = getMousePos(canvas, e);
    var blur = 3;
    waypoints.forEach(function (point) {
        if (Math.abs(pos.x - point.x) < blur || Math.abs(pos.y - point.y) < blur)
            waypoints.splice(waypoints.indexOf(point), 1);
    });
}
/****************************
//borders
****************************/
function setBorderpoint(e, canvas) {
    var pos = getMousePos(canvas, e);
    borderpoints.push(new Point(pos.x, pos.y));
}
function deleteBorderpoint(e, canvas) {
    var pos = getMousePos(canvas, e);
    var blur = 3;
    borderpoints.forEach(function (point) {
        if (Math.abs(pos.x - point.x) < blur || Math.abs(pos.y - point.y) < blur)
            borderpoints.splice(borderpoints.indexOf(point), 1);
    });
}
/****************************
//misc
****************************/
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
function draw(canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    ctx.fillStyle = colorWaypoints;
    ctx.strokeStyle = colorWaypoints + Math.floor((Math.random() * 9) + 1);
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    //waypoints
    ctx.beginPath();
    for (var i = 0; i < waypoints.length; i++) {
        ctx.fillRect(waypoints[i].x, waypoints[i].y, 4, 4);
        ctx.fillText("Waypoint " + i + 1, waypoints[i].x, waypoints[i].y);
        ctx.lineTo(waypoints[i].x, waypoints[i].y);
    }
    ctx.stroke();
    ctx.closePath();

    //border
    ctx.fillStyle = colorBorderpoints;
    ctx.beginPath();
    for (var i = 0; i < borderpoints.length; i++) {
        ctx.fillRect(borderpoints[i].x, borderpoints[i].y, 4, 4);
        ctx.fillText("Border " + i + 1, borderpoints[i].x, borderpoints[i].y);
        ctx.lineTo(borderpoints[i].x, borderpoints[i].y);
    }
    ctx.stroke();
    ctx.closePath();
}
/****************************
//save and load
****************************/
function savePatrol(){
    //schedule
    //create Days and Time JSON object
    alert("concat: "+JSON.stringify(days.concat(time, names)));
    $.ajax({
        type: "POST",
        url: "localhost:9998/schdule",
        data: JSON.stringify(days.concat(time, names)),
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
    alert("saving waypoints: \n"+JSON.stringify(waypoints));
    $.ajax({
        type: "POST",
        url: "localhost:9998/waypoints",
        data: JSON.stringify(waypoints),
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
    alert("saving borderpoints: \n"+JSON.stringify(borderpoints));
    $.ajax({
        type: "POST",
        url: "localhost:9998/borderpoints",
        data: JSON.stringify(borderpoints),
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
function loadPatrol(){
    alert("loading:");
     $.ajax({
        type: "GET",
        url: "localhost:9000",
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
function getDays(){
    $("input:checkbox[name=days]:checked").each(function(){
        days.push(new Day($(this).val()));
    });
}
function getTime(){
    time.push(new Time(document.getElementById("time").value));
}
function getName(){
    names.push(new Name(document.getElementById("name").value));
}