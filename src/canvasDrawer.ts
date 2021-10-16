export default class CanvasDrawer {
  constructor(public ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = false;
  }

  rect(x: number, y: number, width: number, height: number) {
    this.ctx.fillRect(x, y, width, height);
  }

  strokeRect(x: number, y: number, width: number, height: number) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, width, height);
    this.ctx.stroke();
  }

  image(
    imageToRender: CanvasImageSource,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    width = width || (imageToRender.width as number);
    height = height || (imageToRender.height as number);
    this.ctx.drawImage(imageToRender, x, y, width, height);
  }

  clippedImage(
    imageToRender: CanvasImageSource,
    sx: number,
    sy: number,
    swidth: number,
    sheight: number,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    width = width || (imageToRender.width as number);
    height = height || (imageToRender.height as number);
    this.ctx.drawImage(
      imageToRender,
      sx,
      sy,
      swidth,
      sheight,
      x,
      y,
      width,
      height
    );
  }

  background(color: string) {
    this.ctx.clearRect(
      0,
      0,
      this.ctx.canvas.offsetWidth,
      this.ctx.canvas.offsetHeight
    );
    const oldStyle = this.ctx.fillStyle;
    this.ctx.fillStyle = color;
    this.rect(0, 0, this.ctx.canvas.offsetWidth, this.ctx.canvas.offsetHeight);
    this.ctx.fillStyle = oldStyle;
  }

  fill(color: string) {
    this.ctx.fillStyle = color;
  }

  push() {
    this.ctx.save();
  }
  pop() {
    this.ctx.restore();
  }
  stroke(color: string) {
    this.ctx.strokeStyle = color;
  }
  textSize(size: number) {
    this.ctx.font = this.ctx.font.replace(/\d+/, size.toString());
  }
  text(text: any, x: number, y: number) {
    this.ctx.fillText(text, x, y);
  }
  translate(x: number, y: number) {
    this.ctx.translate(x, y);
  }
}
