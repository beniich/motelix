import { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { ArrowLeft, Play, Check, Camera, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react-native';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/Button';
import { colors, fontSize, fontWeight, radius, spacing } from '@/design/tokens';

const CHECKLIST_LABELS: Record<string, string> = {
  bed_made: 'Lit fait',
  sheets_changed: 'Draps changés',
  floor_vacuumed: 'Aspirateur passé',
  floor_mopped: 'Sol lavé',
  bathroom_cleaned: 'Salle de bain nettoyée',
  towels_replaced: 'Serviettes remplacées',
  minibar_restocked: 'Minibar réapprovisionné',
  trash_emptied: 'Poubelles vidées',
  surfaces_dusted: 'Surfaces dépoussiérées',
};

type Task = {
  id: string;
  type: string;
  status: string;
  checklist: Record<string, boolean> | null;
  room: { number: string; type: string; floor: number };
  photos: Array<{ id: string; url: string }>;
};

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  
  const { data: task, isLoading } = useQuery({
    queryKey: ['hk', 'task', id],
    queryFn: async () => (await api.get<{ task: Task }>(`/api/housekeeping/${id}`)).data.task,
    enabled: !!id,
  });
  
  useEffect(() => {
    if (task?.checklist) setChecklist(task.checklist);
  }, [task]);
  
  const startMut = useMutation({
    mutationFn: () => api.post(`/api/housekeeping/${id}/start`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hk'] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    },
  });
  
  const completeMut = useMutation({
    mutationFn: (payload: any) => api.post(`/api/housekeeping/${id}/complete`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hk'] });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    },
  });
  
  const photoMut = useMutation({
    mutationFn: async (uri: string) => {
      const formData = new FormData();
      formData.append('photo', {
        uri,
        type: 'image/jpeg',
        name: `photo-${Date.now()}.jpg`,
      } as any);
      return api.post(`/api/housekeeping/${id}/photos`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hk', 'task', id] });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    },
  });
  
  if (isLoading || !task) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.midnight[900] }}>
        <ActivityIndicator color={colors.gold[400]} />
      </View>
    );
  }
  
  const items = Object.keys(task.checklist ?? {});
  const allChecked = items.length > 0 && items.every(k => checklist[k]);
  const canStart = task.status === 'PENDING';
  const canComplete = task.status === 'IN_PROGRESS';
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'MANAGER';
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.midnight[900] }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 120 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xl }}>
          <Pressable 
            onPress={() => router.back()}
            style={{
              width: 40, height: 40, borderRadius: radius.md,
              backgroundColor: 'rgba(255,255,255,0.05)',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <ArrowLeft size={20} color={colors.midnight[100]} />
          </Pressable>
          <View style={{ marginLeft: spacing.md }}>
            <Text style={{ color: colors.midnight[50], fontSize: 24, fontWeight: fontWeight.bold }}>
              Chambre {task.room.number}
            </Text>
            <Text style={{ color: colors.midnight[300], fontSize: fontSize.sm }}>
              Étage {task.room.floor} • {task.room.type}
            </Text>
          </View>
        </View>
        
        {/* Photos */}
        <GlassCard style={{ marginBottom: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <Text style={{ color: colors.midnight[100], fontSize: fontSize.md, fontWeight: fontWeight.semibold }}>
              Photos ({task.photos.length})
            </Text>
            <Pressable
              onPress={async () => {
                const result = await ImagePicker.launchCameraAsync({
                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                  quality: 0.7,
                });
                if (!result.canceled && result.assets[0]) {
                  photoMut.mutate(result.assets[0].uri);
                }
              }}
              style={{
                paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: radius.md,
                flexDirection: 'row', alignItems: 'center', gap: 6,
              }}
            >
              <Camera size={14} color={colors.midnight[100]} />
              <Text style={{ color: colors.midnight[100], fontSize: fontSize.xs }}>Photo</Text>
            </Pressable>
          </View>
          {task.photos.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {task.photos.map((p: { id: string; url: string }) => (
                <Image 
                  key={p.id} 
                  source={{ uri: p.url }} 
                  style={{ width: 80, height: 80, borderRadius: radius.md, marginRight: spacing.sm }} 
                />
              ))}
            </ScrollView>
          ) : (
            <Text style={{ color: colors.midnight[300], fontSize: fontSize.xs, textAlign: 'center', paddingVertical: spacing.md }}>
              Aucune photo. Prenez-en pour documenter.
            </Text>
          )}
        </GlassCard>
        
        {/* Checklist */}
        {(canStart || canComplete) && (
          <GlassCard>
            <Text style={{ color: colors.midnight[100], fontSize: fontSize.md, fontWeight: fontWeight.semibold, marginBottom: spacing.md }}>
              Checklist
            </Text>
            <View style={{ gap: spacing.sm }}>
              {items.map((key) => (
                <Pressable
                  key={key}
                  onPress={() => {
                    if (!canComplete) return;
                    setChecklist(c => ({ ...c, [key]: !c[key] }));
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
                    padding: spacing.md,
                    borderRadius: radius.md,
                    backgroundColor: checklist[key] ? 'rgba(16,185,129,0.10)' : 'rgba(255,255,255,0.05)',
                  }}
                >
                  <View style={{
                    width: 24, height: 24, borderRadius: 6,
                    backgroundColor: checklist[key] ? colors.emerald[400] : 'transparent',
                    borderWidth: 2,
                    borderColor: checklist[key] ? colors.emerald[400] : colors.midnight[300],
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    {checklist[key] && <Check size={16} color="white" />}
                  </View>
                  <Text style={{ 
                    color: checklist[key] ? colors.midnight[50] : colors.midnight[100], 
                    fontSize: fontSize.md, flex: 1,
                    textDecorationLine: checklist[key] ? 'line-through' : 'none',
                    opacity: checklist[key] ? 0.6 : 1,
                  }}>
                    {CHECKLIST_LABELS[key] ?? key}
                  </Text>
                </Pressable>
              ))}
            </View>
          </GlassCard>
        )}
        
        {/* Inspection (admin) */}
        {isAdmin && task.status === 'COMPLETED' && (
          <View style={{ flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg }}>
            <Button
              title="Approuver"
              onPress={() => api.post(`/api/housekeeping/${id}/inspect`, { approved: true }).then(() => router.back())}
              variant="primary"
              leftIcon={<CheckCircle2 size={18} color={colors.midnight[900]} />}
              style={{ flex: 1 }}
            />
            <Button
              title="Refuser"
              onPress={() => Alert.prompt('Raison du refus', '', (text) => 
                api.post(`/api/housekeeping/${id}/inspect`, { approved: false, notes: text }).then(() => router.back())
              )}
              variant="danger"
              leftIcon={<XCircle size={18} color="white" />}
              style={{ flex: 1 }}
            />
          </View>
        )}
      </ScrollView>
      
      {/* Action bar sticky */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: spacing.lg,
        backgroundColor: 'rgba(10,18,51,0.95)',
        borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.10)',
      }}>
        {canStart && (
          <Button
            title="Démarrer le nettoyage"
            onPress={() => startMut.mutate()}
            variant="primary"
            size="lg"
            isLoading={startMut.isPending}
            leftIcon={<Play size={18} color={colors.midnight[900]} />}
          />
        )}
        {canComplete && (
          <Button
            title="Terminer la tâche"
            onPress={() => completeMut.mutate({ checklist })}
            variant={allChecked ? "gold" : "secondary"}
            disabled={!allChecked}
            size="lg"
            isLoading={completeMut.isPending}
            leftIcon={<Check size={18} color={allChecked ? colors.midnight[900] : colors.midnight[100]} />}
          />
        )}
      </View>
    </View>
  );
}
