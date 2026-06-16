import { useState } from 'react';
import type { CurrentUser } from '../../lib/rbac';
import { hasAccess } from '../../lib/rbac';
import { useAuditLog } from '../../lib/auditLog';
import { ClearanceLock } from '../ClearanceLock';
import { ElevationConfirmModal } from '../modals/ElevationConfirmModal';

interface SecureWrapperProps {
  tabId: string;
  currentUser: CurrentUser;
  onElevate: () => void;
  children: React.ReactNode;
  requireReason?: boolean;
  cooldownSeconds?: number;
}

export function SecureWrapper({
  tabId,
  currentUser,
  onElevate,
  children,
  requireReason = false,
  cooldownSeconds = 5,
}: SecureWrapperProps) {
  const [showModal, setShowModal] = useState(false);
  const { log } = useAuditLog();

  if (hasAccess(currentUser, tabId)) {
    return <>{children}</>;
  }

  const handleElevateClick = () => {
    if (requireReason) {
      setShowModal(true);
    } else {
      log({
        userId: currentUser.id,
        userName: currentUser.name,
        action: 'ROLE_ELEVATED',
        details: { tabId, method: 'direct_elevation' },
      });
      onElevate();
    }
  };

  const handleConfirm = (reason: string) => {
    log({
      userId: currentUser.id,
      userName: currentUser.name,
      action: 'ROLE_ELEVATED',
      details: { tabId, method: 'modal_confirmation', reason },
    });
    onElevate();
    setShowModal(false);
  };

  return (
    <>
      <ClearanceLock
        tabId={tabId}
        currentUser={currentUser}
        onElevate={handleElevateClick}
      />
      {requireReason && (
        <ElevationConfirmModal
          open={showModal}
          currentUser={currentUser}
          cooldownSeconds={cooldownSeconds}
          onCancel={() => setShowModal(false)}
          onConfirm={handleConfirm}
        />
      )}
    </>
  );
}
