var m = canvas.getContext('2d');
var fps = 0;
var velocity = 0.5;
var height = 700;
var width = 700;
var size = 4;
var paused = true;

var created_particles = [];
var created_rules = [];

canvas.height = height;
canvas.width = width;

draw = (x, y, c, s) => {
    m.fillStyle = c;
    m.fillRect(x, y, s, s);
}

particle = (x, y, c) => {
    return {'x': x, 'y': y, 'vx': 0, 'vy': 0, 'color': c}
}

random = () => {
    return Math.random() * (width - 100) + 50;
}

create = (number, color) => {
    var group = [];
    for (let i=0; i < number; i++) {
        group.push(particle(random(), random(), color));
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
            var F = g * 1/d
            fx += (F * dx)
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

frame = () => {
  const t0 = performance.now();
  if (!paused) {
    for (x = 0; x < created_rules.length; x++) {
      rule(created_rules[x].particle1, created_rules[x].particle2, created_rules[x].g);
    }
  }
  m.clearRect(0, 0, width, height)
  draw(0, 0, "black", width, height)
  for (i = 0; i < created_particles.length; i++) {
    for (j = 0; j < created_particles[i].length; j++) {
      draw(created_particles[i][j].x, created_particles[i][j].y, created_particles[i][j].color, size);
    }
  }
  requestAnimationFrame(frame);
  const t1 = performance.now();
  fps = (1 / ((t1 - t0)/1000)).toFixed(1);
}

frame();
displayRules();
displayParticles();
updateUI();

function reset() {
  created_particles = [];
  created_rules = [];
  displayRules();
  displayParticles();
  console.log("Reset");
}

function newRule(particle1, particle2, g) {
  r = {};
  for (i = 0; i < created_particles.length; i++) {
    if (created_particles[i][0].color == particle1) {
      r['particle1'] = created_particles[i];
    }
    if (created_particles[i][0].color == particle2) {
      r['particle2'] = created_particles[i];
    }
  }
  r['g'] = parseFloat(g);
  created_rules.push(r);
  displayRules();
  console.log("Created rule between " + particle1 + " and " + particle2 +
              " with " + g + " of force.");
}

function exportFile() {
  c_rules = [];
  for (var i of created_rules){
    c_rules.push([i.particle1[0].color, i.particle2[0].color, i.g]);
  }

  const data = [created_particles, c_rules, velocity, size];
  const filename = 'new.json';
  const jsonStr = JSON.stringify(data);

  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);
}

function importFile(e) {
  if (e.value.split(".").at(-1).toLowerCase() == "json") {
    var reader = new FileReader();
    reader.onload = function() {
      try {
        var obj = JSON.parse(event.target.result);
        reset();

        created_particles = obj[0];
        for (i of obj[1]) {
          newRule(i[0], i[1], i[2]);
        }
        velocity = obj[2];
        size = obj[3];

        updateUI();
        displayParticles();
      } catch (e) {
        alert("Invalid file content.")
        return
      }
    };
    reader.readAsText(event.target.files[0]);
  } else {
    alert("Invalid file type.");
  }
  e.value = null;
}

function deleteRule(e) {
  index = e.dataset.index;
  if (index > -1) {
    created_rules.splice(index, 1);
  }
  displayRules();
}
