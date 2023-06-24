/**
 *
 * ================================
 *      Magic Code, Do Not Touch
 * ================================
 */

let base = 27;

export const convertPetIdToNum = (petId: string) => {
  petId = petId.toLowerCase();
  const arr = [];
  while (petId.length > 0) {
    if (petId.endsWith('lmao')) {
      arr.push('lmao');
      petId = petId.slice(0, petId.length - 4);
    } else {
      arr.push(petId.slice(petId.length - 1));
      petId = petId.slice(0, petId.length - 1);
    }
  }

  let petIdNum = 0;
  for (let i = 0; i < arr.length; i++) {
    let str = arr[i];
    let num = 0;
    if (str === 'lmao') {
      num = 27;
    } else {
      num = str.charCodeAt(0) - 96;
    }
    petIdNum += num * Math.pow(base, i);
    // here is to remove the 27^i if it is looped more than once
    // because the first letter will not have lmao
    if (i >= 2) {
      petIdNum -= Math.pow(base, i - 1);
    }
  }
  return petIdNum;
};

function getTotalDigit(num: number) {
  let _num = num;
  let totalDigit = 0;
  while (_num > 0) {
    totalDigit++;
    _num = Math.floor(_num / 27);
  }
  return totalDigit;
}

const getChar = (num: number) => (num === 0 ? 'lmao' : String.fromCharCode(num + 96));

const getPrefixChar = (num: number) =>
  num === 0 ? 'z' : num === -1 ? 'y' : String.fromCharCode(num + 96);

export function convertNumToPetId(num: number) {
  const totalDigit = getTotalDigit(num);
  let str = '';

  for (let i = totalDigit; i > 0; i--) {
    if (i === totalDigit && i !== 1) {
      if (num === 27) continue;
      str += getPrefixChar((Math.ceil(num / Math.pow(27, i - 1)) % 26) - 1);
    } else {
      str += getChar(Math.ceil(num / Math.pow(27, i - 1)) % 27);
    }
  }
  if (
    str.startsWith('z') &&
    str.endsWith('lmao') &&
    str !== 'zlmao' &&
    new RegExp('lmaolmao').test(str)
  ) {
    str = str.slice(0, -4);
  }
  return str.toUpperCase();
}

/**
 * ===================================================
 *     check whether the pets id is valid or not
 * ===================================================
 */

export const isPetsIdValid = (ids: string[]) =>
  ids
    .filter((id) => id !== 'epic')
    .every((id) => {
      if (!/^[a-z]+$/.test(id)) return false;
      const petId = convertPetIdToNum(id);
      return petId > 0;
    });
