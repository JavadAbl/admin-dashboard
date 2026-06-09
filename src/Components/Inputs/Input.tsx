import { AlertCircle } from "lucide-react";
import React from "react";
import { cn } from "../../Utils/Cn";

interface InputProps extends React.ComponentProps<"div"> {
  text: string;
  error?: string;
  required?: boolean;
  type: "input" | "select" | "textarea";
}
export default function Input({
  text,
  error,
  className,
  children,
  required = false,
  type,
  ...props
}: InputProps) {
  console.log(error);

  return (
    <div className="w-full">
      <div
        className={cn(
          type,
          "focus-within:border-0 focus-within:text-primary w-full",
          error && "input-error",
          className,
        )}
        {...props}
      >
        <InputLabel text={text} required={required} />
        {children}
      </div>
      {error && <InputError message={error} />}
    </div>
  );
}

interface InputLabelProps extends React.ComponentProps<"label"> {
  text: string;
  required?: boolean;
}
function InputLabel({ text, className, required, ...props }: InputLabelProps) {
  return (
    <label
      className={cn("label flex items-center gap-1", className)}
      {...props}
    >
      <span>{text}</span>
      {required && <span className="text-error">*</span>}
    </label>
  );
}

interface InputErrorProps {
  message: string;
}
function InputError({ message }: InputErrorProps) {
  return (
    <label className="floating-label">
      <span className="text-error flex items-center gap-1.5">
        <AlertCircle className="w-3.5 h-3.5" />
        {message}
      </span>
    </label>
  );
}
