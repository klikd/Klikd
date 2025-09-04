// Simple test to verify Jest is working without React Native imports
describe('App', () => {
  it('should pass basic test', () => {
    expect(true).toBeTruthy();
  });

  it('should handle basic math', () => {
    expect(2 + 2).toBe(4);
  });

  it('should handle string operations', () => {
    expect('hello'.toUpperCase()).toBe('HELLO');
  });
});
