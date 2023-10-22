import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export default function Qualifications({ control }: any) {
  return (
    <div className="mt-[20px] w-[40%]">
      <p className="mb-[10px] text-[18px] ">지원 자격</p>
      <div className="flex">
        <Controller
          name="qualifications"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              multiline
              aria-label="minimum height"
              maxRows={5}
              placeholder="지원자가 갖춰야 할 역량에 대해 자유롭게 작성해주세요."
              sx={{
                width: "100%",
              }}
              variant="standard"
            />
          )}
        />
      </div>
    </div>
  );
}
