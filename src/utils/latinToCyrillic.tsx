export function latinToCyrillic(text: string): string {
  const map: Record<string, string> = {
    A: "А", a: "а",
    B: "Б", b: "б",
    D: "Д", d: "д",
    E: "Е", e: "е",
    F: "Ф", f: "ф",
    G: "Г", g: "г",
    H: "Ҳ", h: "ҳ",
    I: "И", i: "и",
    J: "Ж", j: "ж",
    K: "К", k: "к",
    L: "Л", l: "л",
    M: "М", m: "м",
    N: "Н", n: "н",
    O: "О", o: "о",
    P: "П", p: "п",
    Q: "Қ", q: "қ",
    R: "Р", r: "р",
    S: "С", s: "с",
    T: "Т", t: "т",
    U: "У", u: "у",
    V: "В", v: "в",
    X: "Х", x: "х",
    Y: "Й", y: "й",
    Z: "З", z: "з",
    "ʼ": "ъ", "'": "ъ",
    "’": "ъ",
    "O‘": "Ў", "o‘": "ў",
    "G‘": "Ғ", "g‘": "ғ",
    "Sh": "Ш", "sh": "ш",
    "Ch": "Ч", "ch": "ч",
  };

  let result = text;
  // Avval ikki belgili kombinatsiyalarni o‘zgartiramiz
  Object.entries(map)
    .sort(([a], [b]) => b.length - a.length)
    .forEach(([latin, cyr]) => {
      result = result.replaceAll(latin, cyr);
    });

  return result;
}

class Muhit {
  public lang: string

  constructor() {
    // Language get in localStorage
    const language = localStorage.getItem("lang") || "latin";
    if (language !== "cyril" && language !== "latin"){
        localStorage.setItem("lang", "latin");
    }
    this.lang = language;
  }
  t(text: string) {
    if (this.lang === "cyril") {
      return latinToCyrillic(text);
    }
    return text;
  }
  toUzbek() {
    localStorage.setItem("lang", "latin")
  }
  toCyril() {
    localStorage.setItem("lang", "cyril")
  }
}

const c = new Muhit();
export default c;