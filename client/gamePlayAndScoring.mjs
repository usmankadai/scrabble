/*
This is the rules part of the main menu.
All the code here are mine. No code was adapted.
*/
export function game() {
  const game = document.querySelector('#gameRule');
  const div = document.createElement('div');
  div.id = 'scoreR';
  div.className = 'scroll';
  game.append(div);

  const score = document.querySelector('#scoreR');
  const node = document.createElement('h1');
  score.appendChild(node);

  const rules = document.querySelector('h1');
  const node2 = document.createTextNode('Game Play');
  rules.appendChild(node2);

  for (let i = 1; i < 20; i += 1) {
    const liElem = document.createElement('li');
    liElem.id = `li${i}`;
    score.appendChild(liElem);
  }
}
/*
Scoring and game play rules Referenced from https://scrabble.hasbro.com/en-us/rules#gameplay.
Get a handler on the list element, then insert the given text.
*/
export function rules() {
  const selectRule1 = document.querySelector('#li1');
  const rule1 = document.createTextNode('Place tiles on the board to spell out words. Drag and drop from your rack to any location on the board where you like the word to start.');
  selectRule1.appendChild(rule1);

  const selectRule2 = document.querySelector('#li2');
  const rule2 = document.createTextNode('After spelling a word on the board, check the validity of the word before submitting.');
  selectRule2.appendChild(rule2);

  const selectRule3 = document.querySelector('#li3');
  const rule3 = document.createTextNode('If the word you spelt is correct, after checking validity it will automatically add to the list of words you have played.');
  selectRule3.appendChild(rule3);

  const selectRule4 = document.querySelector('#li4');
  const rule4 = document.createTextNode('After playing a turn, click the refill tile button to refill the seven tiles.');
  selectRule4.appendChild(rule4);

  const selectRule5 = document.querySelector('#li5');
  const rule5 = document.createTextNode('Blanks: The two blank tiles may be used as any letters. When playing a blank, you must state which letter it represents. It remains that letter for the rest of the game.');
  selectRule5.appendChild(rule5);

  const selectRule6 = document.querySelector('#li6');
  const rule6 = document.createTextNode('The game ends when all letters have been drawn and one player uses his or her last letter; or when all possible plays have been made.');
  selectRule6.appendChild(rule6);

  const selectRule7 = document.querySelector('#li7');
  const rule7 = document.createTextNode('No tile may be shifted or replaced after it has been played and scored.');
  selectRule7.appendChild(rule7);

  const selectRule8 = document.querySelector('#li8');
  const rule8 = document.createTextNode('New words may be formed by:');
  selectRule8.appendChild(rule8);

  const selectRule9 = document.querySelector('#li9');
  const rule9 = document.createTextNode('Adding one or more letters to a word or letters already on the board.');
  selectRule9.appendChild(rule9);

  const selectRule10 = document.querySelector('#li10');
  const rule10 = document.createTextNode('Placing a word at right angles to a word already on the board. The new word must use one of the letters already on the board or must add a letter to it.');
  selectRule10.appendChild(rule10);

  const selectRule11 = document.querySelector('#li11');
  const rule11 = document.createTextNode('Placing a complete word parallel to a word already played so that adjacent letters also form complete words.');
  selectRule11.appendChild(rule11);

  const selectScore1 = document.querySelector('#li12');
  const score1 = document.createTextNode('Scoring');
  selectScore1.appendChild(score1);

  const selectScore2 = document.querySelector('#li13');
  const score2 = document.createTextNode('The score for each turn is the sum of the letter values in each word(s) formed or modified on that turn, plus the additional points obtained from placing letters on Premium Squares.');
  selectScore2.appendChild(score2);

  const selectScore3 = document.querySelector('#li14');
  const score3 = document.createTextNode('Premium letter Squares: All the squares with LS are premium letter squares. A dark blue triple the letter score while a light blue double the letter score.');
  selectScore3.appendChild(score3);

  const selectScore4 = document.querySelector('#li15');
  const score4 = document.createTextNode('Premium Word Squares: The score for an entire word is doubled when one of its letters is placed on a pink square: it is tripled when one of its letters is placed on a red square. Include premiums for double or triple letter values, if any, before doubling or tripling the word score. If a word is formed that covers two premium word squares, the score is doubled and then re-doubled (4 times the letter count), or tripled and then re-tripled (9 times the letter count). NOTE: the center square is a pink square, which doubles the score for the first word.');
  selectScore4.appendChild(score4);

  const selectScore5 = document.querySelector('#li16');
  const score5 = document.createTextNode('BINGO! If you play seven tiles on a turn, it is a Bingo. You score a premium of 50 points after totaling your score for the turn.');
  selectScore5.appendChild(score5);

  const selectScore6 = document.querySelector('#li17');
  const score6 = document.createTextNode('When two or more words are formed in the same play, each is scored.');
  selectScore6.appendChild(score6);

  const selectScore7 = document.querySelector('#li18');
  const score7 = document.createTextNode('Unplayed Letters: When the game ends, each player score is reduced by the sum of his or her unplayed letters. In addition, if a player has used all of his or her letters, the sum of the other players unplayed letters is added to that player score');
  selectScore7.appendChild(score7);

  const selectScore8 = document.querySelector('#li19');
  const score8 = document.createTextNode('The player with the highest final score wins the game. In case of a tie, the player with the highest score before adding or deducting unplayed letters wins.');
  selectScore8.appendChild(score8);
}
