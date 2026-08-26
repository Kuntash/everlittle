import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      closeButton
      position="top-center"
      toastOptions={{
        classNames: {
          actionButton: "everlittle-toast-action",
          closeButton: "everlittle-toast-close",
          description: "everlittle-toast-description",
          title: "everlittle-toast-title",
          toast: "everlittle-toast",
        },
      }}
      {...props}
    />
  );
}
