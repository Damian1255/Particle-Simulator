canvas = document.getElementById('screen');
accordion = document.getElementsByClassName("accordion");
acc_container = document.getElementById("accd-container");

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
  velocity_display.innerHTML = "Particle Velocity = " + velocity;

  size_slider.value = size
  size_display.innerHTML = "Particle Size = " + size;

  if (paused) {
    state_button.value = "Play Simulation";
  } else {
    state_button.value = "Pause Simulation";
  }
  loadAccordion()
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

function loadAccordion() {
  acc_container.innerHTML = "";
  rules_display.innerHTML = "<h4>Defined rules: " + created_rules.length;

  var total = 0;
  for (let i of created_particles) {
    total += i.length;
  }
  particles_display.innerHTML = "<h4>Total Particles: " + total + "</h4>";

  for (let x = 0; x < created_particles.length; x++) {
    let color = created_particles[x][0].color;
    let amount = created_particles[x].length;

    var button = '<button class="accordion">'+ amount + ' ' + color.toUpperCase() + '</button>';
    var panel = "";

    for (let y = 0; y < created_rules.length; y++) {
      if (created_rules[y].particle1[0].color == color) {
        var delete_btn = " | <input type='button' class='rule-delete' data-index='" + i + "' onclick='deleteRule(this)' value='Delete Rule'>";
        var p1 = created_rules[y].particle1[0].color;
        var p2 = created_rules[y].particle2[0].color;
        var g = created_rules[y].g;
        panel += '<p>' + p1 + " and " + p2 + " | g = "+ g + delete_btn + '</p>';
      }
    }
    
    acc_container.innerHTML += button + '<div class="panel">' + panel + '</div>';
  }

  for (let i = 0; i < accordion.length; i++) {
    accordion[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var panel = this.nextElementSibling;
      if (!this.classList.contains("active")) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = "160px";
      }
    });
  }
}
