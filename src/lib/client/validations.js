export function isValidIranianMobile(number) {
  // اطمینان از اینکه ورودی رشته است
  const str = number.toString().trim();

  // تبدیل اعداد فارسی به انگلیسی
  const persianToEnglish = str.replace(/[۰-۹]/g, (match) => {
    return String.fromCharCode(
      match.charCodeAt(0) - "۰".charCodeAt(0) + "0".charCodeAt(0),
    );
  });

  // الگوی شماره موبایل ایران: 09xxxxxxxxx
  const regex = /^09\d{9}$/;

  return regex.test(persianToEnglish);
}

export const isValidIranianNationalCode = (input) => {
  // تبدیل اعداد فارسی به انگلیسی
  const persianToEnglish = input.replace(/[۰-۹]/g, (match) => {
    return String.fromCharCode(
      match.charCodeAt(0) - "۰".charCodeAt(0) + "0".charCodeAt(0),
    );
  });

  if (!/^\d{10}$/.test(persianToEnglish)) return false;
  const check = +persianToEnglish[9];
  const sum = persianToEnglish
    .split("")
    .slice(0, 9)
    .reduce((acc, digit, i) => acc + +digit * (10 - i), 0);
  const remainder = sum % 11;
  return (
    (remainder < 2 && check === remainder) ||
    (remainder >= 2 && check === 11 - remainder)
  );
};
