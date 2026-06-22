'use client';

import {
  Modal,
  Stack,
  Textarea,
  Alert,
  Text,
  Group,
  Button,
} from '@mantine/core';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { api, toApiError } from '@/lib/api';
import { fullName } from '@/lib/format';
import type { Guest } from '@/lib/api-client';

interface AnonymizeModalProps {
  opened: boolean;
  onClose: () => void;
  guest: Guest;
  onSuccess: () => void;
}

export function AnonymizeModal({ opened, onClose, guest, onSuccess }: AnonymizeModalProps) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  
  const handleAnonymize = async () => {
    if (reason.trim().length < 10) {
      notifications.show({
        title: 'Raison requise',
        message: 'Veuillez fournir une raison détaillée (minimum 10 caractères)',
        color: 'red',
      });
      return;
    }
    
    setLoading(true);
    try {
      await api.post(`/guests/${guest.id}/anonymize`, { reason });
      notifications.show({
        title: 'Client anonymisé',
        message: `${fullName(guest as any)} — Conforme RGPD Art. 17`,
        color: 'green',
      });
      onSuccess();
      onClose();
    } catch (err) {
      notifications.show({
        title: 'Erreur',
        message: toApiError(err).message,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal opened={opened} onClose={onClose} title="⚠️ Anonymisation RGPD" size="md">
      <Stack gap="md">
        <Alert color="red" variant="light">
          <Text size="sm" fw={500} mb="xs">Action irréversible</Text>
          <Text size="sm">
            Vous êtes sur le point d'anonymiser <strong>{fullName(guest as any)}</strong>.
            Toutes les données personnelles seront supprimées de manière permanente.
          </Text>
          <Text size="sm" mt="xs">
            ✅ Les réservations et données comptables seront conservées (obligation légale).
          </Text>
        </Alert>
        
        <Text size="sm">
          Email : <strong>{guest.email}</strong>
        </Text>
        <Text size="sm">
          Total séjours : <strong>{(guest as any).totalStays || 0}</strong>
        </Text>
        
        <Textarea
          label="Raison de l'anonymisation"
          description="Ex: Demande du client (Art. 17 RGPD), Inactivité > 5 ans, etc."
          required
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.currentTarget.value)}
        />
        
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button color="red" onClick={handleAnonymize} loading={loading}>
            Confirmer l'anonymisation
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
