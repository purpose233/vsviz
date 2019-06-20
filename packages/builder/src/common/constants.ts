export const StreamTypeName = {
  VIDEO: 'video',
  CUSTOMED: 'customed',
  META: 'meta'
};

export const ImageTypeName = {
  JPG: 'jpg',
  PNG: 'png',
  RGB: 'rgb',
  RGBA: 'rgba'
};

const SimpleDataTypeName = {
  JSON: 'json',
  STRING: 'string',
  METADATA: 'metadata'
};

export const DataTypeName = Object.assign(SimpleDataTypeName, ImageTypeName);

export enum NumberTypeEnum {
  UINT8,
  UINT16,
  UINT32
};

export const HeaderSize: number = 32;
