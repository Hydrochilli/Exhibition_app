// src/helpers/stripLastWord.ts
const stripLastWord = (input: any): string => {
    let str = "";
    if (typeof input === "string") {
      str = input;
    } else if (typeof input === "object" && input !== null) {
      if (input.en) {
        if (Array.isArray(input.en)) {
          str = input.en.length > 0 ? String(input.en[0]) : "";
        } else if (typeof input.en === "string") {
          str = input.en;
        } else {
          str = JSON.stringify(input.en);
        }
      } else {
        const keys = Object.keys(input);
        if (keys.length > 0 && typeof input[keys[0]] === "string") {
          str = input[keys[0]];
        } else {
          str = JSON.stringify(input);
        }
      }
    } else {
      str = String(input);
    }
    const words = str.trim().split(" ");
    if (words.length > 1) {
      words.pop();
      return words.join(" ");
    }
    return str;
  };
  
  export default stripLastWord;
  
  