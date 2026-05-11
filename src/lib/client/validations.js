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

export function isValidEmail(email) {
  // اطمینان از اینکه ورودی رشته است
  const str = email.toString().trim();

  // بررسی معتبر بودن ایمیل
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(str);
}

export function isValidCardNumber(cardNumber) {
  // Luhn
  const str = cardNumber.toString().replace(/\s+/g, "");

  if (!/^\d{16}$/.test(str)) return false;

  let sum = 0;
  let shouldDouble = false;

  // از راست به چپ
  for (let i = str.length - 1; i >= 0; i--) {
    let digit = parseInt(str[i]);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
}

export function isValidAccountNumber(accountNumber) {
  const str = accountNumber.toString().trim();

  // بین 10 تا 18 رقم
  return /^\d{10,18}$/.test(str);
}

export function isValidShebaNumber(sheba) {
  const str = sheba.toString().replace(/\s+/g, "").toUpperCase();

  if (!/^IR\d{24}$/.test(str)) return false;

  const rearranged = str.slice(4) + str.slice(0, 4);

  let numeric = "";
  for (const ch of rearranged) {
    if (ch >= "A" && ch <= "Z") {
      numeric += ch.charCodeAt(0) - 55;
    } else {
      numeric += ch;
    }
  }

  let remainder = 0;
  for (const digit of numeric) {
    remainder = (remainder * 10 + Number(digit)) % 97;
  }

  return remainder === 1;
}
