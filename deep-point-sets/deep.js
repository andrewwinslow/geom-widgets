
var GRID_SIZE = 14; 
var TOLERANCE = 0.0001;
var canvas_width; 
var canvas_height; 
var canvas;
var context;
var colors;
var add_point;
var delete_point;
var tri_size;

window.onload = init;

function init()
{
        startActivity();
}

function initGlobals()
{
        canvas = document.getElementById('deepCanvas');
        context = canvas.getContext('2d');
        canvas_width = canvas.width;
        canvas_height = canvas.height;
        tri_size = canvas_height / GRID_SIZE;
        sqrt_3 = Math.sqrt(3);

        color_chars = new Array(12);
        color_chars[0]="0";
        color_chars[1]="1";
        color_chars[2]="2";
        color_chars[3]="3";
        color_chars[4]="4";
        color_chars[5]="5";
        color_chars[5]="6";
        color_chars[6]="7";
        color_chars[7]="8";
        color_chars[8]="9";
        color_chars[9]="a";
        color_chars[10]="b";
        color_chars[11]="c";
        color_chars[12]="d";
        //color_chars[13]="e";
        //color_chars[14]="f";

        colors = [];
        for (i = 0; i < 100; ++i)
        {
                colors[i] = ("#" + 
                        color_chars[Math.round(Math.random()*12)] + 
                        color_chars[Math.round(Math.random()*12)] +
                        color_chars[Math.round(Math.random()*12)])
        }

        add_point = new Point(0, 1);
        delete_point = new Point(1, 1);
}

function tc(rect_pt)
{
        return new Point(rect_pt.x + rect_pt.y * 0.5, sqrt_3 / 2 * rect_pt.y);
}       

function rc(tri_pt)
{
        return new Point(tri_pt.x - 1 / sqrt_3 * tri_pt.y, 2 / sqrt_3 * tri_pt.y);
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



function draw_grid()
{
        context.lineWidth = 1.0;
        context.strokeStyle = "#777";
        context.fillStyle = "#000";

        for (var y = 0; y < sqrt_3 * GRID_SIZE; ++y)
        {
                context.beginPath();
                p = tc(new Point(-canvas_width, y * tri_size));
                context.moveTo(p.x, p.y);
                p = tc(new Point(canvas_width, y * tri_size));
                context.lineTo(p.x, p.y);
                context.stroke();
        }
        for (var x = -GRID_SIZE; x < sqrt_3 * GRID_SIZE; ++x)
        {
                context.beginPath();
                p = tc(new Point(x * tri_size, 0));
                context.moveTo(p.x, p.y);
                p = tc(new Point(x * tri_size, sqrt_3 * canvas_height));
                context.lineTo(p.x, p.y);
                context.stroke();
        }
        for (var x = 1; x < 2 * GRID_SIZE; ++x)
        {
                context.beginPath();
                p = tc(new Point(x * tri_size, 0));
                context.moveTo(p.x, p.y);
                p = tc(new Point(x * tri_size - sqrt_3 * canvas_height, sqrt_3 * canvas_height));
                context.lineTo(p.x, p.y);
                context.stroke();
        }

}

function draw_add_delete()
{
        p = tc(new Point(add_point.x * tri_size, add_point.y * tri_size));
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

        p = tc(new Point(delete_point.x * tri_size, delete_point.y * tri_size));

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

function draw_hint_point(pt, line_color, fill_color)
{
        p = tc(new Point(pt.x * tri_size, pt.y * tri_size));
        context.strokeStyle = line_color;
        context.fillStyle = fill_color;
        context.beginPath();
        context.arc(p.x, p.y, 3, 0, Math.PI * 2, true);
        context.closePath();
        context.stroke();
        context.fill();
}


function draw_point(pt, line_color, fill_color)
{
        p = tc(new Point(pt.x * tri_size, pt.y * tri_size));
        context.strokeStyle = line_color;
        context.fillStyle = fill_color;
        context.beginPath();
        context.arc(p.x, p.y, 7, 0, Math.PI * 2, true);
        context.closePath();
        context.stroke();
        context.fill();
}

function draw_points(points)
{
        for (i = 0; i < points.length; ++i)
                draw_point(points[i], "#000", "#000");
}

function canvas_to_grid(pt)
{
        p = rc(pt);
        p.x = Math.round(p.x / tri_size);
        p.y = Math.round(p.y / tri_size);
        return p;
}

function dist(p1, p2)
{
        p = tc(new Point(p1.x, p1.y));
        q = tc(new Point(p2.x, p2.y));
        return Math.sqrt((p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y));
}

function draw_edge(p1, p2, color, thickness)
{
        p = tc(new Point(p1.x * tri_size, p1.y * tri_size));
        q = tc(new Point(p2.x * tri_size, p2.y * tri_size));
        context.strokeStyle = colors[color];
        context.lineWidth = thickness;
        context.beginPath();
        context.moveTo(p.x, p.y);
        context.lineTo(q.x, q.y);
        context.closePath();
        context.stroke();
}

function draw_distances(points, cur_pt)
{
        dist_colors = [];
        dist_histo = [];

        if (cur_pt != null)
                points[points.length] = cur_pt;        

	// TODO: refactor to pull out histogram generation, then edge drawing	
        var c = 0;
        for (var i = 0; i < points.length; ++i)
        {
                for (var j = i+1; j < points.length; ++j)
                {
                        var d = dist(points[i], points[j]);
                        var found = false;
                        for (var kd in dist_colors)
                        {
                                if (Math.abs(kd - d) < TOLERANCE)
                                {
                                        draw_edge(points[i], points[j], dist_colors[kd], 3.0);
                                        found = true;
                                        dist_histo[kd] += 1;
                                        break;
                                }
                        }
                        if (!found)
                        {
                                dist_colors[d] = c;
                                dist_histo[d] = 1;
                                draw_edge(points[i], points[j], dist_colors[d], 3.0);
                                ++c; 
                        }
                }
        }         

	// Draw circles 
        for (var i = 0; i < points.length; ++i)
	{
		p = tc(new Point(points[i].x * tri_size, points[i].y * tri_size));
		for (var d in dist_histo) 
		{
			context.strokeStyle = colors[dist_colors[d]];
			context.lineWidth = 1.0;
			context.beginPath();
			context.arc(p.x, p.y, d*tri_size, 0, Math.PI * 2, true);
			context.closePath();
			context.stroke();
		}
	}	


        context.fillStyle = "#000";
        context.font = "bold 28px sans-serif"; 
        context.fillText("Points: " + points.length, 400, 40); 
        context.fillText("Distances: " + c , 400, 80); 

        var e = 0;
        first = true;
        for (var i = points.length * points.length; i > 0; --i)
        {
                for (var d in dist_histo)
                {
                        if (dist_histo[d] == i)
                        {
                                if (first)
                                {
                                        context.strokeStyle = "#000";
                                        context.lineWidth = 2.0;
                                        for (var j = 0; j <= i; ++j)
                                        {
                                                context.beginPath();
                                                context.moveTo(5, 580 - 10 * j);
                                                context.lineTo(10, 580 - 10 * j);
                                                context.closePath();
                                                context.stroke();
                                        }

                                        // Init for the rest of the histogram
                                        context.lineWidth = 5.0;
                                        first = false;
                                }
                                context.strokeStyle = colors[dist_colors[d]];
                                context.beginPath();
                                context.moveTo(20 + 10 * e, 580);
                                context.lineTo(20 + 10 * e, 580 - 10 * i);
                                context.closePath();
                                context.stroke();
                                ++e;
                        }
                }
        }
                
        if (cur_pt != null)
                points.splice(points.length-1, 1);
}



function determinant_3x3(m)
{
        return (m[0] * (m[4] * m[8] - m[5] * m[7]) - m[1] * (m[3] * m[8] - m[5] * m[6]) + m[2] * (m[3] * m[7] - m[4] * m[6]));
}


function determinant_4x4(m)
{
        var sm1 = [];
        var sm2 = [];
        var sm3 = [];
        var sm4 = [];

        var j1 = 0;
        var j2 = 0;
        var j3 = 0;
        var j4 = 0;
        for (var i = 4; i < 16; ++i)
        {
                switch (i % 4)
                {
                        case 0:
                                sm2[j2] = m[i];
                                sm3[j3] = m[i];
                                sm4[j4] = m[i];
                                j2++;
                                j3++;
                                j4++;
                                break;
                        case 1:
                                sm1[j1] = m[i];
                                sm3[j3] = m[i];
                                sm4[j4] = m[i];
                                j1++;
                                j3++;
                                j4++;
                                break;
                        case 2:
                                sm1[j1] = m[i];
                                sm2[j2] = m[i];
                                sm4[j4] = m[i];
                                j1++;
                                j2++;
                                j4++;
                                break;
                        case 3:
                                sm1[j1] = m[i];
                                sm2[j2] = m[i];
                                sm3[j3] = m[i];
                                j1++;
                                j2++;
                                j3++;
                                break;
                        default:
                                break;
                }
        }

        return (m[0] * determinant_3x3(sm1) - m[1] * determinant_3x3(sm2) + m[2] * determinant_3x3(sm3) - m[3] * determinant_3x3(sm4));
}


function set_cocirc_row(p, m, row)
{
        m[0 + row*4] = p.x;
        m[1 + row*4] = p.y;
        m[2 + row*4] = p.x * p.x + p.y * p.y;
        m[3 + row*4] = 1;
}

function cocircular(p1, p2, p3, p4)
{
        m = new Array();

        c_p1 = tc(p1);
        c_p2 = tc(p2);
        c_p3 = tc(p3);
        c_p4 = tc(p4);

        // For each permutation of the three points, ask whether the determinant of some matrix is approx. 0
        set_cocirc_row(c_p4, m, 3);

        set_cocirc_row(c_p1, m, 0);
        set_cocirc_row(c_p2, m, 1);
        set_cocirc_row(c_p3, m, 2);

        if (Math.abs(determinant_4x4(m)) < TOLERANCE)
        {
                return true;
        }
        
        set_cocirc_row(c_p1, m, 0);
        set_cocirc_row(c_p2, m, 2);
        set_cocirc_row(c_p3, m, 1);

        if (Math.abs(determinant_4x4(m)) < TOLERANCE)
                return true;
        
        return false;
}


function draw_cocircularity(points)
{
        var problem = false;
        for (var i = 0; i < points.length; ++i)
                for (var j = i+1; j < points.length; ++j)
                        for (var k = j+1; k < points.length; ++k)
                                for (var l = k+1; l < points.length; ++l)
                                {
                                        if (cocircular(points[i], points[j], points[k], points[l]))
                                        {
                                                draw_point(points[i], "#f00", "#f00");
                                                draw_point(points[j], "#f00", "#f00");
                                                draw_point(points[k], "#f00", "#f00");
                                                draw_point(points[l], "#f00", "#f00");
                                                problem = true;
                                        }
                                }

        if (problem)
        {
                context.fillStyle = "#000";
                context.font = "bold 28px sans-serif"; 
                context.fillText("Cocircularity!", 400, 580); 
        }
}

function draw_collinearity(points)
{
        // Check placed points
        var problem = false;
        for (var i = 0; i < points.length; ++i)
                for (var j = i+1; j < points.length; ++j)
                        for (var k = j+1; k < points.length; ++k)
                        {
                                if (collinear(points[i], points[j], points[k]))
                                {
                                        draw_point(points[i], "#f00", "#f00");
                                        draw_point(points[j], "#f00", "#f00");
                                        draw_point(points[k], "#f00", "#f00");
                                        problem = true;
                                }
                        }

        if (problem)
        {
                context.fillStyle = "#000";
                context.font = "bold 28px sans-serif"; 
                context.fillText("Collinearity!", 400, 540); 
        }
}

function draw_violations(points)
{
        for (var x = -GRID_SIZE; x <= GRID_SIZE; ++x)
                for (var y = Math.max(0, -x); y < sqrt_3 * GRID_SIZE - Math.max(0, x); ++y)
                {
                        var found = false;
                        var grid_pt = new Point(x, y);
                        for (var i = 0; i < points.length && !found; ++i)
                                for (var j = i+1; j < points.length && !found; ++j)
                                {
                                        if (collinear(grid_pt, points[i], points[j]))
                                        {
                                                draw_hint_point(grid_pt, "#f44", "#f44");
                                                found = true;
                                        }
                                } 
                        
                        if (found)
                                continue;

                        for (var i = 0; i < points.length && !found; ++i)
                                for (var j = i+1; j < points.length && !found; ++j)
                                        for (var k = j+1; k < points.length && !found; ++k)
                                        {
                                                if (cocircular(grid_pt, points[i], points[j], points[k]))
                                                {
                                                        draw_hint_point(grid_pt, "#f44", "#f44");
                                                        found = true;
                                                }
                                        } 
                        

                }
}

function collinear(p1, p2, p3)
{
        var vec1 = new Point(p2.x - p1.x, p2.y - p1.y);
        var vec1_mag = Math.sqrt(vec1.x*vec1.x + vec1.y*vec1.y);

        var vec2 = new Point(p3.x - p1.x, p3.y - p1.y);
        var vec2_mag = Math.sqrt(vec2.x*vec2.x + vec2.y*vec2.y);

        // Unitize
        vec1.x /= vec1_mag;
        vec1.y /= vec1_mag;

        vec2.x /= vec2_mag;
        vec2.y /= vec2_mag;

        if ((Math.abs(vec1.x - vec2.x) < TOLERANCE && Math.abs(vec1.y - vec2.y) < TOLERANCE) ||
                (Math.abs(-vec1.x - vec2.x) < TOLERANCE && Math.abs(-vec1.y - vec2.y) < TOLERANCE))
                return true;

        return false;
}


function startActivity()
{
        var date = new Date();

        initGlobals();
        clearCanvas();
        context.strokeStyle = "#000";

        var points = [new Point(2, 0), new Point(4, 0), new Point(0, 3), new Point(0, 5), new Point(2, 2), new Point(1, 4), new Point(5, 1), new Point(3, 4)];
        for (var i = 0; i < points.length; ++i)
                points[i].y += parseInt(GRID_SIZE / 2);
        var cur_pt = null;
        var mouse_loc = null;
 
        function draw_current_state()
        {
                clearCanvas();
                draw_grid();
                draw_violations(points);
                if (cur_pt != null)
                        points[points.length] = cur_pt;
                draw_distances(points);
                draw_add_delete();
                draw_points(points);
                draw_collinearity(points);
                draw_cocircularity(points);
                if (cur_pt != null)
                        points.splice(points.length-1, 1);
        }

        function ev_mousedown (ev)
        {
                // Find closest point
                for (i = 0; i < points.length; ++i)
                {
                        pt_loc = tc(new Point(points[i].x * tri_size, points[i].y * tri_size));
                        if (dist(pt_loc, mouse_loc) < 20)
                        {
                                points.splice(i, 1);
                                cur_pt = canvas_to_grid(mouse_loc);
                                break;
                        }
                }
                if (cur_pt == null)
                {       
                        // Check 'point generator' aka fat point
                        add_pt_loc = tc(new Point(add_point.x * tri_size, add_point.y * tri_size));
                        if (dist(add_pt_loc, mouse_loc) < 20)
                                cur_pt = new Point(1, 1);
                }

                draw_current_state();
        }   

        function ev_mousemove (ev) 
        {
                mouse_loc = get_point(ev); 
                if (cur_pt != null)
                        cur_pt = canvas_to_grid(mouse_loc);
                draw_current_state();
        }

        function ev_mouseup (ev) 
        {
                del_pt_loc = tc(new Point(delete_point.x * tri_size, delete_point.y * tri_size));
                if (dist(del_pt_loc, mouse_loc) < 20)
                        cur_pt = null;
                if (cur_pt != null)
                        points[points.length] = cur_pt; 
                cur_pt = null;
                draw_current_state();
        }

        canvas.addEventListener('mousedown', ev_mousedown, false);
        canvas.addEventListener('mousemove', ev_mousemove, false);
        canvas.addEventListener('mouseup', ev_mouseup, false);

        setInterval(draw_current_state, 300);
}



function Point(x, y)
{
        this.x = x;
        this.y = y;
}



