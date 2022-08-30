canvas = document.getElementById('life');
velocity_slider = document.getElementById('velocity-slider');
fps_display = document.getElementById('fps-display');
m = canvas.getContext('2d');

fps = 0;
height = 700;
width = 700;
velocity = 0.5;
canvas.height = height;
canvas.width = width;

draw = (x, y, c, s) => {
    m.fillStyle = c
    m.fillRect(x, y, s, s)
}

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

particles = []
created_particles = [];
created_rules = []

update = () => {
  console.log(created_particles);
  console.log(created_rules);
  console.log(particles);
  velocity = velocity_slider.value / 100;
  const t0 = performance.now();

  for (x = 0; x < created_rules.length; x++){
    rule(created_rules[x].particle1, created_rules[x].particle2, created_rules[x].g)
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
update();

reset = () => {
  particles = []
  created_particles = [];
  created_rules = []

  console.log("Reset");
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
  created_rules.push(r);
  console.log("Created rule between " + rule1 + " and " + rule2 + " with " + g + " of force.");
  console.log(created_particles);
  console.log(created_rules);
  console.log(particles);
}

function exportFile() {
  const data = [created_particles, created_rules]
  const filename = 'data.json';
  const jsonStr = JSON.stringify(data);

  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);
}

function importFile() {
  var reader = new FileReader();
  reader.onload = function(){
    var obj = JSON.parse(event.target.result);
    reset();

    created_particles = obj[0]
    created_rules = obj[1]
    particles = []

    for (i = 0; i < created_particles.length; i++) {
      for (x = 0; x < created_particles[i].length; x++){
        particles.push(created_particles[i][x])
      }
    }
  };
  reader.readAsText(event.target.files[0]);
}
