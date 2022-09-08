canvas = document.getElementById('screen');

size_slider = document.getElementById('size-slider');
size_display = document.getElementById('size-display');

velocity_slider = document.getElementById('velocity-slider');
velocity_display = document.getElementById('velocity-display');

fps_display = document.getElementById('fps-display');

rules_display = document.getElementById('rules-display');
create_rules_button = document.getElementById('rule-btn');

particles_display = document.getElementById('particles-display');
create_particles_button = document.getElementById('particles-btn');

state_button = document.getElementById('state-btn');


setInterval(function () {
  if (fps <= 10000) {
    fps_display.innerHTML = "FPS: " + fps;
  } else {
    fps_display.innerHTML = "FPS: >10000.0";
  }
  }, 1000);


function updateUI() {
  velocity_slider.value = velocity * 100;
  velocity_display.innerHTML = "Velocity = " + velocity;

  size_slider.value = size
  size_display.innerHTML = "Size = " + size;

  if (paused) {
    state_button.value = "Play Simulation";
  } else {
    state_button.value = "Pause Simulation";
  }
}

function displayRules() {
  var text = "";
  for (let i = 0; i < created_rules.length; i++) {
    var delete_btn = " | <input type='button' class='rule-delete' data-index='" + i + "' onclick='deleteRule(this)' value='Delete Rule'>";
    var p1 = created_rules[i].particle1[0].color;
    var p2 = created_rules[i].particle2[0].color;
    var g = created_rules[i].g;

    text += "<p>"+ p1 + " and " + p2 + " | g = "+ g + delete_btn + "</p>";
  }
  rules_display.innerHTML = "<h4>Defined rules: " + created_rules.length + "</h4><div>" + text + '</div>';
}

function displayParticles() {
  var total = 0;
  var text = "";
  for (let i of created_particles) {
    text += "<p>" + i.length + " " + i[0].color + " particles</p>";
    total += i.length;
  }
  particles_display.innerHTML = "<h4>Total Particles: " + total + "</h4><div>" + text + '</div>';
}

create_rules_button.onclick = function() {
  particle1 = document.getElementById("rule1-color").value;
  particle2 = document.getElementById("rule2-color").value;
  g = document.getElementById("rule-force").value;

  newRule(particle1, particle2, g);
}

create_particles_button.onclick = function() {
  amount = document.getElementById("create-amount").value;
  color = document.getElementById("create-color").value;
  created_particles.push(create(amount, color));
  console.log("Created " + amount + " " + color + " particles.");
  displayParticles();
}

velocity_slider.oninput = function() {
  velocity = this.value / 100;
  updateUI();
}

size_slider.oninput = function() {
  size = this.value;
  updateUI();
}

state_button.onclick = function() {
  if (paused) {
    paused = false;
  } else {
    paused = true;
  }
  updateUI();
}

var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (!this.classList.contains("active")) {
      panel.style.height = null;
    } else {
      panel.style.height = "150px";
    }
  });
}
