'use client';

import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { Cpu, Database, HardDrive } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GradientButton } from '@/components/ui/GradientButton';

export default function SystemAdminPage() {
  // Refs for the three doughnut charts
  const cpuChartRef = useRef<HTMLCanvasElement>(null);
  const ramChartRef = useRef<HTMLCanvasElement>(null);
  const storageChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cpuChart: Chart | null = null;
    let ramChart: Chart | null = null;
    let storageChart: Chart | null = null;

    const createDoughnut = (ref: HTMLCanvasElement | null, value: number, label: string, color: string) => {
      if (!ref) return null;
      return new Chart(ref, {
        type: 'doughnut',
        data: {
          labels: [label, 'Rest'],
          datasets: [
            {
              data: [value, 100 - value],
              backgroundColor: [color, '#e5e7eb'],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '70%',
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
          },
        },
      });
    };

    if (cpuChartRef.current) {
      cpuChart = createDoughnut(cpuChartRef.current, 68, 'CPU', '#ef4444'); // 68% usage example
    }
    if (ramChartRef.current) {
      ramChart = createDoughnut(ramChartRef.current, 45, 'RAM', '#3b82f6'); // 45% usage example
    }
    if (storageChartRef.current) {
      storageChart = createDoughnut(storageChartRef.current, 80, 'Storage', '#22c55e'); // 80% usage example
    }

    return () => {
      cpuChart?.destroy();
      ramChart?.destroy();
      storageChart?.destroy();
    };
  }, []);

  return (
    <div className="space-y-6 max-w-[1500px] mx-auto px-4 py-6 text-slate-800 font-sans">
      <header className="flex items-center gap-4">
        <Cpu className="w-8 h-8 text-amber-600" />
        <h1 className="text-3xl font-semibold">Zafir System Admin</h1>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CPU Usage */}
        <GlassCard className="p-6 flex flex-col items-center">
          <Cpu className="w-6 h-6 text-amber-600 mb-2" />
          <div className="w-32 h-32 relative" style={{ aspectRatio: '1' }}>
            <canvas ref={cpuChartRef} className="w-full h-full" />
          </div>
          <p className="mt-2 text-sm font-medium">CPU Usage</p>
        </GlassCard>

        {/* RAM Usage */}
        <GlassCard className="p-6 flex flex-col items-center">
          <HardDrive className="w-6 h-6 text-blue-600 mb-2" />
          <div className="w-32 h-32 relative" style={{ aspectRatio: '1' }}>
            <canvas ref={ramChartRef} className="w-full h-full" />
          </div>
          <p className="mt-2 text-sm font-medium">RAM Usage</p>
        </GlassCard>

        {/* Storage Usage */}
        <GlassCard className="p-6 flex flex-col items-center">
          <Database className="w-6 h-6 text-emerald-600 mb-2" />
          <div className="w-32 h-32 relative" style={{ aspectRatio: '1' }}>
            <canvas ref={storageChartRef} className="w-full h-full" />
          </div>
          <p className="mt-2 text-sm font-medium">Storage Usage</p>
        </GlassCard>
      </section>

      {/* Example of existing admin controls – reuse existing component styling */}
      <section className="rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.06)' }}>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-slate-600" /> Server Health Overview
        </h2>
        <p className="text-sm text-slate-600 mb-4">Utilisez les graphiques ci‑dessus pour surveiller l’état des nœuds du serveur en temps réel.</p>
        <GradientButton variant="primary" className="mt-2" onClick={() => alert('Refresh placeholder')}>Actualiser les métriques</GradientButton>
      </section>
    </div>
  );
}
