// Required canvas exception: a static drawing, no interaction.
const canvas = document.getElementById("practice-canvas");
const context = canvas.getContext("2d");
if (context) {
  context.strokeRect(10, 20, 100, 60);
  context.strokeRect(170, 20, 100, 60);
  context.beginPath();
  context.moveTo(110, 50);
  context.lineTo(170, 50);
  context.stroke();
}
