import ValidateString from './ValidateString';
import { expect } from 'chai';

describe('Testing game input string validation', () => {

  describe('Runing basic validations ', () => {
    it('It should instantiate the component ValidateString', () => {
      const validateString = new ValidateString( 'XXXX' );
      expect( validateString instanceof ValidateString ).to.equal( true );
    });

    it('should pass when the parameter passed is of type string', () => {
      const validateString = new ValidateString( 'XXXX' );
      expect( validateString.validateDataType() ).to.be.true;
    });

    it('should capitalize all letters in the string', () => {
      const passedString = 'xxxxx';
      const validateString = new ValidateString( passedString );
      expect( validateString.capitalizeString() ).to.equal( passedString.toUpperCase() );
    });

    it('should pass for any string containing valid characters [0-9],X,/,-,|', () => {
      const passedString = 'xxxxx';
      const validateString = new ValidateString( passedString );
      expect( validateString.validateAcceptableCharacters() ).to.be.true;
    });

    it('should pass the minimum length requirements', () => {
      const validateString = new ValidateString( 'X|X|X|X|X|X|X|X|X|X||XX' );
      expect(  validateString.validateMinLength() ).to.be.true;
    });
  });

  describe('Runing complex validations ', () => {
    it('should pass if no triple pipe ||| exists in the string', () => {
      const validateString = new ValidateString( 'X|X|X|X|X|X|X|X|X|X||XX' );
      expect( validateString.validateSingleDoublePipe() ).to.be.true;
    });

    it('should pass where 11 pipes exist in the string| ', () => {
      const validateString = new ValidateString( 'X|X|X|X|X|X|X|X|X|X||XX' );
      expect( validateString.validatePipesLength() ).to.be.true;
    });

    it('should pass the single double pipe || check', () => {
      const validateString = new ValidateString( 'X|X|X|X|X|X|X|X|X|X||XX' );
      expect( validateString.validateSingleDoublePipe() ).to.be.true;
    });

    it('should pass the minimum game length test', () => {
      const validateString = new ValidateString( 'X|X|X|X|X|X|X|X|X|X||XX' );
      expect( validateString.validateFrameLength() ).to.be.true;
    });

    it('should fail if a STRIKE is found as the second character in the frame', () => {
      const validateString = new ValidateString( 'X|X|X|X|X|X|X|X|X|X||XX' );
      expect( validateString.noStrikeExistsinTheSecondBall() ).to.be.true;
    });

    it('validate that if a frame has only one character then that character should be X', () => {
      const validateString = new ValidateString( 'X|X|X|X|X|X|X|X|X|X||XX' );
      expect( validateString.validateStrikes() ).to.be.true;
    });

    it('should fail if a SPARE is found as the first character in the frame', () => {
      const validateString = new ValidateString( 'X|X|X|X|X|X|X|X|X|X||XX' );
      expect( validateString.noSpareExistsinTheFirstBall() ).to.be.true;
    });

    it('should fail if a SPARE is found at the first BONUS ball', () => {
      const validateString = new ValidateString( 'X|X|X|X|X|X|X|X|X|X||' );
      expect( validateString.noSpareExistsinFirstBonusBall() ).to.be.true;
    });
  });

  describe('Testing Bonus stage', () => {

    it('should pass if Bonus Stage exists', () => {
      const validateString1 = new ValidateString( 'X|X|X|X|X|X|X|X|X|X||XX' );
      expect( validateString1.validateBonusStage() ).to.be.true;

      const validateString2 = new ValidateString( 'X|X|X|X|X|X|X|X|X|5/||X' );
      expect( validateString2.validateBonusStage() ).to.be.true;
    });

    it('should pass if the last ball of the last frame is SPARE and more than ONE ball exist in the bonus', () => {
      const validateString = new ValidateString( 'X|X|X|X|X|X|X|X|X|5/||X' );
      expect( validateString.validateBonusBallOnSpare() ).to.be.true;
    });

    it('should fail if the last ball is STRIKE and LESS than TWO ball exist in the bonus', () => {
      const validateString = new ValidateString( 'X|X|X|X|X|X|X|X|X|X||XX' );
      expect( validateString.validateBonusBallsOnStrike() ).to.be.true;
    });
  });

  describe('It should pass for valid strings', () => {
    it('should pass for string X|X|X|X|X|X|X|X|X|X||XX', () => {

      const validateString = new ValidateString( 'X|X|X|X|X|X|X|X|X|X||XX' );
      expect( validateString.validateString() ).to.be.true;
    });

    it('should pass for string 9-|9-|9-|9-|9-|9-|9-|9-|9-|9-||', () => {
      const validateString = new ValidateString( '9-|9-|9-|9-|9-|9-|9-|9-|9-|9-||' );
      expect( validateString.validateString() ).to.be.true;
    });

    it('should pass for string 5/|5/|5/|5/|5/|5/|5/|5/|5/|5/||5', () => {
      const validateString = new ValidateString( '5/|5/|5/|5/|5/|5/|5/|5/|5/|5/||5' );
      expect( validateString.validateString() ).to.be.true;
    });

    it('should pass for string X|7/|9-|X|-8|8/|-6|X|X|X||81', () => {
      const validateString = new ValidateString( 'X|7/|9-|X|-8|8/|-6|X|X|X||81' );
      expect( validateString.validateString() ).to.be.true;
    });
  });

  describe('It should fail for invalidvalid strings', () => {
    it('should fail for null string', () => {
      const validateString = new ValidateString( null );
      expect( validateString.validateString() ).to.not.be.true;
    });

    it('should fail for small length string', () => {
      const validateString = new ValidateString( 'X|X|X' );
      expect( validateString.validateString() ).to.not.be.true;
    });

    it('should fail for proper length invalid string A|7/|9-|X|-8|8/|-6|X|X|X||81', () => {
      const validateString = new ValidateString( 'A|7/|9-|X|-8|8/|-6|X|X|X||81' );
      expect( validateString.validateString() ).to.not.be.true;
    });
  });

});
