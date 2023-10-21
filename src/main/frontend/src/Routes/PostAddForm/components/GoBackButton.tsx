import { isConfirmModalState } from "components/atom";
import { useRecoilState, useSetRecoilState } from "recoil";

export default function GoBackButton() {
  const setIsGoBackConfirmModal = useSetRecoilState(isConfirmModalState);

  const handleGoBack = () => {
    setIsGoBackConfirmModal(true);
  };

  return (
    <button onClick={handleGoBack}>
      <i className="fa-solid fa-arrow-left-long text-[20px]"></i>
    </button>
  );
}
