export default function Soon({
  recruitStart,
  recruitEnd,
  closed,
  color,
  bgColor,
  fontSize,
}: any) {
  const dateDiff =
    (new Date(recruitEnd).getTime() - new Date(recruitStart).getTime()) /
    (1000 * 60 * 60 * 24);
  const soon = dateDiff <= 4 && dateDiff > 0 && closed === false;

  return (
    <>
      {soon && (
        <span
          className={`px-[10px] py-[1px] rounded-full ${bgColor} text-[${fontSize}px] ml-[10px] ${color}`}
        >
          마감 임박🔥
        </span>
      )}
    </>
  );
}
