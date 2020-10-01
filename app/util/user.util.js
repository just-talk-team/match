function obtainAgeOfBirthday(birthday) {
  birthday = new Date(birthday);

  var difference = Date.now() - birthday.getTime();
  var age = new Date(difference);

  return Math.abs(age.getUTCFullYear() - 1970);
}

function compareMatches(firstList, secondList) {
  var count = 0;

  firstList.forEach((firstElement) => {
    secondList.forEach((secondElement) => {
      if (firstElement == secondElement) {
        count++;
      }
    });
  });

  return count;
}

module.exports = { obtainAgeOfBirthday, compareMatches };
