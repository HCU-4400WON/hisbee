import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export default function ApplyMethod({ control }: any) {
  return (
    <span className="flex items-start w-[45%]">
      <p className="w-[130px]">신청 방법</p>
      <div className="w-full">
        <Controller
          name="contactDetails"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              multiline
              aria-label="minimum height"
              maxRows={5}
              placeholder="(선택) 신청 방법이 따로 있다면 설명해주세요."
              sx={{
                width: "100%",
              }}
              variant="standard"
            />
          )}
        />
      </div>
    </span>
  );
}
