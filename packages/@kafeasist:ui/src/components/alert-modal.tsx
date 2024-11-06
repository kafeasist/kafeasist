"use client";

import { useEffect, useState } from "react";

import { Button } from "./button";
import { Modal } from "./modal";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  message?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  message,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Bu işlemi yapmak istediğinize emin misiniz?"
      isOpen={isOpen}
      onClose={onClose}
    >
      <p className="text-sm text-muted-foreground">{message}</p>
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Vazgeç
        </Button>
        <Button disabled={loading} variant="destructive" onClick={onConfirm}>
          Devam et
        </Button>
      </div>
    </Modal>
  );
};
