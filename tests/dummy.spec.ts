
import { expect } from 'chai';

function mythical (message: string): string {
  return `=== ${message} ===`;
}

describe('xeno; no implementation to test', () => {
  context('What is the difference between a carrot and a unicorn', () => {
    it('The first is a bunny feast, the other is a funny beast', () => {
      const result = mythical('magical');
      expect(result).to.equal('=== magical ===');
    });
  });
});
