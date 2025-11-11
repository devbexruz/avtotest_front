export function latinToCyrillic(text: string): string {
  text = text.replace(/[‘’ʼ']/g, "‘");

  const map: Record<string, string> = {
    "Sh": "Ш", "SH": "Ш", "sh": "ш",
    "Ch": "Ч", "CH": "Ч", "ch": "ч",
    "O‘": "Ў", "o‘": "ў", "G‘": "Ғ", "g‘": "ғ",
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
    "‘": "ъ"
  };

  let result = text;
  Object.entries(map)
    .sort(([a], [b]) => b.length - a.length)
    .forEach(([latin, cyr]) => {
      result = result.split(latin).join(cyr);
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