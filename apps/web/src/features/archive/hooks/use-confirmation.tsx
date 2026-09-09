import { SurfaceModal } from "@/components/design/controls";
import { Button } from "@/components/design/shared";
import { useEffect, useRef, useState } from "react";
export function useConfirmation() {
  const [message, setMessage] = useState("");
  const resolve = useRef<((value: boolean) => void) | null>(null);
  const close = (value: boolean) => {
    resolve.current?.(value);
    resolve.current = null;
    setMessage("");
  };
  useEffect(
    () => () => {
      resolve.current?.(false);
    },
    [],
  );
  const confirm = (text: string) =>
    new Promise<boolean>((done) => {
      resolve.current?.(false);
      resolve.current = done;
      setMessage(text);
    });
  const confirmation = (
    <SurfaceModal open={Boolean(message)} title="Confirm this change" onClose={() => close(false)}>
      <p>{message}</p>
      <div className="form-footer">
        <Button secondary onClick={() => close(false)} type="button">
          Keep as is
        </Button>
        <Button onClick={() => close(true)} type="button">
          Confirm
        </Button>
      </div>
    </SurfaceModal>
  );
  return { confirm, confirmation };
}
