import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const isDeleteModalState = atom({
  key: "isDeleteModal",
  default: false,
});

export const isLoginModalState = atom({
  key: "isLoginModal",
  default: false,
});

export const isPostDeleteModalState = atom({
  key: "isPostDeleteModal",
  default: false,
});

export const isSignupModalState = atom({
  key: "isSignupModatState",
  default: false,
});

export const isExtraSignupModalState = atom({
  key: "isExtraSignupModalState",
  default: false,
});

export const isLoginState = atom({
  key: "isLoginState",
  default: false,
  effects_UNSTABLE: [persistAtom],
});

export const isConfirmModalState = atom({
  key: "isConfirmState",
  default: false,
});

export const isAlertModalState = atom({
  key: "isAlertState",
  default: false,
});

export const isLogoutConfirmState = atom({
  key: "isLogoutConfirmState",
  default: false,
});

export const isPreventAlertState = atom({
  key: "isPreventAlertState",
  default: false,
});
