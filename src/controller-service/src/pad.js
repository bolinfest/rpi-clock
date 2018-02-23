function pad(n, ch = '0', size = 2) {
  const s = String(n);
  const len = s.length;
  if (size > len) {
    return ch.repeat(size - len) + s;
  } else {
    return s;
  }
}

module.exports = {
  pad,
};
