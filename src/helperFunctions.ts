import { AppDispatch, RootState } from './store';
import { KeyPresses, ScoreTracker, pushScore } from './store/slices/StatSlice';

////////////////////////////////////////////////////////////////////////////////////
function CalculateWPM(
  useCountdown: boolean,
  timeElapsed: number,
  countdownTimer: number,
  startingTime: number,
  excessQuoteToType: string,
  quoteToType: string,
  duplicateQuoteToType: string,
  userTextInput: string
): number {
  const correct = calculateCorrectCharacters(
    excessQuoteToType,
    quoteToType,
    duplicateQuoteToType,
    userTextInput
  );

  if (useCountdown) {
    const dupWpm =
      +(correct / 5 / ((startingTime - countdownTimer) / 60)).toFixed(2) || 0;
    return dupWpm;
  } else {
    const dupWpm = +(correct / 5 / (timeElapsed / 60)).toFixed(2);
    return dupWpm;
  }
}
////////////////////////////////////////////////////////////////////////////////////

function calculateCorrectCharacters(
  excessQuoteToType: string,
  quoteToType: string,
  duplicateQuoteToType: string,
  userTextInput: string
): number {
  const logicData = deleteExcessLettersData(
    userTextInput,
    duplicateQuoteToType,
    quoteToType
  );

  const numOfIncorrectCharsInWord = incorrectCharsInCurrentWord(
    logicData.reassignWord,
    logicData.currentWordNumber - 1,
    excessQuoteToType
  );

  const allLettersTyped = excessQuoteToType.length;
  const timesSkipped = excessQuoteToType?.match(/[#]/g)?.length;
  const lettersInMispelledWords = excessQuoteToType
    .split(' ')
    .filter(
      (word, idx) =>
        word !== duplicateQuoteToType.split(' ')[idx] &&
        idx !== logicData.currentWordNumber - 1
    )
    .join('').length;

  return (
    allLettersTyped -
    (timesSkipped || 0) -
    lettersInMispelledWords -
    numOfIncorrectCharsInWord
  );
}

////////////////////////////////////////////////////////////////////////////////////
function calculateAccuracy(
  totalKeysPressed: number,
  incorrectKeys: number,
  userTextInput: string
): number {
  const incorrectNonSkipped =
    // Regex finds '%' char which represents letters that were skipped by pressing space early on a word, which shouldn't count towards incorrect letters
    incorrectKeys - userTextInput.replace(/[^%]/g, '').length;
  return +((totalKeysPressed - incorrectNonSkipped) / totalKeysPressed).toFixed(
    2
  );
}

////////////////////////////////////////////////////////////////////////////////////
function calculateRaw(totalKeysPressed: number, time: number): number {
  const raw = +(totalKeysPressed / 5 / (time / 60)).toFixed(2);
  return raw;
}

////////////////////////////////////////////////////////////////////////////////////

function incorrectKeyPresses(
  excessQuoteToType: string,
  incorrectKeys: number
): number {
  const skippedChars = excessQuoteToType?.match(/[%]/g)?.length;
  return skippedChars ? incorrectKeys - skippedChars : incorrectKeys;
}

////////////////////////////////////////////////////////////////////////////////////
function keyPressData(
  userTextInput: string,
  excessQuoteToType: string,
  incorrectKeys: number,
  quoteToType: string
): KeyPresses {
  const skipped = excessQuoteToType.match(/[%#]/g)?.length || 0;

  const extra = excessQuoteToType.match(/[~]/g)?.length || 0;

  const incorrect =
    userTextInput.split('').filter((char, idx) => {
      return char !== quoteToType[idx];
    }).length - skipped;
  const correct =
    userTextInput.split('').filter((char, idx) => char === quoteToType[idx])
      .length - extra;

  return { skipped, extra, incorrect, correct };
}

////////////////////////////////////////////////////////////////////////////////////

function incorrectCharsInCurrentWord(
  reassignWord: string,
  currentWordNumber: number,
  excessQuoteToType: string
): number {
  let incorrectChars = 0;
  const userTypedWord = excessQuoteToType.split(' ')[currentWordNumber];
  let userTypedChar;
  for (let idx = 0; idx < userTypedWord.length; idx++) {
    if (excessQuoteToType) {
      userTypedChar = excessQuoteToType.split(' ')[currentWordNumber][idx];
    }
    const correctChar = reassignWord[idx];
    if (userTypedChar !== correctChar) incorrectChars++;
  }
  return incorrectChars;
}
////////////////////////////////////////////////////////////////////////////////////
function addScoreToState(
  currentScores: ScoreTracker[],
  dispatch: AppDispatch,
  wpm: number,
  errors: number,
  time: number,
  func: typeof pushScore,
  totalKeysPressed: number
): void {
  const recentErrors = currentScores.reduce((acc, cv) => acc + cv.errors, 0);

  const raw =
    (totalKeysPressed -
      currentScores[currentScores.length - 1].totalKeysPressed) /
    5 /
    (1 / 60);

  dispatch(
    func({
      raw,
      wpm,
      errors: errors - recentErrors,
      time,
      totalKeysPressed,
    })
  );
}
////////////////////////////////////////////////////////////////////////////////////

function focusTextArea(): void {
  const testTextArea = document.getElementById('type-test');
  testTextArea?.focus();
}

////////////////////////////////////////////////////////////////////////////////////
export interface KeyLogic {
  currentWordNumber: number;
  userInputWordLength: number;
  quoteWordLength: number;
  quoteWord: string;
  userTypedWord: string;
  reassignWord: string;
  splitQuote: string[];
  lettersRemainingInCurrentWord: number;
}

function deleteExcessLettersData(
  userTextInput: string,
  duplicateQuoteToType: string,
  quoteToType: string
): KeyLogic {
  const currentWordNumber = userTextInput.split(' ').length;

  const userInputWordLength =
    userTextInput.split(' ')[currentWordNumber - 1].length;

  const quoteWordLength =
    duplicateQuoteToType.split(' ')[currentWordNumber - 1].length;

  const quoteWord = duplicateQuoteToType.split(' ')[currentWordNumber - 1];

  const userTypedWord = userTextInput
    .split(' ')
    [currentWordNumber - 1].slice(
      0,
      userTextInput.split(' ')[currentWordNumber - 1].length - 1
    );

  const reassignWord = quoteWord.concat(
    userTypedWord.slice(quoteWordLength, userInputWordLength - 1)
  );

  const splitQuote = quoteToType.split(' ');

  const lettersRemainingInCurrentWord = quoteWordLength - userInputWordLength;

  return {
    currentWordNumber,
    userInputWordLength,
    quoteWordLength,
    quoteWord,
    userTypedWord,
    reassignWord,
    splitQuote,
    lettersRemainingInCurrentWord,
  };
}

////////////////////////////////////////////////////////////////////////////////////
function remakeQuoteString(
  userTextInput: string,
  duplicateQuoteToType: string,
  quoteToType: string
): string {
  const logicData = deleteExcessLettersData(
    userTextInput,
    duplicateQuoteToType,
    quoteToType
  );
  const splitQuote = logicData.splitQuote;
  // Replacing the current word with what was deleted from user input
  splitQuote[logicData.currentWordNumber - 1] = logicData.reassignWord;
  return splitQuote.join(' ');
}
////////////////////////////////////////////////////////////////////////////////////

function generateTest(state: RootState): string[] {
  let wordsToGenerate;
  if (state.statSlice.useCountdown) {
    wordsToGenerate = 200;
  } else {
    wordsToGenerate = state.typeInput.numOfWordsToType;
  }
  const randomWordList = [];

  for (let i = 0; i < wordsToGenerate; i++) {
    if (state.statSlice.language === 'HTML') {
      const randomNumber = Math.floor(Math.random() * 100);
      if (randomNumber > 50) {
        randomWordList.push(
          `</${
            htmlElementsList[
              Math.floor(Math.random() * htmlElementsList.length)
            ]
          }>`
        );
      } else {
        randomWordList.push(
          `<${
            htmlElementsList[
              Math.floor(Math.random() * htmlElementsList.length)
            ]
          }>`
        );
      }
    } else if (state.statSlice.language === 'JavaScript') {
      randomWordList.push(
        javascriptWordList[
          Math.floor(Math.random() * javascriptWordList.length)
        ]
      );
    } else {
      randomWordList.push(
        state.typeInput.wordList[
          Math.floor(Math.random() * state.typeInput.wordList.length)
        ]
      );
    }
  }
  return randomWordList;
}

////////////////////////////////////////////////////////////////////////////////////
export {
  deleteExcessLettersData,
  remakeQuoteString,
  CalculateWPM,
  calculateAccuracy,
  focusTextArea,
  generateTest,
  calculateRaw,
  incorrectKeyPresses,
  addScoreToState,
  keyPressData,
};

export const allWordsList = [
  'able',
  'about',
  'above',
  'accept',
  'account',
  'across',
  'act',
  'action',
  'add',
  'admit',
  'adult',
  'affect',
  'after',
  'again',
  'against',
  'age',
  'agency',
  'agent',
  'ago',
  'agree',
  'ahead',
  'air',
  'all',
  'allow',
  'almost',
  'alone',
  'along',
  'already',
  'also',
  'always',
  'among',
  'amount',
  'and',
  'animal',
  'another',
  'answer',
  'any',
  'anyone',
  'appear',
  'apply',
  'area',
  'argue',
  'arm',
  'around',
  'arrive',
  'art',
  'artist',
  'as',
  'ask',
  'assume',
  'at',
  'attack',
  'author',
  'avoid',
  'away',
  'baby',
  'back',
  'bad',
  'bag',
  'ball',
  'bank',
  'bar',
  'base',
  'be',
  'beat',
  'because',
  'become',
  'bed',
  'before',
  'begin',
  'behind',
  'best',
  'better',
  'between',
  'beyond',
  'big',
  'bill',
  'bit',
  'black',
  'blood',
  'blue',
  'board',
  'body',
  'book',
  'born',
  'both',
  'box',
  'boy',
  'break',
  'bring',
  'brother',
  'budget',
  'build',
  'but',
  'buy',
  'by',
  'call',
  'camera',
  'can',
  'car',
  'card',
  'care',
  'career',
  'carry',
  'case',
  'catch',
  'cause',
  'cell',
  'center',
  'central',
  'certain',
  'chair',
  'chance',
  'change',
  'charge',
  'check',
  'choice',
  'choose',
  'church',
  'city',
  'civil',
  'claim',
  'class',
  'clear',
  'clearly',
  'close',
  'coach',
  'cold',
  'college',
  'color',
  'come',
  'common',
  'company',
  'compare',
  'concern',
  'contain',
  'control',
  'cost',
  'could',
  'country',
  'couple',
  'course',
  'court',
  'cover',
  'create',
  'crime',
  'culture',
  'cup',
  'current',
  'cut',
  'dark',
  'data',
  'day',
  'dead',
  'deal',
  'death',
  'debate',
  'decade',
  'decide',
  'deep',
  'degree',
  'design',
  'despite',
  'detail',
  'develop',
  'die',
  'dinner',
  'discuss',
  'do',
  'doctor',
  'dog',
  'door',
  'down',
  'draw',
  'dream',
  'drive',
  'drop',
  'drug',
  'during',
  'each',
  'early',
  'east',
  'easy',
  'eat',
  'edge',
  'effect',
  'effort',
  'eight',
  'either',
  'else',
  'end',
  'energy',
  'enjoy',
  'enough',
  'enter',
  'entire',
  'even',
  'event',
  'ever',
  'every',
  'exist',
  'expect',
  'expert',
  'explain',
  'eye',
  'face',
  'fact',
  'factor',
  'fail',
  'fall',
  'family',
  'far',
  'fast',
  'father',
  'fear',
  'feel',
  'feeling',
  'few',
  'field',
  'fight',
  'figure',
  'fill',
  'film',
  'final',
  'finally',
  'find',
  'fine',
  'finger',
  'finish',
  'fire',
  'firm',
  'first',
  'fish',
  'five',
  'floor',
  'fly',
  'focus',
  'follow',
  'food',
  'foot',
  'for',
  'force',
  'forget',
  'form',
  'former',
  'forward',
  'four',
  'free',
  'friend',
  'from',
  'front',
  'full',
  'fund',
  'future',
  'game',
  'garden',
  'gas',
  'general',
  'get',
  'girl',
  'give',
  'glass',
  'go',
  'goal',
  'good',
  'great',
  'green',
  'ground',
  'group',
  'grow',
  'growth',
  'guess',
  'gun',
  'guy',
  'hair',
  'half',
  'hand',
  'hang',
  'happen',
  'happy',
  'hard',
  'have',
  'he',
  'head',
  'health',
  'hear',
  'heart',
  'heat',
  'heavy',
  'help',
  'her',
  'here',
  'herself',
  'high',
  'him',
  'himself',
  'his',
  'history',
  'hit',
  'hold',
  'home',
  'hope',
  'hot',
  'hotel',
  'hour',
  'house',
  'how',
  'however',
  'huge',
  'human',
  'hundred',
  'husband',
  'idea',
  'if',
  'image',
  'imagine',
  'impact',
  'in',
  'indeed',
  'inside',
  'instead',
  'into',
  'involve',
  'issue',
  'it',
  'item',
  'its',
  'itself',
  'job',
  'join',
  'just',
  'keep',
  'key',
  'kid',
  'kill',
  'kind',
  'kitchen',
  'know',
  'land',
  'large',
  'last',
  'late',
  'later',
  'laugh',
  'law',
  'lay',
  'lead',
  'leader',
  'learn',
  'least',
  'leave',
  'left',
  'leg',
  'legal',
  'less',
  'let',
  'letter',
  'level',
  'lie',
  'life',
  'light',
  'like',
  'likely',
  'line',
  'list',
  'listen',
  'little',
  'live',
  'local',
  'long',
  'look',
  'lose',
  'loss',
  'lot',
  'love',
  'low',
  'machine',
  'main',
  'major',
  'make',
  'manage',
  'many',
  'market',
  'matter',
  'may',
  'maybe',
  'me',
  'mean',
  'measure',
  'media',
  'meet',
  'meeting',
  'member',
  'memory',
  'mention',
  'message',
  'method',
  'middle',
  'might',
  'mind',
  'minute',
  'miss',
  'mission',
  'model',
  'modern',
  'moment',
  'money',
  'month',
  'more',
  'most',
  'mother',
  'mouth',
  'move',
  'movie',
  'much',
  'music',
  'must',
  'my',
  'myself',
  'name',
  'nation',
  'nature',
  'near',
  'nearly',
  'need',
  'never',
  'new',
  'news',
  'next',
  'nice',
  'night',
  'no',
  'none',
  'nor',
  'north',
  'not',
  'note',
  'nothing',
  'notice',
  'now',
  'number',
  'occur',
  'of',
  'off',
  'offer',
  'office',
  'often',
  'oh',
  'oil',
  'ok',
  'old',
  'on',
  'once',
  'one',
  'only',
  'onto',
  'open',
  'option',
  'or',
  'order',
  'other',
  'others',
  'our',
  'out',
  'outside',
  'over',
  'own',
  'owner',
  'page',
  'pain',
  'paper',
  'parent',
  'part',
  'partner',
  'party',
  'pass',
  'past',
  'patient',
  'pattern',
  'pay',
  'peace',
  'per',
  'perhaps',
  'period',
  'phone',
  'pick',
  'piece',
  'place',
  'plan',
  'plant',
  'play',
  'player',
  'point',
  'police',
  'policy',
  'poor',
  'popular',
  'power',
  'prepare',
  'present',
  'pretty',
  'prevent',
  'price',
  'private',
  'problem',
  'process',
  'product',
  'program',
  'prove',
  'public',
  'pull',
  'purpose',
  'push',
  'put',
  'quality',
  'quite',
  'race',
  'radio',
  'raise',
  'range',
  'rate',
  'rather',
  'reach',
  'read',
  'ready',
  'real',
  'really',
  'reason',
  'receive',
  'recent',
  'record',
  'red',
  'reduce',
  'reflect',
  'region',
  'relate',
  'remain',
  'remove',
  'report',
  'rest',
  'result',
  'return',
  'reveal',
  'rich',
  'right',
  'rise',
  'risk',
  'road',
  'rock',
  'role',
  'room',
  'rule',
  'run',
  'safe',
  'same',
  'save',
  'say',
  'scene',
  'school',
  'score',
  'sea',
  'season',
  'seat',
  'second',
  'see',
  'seek',
  'seem',
  'sell',
  'send',
  'senior',
  'sense',
  'series',
  'serious',
  'serve',
  'set',
  'seven',
  'shake',
  'share',
  'she',
  'shoot',
  'short',
  'shot',
  'should',
  'show',
  'side',
  'sign',
  'simple',
  'simply',
  'since',
  'sing',
  'single',
  'sister',
  'sit',
  'site',
  'six',
  'size',
  'skill',
  'skin',
  'small',
  'smile',
  'so',
  'social',
  'some',
  'someone',
  'song',
  'soon',
  'sort',
  'sound',
  'source',
  'south',
  'space',
  'speak',
  'speech',
  'spend',
  'sport',
  'spring',
  'staff',
  'stage',
  'stand',
  'star',
  'start',
  'state',
  'stay',
  'step',
  'still',
  'stock',
  'stop',
  'store',
  'story',
  'street',
  'strong',
  'student',
  'study',
  'stuff',
  'style',
  'such',
  'suffer',
  'summer',
  'support',
  'sure',
  'system',
  'table',
  'take',
  'talk',
  'task',
  'tax',
  'teach',
  'teacher',
  'team',
  'tell',
  'ten',
  'tend',
  'term',
  'test',
  'than',
  'thank',
  'that',
  'the',
  'their',
  'them',
  'then',
  'theory',
  'there',
  'these',
  'they',
  'thing',
  'think',
  'third',
  'this',
  'those',
  'though',
  'thought',
  'threat',
  'three',
  'through',
  'throw',
  'thus',
  'time',
  'to',
  'today',
  'tonight',
  'too',
  'top',
  'total',
  'tough',
  'toward',
  'town',
  'trade',
  'travel',
  'treat',
  'tree',
  'trial',
  'trip',
  'true',
  'truth',
  'try',
  'turn',
  'tv',
  'two',
  'type',
  'under',
  'unit',
  'until',
  'up',
  'upon',
  'us',
  'use',
  'usually',
  'value',
  'very',
  'victim',
  'view',
  'visit',
  'voice',
  'vote',
  'wait',
  'walk',
  'wall',
  'want',
  'war',
  'watch',
  'water',
  'way',
  'we',
  'weapon',
  'wear',
  'week',
  'weight',
  'well',
  'west',
  'what',
  'when',
  'where',
  'whether',
  'which',
  'while',
  'white',
  'who',
  'whole',
  'whom',
  'whose',
  'why',
  'wide',
  'wife',
  'will',
  'win',
  'wind',
  'window',
  'wish',
  'with',
  'within',
  'without',
  'wonder',
  'word',
  'work',
  'worker',
  'world',
  'worry',
  'would',
  'write',
  'writer',
  'wrong',
  'yard',
  'yeah',
  'year',
  'yes',
  'yet',
  'you',
  'young',
  'your',
];

export const htmlElementsList = [
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'code',
  'col',
  'data',
  'dd',
  'del',
  'details',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hr',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'meta',
  'nav',
  'noscript',
  'object',
  'ol',
  'option',
  'p',
  'picture',
  'pre',
  'q',
  'script',
  'section',
  'select',
  'small',
  'source',
  'span',
  'strong',
  'style',
  'sub',
  'sup',
  'svg',
  'table',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'tr',
  'ul',
  'video',
];

export const javascriptWordList = [
  'console',
  '.log',
  'Object',
  'object',
  '.keys',
  '.push',
  '.shift',
  '.unshift',
  '.pop',
  'NaN',
  'Math',
  'Infinity',
  '.isArray',
  'array',
  'async',
  'await',
  'const',
  'let',
  'var',
  '=',
  '[]',
  '{}',
  'return',
  'function',
  '=>',
  'break',
  'continue',
  'while',
  'for',
  'continue',
  'try',
  'catch',
  'debugger',
  'throw',
  'of',
  'import',
  'from',
  'true',
  'false',
  '===',
  '!==',
  'module',
  '.addEventListener',
  'document',
  '.querySelector',
  '.getElementById',
  '``',
];
////////////////////////////////////////////////////////////////////////////////////
