import { atom } from "recoil";

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
