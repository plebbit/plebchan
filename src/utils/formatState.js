function formatState(str) {
  return (
    str
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => {
        word = word.toLowerCase();
        if (word === "ipfs" || word === "ipns") {
          return word.toUpperCase();
        } else {
          return word.charAt(0).toUpperCase() + word.slice(1);
        }
      })
      .join(" ") + "..."
  );
}

export default formatState;