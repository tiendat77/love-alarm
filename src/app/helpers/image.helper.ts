/**
 * Source: https://github.com/MickL/ts-image-precessor
 */

interface Base64ImageData {
  width: number;
  height: number;
  imgElement: HTMLImageElement;
}

function base64ToImgElement(base64: string): Promise<Base64ImageData> {
  return new Promise<Base64ImageData>(resolve => {
    const img = document.createElement('img');

    img.onload = () => {
      resolve({
        height:     img.naturalHeight || img.height,
        imgElement: img,
        width:      img.naturalWidth || img.width,
      });
    };

    img.src = base64;
  });
}

function fileToBase64(file: File): Promise<string> {
  return new Promise<string>(resolve => {
    let reader: any = new FileReader();

    reader.addEventListener('load', () => {
      resolve(reader.result as string);
      reader = null;
    });

    reader.readAsDataURL(file);
  });
}

class HollyCanvas {
  readonly canvas          = document.createElement('canvas');
  readonly canvasCtx       = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  readonly helperCanvas    = document.createElement('canvas');
  readonly helperCanvasCtx = this.helperCanvas.getContext('2d') as CanvasRenderingContext2D;

  constructor() {}

  drawBase64(base64: string): Promise<void> {
    return new Promise<void>(resolve => {
      base64ToImgElement(base64).then(img => {
        this.canvas.width  = img.width;
        this.canvas.height = img.height;
        this.canvasCtx.drawImage(img.imgElement, 0, 0);
        resolve();
      });
    });
  }

  crop(width: number, height: number) {
    this.helperCanvas.width  = width;
    this.helperCanvas.height = height;
    this.helperCanvasCtx.drawImage(this.canvas, 0, 0, width, height, 0, 0, width, height);
    this.canvas.width  = width;
    this.canvas.height = height;
    this.canvasCtx.drawImage(this.helperCanvas, 0, 0);
  }

  resize(width: number, height: number) {
    this.helperCanvas.width  = width;
    this.helperCanvas.height = height;
    this.helperCanvasCtx.drawImage(this.canvas, 0, 0, width, height);
    this.canvas.width  = width;
    this.canvas.height = height;
    this.canvasCtx.drawImage(this.helperCanvas, 0, 0);
  }

  export() {
    return this.canvas.toDataURL('image/jpeg', 0.9);
  }
}

export class ImageProcess {

  private $canvas = new HollyCanvas();

  constructor(private base64: string) {}

  /**
   *
   * @param maxWidth in px
   * @param maxHeight in px
   * @returns base64 string
   */
  resize(maxWidth: number, maxHeight: number): Promise<string> {
    return new Promise(async (resolve) => {
      await this.$canvas.drawBase64(this.base64);

      const oldWidth  = this.$canvas.canvas.width;
      const oldHeight = this.$canvas.canvas.height;

      const resizeNeeded = oldWidth > maxWidth || oldHeight > maxHeight;

      if (!resizeNeeded) {
        resolve(this.$canvas.export());
      } else {
        let newWidth: number;
        let newHeight: number;
        let downscalingSteps: number;

        // TODO: Is this really working for all formats? What if maxWidth = 2000, maxHeight = 20 ?
        if (oldWidth > oldHeight) {
          newWidth         = maxWidth;
          newHeight        = Math.round(oldHeight * newWidth / oldWidth);
          downscalingSteps = Math.ceil(Math.log(oldWidth / newWidth) / Math.log(2));
        } else {
          newHeight        = maxHeight;
          newWidth         = Math.round(oldWidth * newHeight / oldHeight);
          downscalingSteps = Math.ceil(Math.log(oldHeight / newHeight) / Math.log(2));
        }

        if (downscalingSteps === 1) {
          // The image can directly be resized to the final dimensions
          this.$canvas.resize(newWidth, newHeight);
        } else {
          // To get the best result, we need to resize the image by 50% again and again until we reach the final dimensions
          // Step 1
          let oldScale         = 1;
          let currentStepScale = 1;

          // Step i
          for (let i = 1; i < downscalingSteps; i++) {
            oldScale         = currentStepScale;
            currentStepScale = currentStepScale * .5;
            this.$canvas.canvasCtx.drawImage(this.$canvas.canvas, 0, 0, oldWidth * oldScale, oldHeight * oldScale, 0, 0, oldWidth * currentStepScale, oldHeight * currentStepScale);
          }

          // Down-scaling step i+1 (draw final result)
          this.$canvas.canvasCtx.drawImage(this.$canvas.canvas, 0, 0, oldWidth * currentStepScale, oldHeight * currentStepScale, 0, 0, newWidth, newHeight);
          this.$canvas.crop(newWidth, newHeight);
        }
      }

      resolve(this.$canvas.export());
    });
  }
}