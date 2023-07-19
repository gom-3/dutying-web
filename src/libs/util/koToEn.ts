const KOR_KEY = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎㅏㅐㅑㅒㅓㅔㅕㅖㅗㅛㅜㅠㅡㅣ';
const ENG_KEY = 'rRseEfaqQtTdwWczxvgkoiOjpuPhynbml';

export const koToEn = (str: string): string => {
  if (KOR_KEY.includes(str)) {
    return ENG_KEY[KOR_KEY.indexOf(str)];
  } else {
    return str;
  }
};
