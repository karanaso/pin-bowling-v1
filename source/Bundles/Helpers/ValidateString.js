export default class ValidateString {
  /**
  * Constructor
  * @param {string} A VALID game string
  * @return {object} all available methods if in development or public API if in production
  */
  constructor(string) {
    this.string = string;

    // the number of frames in the game
    this.framesPerGame = 10;

    // the index of the last frame starting counting from 0
    this.idxLastFrame = 9;

    // the index in the array that contains the bonus balls
    this.idxBonusBalls = 11;

    // the number of pipes that should exist in a game in order to make a quick validation
    this.numberOfAllowedPipes = 11;

    // the minimum length of a valid string is 23
    this.minimumLengthOfCharsPerGame = 23;
    this.numberOfAllowedPipes = 11;

    // if its a string immediatelly capitalize it
    if (this.validateDataType() === true) {
      this.capitalizeString();
    }

    // Due to performance optimization,
    // this.splitArray = this.string.split('|');
    // has been removed from methods
    //  validateSDPCorrectPosition: [Function],
    //  validateFrameLength: [Function],
    //  noStrikeExistsinTheSecondBall: [Function],
    //  validateStrikes: [Function],
    //  noSpareExistsinTheFirstBall: [Function],
    //  noSpareExistsinFirstBonusBall: [Function],
    //  validateBonusStage: [Function],
    //  validateBonusBallOnSpare: [Function],
    //  validateBonusBallsOnStrike: [Function],

    // if the test below pass immediatelly split the array
    if (
          (this.validateDataType() === true) &&
          (this.validateMinLength() === true) &&
          (this.validateAcceptableCharacters() === true) &&
          (this.validatePipesLength() === true) &&
          (this.validateSingleDoublePipe() === true)
        )
    {
      this.splitArray = this.string.split('|');
    }

    // create closure by returning in the constructor only the methods needed
    if (process.env.NODE_ENV === 'production') {
      return {
        validateString : this.validateString
      };
    }
  }

  /**
  * Capitalizes the string
  * @param {string} the string to capitalizeString
  * @return {string} capitalized string
  */
  capitalizeString = () => {
    this.string = this.string.toUpperCase();
    return this.string;
  }

  /**
  * Validation step 1
  * Validate the datatype of the passed parameter
  * @param {none}
  * @return {bool} true if its a string, otherwise false
  */
  validateDataType = () => typeof this.string === 'string';

  /**
  * Validation step 2
  * The minimum length game should consist of 23 characters for the game 'X|X|X|X|X|X|X|X|X|X||XX'
  * if less characters are found in the string then its not a valid game
  * @param {none}
  * @return {bool} true if the string length meets the minimum requirements
  */
  validateMinLength = () => this.string.length >= this.minimumLengthOfCharsPerGame;

  /**
  * Validation step 3
  * Validate that only allowed characters are present in the string
  * @param {none}
  * @return {bool} true if all characters are valid in the string
  */
  validateAcceptableCharacters = () => /^[X1-9\|\/-]+$/.test( this.string );

  /**
  * Validation step 4
  * Validate that there are at least 11 pipes || in the string
  * @param {none}
  * @return {bool} true if validates the minimum number of pipes, otherwise false
  */
  validatePipesLength = () => (this.string.match(/\|/g).length === this.numberOfAllowedPipes);

  /**
  * Validation step 5
  * match that only a singe double pipe exists || and it is in the right position
  * @param {none}
  * @return {bool} true if only only a singe double pipe exists || and it is in the right position
  */
  validateSingleDoublePipe = () => ( (this.string.match(/\|\|/g).length === 1) && (this.string.match(/\|\|\|/g) === null) );

  /**
  * Validation step 6
  * to validate the correct position of the double quote
  * we split the array and validate that the 10th element is empty
  * @param {none}
  * @return {bool}
  */
  validateSDPCorrectPosition = () => {
    // const splitArray = this.string.split('|');
    return this.splitArray[ this.idxBonusBalls -1 ] === '';
  }

  /**
  * Validation step 7
  * split the array, and count all elements that have length of >=1 and <=2
  * there are 10 frames plus the maximum 2 bonus pins.
  * After splitting the array using | you should have at least 10 items containing >=1 and <=2 stirkes
  * @param {none}
  * @return {bool}
  */
  validateFrameLength = () => {
    // const splitArray = this.string.split('|');
    const numberOfValidFrames = this.splitArray.filter( (item) => ( (item.length >=1) && (item.length <=2) ) ).length;
    return numberOfValidFrames >= this.framesPerGame;
  }

  /**
  * Validation step 8
  * split the array and check all 10 frames that the second character (if exist) is not an X/Strike
  * @param {none}
  * @return {bool} false if second char of each frame contains an X, otherwise true
  */
  noStrikeExistsinTheSecondBall = () => {
    // const splitArray = this.string.split('|');
    return this.splitArray.every( (item, idx) => {
        // the tenth element comes from double PIPE and is ALWAYS EMPTY in a VALID string
        // the eleventh item could contain double XX so we return true
        if (idx >= this.framesPerGame) {
          return true;
        } else {
          return ( (item.length === 1) || (item.length === 2) && (item[1] !== 'X') );
        }
    });
  }

  /**
  * Validation step 9
  * validate that if a frame has only one character then that character should be X
  * @param {none}
  * @return {bool} true if all X are single characters in the frame, otherwise false
  */
  validateStrikes = () => {
    // const splitArray = this.string.split('|');
    return this.splitArray.every( (item, idx) => {
        // the tenth element comes from double PIPE and is ALWAYS EMPTY in a VALID string
        // the eleventh item could contain double XX so we return true
        if (idx >= this.framesPerGame) {
          return true;
        } else if (item[0] === 'X') {
          return item.length === 1;
        } else {
          return true;
        }
    });
  }

  /**
  * Validation step 10
  * split the array and check all 10 frames that the first character  is not a SPARE
  * @param {none}
  * @return {bool} false if a PARSE character is found at the first character of the frameId
  */
  noSpareExistsinTheFirstBall = () => {
    // const splitArray = this.string.split('|');
    return this.splitArray.every( (item, idx) => {
        // the tenth element comes from double PIPE and is ALWAYS EMPTY in a VALID string
        // the eleventh item could contain double XX so we return true
        if (idx >= this.framesPerGame) {
          return true;
        } else {
          return  (item[0] !== '/');
        }
    });
  }

  /**
  * Validation step 11
  * the 11th element of the array is the bonus balls
  * @param {none}
  * @return {bool} no spare exists as the first character in the set
  */
  noSpareExistsinFirstBonusBall = () => {
    const splitArray = this.string.split('|');
    return ( splitArray[ this.idxBonusBalls ][0] !== '/')
  }

  /**
  * Validation step 12
  * Validate Bonus Stage
  * @param {none}
  * @return {bool}
  */
  validateBonusStage = () => {
    //const this.splitArray = this.string.split('|');
    const lastBallIsSpare = ( (this.splitArray[ this.idxLastFrame ].length === 2) && (this.splitArray[ this.idxLastFrame ][1] === '/') );
    const firstBallIsStrike = ( (this.splitArray[ this.idxLastFrame ].length === 1) && (this.splitArray[ this.idxLastFrame ][0] === 'X') );

    return lastBallIsSpare || firstBallIsStrike;
  }

  /**
  * Validation step 13
  * If the last frame has two balls, and the second one is SPARE, then a bonus stage should exist with one ball
  * @param {none}
  * @return {bool}
  */
  validateBonusBallOnSpare = () => {
    // const splitArray = this.string.split('|');
    // If the last frame has two balls, and the second one is SPARE
    const lastBallIsSpare = ( ( this.splitArray[ this.idxLastFrame ].length === 2) && ( this.splitArray[ this.idxLastFrame ][1] === '/') );
    // the length of the extraBalls should be 1
    const extraBallsAreValid = this.splitArray[ this.idxBonusBalls ].length === 1;
    return (lastBallIsSpare && extraBallsAreValid);
  }

  /**
  * Validation step 14
  * If the last frame has a STRIKE X,  then a bonus stage should exist with two balls
  * @param {none}
  * @return {bool}
  */
  validateBonusBallsOnStrike = () => {
    // const splitArray = this.string.split('|');
    const fistBallIsStrike = ( ( this.splitArray[ this.idxLastFrame ].length === 1) && ( this.splitArray[ this.idxLastFrame ][0] === 'X') );
    // the length of the extraBalls should be 2
    const extraBallsAreValid = this.splitArray[ this.idxBonusBalls ].length === 2;
    return (fistBallIsStrike && extraBallsAreValid);
  }

  /**
  * Validation runner
  * Will run all validations
  * @param {none}
  * @return {bool} true uppon success, otherwise fail
  */
  validateString = () => {
    const validationWithoutBonus = this.validateDataType() &&
      this.validateMinLength() &&
      this.validateAcceptableCharacters() &&
      this.validatePipesLength() &&
      this.validateSingleDoublePipe() &&
      this.validateSDPCorrectPosition() &&
      this.validateFrameLength() &&
      this.validateStrikes() &&
      this.noStrikeExistsinTheSecondBall() &&
      this.noSpareExistsinTheFirstBall() &&
      this.noSpareExistsinFirstBonusBall();

      if (validationWithoutBonus === true) {
        // if Bonus State exists apply more validation rules, otherwise simply return true;
        if (this.validateBonusStage() === true)  {
          return validationWithoutBonus && ( this.validateBonusBallOnSpare() || this.validateBonusBallsOnStrike() );
        } else {
          return validationWithoutBonus;
        }
      } else {
        return false;
      }

  }
}
