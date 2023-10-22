import { isConfirmModalState } from "components/atom";
import { useRecoilState, useSetRecoilState } from "recoil";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function GoBackButton() {
  const setIsGoBackConfirmModal = useSetRecoilState(isConfirmModalState);

  const handleGoBack = () => {
    setIsGoBackConfirmModal(true);
  };

  return (
    <button onClick={handleGoBack}>
      <ArrowBackIcon className="text-[25px]"></ArrowBackIcon>
    </button>
  );
}
