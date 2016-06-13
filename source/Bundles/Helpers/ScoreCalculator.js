export default class CalculateScore {
  /**
  * Constructor
  * @param {string} A VALID game string
  * @return {object} all available methods if in development or public API if in production
  */
  constructor( validString ) {
    this.validString = validString;

    // create an array out of the VALIDATED string
    this.stringArray = this.validString.split('|');

    // the number of frames in the game
    this.framesInGame = 10;

    // the index of the last frame starting counting from 0
    this.bonusFrame = 11;

    // the current Position
    this.currentFrame = 0;

    this.posInFrame = 0;

    // create closure by returning in the constructor only the methods needed
    if (process.env.NODE_ENV === 'production') {
      return {
        runCalculator : this.runCalculator
      };
    }

  }

  /**
  * gets the current frame
  * @param {number} the frameId
  * @return {array} the current frame
  */
  getFrame = (frameId) => {
    return this.stringArray[ frameId ];
  }

  /**
  * Gets the current position
  * @param none
  * @return {array} the array[ currentFrame, positionInFrame ]
  */
  getCurrentPos = () => [ this.currentFrame, this.posInFrame ];

  /**
  *  Get  the current symbol at frameId, posId
  * @param {Number} the frameId
  * @param {Number} the position in the frame
  * @return {string} single character [0..9] X - /
  */
  getSymbolAtPos = (frameId, posId) => this.stringArray[ frameId ][posId];

  /**
  * Returns true if the frameId has a spare
  * @param {number} the frameId
  * @return {bool} true if the frame has a spare, otherwise false
  */
  frameHasSpare = ( frameId ) => this.stringArray[ frameId ][1] === '/';

  /**
  * Is this a bonus frame ? Used in recursion to identify if the current frame is a bonus frame
  * @param {number} the frameId
  * @return {bool} true if we are in bonus, otherwise false
  */
  isBonusFrame = ( frameId ) => frameId === this.bonusFrame;

  /**
  * Get next available pos in the array
  * @param {number} the frameId
  * @param {number} the position in the frameId
  * @return {array} [nextFrame,nextPosId] the nextAvailable frame and the nextPosition
  */
  getNextPos = ( frameId, posId ) => {
    let nextFrame = frameId;
    let nextPosId = posId;

    if ( ( frameId === this.framesInGame-1 ) && ( posId+1 > this.getFrame( frameId ).length-1 ) ) {
      nextFrame = frameId;
      nextPosId = posId;
    } else if ( frameId <= this.framesInGame - 2  ) {
     // if you are not on the last fram
      // check if you can go to nextPos
      if ( posId + 1 === this.getFrame( frameId ).length ) {
        // If you are at the last pos, goto nextFram and reset the posId
        nextFrame++;
        nextPosId = 0;
      } else {
        // otherwise go to next pos
        nextPosId++;
      }
    }

    return [nextFrame, nextPosId];
  }

  /**
  * Get previous available pos in the game based on current position
  * @param {number} the current frameId
  * @param {number} the current position
  * @return {array} [prevFrame, prevPosId]
  */
  getPrevPos = (frameId, posId) => {
    let prevFrame = frameId;
    let prevPosId = posId;

    if ( ( frameId === 0) && (posId === 0) ) {
        prevFrame = frameId;
        prevPosId = posId;
    } else {
      if ( posId === 0) {
        prevFrame--;
        prevPosId = this.getFrame( prevFrame ).length - 1;
      } else {
        prevPosId--;
      }
    }
    return [prevFrame, prevPosId];
  }

  /**
  * Calculate the points, uses recursion if needed
  * @param {number} the frameId to calculate
  * @param {number} the positionId to calculate
  * @param {number} recursion automatically set if needed
  * @return {number} the calculated points based on the frameId, posId
  */
  calculatePoints = ( frameId, posId, recursion = 2 ) => {

    let result;
    let prevPoints;
    let nextPoints;
    let nextPoints1;
    let nextPoints2;
    const symbol = this.getSymbolAtPos(frameId, posId);

    switch (symbol) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        return parseInt(symbol);

      case '/':

        prevPoints = this.calculatePoints(
          this.getPrevPos( frameId, posId)[0],
          this.getPrevPos( frameId, posId)[1]
        );

        // if you are in the last
        if ( ( frameId === this.framesInGame-1 ) && ( posId === 1) ) {
          nextPoints = this.calculatePoints( this.bonusFrame , 0 );
        } else {
          nextPoints = this.calculatePoints(
            this.getNextPos( frameId, posId )[0],
            this.getNextPos( frameId, posId )[1]
          );
        }

        result = 10 - prevPoints + nextPoints;
        return result;

      case 'X' :
        // get next symbol
        let nextSymbol = this.getSymbolAtPos( this.getNextPos( frameId, posId )[0], this.getNextPos(frameId,posId)[1]);

        // if in the bonus frame return 10 for each X
        if (this.isBonusFrame( frameId ) === true) {
          return 10;
        } else if ( this.frameHasSpare( frameId + 1 ) === true ) {
          // else if there is a spare in the next frame return a simple 10 + 10
          return 20;
        } else if ( ( frameId === this.framesInGame -1 ) && ( recursion > 0 ) ) {
          // else if in the last frame of the game simply calculate the two bonus Values
          nextPoints1 = this.calculatePoints( 11, 0 );
          nextPoints2 = 0;

          // if in the last step of recursion do not get the next (4th point)
          // in case an X is found in the eight position
          if ( recursion > 1 ) {
            nextPoints2 = this.calculatePoints( 11, 1 );
          }

          return 10 + nextPoints1 + nextPoints2;

        } else if (nextSymbol !== 'X') {
          const nextPos1 = this.getNextPos( frameId, posId );
          nextPoints1 = this.calculatePoints( nextPos1[0], nextPos1[1]);

          const nextPos2 = this.getNextPos( nextPos1[0], nextPos1[1] );
          nextPoints2 = this.calculatePoints( nextPos2[0], nextPos2[1]);

          result = 10 + nextPoints1 + nextPoints2;
        } else if ( (nextSymbol === 'X') && (recursion > 0 ) ) {
          // recursion
          recursion--;
          let nextPos = this.getNextPos( frameId, posId );
          result = 10 + this.calculatePoints( nextPos[0], nextPos[1], recursion );
        } else {
          result = 10;
        }

        return result;

      case '-' :
        return 0;

      default :
        return 0;
    }
  }

  /**
  *  Run the calculator
  * @param {none}
  * @return {number} the total points of the game
  */
  runCalculator = () => {
    let score = 0;

    // for each frame in the game
    for ( let frameId = 0; frameId <= this.framesInGame-1; frameId++ ) {

      // get the number of throws that happened in the game
      const numOfThrows = this.getFrame( frameId ).length;

      //f or each throw
      for ( let posId = 0; posId < numOfThrows; posId++ ) {

        // calculate the score
        score += this.calculatePoints( frameId, posId );
      }
    }

    //console.log('the score is ', score);
    return score;
  }

}
