'use client';

import React from 'react';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface ConfirmLogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" hideHeader className="max-w-sm">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-border-subtle pb-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-base">
            <LogOut className="w-5 h-5" />
            Konfirmasi Keluar Akun
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          Apakah Anda yakin ingin keluar dari akun platform <strong>SMKN 1 Cisarua Connect</strong>? Sesi Anda akan diakhiri.
        </p>

        <div className="pt-2 flex justify-end gap-2 border-t border-slate-100 dark:border-border-subtle">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Batal
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              onClose();
              onConfirm();
            }}
            className="text-xs"
          >
            Ya, Keluar Akun
          </Button>
        </div>
      </div>
    </Modal>
  );
};
