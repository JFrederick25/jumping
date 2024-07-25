let p = {};
gravity = 0.5;
p.vel = 0;
p.x = 180;
p.y = 360;
p.maxH = 0;
p.score = 0;

let m = {};
m.vel = 0;
m.off = 0;

let clouds = [];
let bonus = {};
let platforms = {};


///////setup
function setup() {
    createCanvas(400, 500);
    setBonus();
    setPlatforms();
    setClouds();
}

///////draw
function draw() {
    var backmod = Math.trunc(p.y/ -200);

    background(190 + backmod, 240, 255);

    stroke('black');
    strokeWeight(1);

    // figure out gravity
    p.vel += gravity;
    p.y += p.vel;

    if (p.y > 360) {
        p.y = 360;
        p.vel = -12.5;
    }

    // figure out left/right
    m.vel = Math.trunc(mouseX - p.x);
    p.x += m.vel / 10;

    if (p.x < 20) p.x = 20;
    if (p.x > 380) p.x = 380;

    // top tracking
    if (p.y < 200) {
        m.off = p.y - 200;
    }

    // clouds
    fill('white');
    clouds.forEach(cld => {
        var cx = cld.col * 38;
        var cy = (cld.alt * -20) + 300 - (m.off / 2);
        var cw = cld.wid * 38;
        var ch = cld.hih * -20;
        rect(cx, cy, cw, ch);
    });

    // player
    fill('orange');
    rect(p.x - 20, p.y - m.off, 40, 40);

    // bonus
    fill('yellow');
    bonus.arr.forEach(bns => {
        var bx = bns.col * 38;
        var by = (bns.alt * -20) + 300 - m.off;
        rect(bx, by, 20, 20);
        var a = { x: p.x - 20, y: p.y - m.off, w: 40, h: 40 };
        var b = { x: bx, y: by, w: 20, h: 20 };
        var collided = collision(a, b);
        if (collided) {
            p.vel = -18;
            var ind = bonus.arr.indexOf(bns);
            bonus.arr.splice(ind, 1);
            p.score++;
        }
    });

    // platform
    fill('green');
    platforms.arr.forEach(plt => {
        var px = plt.col * 38;
        var py = (plt.alt * -20) + 300 - (m.off);
        var pw = plt.wid * 38;
        var ph = plt.hih * -20;
        rect(px, py, pw, ph);
        var a = { x: p.x - 20, y: p.y - m.off, w: 40, h: 40 };
        var b = { x: px, y: py, w: pw, h: ph };
        var collided = bottomCollision(a, b);
        if (collided && p.vel > 0) {
            p.vel = -13;
        }
    });

    // ground
    fill('brown');
    rect(0, 400 - m.off, 400, 100);

    fill('yellow');
    stroke('blue');
    strokeWeight(3);
    textSize(36);
    
    p.maxH = Math.max(Math.trunc((p.y / -20) + 18), p.maxH);
    text(p.maxH, 20, 30);
    text(p.score, 220, 30)
    
    // debug info
    
}



function bottomCollision(a, b) {
    // bottom left corner of a inside b
    if (a.x > b.x && a.x < b.x + b.w) {
        if (a.y + a.h > b.y && a.y + a.h < b.y + b.h) {
            return true;
        }
    }

    // bottom right corner of a inside b
    if (a.x + a.w > b.x && a.x + a.w < b.x + b.w) {
        if (a.y + a.h > b.y && a.y + a.h < b.y + b.h) {
            return true;
        }
    }

    // bottom left corner of a inside b
    if (b.x > a.x && b.x < a.x + a.w) {
        if (b.y + b.h > a.y && b.y + b.h < a.y + a.h) {
            return true;
        }
    }

    // bottom right corner of a inside b
    if (b.x + b.w > a.x && b.x + b.w < a.x + a.w) {
        if (b.y + b.h > a.y && b.y + b.h < a.y + a.h) {
            return true;
        }
    }

    // top of a above but between sides of b AND
    // bottom of a below but between sides of b
    if (a.x > b.x && a.x + a.w < b.x + b.w) {
        if (a.y < b.y && a.y + a.h > b.y + b.h) {
            return true;
        }
    }

    // top of b above but between sides of a AND
    // bottom of b below but between sides of a
    if (b.x > a.x && b.x + b.w < a.x + a.w) {
        if (b.y < a.y && b.y + b.h > a.y + a.h) {
            return true;
        }
    }

    return false;
}

function collision(a, b) {
    // top left corner of a inside b
    if (a.x > b.x && a.x < b.x + b.w) {
        if (a.y > b.y && a.y < b.y + b.h) {
            return true;
        }
    }

    // top right corner of a inside b
    if (a.x + a.w > b.x && a.x + a.w < b.x + b.w) {
        if (a.y > b.y && a.y < b.y + b.h) {
            return true;
        }
    }

    // bottom left corner of a inside b
    if (a.x > b.x && a.x < b.x + b.w) {
        if (a.y + a.h > b.y && a.y + a.h < b.y + b.h) {
            return true;
        }
    }

    // bottom right corner of a inside b
    if (a.x + a.w > b.x && a.x + a.w < b.x + b.w) {
        if (a.y + a.h > b.y && a.y + a.h < b.y + b.h) {
            return true;
        }
    }

    ///////////
    // top left corner of b inside a
    if (b.x > a.x && b.x < a.x + a.w) {
        if (b.y > a.y && b.y < a.y + a.h) {
            return true;
        }
    }

    // top right corner of a inside b
    if (b.x + b.w > a.x && b.x + b.w < a.x + a.w) {
        if (b.y > a.y && b.y < a.y + a.h) {
            return true;
        }
    }

    // bottom left corner of a inside b
    if (b.x > a.x && b.x < a.x + a.w) {
        if (b.y + b.h > a.y && b.y + b.h < a.y + a.h) {
            return true;
        }
    }

    // bottom right corner of a inside b
    if (b.x + b.w > a.x && b.x + b.w < a.x + a.w) {
        if (b.y + b.h > a.y && b.y + b.h < a.y + a.h) {
            return true;
        }
    }

    // top of a above but between sides of b AND
    // bottom of a below but between sides of b
    if (a.x > b.x && a.x + a.w < b.x + b.w) {
        if (a.y < b.y && a.y + a.h > b.y + b.h) {
            return true;
        }
    }

    // top of b above but between sides of a AND
    // bottom of b below but between sides of a
    if (b.x > a.x && b.x + b.w < a.x + a.w) {
        if (b.y < a.y && b.y + b.h > a.y + a.h) {
            return true;
        }
    }

    return false;
}