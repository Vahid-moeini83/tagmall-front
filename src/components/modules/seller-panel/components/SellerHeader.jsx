function SellerHeader() {
  return (
    <header className="flex flex-col gap-1 text-right">
      <h1 className="text-[22px] lg:text-h4 font-semibold text-text-primary">
        پنل فروشگاه تگ مال
      </h1>
      <p className="text-caption text-text-muted">
        امروز ۳۰ مرداد ماه ۱۴۰۵
        <span className="hidden sm:inline"> ساعت ۱۲:۲۴</span>
      </p>
    </header>
  );
}

export default SellerHeader;
