import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export default function ApplyLink({ control }: any) {
  return (
    <div className="relative flex items-center w-[45%]">
      <span className="text-[#ff0000]">*</span>
      <div className="w-[130px] flex">신청 경로</div>
      <div className="relative flex w-full ">
        <Controller
          name="contact"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant="standard"
              color="primary"
              sx={{
                width: "100%",
              }}
              placeholder="신청 받을 연락처/사이트/구글폼/각종 링크를 적어주세요."
            />
          )}
        />
      </div>
    </div>
  );
}
