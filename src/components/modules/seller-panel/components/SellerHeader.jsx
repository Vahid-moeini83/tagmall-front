function SellerHeader() {
  return (
    <header className="flex flex-col gap-[2px] lg:gap-1 text-right">
      <h1 className="text-[22px] leading-[30px] lg:text-[22px] lg:leading-[30px] [font-weight:450] lg:[font-weight:450] text-text-primary">
        پنل فروشگاه تگ مال
      </h1>
      <p className="text-caption leading-[18px] [font-weight:325] text-text-muted">
        امروز ۳۰ مرداد ماه ۱۴۰۵
        <span className="hidden sm:inline"> ساعت ۱۲:۲۴</span>
      </p>
    </header>
  );
}

export default SellerHeader;
