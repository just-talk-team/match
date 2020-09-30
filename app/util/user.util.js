function obtainAgeOfBirthday(birthday) {
  birthday = new Date(birthday);

  var difference = Date.now() - birthday.getTime();
  var age = new Date(difference);

  return Math.abs(age.getUTCFullYear() - 1970);
}

module.exports = obtainAgeOfBirthday;
