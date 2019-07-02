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
  BINARY: 'binary'
};

export const DataTypeName = Object.assign(SimpleDataTypeName, ImageTypeName);

export enum NumberTypeEnum {
  UINT8,
  UINT16,
  UINT32
};

export const HeaderSize: number = 36;

export const PackageInitCode: string = 'ADAM';
export const PackageInitCodeBuffer: Buffer = Buffer.from(PackageInitCode, 'utf-8');
