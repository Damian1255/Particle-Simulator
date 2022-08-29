canvas = document.getElementById('life');
speed_slider = document.getElementById('speed-slider');
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
    return{'x': x, 'y': y, 'vx': 0, 'vy': 0, 'color': c}
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
        a.vx = (a.vx + fx) * speed
        a.vy = (a.vy + fy) * speed
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

yellow = create(200, "yellow")
red = create(200, "red")
green = create(200, "green")

update = () => {
  speed = speed_slider.value / 100;
  const t0 = performance.now();

  rule(green, green, 0.32)
  rule(green, red, -0.17)
  rule(green, yellow, 0.34)
  rule(red, red, -0.10)
  rule(red, green, 0.34)
  rule(yellow, yellow, 0.15)
  rule(yellow, green, -0.20)

  m.clearRect(0, 0, width, height)
  draw(0, 0, "black", width, height)
  for (i = 0; i < particles.length; i++){
      draw(particles[i].x, particles[i].y, particles[i].color, 5)
  }
  requestAnimationFrame(update)

  const t1 = performance.now();
  fps_display.innerHTML = (1 / ((t1 - t0)/1000)).toFixed(1);
}

update();
