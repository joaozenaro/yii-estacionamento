"use client";
import * as ToastPrimitive from "@radix-ui/react-toast";
import clsx from "clsx";
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineExclamationCircle,
} from "react-icons/ai";

export interface ToastProps {
  type?: "success" | "error" | "warning" | "info";
  title: string;
  description?: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  duration?: number;
}

const IconByType = {
  success: AiOutlineCheckCircle,
  error: AiOutlineCloseCircle,
  warning: AiOutlineExclamationCircle,
  info: AiOutlineExclamationCircle,
};
const Toast = ({
  type = "success",
  title,
  description,
  open,
  setOpen,
  duration = 3000,
}: ToastProps) => {
  const Icon = IconByType[type];
  return (
    <ToastPrimitive.Provider swipeDirection="right" duration={duration}>
      <ToastPrimitive.Root
        className="bg-white rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] p-[15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut"
        open={open}
        onOpenChange={setOpen}
      >
        <ToastPrimitive.Title className="[grid-area:_title] mb-[5px] font-medium text-zinc-900 text-md">
          <span className="flex items-center">
            <Icon
              className={clsx("h-6 w-6 mr-2", {
                "text-emerald-600": type === "success",
                "text-red-600": type === "error",
                "text-blue-500": type === "info",
                "text-amber-500": type === "warning",
              })}
            />
            {title}
          </span>
        </ToastPrimitive.Title>
        <ToastPrimitive.Description asChild>
          <p className="[grid-area:_description] m-0 text-slate-500 text-[13px] leading-[1.3]">
            {description}
          </p>
        </ToastPrimitive.Description>
        <ToastPrimitive.Action
          className="[grid-area:_action]"
          asChild
          altText="asdsa"
        >
          <button
            className={clsx(
              "inline-flex items-center justify-center rounded font-medium text-xs px-[10px] leading-[25px] h-[25px] shadow-[inset_0_0_0_1px] hover:shadow-[inset_0_0_0_1px] focus:shadow-[0_0_0_2px]",
              {
                "bg-emerald-100 text-emerald-600 shadow-emerald-700 hover:shadow-emerald-700  focus:shadow-emerald-700":
                  type === "success",
                "bg-red-100 text-red-600 shadow-red-700 hover:shadow-red-700  focus:shadow-red-700":
                  type === "error",
                "bg-blue-100 text-blue-600 shadow-blue-700 hover:shadow-blue-700  focus:shadow-blue-700":
                  type === "info",
                "bg-amber-100 text-amber-600 shadow-amber-700 hover:shadow-amber-700  focus:shadow-amber-700":
                  type === "warning",
              }
            )}
          >
            Ok
          </button>
        </ToastPrimitive.Action>
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport className="[--viewport-padding:_32px] fixed top-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
    </ToastPrimitive.Provider>
  );
};

export default Toast;
