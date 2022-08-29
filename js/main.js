canvas = document.getElementById('life');
velocity_slider = document.getElementById('velocity-slider');
fps_display = document.getElementById('fps-display');
m = canvas.getContext('2d');

fps = 0;
height = 700;
width = 700;
canvas.height = height;
canvas.width = width;

draw = (x, y, c, s) => {
    m.fillStyle = c
    m.fillRect(x, y, s, s)
}

particles = []
particle = (x, y, c) => {
    return {'x': x, 'y': y, 'vx': 0, 'vy': 0, 'color': c}
}

random = () => {
    return Math.random() * (width - 100) + 50
}

create = (number, color) => {
    group = [];
    for (let i=0; i < number; i++) {
        group.push(particle(random(), random(), color))
        particles.push(group[i])
    }
    return group
}

rule = (particles1, particles2, g) => {
    for (let i = 0; i < particles1.length; i++){
        fx = 0
        fy = 0
        for (let j = 0; j < particles2.length; j++){
            a = particles1[i]
            b = particles2[j]
            dx = a.x - b.x
            dy = a.y - b.y
            d = Math.sqrt(dx*dx + dy*dy)
            if (d > 0 && d < 80) {
                F = g * 1/d
                fx += (F *dx)
                fy += (F * dy)
            }
        }
        a.vx = (a.vx + fx) * velocity
        a.vy = (a.vy + fy) * velocity
        a.x += a.vx
        a.y += a.vy
        if (a.x <= 0 || a.x >= width){
            a.vx *= -1
        }
        if (a.y <= 0 || a.y >= height){
            a.vy *= -1
        }
    }
}


created_particles = [];
rules = []

update = () => {
  velocity = velocity_slider.value / 100;
  const t0 = performance.now();

  for (x = 0; x < rules.length; x++){
    rule(rules[x].particle1, rules[x].particle2, rules[x].g)
  }

  m.clearRect(0, 0, width, height)
  draw(0, 0, "black", width, height)
  for (i = 0; i < particles.length; i++){
      draw(particles[i].x, particles[i].y, particles[i].color, 4)
  }
  requestAnimationFrame(update)

  const t1 = performance.now();
  fps_display.innerHTML = (1 / ((t1 - t0)/1000)).toFixed(0);
}

function createParticle() {
  amount = document.getElementById("create-amount").value;
  color = document.getElementById("create-color").value;
  created_particles.push(create(amount, color));
  console.log("Created " + amount + " " + color + " particles.");
}

function createRule() {
  rule1 = document.getElementById("rule1-color").value;
  rule2 = document.getElementById("rule2-color").value;
  g = document.getElementById("rule-force").value;

  r = {}
  for (i = 0; i < created_particles.length; i++){
    if (created_particles[i][0].color == rule1){
      r['particle1'] = created_particles[i]
    }
    if (created_particles[i][0].color == rule2){
      r['particle2'] = created_particles[i]
    }
  }
  r['g'] = parseFloat(g);
  rules.push(r);
  console.log("Created rule between" + rule1 + " and " + rule2 + " with " + g + " force.");
}

update();
