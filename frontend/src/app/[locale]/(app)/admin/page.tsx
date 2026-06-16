'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, UserX, UserCheck } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi, type Role, type User } from '@/lib/api-client';
import { usePaginatedQuery } from '@/hooks/usePaginatedQuery';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { Modal } from '@/components/ui/Modal';
import { GlassInput } from '@/components/ui/GlassInput';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { toApiError } from '@/lib/api';

export default function AdminPage() {
  const t = useTranslations();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);

  const { data, page, setPage } = usePaginatedQuery<User>('users', usersApi.list);

  const createMut = useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); setOpen(false); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof usersApi.update>[1] }) =>
      usersApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); setEditing(null); },
  });
  const deactivateMut = useMutation({
    mutationFn: usersApi.deactivate,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold" style={{ color: '#E6E8F2' }}>Gestion de l'équipe</h1>
          <p className="mt-1 text-sm" style={{ color: '#8E96BD' }}>{data?.pagination.total ?? 0} membres</p>
        </div>
        <GradientButton leftIcon={<Plus className="w-4 h-4" />} onClick={() => setOpen(true)} variant="primary">
          Inviter un membre
        </GradientButton>
      </div>

      <GlassCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider border-b border-white/10" style={{ color: '#8E96BD' }}>
                <th className="py-3 px-2">Nom</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Rôle</th>
                <th className="py-3 px-2">Statut</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.items.map((u) => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-3 px-2" style={{ color: '#E6E8F2' }}>{u.firstName} {u.lastName}</td>
                  <td className="py-3 px-2" style={{ color: '#C2C7DC' }}>{u.email}</td>
                  <td className="py-3 px-2">
                    <Badge variant={u.role === 'ADMIN' ? 'gold' : u.role === 'MANAGER' ? 'info' : 'default'}>
                      {t(`roles.${u.role}`)}
                    </Badge>
                  </td>
                  <td className="py-3 px-2">
                    <Badge variant={u.isActive ? 'success' : 'danger'}>
                      {u.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-right space-x-2">
                    <button onClick={() => setEditing(u)} className="text-xs hover:text-[#3B82F6]" style={{ color: '#8B5CF6' }}>
                      Modifier
                    </button>
                    {u.isActive && (
                      <button
                        onClick={() => deactivateMut.mutate(u.id)}
                        className="text-xs hover:text-[#FCA5A5]"
                        style={{ color: '#F87171' }}
                      >
                        Désactiver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {data && <Pagination page={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} />}
      </GlassCard>

      <UserFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(payload) => createMut.mutate(payload, { onError: (e) => alert(toApiError(e).message) })}
        isLoading={createMut.isPending}
      />
      <UserFormModal
        open={!!editing}
        onClose={() => setEditing(null)}
        initial={editing ?? undefined}
        onSubmit={(payload) => editing && updateMut.mutate({
          id: editing.id,
          data: { firstName: payload.firstName, lastName: payload.lastName, role: payload.role }
        }, { onError: (e) => alert(toApiError(e).message) })}
        isLoading={updateMut.isPending}
      />
    </div>
  );
}

function UserFormModal({
  open, onClose, onSubmit, isLoading, initial,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { email: string; password: string; firstName: string; lastName: string; role: Role }) => void;
  isLoading: boolean;
  initial?: User;
}) {
  const [email, setEmail] = useState(initial?.email ?? '');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState(initial?.firstName ?? '');
  const [lastName, setLastName] = useState(initial?.lastName ?? '');
  const [role, setRole] = useState<Role>(initial?.role ?? 'STAFF');

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'Modifier le membre' : 'Nouveau membre'}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (initial) {
            onSubmit({ email, password: password || initial.id, firstName, lastName, role });
          } else {
            onSubmit({ email, password, firstName, lastName, role });
          }
        }}
        className="space-y-4"
      >
        <GlassInput label="Prénom" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
        <GlassInput label="Nom" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
        {!initial && <GlassInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />}
        <GlassInput
          label={initial ? 'Nouveau mot de passe (optionnel)' : 'Mot de passe'}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required={!initial}
          minLength={8}
        />
        <Select
          label="Rôle"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          options={[
            { value: 'STAFF', label: 'Personnel' },
            { value: 'MANAGER', label: 'Manager' },
            { value: 'ADMIN', label: 'Administrateur' },
          ]}
        />
        <div className="flex justify-end gap-2 pt-2">
          <GradientButton type="button" variant="ghost" onClick={onClose}>Annuler</GradientButton>
          <GradientButton type="submit" variant="primary" isLoading={isLoading}>Enregistrer</GradientButton>
        </div>
      </form>
    </Modal>
  );
}
