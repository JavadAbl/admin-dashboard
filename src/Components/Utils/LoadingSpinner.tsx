import React from "react";
import { cn } from "../../Utils/Cn";

interface Props extends React.ComponentProps<"div"> {
  centerScreen?: boolean;
}
export default function LoadingSpinner({ centerScreen = false }: Props) {
  return (
    <span
      className={cn(
        "loading loading-ring loading-xl",
        centerScreen && "block h-screen w-screen",
      )}
    />
  );
}
