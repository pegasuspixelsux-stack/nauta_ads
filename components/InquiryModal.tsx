"use client";

import { InquiryForm } from "@/components/InquiryForm";
import { Modal } from "@/components/ui/modal";
import type { Boat } from "@/lib/types";

export function InquiryModal({ boat, onClose }: { boat: Boat | null; onClose: () => void }) {
  return (
    <Modal
      open={boat !== null}
      onClose={onClose}
      title={boat ? `Consultar por ${boat.builder} ${boat.model}` : "Consultar"}
    >
      {/* Se monta solo con el modal abierto, así el formulario arranca limpio cada vez. */}
      {boat && <InquiryForm boat={boat} onDone={onClose} />}
    </Modal>
  );
}
