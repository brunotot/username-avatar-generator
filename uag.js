const TEXT_SIZE_PERCENTAGE_MULTIPLIER = 0.4;
const DEFAULT_AVATAR_DIV_WIDTH = '50px';

function getUsernameHEX(username) {
  var hash = 0;
  for (var i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  var color = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}

function getUsernameAcronymUppercase(username) {
  var usernameNormalized = typeof username === 'string' ? username : '';
  var chunks = splitUsernameToWords(usernameNormalized);
  var chunksAcronyms = getChunksAcronyms(chunks);
  
  var usernameAcronym = chunksAcronyms.includes('?') 
  ? getFirstTwoLettersOrQuestionMarks(usernameNormalized)
  : chunksAcronyms;

  return usernameAcronym.toUpperCase();
}

function isLetter(ch) {
  if (ch.length != 1 || ch == '_' || ch == '$')
    return false;
  if (ch.toUpperCase() != ch.toLowerCase())
    return true;
  if (ch.charCodeAt(0) < 128)
    return false;
  try {
    eval("function " + ch + "(){}");
    return true;
  } catch {
    return false;
  }
}

function splitUsernameToWords(str) {
  return str.match(/\b(\w+)\b/g);
}

function getChunksAcronyms(chunks) {
  var firstLetter = '?';
  var secondLetter = '?';
  var chunksNormalized = Array.isArray(chunks) ? chunks : [];
  if (chunksNormalized.length === 0) return '??';
  for (const chunk of chunksNormalized) {
    if (firstLetter === '?') {
      firstLetter = getFirstLetterOrQuestionMark(chunk).letter;
    } else if (secondLetter === '?') {
      secondLetter = getFirstLetterOrQuestionMark(chunk).letter;
    } else {
      break;
    }
  }
  return `${firstLetter}${secondLetter}`;
}

function getFirstTwoLettersOrQuestionMarks(value) {
  var firstLetterObject = getFirstLetterOrQuestionMark(value);
  var firstLetter = firstLetterObject.letter;
  var firstLetterIndex = firstLetterObject.index;
  var secondLetter = '?';
  if (firstLetterIndex > -1) {
    secondLetter = getFirstLetterOrQuestionMark(value, firstLetterIndex + 1).letter;
  }
  return `${firstLetter}${secondLetter}`;
}

function getFirstLetterOrQuestionMark(value, startIndex = 0) {
  var str = typeof value === 'string' ? value.substring(startIndex) : '';
  for (var i = 0; i < str.length; i++) {
    var ch = str.charAt(i);
    if (isLetter(ch)) {
      return {
        letter: ch,
        index: i
      };
    }
  }
  return {
    letter: '?',
    index: -1
  };
}

function invertColorDisplay(hex, bw) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  var r = parseInt(hex.slice(0, 2), 16),
      g = parseInt(hex.slice(2, 4), 16),
      b = parseInt(hex.slice(4, 6), 16);
  if (bw) {
    return (r * 0.299 + g * 0.587 + b * 0.114) > 186
      ? '#000000'
      : '#FFFFFF';
  }
  r = (255 - r).toString(16);
  g = (255 - g).toString(16);
  b = (255 - b).toString(16);
  return "#" + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}

function generateAvatar(config) {
  var username = config.text, 
      width = CSS.supports('width', config.width) ? config.width : DEFAULT_AVATAR_DIV_WIDTH,
      invertColor = typeof config.invertColor === 'boolean' ? config.invertColor : true;
  var avatarDiv = document.createElement('div');
  var avatarDivColor = getUsernameHEX(username);
  avatarDiv.style.display = 'flex';
  avatarDiv.style.justifyContent = 'center';
  avatarDiv.style.alignItems = 'center';
  avatarDiv.style.borderRadius = '50%';
  avatarDiv.style.height = width;
  avatarDiv.style.width = width;
  avatarDiv.style.backgroundColor = avatarDivColor;
  var acroSpan = document.createElement('span');
  var acroSpanColor = invertColorDisplay(avatarDivColor, invertColor)
  var acro = getUsernameAcronymUppercase(username);
  acroSpan.textContent = acro;
  acroSpan.style.fontSize = `calc(${width} * ${TEXT_SIZE_PERCENTAGE_MULTIPLIER})`
  acroSpan.style.color = acroSpanColor;
  avatarDiv.append(acroSpan);
  return {
    acro: acro,
    hex: avatarDivColor,
    elem: avatarDiv
  };
}

function displayAvatar(elemId, config) {
  var elem = document.getElementById(elemId);
  if (!elem) {
    throw new Error(`Cannot find HTML element with id: "${elemId}"`)
  }
  var avatarDiv = generateAvatar(config).elem;
  avatarDiv.id = elemId;
  elem.replaceWith(avatarDiv);
}

