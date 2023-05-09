export default function Outline({ bgColor, children }: any) {
  return (
    <div className={`min-w-[1470px] 2xl:flex 2xl:justify-center ${bgColor}`}>
      {children}
    </div>
  );
}
