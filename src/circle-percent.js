var circle = function renderPercent(obj) {
  //x, y, color, percent, title
  var canvas = document.getElementById("circle"),
    ctx = canvas.getContext("2d"),
    PI = Math.PI;
  canvas.width = canvas.offsetHeight;
  canvas.height = canvas.offsetHeight;
  ctx.clearRect(0, 0, canvas.offsetHeight, canvas.offsetHeight);
  var r = canvas.offsetHeight / 2 - 8;
  ctx.save();
  ctx.translate(canvas.offsetHeight / 2, canvas.offsetHeight / 2);
  ctx.lineWidth = 8;
  ctx.setLineDash([1, 2]);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "18px arial";
  // circle1
  ctx.save();
  ctx.strokeStyle = "#7366BB";
  ctx.rotate(-PI / 2);
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, PI * 2, false);
  ctx.stroke();
  ctx.restore();
  // circle2
  ctx.save();
  ctx.strokeStyle = obj.color;
  ctx.rotate(-PI / 2);
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, (PI * obj.percent) / 50, false);
  ctx.stroke();
  ctx.restore();
  ctx.restore();
}
export default circle;