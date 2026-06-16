import { View, Text, FlatList, RefreshControl, Pressable } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Clock, AlertTriangle, ChevronRight } from 'lucide-react-native';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { GlassCard } from '@/components/ui/GlassCard';
import { colors, fontSize, fontWeight, gradients, radius, spacing } from '@/design/tokens';
import { LinearGradient } from 'expo-linear-gradient';
import { differenceInMinutes, formatDistanceToNow } from 'date-fns';
import { fr as frLocale } from 'date-fns/locale';

type Task = {
  id: string;
  type: 'CHECKOUT_CLEAN' | 'STAYOVER' | 'DEEP_CLEAN' | 'INSPECTION' | 'TURNDOWN';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'INSPECTED' | 'REJECTED';
  priority: number;
  dueAt: string | null;
  room: { number: string; type: string; floor: number };
  _count: { photos: number };
};

const TYPE_LABELS: Record<string, string> = {
  CHECKOUT_CLEAN: 'Après départ',
  STAYOVER: 'Pendant séjour',
  DEEP_CLEAN: 'Grand nettoyage',
  INSPECTION: 'Inspection',
  TURNDOWN: 'Service soir',
};

export default function HousekeepingScreen() {
  const router = useRouter();
  const { user } = useAuth();
  
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['hk', 'my-tasks'],
    queryFn: async () => {
      const res = await api.get<{ items: Task[] }>('/api/housekeeping', { 
        params: { assigneeId: user?.id, pageSize: 50 } 
      });
      return res.data.items;
    },
    enabled: !!user,
  });
  
  const tasks = data ?? [];
  const pending = tasks.filter((t: Task) => t.status === 'PENDING');
  const inProgress = tasks.filter((t: Task) => t.status === 'IN_PROGRESS');
  const overdue = tasks.filter((t: Task) => t.dueAt && new Date(t.dueAt) < new Date() && t.status === 'PENDING');
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.midnight[900] }}>
      <FlatList
        data={[...inProgress, ...pending]}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.gold[400]}
          />
        }
        ListHeaderComponent={
          <View>
            <Text style={{ 
              color: colors.midnight[50], 
              fontSize: fontSize.xxxl, 
              fontWeight: fontWeight.bold, 
              marginBottom: spacing.lg,
            }}>
              Ménage
            </Text>
            
            {/* Stats */}
            <View style={{ flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl }}>
              <StatCard value={pending.length} label="À faire" color={colors.midnight[50]} />
              <StatCard value={inProgress.length} label="En cours" color={colors.sapphire[400]} />
              <StatCard 
                value={overdue.length} 
                label="En retard" 
                color={overdue.length > 0 ? '#FCA5A5' : colors.midnight[200]}
                highlight={overdue.length > 0}
              />
            </View>
            
            {inProgress.length > 0 && (
              <Text style={{
                color: colors.midnight[100], 
                fontSize: fontSize.md, 
                fontWeight: fontWeight.semibold, 
                marginBottom: spacing.md, 
                marginTop: spacing.sm,
              }}>
                En cours
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => <TaskCard task={item} onPress={() => router.push(`/housekeeping/${item.id}` as any)} />}
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', paddingTop: spacing.xxxl }}>
            <Text style={{ color: colors.midnight[300], fontSize: fontSize.md }}>
              {isLoading ? 'Chargement…' : '✨ Aucune tâche assignée'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

function StatCard({ value, label, color, highlight }: { value: number; label: string; color: string; highlight?: boolean }) {
  return (
    <View style={{ 
      flex: 1, 
      padding: spacing.md, 
      borderRadius: radius.lg,
      backgroundColor: highlight ? 'rgba(239,68,68,0.10)' : 'rgba(255,255,255,0.05)',
      borderWidth: 1,
      borderColor: highlight ? 'rgba(239,68,68,0.30)' : 'rgba(255,255,255,0.10)',
    }}>
      <Text style={{ color, fontSize: 32, fontWeight: fontWeight.bold }}>{value}</Text>
      <Text style={{ color: colors.midnight[300], fontSize: fontSize.xs, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function TaskCard({ task, onPress }: { task: Task; onPress: () => void }) {
  const dueIn = task.dueAt ? differenceInMinutes(new Date(task.dueAt), new Date()) : null;
  const isOverdue = dueIn !== null && dueIn < 0 && task.status === 'PENDING';
  const isInProgress = task.status === 'IN_PROGRESS';
  
  const gradientColors = isOverdue 
    ? (['#EF4444', '#F59E0B'] as [string, string])
    : isInProgress
    ? gradients.sapphire
    : task.priority >= 4
    ? (['#F59E0B', '#FB923C'] as [string, string])
    : gradients.emerald;
  
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <GlassCard variant={isInProgress ? 'strong' : 'default'}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <LinearGradient
            colors={gradientColors}
            style={{
              width: 56, height: 56, borderRadius: radius.lg,
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 20, fontWeight: fontWeight.bold }}>
              {task.room.number}
            </Text>
          </LinearGradient>
          
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.midnight[50], fontSize: fontSize.md, fontWeight: fontWeight.semibold }}>
              {TYPE_LABELS[task.type] || task.type}
            </Text>
            <Text style={{ color: colors.midnight[300], fontSize: fontSize.sm, marginTop: 2 }}>
              Étage {task.room.floor} • {task.room.type}
            </Text>
            {task.dueAt && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs + 2 }}>
                {isOverdue ? (
                  <AlertTriangle size={12} color="#FCA5A5" />
                ) : (
                  <Clock size={12} color={colors.midnight[300]} />
                )}
                <Text style={{ 
                  color: isOverdue ? '#FCA5A5' : colors.midnight[300],
                  fontSize: fontSize.xs, 
                  marginLeft: 4,
                }}>
                  {isOverdue 
                    ? `En retard de ${formatDistanceToNow(new Date(task.dueAt), { locale: frLocale })}`
                    : `À faire dans ${formatDistanceToNow(new Date(task.dueAt), { locale: frLocale })}`
                  }
                </Text>
              </View>
            )}
          </View>
          
          <ChevronRight size={20} color={colors.midnight[300]} />
        </View>
      </GlassCard>
    </Pressable>
  );
}
