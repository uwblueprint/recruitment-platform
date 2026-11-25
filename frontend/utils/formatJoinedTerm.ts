// school terms
const formatJoinedTerm = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  const month = date.getMonth();
  const season = month <= 3 ? "Winter" : month <= 7 ? "Spring" : "Fall";
  return `${season} ${date.getFullYear()}`;
};

export default formatJoinedTerm;
