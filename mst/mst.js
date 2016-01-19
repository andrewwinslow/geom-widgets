
var canvasWidth; 
var canvasHeight; 
var canvas;
var context;
var points;
var preemptive;
var curPt;

window.onload = init;

function init()
{
        startActivity();
}

function initGlobals()
{
        canvas = document.getElementById('mstCanvas');
        context = canvas.getContext('2d');
        canvasWidth = canvas.width;
        canvasHeight = canvas.height;
        preemptive = true;

        points = [];
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

function drawPoint(pt, lineColor, fillColor)
{
        context.strokeStyle = lineColor;
        context.fillStyle = fillColor;
        context.beginPath();
        context.arc(pt.x, pt.y, 6, 0, Math.PI * 2, true);
        context.closePath();
        context.stroke();
        context.fill();
}

// return dist^2 for speed
function dist(p1, p2)
{
        return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
}

function draw_edge(p1, p2, color, thickness)
{
        context.strokeStyle = color;
        context.lineWidth = thickness;
        context.beginPath();
        context.moveTo(p1.x, p1.y);
        context.lineTo(p2.x, p2.y);
        context.closePath();
        context.stroke();
}

function drawPoints()
{
        for (var i = 0; i < points.length; ++i)
        {
                if (points[i] == curPt)
                        drawPoint(points[i], "#f00", "#000");
                else
                        drawPoint(points[i], "#000", "#000");
        }         
}

function drawMST()
{
	var edges = MST();
	for (var i = 0; i < edges.length; ++i)
	{
		draw_edge(edges[i][0], edges[i][1], "00f", 3.0);
	}
}

function MST()
{
	if (points.length == 0)
		return [];

	// let's do a less-efficient but simpler version of prim's algorithm

	// initialize two arrays: one containing things reached so far, one containing things (vertices) left to reach
	var processed = [points[0]];
	var remaining = [];
	var edges = [];
	for (var i = 1; i < points.length; ++i)
	{
		remaining.push(points[i]);
	}
	
	while (remaining.length > 0)
	{
		var winner = 0;
		var contact = 0;
		for (var i = 0; i < remaining.length; ++i)
		{
			for (var j = 0; j < processed.length; ++j)
			{
				if (dist(remaining[i], processed[j]) < dist(remaining[winner], processed[contact]))
				{
					winner = i;
					contact = j;
				}
			}
		}
		edges.push([remaining[winner], processed[contact]]);
		processed.push(remaining[winner]);
		remaining.splice(winner, 1);
	}
	return edges;	
}

function add_point(x, y)
{
	points.push(new Point(x * canvasWidth, y * canvasHeight)); 
}

function is_near_boundary(loc, threshold)
{
        return !(threshold < loc.x && loc.x < canvasWidth - threshold && threshold < loc.y && loc.y < canvasHeight - threshold)
}


function startActivity()
{
        initGlobals();
        clearCanvas();
        context.strokeStyle = "#000";

        points = [];

        curPt = null;
        var mouseLoc = null;

        add_point(0.1, 0.3);
        add_point(0.15, 0.73);
        add_point(0.31, 0.11);
        add_point(0.41, 0.57);
        add_point(0.54, 0.48);

        function draw_current_state()
        {
                clearCanvas();
                drawMST();
                drawPoints();
        }
        
        function eventMouseDown(ev)
        {
                // Find closest point
                for (i = 0; i < points.length; ++i)
                {
                        if (dist(points[i], mouseLoc) < 400)
                        {
                                curPt = points[i];
                                break;
                        }
                }
                if (curPt == null && !is_near_boundary(mouseLoc, 10))
                {      
			points.push(new Point(mouseLoc.x, mouseLoc.y));
			curPt = points[points.length-1];
                }

                draw_current_state();
        }   

        function eventMouseMove(ev) 
        {
                mouseLoc = get_point(ev); 
                if (is_near_boundary(mouseLoc, 8))
                {
                        curPt = null;
                }
                else if (curPt != null)
		{
			curPt.x = Math.min(Math.max(mouseLoc.x, 0), canvasWidth);
			curPt.y = Math.min(Math.max(mouseLoc.y, 0), canvasHeight);
		}
                draw_current_state();
        }

        function eventMouseUp(ev) 
        {
                curPt = null;
                draw_current_state();
        }

        canvas.addEventListener('mousedown', eventMouseDown, false);
        canvas.addEventListener('mousemove', eventMouseMove, false);
        canvas.addEventListener('mouseup', eventMouseUp, false);

        draw_current_state();
}

function Point(x, y)
{
        this.x = x;
        this.y = y;
}



