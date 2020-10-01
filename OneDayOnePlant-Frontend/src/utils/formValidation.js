export const isEmailValid = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  return re.test(email);
};

export const isUsernameValid = (username) => {
  return username.length > 0 && username.length < 16;
};
export const isPasswordValid = (psw) => {
  return psw.length > 8;
};

export const AreFieldsValid = (username, email, password) => {
  return (
    isEmailValid(email) &&
    isUsernameValid(username) &&
    isPasswordValid(password)
  );
};
