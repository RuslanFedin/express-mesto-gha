function validateUrl(url) {
  const regex = /^https?:\/\/(www\.)?[a-zA-Z\d]+\.[\w\-._~:/?#[\]@!$&'()*+,;=]{2,}#?$/g;
  if (regex.text(url)) {
    return url;
  }
  throw new Error('Ссылка не работает');
}

module.exports = { validateUrl };