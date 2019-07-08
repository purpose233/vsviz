import H264DecodeWorker from '../worker/h264decode.worker.js';
import { number } from 'prop-types';

export class H264Decoder {

  private worker: Worker = null;

  constructor(drawFrame: Function) {
    this.worker = new H264DecodeWorker();
    this.worker.onerror = (e): void => {
      console.log(e);
    };
    this.worker.onmessage = (e): void => {
      drawFrame(e.data);
    };
  }

  public decode(data: Buffer): void {
    this.worker.postMessage(data);
  }
}

// const Decoder = (window as any).Decoder;
// const isDecoderEnabled = !!Decoder;

// export class H264Decoder {

//   private useWorker: boolean;
//   private worker: Worker = null;
//   private decoder;

//   constructor(drawFrame: Function, useWorker: boolean = true) {
//     if (!isDecoderEnabled) { 
//       // TODO: warning no decoder for h264 
//       return null;
//     }

//     this.useWorker = useWorker;

//     if (useWorker) {
//       this.worker = new H264DecodeWorker();
//       this.worker.onerror = (e): void => {
//         console.log(e);
//       };
//       this.worker.onmessage = (e): void => {
//         drawFrame(e.data);
//       };
//     } else {
//       this.decoder = new Decoder({ rgb: true });
//       this.decoder.onPictureDecoded = (data: Uint8Array, width: number, height: number) => {
//         drawFrame(data);
//       }
//     }
//   }

//   public decode(data: Buffer): void {
//     if (!isDecoderEnabled) { return; }
    
//     if (this.useWorker) {
//       this.worker.postMessage(data);
//     } else {
//       this.decoder.decode(data);
//     }
//   }
// }
