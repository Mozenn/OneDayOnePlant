import {
  isUsernameValid,
  isEmailValid,
  isPasswordValid,
} from "./formValidation";

test("validate valid username", () => {
  expect(isUsernameValid("ValidUsername")).toBe(true);
});

test("refuse empty username", () => {
  expect(isUsernameValid("")).toBe(false);
});

test("validate valid email", () => {
  expect(isEmailValid("hey@gmail.com")).toBe(true);
});

test("refuse empty email", () => {
  expect(isEmailValid("")).toBe(false);
});

test("validate valid password", () => {
  expect(isPasswordValid("Z043Wes8nXmqbPkwib6Bjpf5")).toBe(true);
});

test("refuse empty password", () => {
  expect(isPasswordValid("")).toBe(false);
});
