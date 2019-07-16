import { validateStreamInfo, serializeStreamBuilder, deserializeStreamMsg, 
  serializeStreamMsgWithInitCode, deserializeStreamMsgWithInitCode, serializeStreamMsg } from '../common/serialize';
import { StreamInfoType, StreamMessageType } from '../common/types';
import { Builder } from '../builder/builder';
import { StreamParser, concatBuffer } from '../parser/parser';

const headerInfo: StreamInfoType = {
  id: 'test001',
  streamType: 'customed',
  dataType: 'string',
  size: 8,
  sequence: 0,
  timestamp: 1110
}

const bodyData: string = 'testdata';

const streamMsg: StreamMessageType = { info: headerInfo, data: bodyData };

const binaryPackage: Buffer = Buffer.from(
  new Uint8Array([
    0x41,0x44,0x41,0x4d,0x74,0x65,0x73,0x74,
    0x30,0x30,0x31,0x00,0x63,0x75,0x73,0x74,
    0x6f,0x6d,0x65,0x64,0x73,0x74,0x72,0x69,
    0x6e,0x67,0x00,0x00,0x00,0x00,0x00,0x08,
    0x00,0x00,0x00,0x00,0x00,0x00,0x04,0x56,
    0x74,0x65,0x73,0x74,0x64,0x61,0x74,0x61
  ]));

describe('serialize', () => {
  test('validate valid header', () => {
    expect(validateStreamInfo(headerInfo)).toBe(true);
  });

  test('serialize & deserialize', () => {
    expect(deserializeStreamMsg(serializeStreamMsg(headerInfo, bodyData)).info)
      .toStrictEqual(headerInfo);
  });

  test('serialize & deserialize with init code', () => {
    expect(deserializeStreamMsgWithInitCode(serializeStreamMsgWithInitCode(headerInfo, bodyData)).info)
      .toStrictEqual(headerInfo);
    const streamMsg = deserializeStreamMsgWithInitCode(binaryPackage);
    expect(streamMsg.info).toStrictEqual(headerInfo);
    expect(streamMsg.data).toBe(bodyData);
  });
});

describe('builder', () => {
  const builder = new Builder();
  
  test('empty dirty builder', () => {
    expect(builder.getAllDirtyBuilders().length).toBe(0);
  });

  test('empty frame data', () => {
    expect(builder.getFrameData().length).toBe(0);
  });


  test('dirty builder', () => {
    builder.handleData(streamMsg);
    const streamBuilder = builder.getAllDirtyBuilders()[0];
    expect(streamBuilder).not.toBe(null);
    expect(streamBuilder.getId()).toBe(headerInfo.id);
    expect(streamBuilder.getHeader()).toStrictEqual(headerInfo);
    expect(streamBuilder.getBody()).toBe(bodyData);
    expect(builder.getFrameData().length).toBe(1);
    // TODO: check for frame data
    builder.clearAllDirtyBuilders();
    expect(builder.getAllDirtyBuilders().length).toBe(0);
  });
});

describe('parse', () => {

  const parser = new StreamParser();

  const bodyData2 = {test: 'aaa'};
  const headerInfo2: StreamInfoType = {
    id: 'test002',
    streamType: 'customed',
    dataType: 'json',
    size: JSON.stringify(bodyData2).length,
    sequence: 1,
    timestamp: 1120
  };
  const binaryPackage2 = serializeStreamMsgWithInitCode(headerInfo2, bodyData2);

  test('single package', () => {
    const parsedResult = parser.parse(binaryPackage);
    expect(parsedResult.length).toBe(1);
    expect(parsedResult[0].info).toStrictEqual(headerInfo);
    expect(parsedResult[0].data).toBe(bodyData);
  })

  test('sticky package', () => {
    const parsedResult = parser.parse(concatBuffer([binaryPackage, binaryPackage2]));
    expect(parsedResult.length).toBe(2);
    expect(parsedResult[1].info).toStrictEqual(headerInfo2);
  });

  test('splited package', () => {
    const fragment0 = binaryPackage.slice(0, 44);
    const fragment1 = binaryPackage.slice(44);
    expect(parser.parse(fragment0).length).toBe(0);
    const parsedResult = parser.parse(fragment1);
    expect(parsedResult.length).toBe(1);
    expect(parsedResult[0].info).toStrictEqual(headerInfo);
    expect(parsedResult[0].data).toBe(bodyData);
  });

  test('splited & sticky package', () => {
    const fragment0 = binaryPackage.slice(0, 44);
    const fragment1 = concatBuffer([binaryPackage.slice(44), binaryPackage2]);
    expect(parser.parse(fragment0).length).toBe(0);
    const parsedResult = parser.parse(fragment1);
    expect(parsedResult.length).toBe(2);
    expect(parsedResult[0].info).toStrictEqual(headerInfo);
    expect(parsedResult[0].data).toBe(bodyData);
    expect(parsedResult[1].info).toStrictEqual(headerInfo2);
    expect(parsedResult[1].data).toStrictEqual(bodyData2);
  });

  test('invalid package', () => {
    const fragment = binaryPackage.slice(20);
    expect(parser.parse(fragment).length).toBe(0);

    const parsedResult = parser.parse(binaryPackage);
    expect(parsedResult.length).toBe(1);
    expect(parsedResult[0].info).toStrictEqual(headerInfo);
    expect(parsedResult[0].data).toBe(bodyData);
  });
});

// describe('utils', () => {

// });
