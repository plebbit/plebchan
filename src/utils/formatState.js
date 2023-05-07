function formatState(str) {
  if (!str) {
    return null;
  }

  const formattedWords = str
    .replace(/-/g, " ")
    .split(" ")
    .map((word, index) => {
      word = word.toLowerCase();
      if (word === "ipfs" || word === "ipns") {
        return word.toUpperCase();
      } else if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      } else {
        return word;
      }
    });

  if (formattedWords.includes("Failed")) {
    return formattedWords.join(" ") + ".";
  }

  return formattedWords.join(" ") + "...";
}

export default formatState;