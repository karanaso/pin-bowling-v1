import ValidateString from './Bundles/Helpers/ValidateString';
import ScoreCalculator from './Bundles/Helpers/ScoreCalculator';

const strings = [
  'X|X|X|X|X|X|X|X|X|X||XX',
  'X|7/|9-|X|-8|8/|-6|X|X|X||81',
  '9-|9-|9-|9-|9-|9-|9-|9-|9-|9-||',
  '5/|5/|5/|5/|5/|5/|5/|5/|5/|5/||5'
];

console.log('Available methods -------', process.env.NODE_ENV);
console.log( new ValidateString('asdfasdfasdf') );
console.log( new ScoreCalculator('asdfasdfasdf') );
console.log('','','');


strings.forEach( (string) => {
  let isValidated = new ValidateString( string ).validateString();
  if (isValidated) {
    console.log( `Your score for string ${string} is ${new ScoreCalculator(string).runCalculator()}`);
  }
});
