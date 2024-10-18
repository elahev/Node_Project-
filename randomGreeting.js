// randomGreeting.js
const greetings = [
  "Hello!",
  "Welcome to My Page!",
  "Good to see you!",
  "Hi Everybody!",
  "Greetings!"
];

module.exports = function () {
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return greetings[randomIndex];
};
