import { validateDataInfo } from '../common/serialize';

test("Judge data info", () => {
  expect(validateDataInfo(null)).toBe(false);
});
