const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function randomCode(length = 6) {
  let s = '';
  for (let i = 0; i < length; i++) {
    s += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return s;
}

module.exports = async function generateUniqueCode(LinkModel, length = 6) {
  let tries = 0;
  while (tries < 5) {
    const code = randomCode(length);
    // check exists
    // eslint-disable-next-line no-await-in-loop
    const exists = await LinkModel.findOne({ code }).lean();
    if (!exists) return code;
    tries++;
  }
  // fallback longer code
  return randomCode(8);
};
