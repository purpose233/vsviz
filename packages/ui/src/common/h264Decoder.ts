import H264DecodeWorker from '../worker/h264decode.worker.js';
import { number } from 'prop-types';

const Decoder = (window as any).Decoder;
const isDecoderEnabled = !!Decoder;

export class H264Decoder {

  private useWorker: boolean;
  private worker: Worker = null;
  private decoder;

  constructor(drawFrame: Function, useWorker: boolean = true) {
    if (!isDecoderEnabled) { 
      // TODO: warning no decoder for h264 
      return null;
    }

    this.useWorker = useWorker;

    if (useWorker) {
      this.worker = new H264DecodeWorker();
      this.worker.onerror = (e): void => {
        console.log(e);
      };
      this.worker.onmessage = (e): void => {
        drawFrame(e.data);
      };
    } else {
      this.decoder = new Decoder({ rgb: true });
      this.decoder.onPictureDecoded = (data: Uint8Array, width: number, height: number) => {
        drawFrame(data);
      }
    }
  }

  public decode(data: Buffer): void {
    if (!isDecoderEnabled) { return; }
    
    if (this.useWorker) {
      this.worker.postMessage(data);
    } else {
      this.decoder.decode(data);
    }
  }
}

// export class H264Decoder {

//   private decoder = null;
//   private frameStack: Buffer[] = [];
//   private maxStackSize: number;
//   private maxWaitingTime: number;
//   private isDecoding: boolean = false;
//   private timeout: NodeJS.Timeout = null;

//   constructor(drawFrame: Function, 
//               maxStackSize: number = 10, 
//               maxWaitingTime: number = 50) {
//     if (!isDecoderEnabled) { 
//       // TODO: warning no decoder for h264 
//       return null;
//     }

//     this.maxStackSize = maxStackSize;
//     this.maxWaitingTime = maxWaitingTime;
//     this.decoder = new Decoder({ rgb: true });

//     this.decoder.onPictureDecoded = async (data: Uint8Array, width: number, height: number) => {
//       // console.log('show frame: ', new Date().getTime());
//       await drawFrame(data);
//       // this.isDecoding = false;
//       // if (this.timeout) { clearTimeout(this.timeout); }
//       // if (this.frameStack.length > 0) {
//       //   this.decode(this.frameStack.shift());
//       // }
//     }
//   }

//   public decode(data: Buffer): void {
//     if (!isDecoderEnabled) { return; }

//     // console.log(data);
//     // console.log(this.frameStack, this.isDecoding);
//     // if (this.frameStack.length === 0 && !this.isDecoding) {
//       this.decoder.decode(data);
//     //   this.isDecoding = true;
//     //   console.log('decode: ', new Date().getTime());
//     //   this.timeout = setTimeout(this.waitTimeout, this.maxWaitingTime);
//     // } else {
//     //   if (this.frameStack.length >= this.maxStackSize) {
//     //     this.frameStack.shift();
//     //   }
//     //   this.frameStack.push(data);
//     // }
//   }

//   private waitTimeout = () => {
//     this.isDecoding = false;
//     this.timeout = null;
//     if (this.frameStack.length > 0) {
//       this.decode(this.frameStack.shift());
//     }
//   }
// }
