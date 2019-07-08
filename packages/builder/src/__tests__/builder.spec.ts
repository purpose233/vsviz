import { validateDataInfo } from '../common/serialize';
import { DataInfoType } from '../common/types';

const headerInfo: DataInfoType = {
  id: 'test001',
  streamType: 'customed',
  dataType: 'json',
  size: 10,
  sequence: 0,
  timestamp: 1110
}

test('validate valid header', () => {
  expect(validateDataInfo(headerInfo)).toBe(true);
});
