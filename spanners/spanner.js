
var canvas_width; 
var canvas_height; 
var canvas;
var context;
var add_point;
var delete_point;
var cur_pt;
var spanner_mode;

window.onload = init;

function init()
{
        startActivity();
}

function setThetaMode()
{
	if (document.getElementById('t6').checked)
		spanner_mode = "t6";
	else if (document.getElementById('tt6').checked)
		spanner_mode = "tt6";
	else if (document.getElementById('yaoyao').checked) 
		spanner_mode = "yaoyao";
	else
		spanner_mode = "half-tt6";
}

function initGlobals()
{
        canvas = document.getElementById('spannerCanvas');
        context = canvas.getContext('2d');
        canvas_width = canvas.width;
        canvas_height = canvas.height;
	setThetaMode();

        add_point = new Point(50, 50);
        delete_point = new Point(50, 100);
}


function clearCanvas()
{
        context.clearRect(0, 0, canvas.width, canvas.height);
        real_width = canvas.width;
        canvas.width = 1;
        canvas.width = real_width;
}

function get_point(ev) 
{
        var pt;

        mouseX = ev.pageX - canvas.offsetLeft;
        mouseY = ev.pageY - canvas.offsetTop;

        pt = new Point(mouseX, mouseY);
        return pt;
} 



function draw_add_delete()
{
	var p = add_point;
        context.strokeStyle = "#000";

        context.fillStyle = "#0f0";
        context.beginPath();
        context.arc(p.x, p.y, 14, 0, Math.PI * 2, true);
        context.closePath();
        context.stroke();
        context.fill();
                
        context.lineWidth = 4.0;
        context.beginPath();
        context.moveTo(p.x - 10, p.y);
        context.lineTo(p.x + 10, p.y);
        context.closePath();
        context.stroke();

        context.beginPath();
        context.moveTo(p.x, p.y - 10);
        context.lineTo(p.x, p.y + 10);
        context.closePath();
        context.stroke();

        p = delete_point;

        context.fillStyle = "#f00";
        context.beginPath();
        context.arc(p.x, p.y, 14, 0, Math.PI * 2, true);
        context.closePath();
        context.stroke();
        context.fill();

        context.fillStyle = "#000";
        context.lineWidth = 4.0;
        context.beginPath();
        context.moveTo(p.x - 10, p.y);
        context.lineTo(p.x + 10, p.y);
        context.closePath();
        context.stroke();
}


function draw_point(p, line_color, fill_color)
{
        context.strokeStyle = line_color;
        context.fillStyle = fill_color;
        context.beginPath();
        context.arc(p.x, p.y, 7, 0, Math.PI * 2, true);
        context.closePath();
        context.stroke();
        context.fill();
}

function draw_cones(points)
{
        for (i = 0; i < points.length; ++i)
	{
		var angle = Math.PI/3.0;
		draw_edge(new Point(points[i].x + 1000*Math.cos(angle), points[i].y + 1000*Math.sin(angle)),
			new Point(points[i].x - 1000*Math.cos(angle), points[i].y - 1000*Math.sin(angle)), "#ccc", 1.0);
		angle = Math.PI * 2.0 / 3.0;
		draw_edge(new Point(points[i].x + 1000*Math.cos(angle), points[i].y + 1000*Math.sin(angle)),
			new Point(points[i].x - 1000*Math.cos(angle), points[i].y - 1000*Math.sin(angle)), "#ccc", 1.0);
		angle = Math.PI;
		draw_edge(new Point(points[i].x + 1000*Math.cos(angle), points[i].y + 1000*Math.sin(angle)),
			new Point(points[i].x - 1000*Math.cos(angle), points[i].y - 1000*Math.sin(angle)), "#ccc", 1.0);
	}
}

function draw_points(points)
{
        for (i = 0; i < points.length; ++i)
	{
		if (i == cur_pt)
			draw_point(points[i], "#f00", "#000");
		else
			draw_point(points[i], "#000", "#000");
	}
}

function dist(p, q)
{
        return Math.sqrt((p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y));
}

function draw_edge(p, q, color, thickness)
{
        context.strokeStyle = color;
        context.lineWidth = thickness;
        context.beginPath();
        context.moveTo(p.x, p.y);
        context.lineTo(q.x, q.y);
        context.closePath();
        context.stroke();

	var angle = Math.atan2(p.y-q.y, p.x-q.x); 
	var dangle = Math.PI/8.0;
	var arrowlen = 15;
	
	var arrow_loc = new Point(p.x*0.1 + q.x*0.9, p.y*0.1 + q.y*0.9);

        context.beginPath();
        context.moveTo(arrow_loc.x, arrow_loc.y);
	context.lineTo(arrow_loc.x + arrowlen * Math.cos(angle+dangle), arrow_loc.y + arrowlen * Math.sin(angle+dangle));
        context.closePath();
        context.stroke();

        context.beginPath();
        context.moveTo(arrow_loc.x, arrow_loc.y);
	context.lineTo(arrow_loc.x + arrowlen * Math.cos(angle-dangle), arrow_loc.y + arrowlen * Math.sin(angle-dangle));
        context.closePath();
        context.stroke();
}


function cone_number(q)
{
	var angle = Math.atan2(q.y, q.x);
	if (angle < 0.0)
		angle += Math.PI * 2;
	return Math.floor(angle / (Math.PI/3.0)); 
}

function rotate(p, theta)
{
	return new Point(p.x * Math.cos(theta) - p.y*Math.sin(theta), p.x*Math.sin(theta) + p.y*Math.cos(theta));
}

function yao_winner(i, points, cone)
{
	var closest = -1;
	var dist = 1000000;
	for (var j = 0; j < points.length; ++j)
	{
		if (i == j)
			continue;
		var q = new Point(points[j].x, points[j].y);
		q.x -= points[i].x;
		q.y -= points[i].y;
		var c = cone_number(q);
		if (c != cone)
			continue;
		q = rotate(q, Math.PI/2 - Math.atan2(q.y, q.x));
		if (q.y < dist)
		{
			closest = j;
			dist = q.y;
		}
	}

	return closest;
}

function theta_winner(i, points, cone)
{
	var closest = -1;
	var dist = 1000000;
	for (var j = 0; j < points.length; ++j)
	{
		if (i == j)
			continue;
		var q = new Point(points[j].x, points[j].y);
		q.x -= points[i].x;
		q.y -= points[i].y;
		var c = cone_number(q);
		if (c != cone)
			continue;
		q = rotate(q, Math.PI/3.0 * (1-cone));
		if (q.y < dist)
		{
			closest = j;
			dist = q.y;
		}
	}

	return closest;
}

function draw_theta6_edges(points)	
{
	for (var i = 0; i < points.length; ++i) 
	{
		for (var c = 0; c < 6; ++c)
		{
			var w = theta_winner(i, points, c); 
			if (w != -1)
				draw_edge(points[i], points[w], "#000", 3.0);
		}
	}

}

function draw_yaoyao_edges(points)
{
	for (var i = 0; i < points.length; ++i)
	{
		for (var c = 0; c < 6; ++ c)
		{
			var dist = 1000000;
			var closest = -1;
			for (var j = 0; j < points.length; ++j)
			{
				if (j == i)
					continue;
				var w = yao_winner(j, points, (c+3) % 6);
				if (w == i)
				{
					var q = new Point(points[j].x, points[j].y);
					q.x -= points[i].x;
					q.y -= points[i].y;
					q = rotate(q, Math.PI/3.0 * (1-c));
					if (q.y < dist)
					{
						closest = j;
						dist = q.y;
					}
				}	
			}
			if (closest != -1)
			{
				draw_edge(points[closest], points[i], "#000", 3.0);
			}
		}
	}
}

function draw_halfthetatheta6_edges(points)
{
	// For each point
	for (var i = 0; i < points.length; ++i)
	{
		// For each cone
		for (var c = 0; c < 6; c+=2)
		{
			// Find the incoming edge for this cone
			var dist = 1000000;
			var closest = -1;
			for (var j = 0; j < points.length; ++j)
			{
				// Iterate through other point j, find the point j
				// has outgoint edge to in the cone, and if it's point i,
				// compare distance to i with current "best" (closest) incoming 
				// edge for point i.
				if (j == i)
					continue;
				var w = theta_winner(j, points, (c+3) % 6);
				if (w == i)
				{
					var q = new Point(points[j].x, points[j].y);
					q.x -= points[i].x;
					q.y -= points[i].y;
					q = rotate(q, Math.PI/3.0 * (1-c));
					if (q.y < dist)
					{
						closest = j;
						dist = q.y;
					}
				}	
			}
			if (closest != -1)
			{
				draw_edge(points[closest], points[i], "#000", 3.0);
			}
		}
	}
}

function draw_thetatheta6_edges(points)
{
	for (var i = 0; i < points.length; ++i)
	{
		for (var c = 0; c < 6; ++ c)
		{
			var dist = 1000000;
			var closest = -1;
			for (var j = 0; j < points.length; ++j)
			{
				if (j == i)
					continue;
				var w = theta_winner(j, points, (c+3) % 6);
				if (w == i)
				{
					var q = new Point(points[j].x, points[j].y);
					q.x -= points[i].x;
					q.y -= points[i].y;
					q = rotate(q, Math.PI/3.0 * (1-c));
					if (q.y < dist)
					{
						closest = j;
						dist = q.y;
					}
				}	
			}
			if (closest != -1)
			{
				draw_edge(points[closest], points[i], "#000", 3.0);
			}
		}
	}
}

function draw_mode()
{
	var pos = new Point(480, 30)
	context.fillStyle = "#000";
	context.font = "bold 28px sans-serif";
	theta = String.fromCharCode(952);
	if (spanner_mode == "t6")
		context.fillText(theta + "6", pos.x, pos.y);
	else if (spanner_mode == "tt6")
		context.fillText(theta + theta + "6", pos.x, pos.y);
	else if (spanner_mode == "yaoyao") 
		context.fillText("YaoYao", pos.x, pos.y);
	else
		context.fillText("Half " + theta + theta + "6", pos.x, pos.y);
}

function startActivity()
{
        initGlobals();
        clearCanvas();
        context.strokeStyle = "#000";

        var points = [new Point(200, 200), new Point(350, 350)];
        cur_pt = -1;
        var mouse_loc = null;
 
        function draw_current_state()
        {
                clearCanvas();
		draw_cones(points);
		if (spanner_mode == "t6")
			draw_theta6_edges(points);
		else if (spanner_mode == "tt6")
	                draw_thetatheta6_edges(points);
		else if (spanner_mode == "yaoyao")
	                draw_yaoyao_edges(points);
		else
			draw_halfthetatheta6_edges(points);

		draw_points(points);
                draw_add_delete();
		draw_mode();
        }

        function ev_mousedown (ev)
        {
                // Find closest point
                for (i = 0; i < points.length; ++i)
                {
                        if (dist(points[i], mouse_loc) < 20)
                        {
              			cur_pt = i;  
                                break;
                        }
                }
                if (cur_pt == -1)
                {       
                        // Check 'point generator' aka fat point
                        if (dist(add_point, mouse_loc) < 20)
			{
				points.push(new Point(add_point.x, add_point.y));
                                cur_pt = points.length-1;
			}
                }

                draw_current_state();
        }   

        function ev_mousemove (ev) 
        {
                mouse_loc = get_point(ev); 
                if (cur_pt != -1) 
		{
                        points[cur_pt].x = mouse_loc.x;
                        points[cur_pt].y = mouse_loc.y;
		}
                draw_current_state();
        }

        function ev_mouseup (ev) 
        {
                if (dist(delete_point, mouse_loc) < 20)
		{
			if (cur_pt != -1) 
			{	
				points.splice(cur_pt, 1);
				cur_pt = -1;
			}
		}
		else
		{
			cur_pt = -1;
               	} 
                draw_current_state();
        }

        function ev_radio_mode(ev)
        {
		setThetaMode()
		draw_current_state();
        }

        canvas.addEventListener('mousedown', ev_mousedown, false);
        canvas.addEventListener('mousemove', ev_mousemove, false);
        canvas.addEventListener('mouseup', ev_mouseup, false);
	document.modesForm.addEventListener('change', ev_radio_mode, false);
	draw_current_state();

	setInterval(draw_current_state, 300);
}



function Point(x, y)
{
        this.x = x;
        this.y = y;
}



