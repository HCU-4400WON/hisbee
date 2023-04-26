export function FunctionButton({ text, onClick }: any) {
  return (
    <button
      type="button"
      className="bg-blue-100 text-blue-600 rounded-lg px-[20px] py-[7px] text-[13px]"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
