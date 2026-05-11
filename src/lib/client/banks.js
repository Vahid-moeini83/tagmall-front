export const shebaBankCodes = {
  "017": { name: "بانک ملی ایران", color: "#e31e24", icon: "ir-melli" },
  "015": { name: "بانک سپه", color: "#0055a5", icon: "ir-sepah" },
  "020": { name: "بانک توسعه صادرات", color: "#f37021", icon: "ir-saderat" },
  "011": { name: "بانک صنعت و معدن", color: "#ffc20e", icon: "ir-sanat-madan" },
  "016": { name: "بانک کشاورزی", color: "#008f4c", icon: "ir-keshavarzi" },
  "014": { name: "بانک مسکن", color: "#f7941d", icon: "ir-maskan" },
  "021": { name: "پست بانک ایران", color: "#a41e32", icon: "ir-post-bank" },
  "022": { name: "بانک توسعه تعاون", color: "#ed1c24", icon: "ir-tose-taawon" },
  "055": {
    name: "بانک اقتصاد نوین",
    color: "#f7941d",
    icon: "ir-eghtesad-novin",
  },
  "054": { name: "بانک پارسیان", color: "#00a651", icon: "ir-parsian" },
  "057": { name: "بانک پاسارگاد", color: "#8cc63e", icon: "ir-pasargad" },
  "058": { name: "بانک سرمایه", color: "#0055a5", icon: "ir-sarmayeh" },
  "056": { name: "بانک سامان", color: "#ef394e", icon: "ir-saman" },
  "059": { name: "بانک سینا", color: "#0055a5", icon: "ir-sina" },
  "061": { name: "بانک شهر", color: "#f7941d", icon: "ir-shahr" },
  "062": { name: "بانک آینده", color: "#a41e32", icon: "ir-ayandeh" },
  "012": { name: "بانک ملت", color: "#ed1c24", icon: "ir-mellat" },
  "018": { name: "بانک تجارت", color: "#0055a5", icon: "ir-tejarat" },
  "019": { name: "بانک صادرات", color: "#f37021", icon: "ir-saderat" },
  "013": { name: "بانک رفاه", color: "#0055a5", icon: "ir-refah" },
  "060": {
    name: "بانک قرض الحسنه مهر ایران",
    color: "#008f4c",
    icon: "ir-mehr",
  },
  "051": { name: "رسالت", color: "#a41e32", icon: "ir-resalat" },
  "075": { name: "موسسه اعتباری ملل", color: "#0055a5", icon: "ir-melal" },
};

// گرفتن اطلاعات بانک از روی شماره شبا
export function getBankBySheba(sheba) {
  if (!sheba) return null;

  const clean = sheba.toString().replace(/\s+/g, "").toUpperCase();

  if (!clean.startsWith("IR") || clean.length < 7) return null;

  const bankCode = clean.substring(4, 7);

  return shebaBankCodes[bankCode] || null;
}
