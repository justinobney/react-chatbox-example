const alpha = /\w/;
const alphaEnd = /\w\s/;

const defaultIdentifiers = ['@', '#'];
export default function getCapture(text, right, identifiers = defaultIdentifiers){
  let regexMap = identifiers.map((key)=> (
    [ new RegExp(`\^${key}`), new RegExp(`\\s${key}`) ]
  ));

  let regexTests = [].concat.apply([], regexMap)
  let left = right-1;
  let lastWasAlpha = alpha.test(text.substring(left, right));
  
  while (lastWasAlpha){
    left--;
    lastWasAlpha = alpha.test(text.substring(left, left + 1));
  }

  let matchesIdentifier = regexTests.some((identifier)=>identifier.test(text.substring(left - 1, left + 1)));
  let capture = text.substring(left, right);
  let isValidPoint = right === text.length || alphaEnd.test(text.substring(right-1, right+1));
  
  if(matchesIdentifier && isValidPoint){
    return {left, right, capture};
  }

  return null;
}
