// Stream message
export const StreamTypeName = {
  VIDEO: 'video',
  CUSTOMED: 'customed',
  META: 'meta'
};

export const ImageTypeName = {
  JPG: 'jpg',
  PNG: 'png',
  RGB: 'rgb',
  BGR: 'bgr',
  RGBA: 'rgba'
};

const SimpleDataTypeName = {
  JSON: 'json',
  STRING: 'string',
  BINARY: 'binary',
  H264: 'h264'
};

export const StreamDataTypeName = Object.assign(SimpleDataTypeName, ImageTypeName);

// Client message
export const ClientTypeName = {
  COMMAND: 'command',
  CUSTOMED: 'customed'
};

export const ClientDataTypeName = {
  JSON: 'json',
  STRING: 'string',
  BINARY: 'binary'
};

export enum NumberTypeEnum {
  UINT8,
  UINT16,
  UINT32
};

export const HeaderSize: number = 36;

export const PackageInitCode: string = 'ADAM';
export const PackageInitCodeBuffer: Buffer = Buffer.from(PackageInitCode, 'utf-8');
