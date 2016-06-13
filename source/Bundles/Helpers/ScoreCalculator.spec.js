import ScoreCalculator from './ScoreCalculator';
import { expect } from 'chai';

describe('Testing CalculateScore spec', () => {

  describe('Instantiating the component', () => {
    it('should instantiate the component', () => {
      const scoreCalculator = new ScoreCalculator( 'XXXX' );
      expect( scoreCalculator instanceof ScoreCalculator ).to.equal( true );
    });

    it('should check that the currentPosition is set 0,0', () => {
      const scoreCalculator = new ScoreCalculator( 'X|7/|9-|X|-8|8/|-6|X|X|X||81' );
      expect( scoreCalculator.getCurrentPos()[0] ).to.equal( 0 );
      expect( scoreCalculator.getCurrentPos()[1] ).to.equal( 0 );
    });
  });

  describe('Testing Array Movement and manipulation', () => {
    it('should test getFrame', () => {
      const scoreCalculator = new ScoreCalculator( 'X|7/|9-|X|-8|8/|-6|X|X|X||81' );
      expect( scoreCalculator.getFrame(0) ).to.equal( 'X' );
      expect( scoreCalculator.getFrame(2) ).to.equal( '9-' );
    });


    it('should return a new position the getNextAvailPos', () => {
      const scoreCalculator = new ScoreCalculator( 'X|7/|9-|X|-8|8/|-6|X|X|X||81' );
      let result;
      result = scoreCalculator.getNextPos( 0, 0 );
      expect( result[0] ).to.equal(1);
      expect( result[1] ).to.equal(0);
      result = scoreCalculator.getNextPos( 1, 0);
      expect( result[0] ).to.equal(1);
      expect( result[1] ).to.equal(1);
      result = scoreCalculator.getNextPos( 1, 1);
      expect( result[0] ).to.equal(2);
      expect( result[1] ).to.equal(0);
    });

    it('should not return a new position when at the last position of the last frame', () => {
      let scoreCalculator;
      let result;

      scoreCalculator = new ScoreCalculator( 'X|7/|9-|X|-8|8/|-6|X|X|X||81' );
      result = scoreCalculator.getNextPos( 9, 0 );
      expect( result[0] ).to.equal(9);
      expect( result[1] ).to.equal(0);

      scoreCalculator = new ScoreCalculator( 'X|7/|9-|X|-8|8/|-6|X|X|5-||81' );
      result = scoreCalculator.getNextPos( 9, 1 );
      expect( result[0] ).to.equal(9);
      expect( result[1] ).to.equal(1);


      scoreCalculator = new ScoreCalculator( '5/|5/|5/|5/|5/|5/|5/|5/|5/|5/||5' );
      result = scoreCalculator.getNextPos( 9, 1 );
      expect( result[0] ).to.equal(9);
      expect( result[1] ).to.equal(1);
    });

    it('should not return a new position when in the first frame, first position ', () => {
      const scoreCalculator = new ScoreCalculator( 'X|7/|9-|X|-8|8/|-6|X|X|51||81' );
      const result = scoreCalculator.getPrevPos( 0, 0 );
      expect( result[0] ).to.equal(0);
      expect( result[1] ).to.equal(0);
    });

    it('should return new position when not in the first frame, first position ', () => {
      const scoreCalculator = new ScoreCalculator( 'X|7/|9-|X|-8|8/|-6|X|X|X||81' );
      let result;

      result = scoreCalculator.getPrevPos( 2, 0 );
      expect( result[0] ).to.equal(1);
      expect( result[1] ).to.equal(1);

      result = scoreCalculator.getPrevPos( 1, 1 );
      expect( result[0] ).to.equal(1);
      expect( result[1] ).to.equal(0);

      result = scoreCalculator.getPrevPos( 1, 0 );
      expect( result[0] ).to.equal(0);
      expect( result[1] ).to.equal(0);
    });

  });

  describe('Testing calculatePoints', () => {

    describe('Simple Calculations', () => {
      it('should return a valid result for a -', () => {
        const scoreCalculator = new ScoreCalculator( 'X|7/|9-|X|-8|8/|-6|X|X|X||81' );
        const frameId = 2;
        const posId = 1;
        const result = scoreCalculator.calculatePoints( frameId,posId );
        expect( result ).to.equal( 0 );
      });

      it('should return a valid result for any valid number [0..9]', () => {
        const scoreCalculator = new ScoreCalculator( 'X|7/|9-|X|-8|8/|-6|X|X|X||81' );
        const frameId = 1;
        const posId = 0;
        const result = scoreCalculator.calculatePoints( frameId, posId );
        expect( result ).to.equal( 7 );
      });
    });

    describe('Testing X', () => {
      it('should return 20 for an "X" at pos 0,0', () => {
        let frameId;
        let posId;
        let result
        const scoreCalculator = new ScoreCalculator( 'X|7/|9-|X|-8|8/|-6|X|X|X||81' );

        frameId = 0;
        posId = 0;
        result = scoreCalculator.calculatePoints( frameId, posId );
        expect( result ).to.equal( 20 );
      });

      it('should return 18 for an "X" at pos 3,0', () => {
        let frameId;
        let posId;
        let result
        const scoreCalculator = new ScoreCalculator( 'X|7/|9-|X|-8|8/|-6|X|X|X||81' );

        frameId = 3;
        posId = 0;
        result = scoreCalculator.calculatePoints( frameId, posId );
        expect( result ).to.equal( 18 );
      });

      it('should return 30 for an "X" at pos 7,0', () => {
        let frameId;
        let posId;
        let result
        const scoreCalculator = new ScoreCalculator( 'X|7/|9-|X|-8|8/|-6|X|X|X||81' );

        frameId = 7;
        posId = 0;
        result = scoreCalculator.calculatePoints( frameId, posId );
        expect( result ).to.equal( 30 );
      });

      it('should return 28 for an "X" at pos 8,0', () => {
        let frameId;
        let posId;
        let result
        const scoreCalculator = new ScoreCalculator( 'X|7/|9-|X|-8|8/|-6|X|X|X||81' );

        frameId = 8;
        posId = 0;
        result = scoreCalculator.calculatePoints( frameId, posId );
        expect( result ).to.equal( 28 );
      });

      it('should return 19 for an "X" at pos 9,0', () => {
        let frameId;
        let posId;
        let result
        const scoreCalculator = new ScoreCalculator( 'X|7/|9-|X|-8|8/|-6|X|X|X||81' );

        frameId = 9;
        posId = 0;
        result = scoreCalculator.calculatePoints( frameId, posId );
        expect( result ).to.equal( 19 );
      });
    });

    describe('Testing SPARE', () => {
      // the calculator will loop throu all values, so if a SPARE is found and SINCE its previous
      // value will already have been addeed to our sum, we will only calculate the diff of the spare and the
      // next ball

      it('should return diff 2 for an "X" at pos 1,1', () => {
        const scoreCalculator = new ScoreCalculator( 'X|7/|9-|X|-8|8/|-6|X|X|X||81' );
        const frameId = 1;
        const posId = 1;
        const result = scoreCalculator.calculatePoints( frameId, posId );
        expect( result ).to.equal( 12 );
      });

      it('should return diff 2 for an "X" at pos 5,1', () => {
        const scoreCalculator = new ScoreCalculator( 'X|7/|9-|X|-8|8/|-6|X|X|X||81' );
        const frameId = 5;
        const posId = 1;
        const result = scoreCalculator.calculatePoints( frameId, posId );
        expect( result ).to.equal( 2 );
      });


      it('should return diff 2 for an "X" at pos 5,1', () => {
        const scoreCalculator = new ScoreCalculator( 'X|7/|9-|X|-8|8/|-6|X|X|X||81' );
        const frameId = 5;
        const posId = 1;
        const result = scoreCalculator.calculatePoints( frameId, posId );
        expect( result ).to.equal( 2 );
      });

      it('should run return diff 10 from string "5/|5/|5/|5/|5/|5/|5/|5/|5/|5/||5" at pos 0,1', () => {
        const scoreCalculator = new ScoreCalculator( '5/|5/|5/|5/|5/|5/|5/|5/|5/|5/||5' );
        const frameId = 0;
        const posId = 1;
        const result = scoreCalculator.calculatePoints( frameId, posId );
        expect( result ).to.equal( 10 );
      });

      it('should run return diff 5 from string "5/|5/|5/|5/|5/|5/|5/|5/|5/|3/||5" at pos 8,1', () => {
        const scoreCalculator = new ScoreCalculator( '5/|5/|5/|5/|5/|5/|5/|5/|5/|3/||5' );
        const frameId = 8;
        const posId = 1;
        const result = scoreCalculator.calculatePoints( frameId, posId );
        expect( result ).to.equal( 8 );
      });
    });
  });


  describe('Testing Calculator', () => {

    it('should run return score 300 from string "X|X|X|X|X|X|X|X|X|X||XX"', () => {
      const scoreCalculator = new ScoreCalculator( 'X|X|X|X|X|X|X|X|X|X||XX' );
      let score = scoreCalculator.runCalculator();
      expect( score ).to.equal( 300 );
    });

    it('should run return score 167 from string "X|7/|9-|X|-8|8/|-6|X|X|X||81"', () => {
      const scoreCalculator = new ScoreCalculator( 'X|7/|9-|X|-8|8/|-6|X|X|X||81' );
      let score = scoreCalculator.runCalculator();
      expect( score ).to.equal( 167 );
    });

    it('should run return score 90 from string "9-|9-|9-|9-|9-|9-|9-|9-|9-|9-||"', () => {
      const scoreCalculator = new ScoreCalculator( '9-|9-|9-|9-|9-|9-|9-|9-|9-|9-||' );
      let score = scoreCalculator.runCalculator();
      expect( score ).to.equal( 90 );
    });

    it('should run return score 150 from string "5/|5/|5/|5/|5/|5/|5/|5/|5/|5/||5"', () => {
      const scoreCalculator = new ScoreCalculator( '5/|5/|5/|5/|5/|5/|5/|5/|5/|5/||5' );
      let score = scoreCalculator.runCalculator();
      expect( score ).to.equal( 150 );
    });

  });
});
