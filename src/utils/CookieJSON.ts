import Cookie from 'js-cookie';

const CookieJSON = Cookie.withConverter({
  read: (value) => JSON.parse(value),
  write: (value) => JSON.stringify(value)
});

export default CookieJSON;
