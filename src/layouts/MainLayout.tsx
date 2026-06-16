import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { renderWithRBAC } from '@/components/workspace/RBACWrapper';
import { isTabRestricted } from '@/lib/rbac';
import { useAuth } from '@/hooks/useAuth';

// default exports
import ArrivalsDashboard from '@/components/ArrivalsDashboard';
import ValetDashboard from '@/components/ValetDashboard';
import ConciergeDashboard from '@/components/ConciergeDashboard';
import MasterSwitchDashboard from '@/components/MasterSwitchDashboard';
import SecurityDashboard from '@/components/SecurityDashboard';
import EnergyDashboard from '@/components/EnergyDashboard';
import RoomServiceDashboard from '@/components/RoomServiceDashboard';
import MinibarDashboard from '@/components/MinibarDashboard';
import PoolDashboard from '@/components/PoolDashboard';
import BoutiqueDashboard from '@/components/BoutiqueDashboard';
import SubscriptionDashboard from '@/components/SubscriptionDashboard';
import DigitalTwinDashboard from '@/components/DigitalTwinDashboard';
import DocumentVaultDashboard from '@/components/DocumentVaultDashboard';
import MaintenanceDashboard from '@/components/MaintenanceDashboard';
import DroneDashboard from '@/components/DroneDashboard';
import OmniStreamDashboard from '@/components/OmniStreamDashboard';
import AdminCommandCenter from '@/components/AdminCommandCenter';

// named exports
import { HousekeepingDashboard } from '@/components/HousekeepingDashboard';
import { StrategyDashboard } from '@/components/StrategyDashboard';
import { ReservationsDashboard } from '@/components/ReservationsDashboard';
import { BillingDashboard } from '@/components/BillingDashboard';
import { GuestsDashboard } from '@/components/GuestsDashboard';
import { ChannelManagerDashboard } from '@/components/ChannelManagerDashboard';

const DASHBOARD_ROUTES: Record<string, () => React.ReactNode> = {
  arrivals:             () => <ArrivalsDashboard logs={[]} onAddLog={() => {}} onNavigate={() => {}} currentUser={null} />,
  housekeeping:         () => <HousekeepingDashboard />,
  valet:                () => <ValetDashboard logs={[]} onAddLog={() => {}} />,
  concierge:            () => <ConciergeDashboard />,
  'room-service':       () => <RoomServiceDashboard />,
  minibar:              () => <MinibarDashboard />,
  pool:                 () => <PoolDashboard theme="dark" />,
  boutique:             () => <BoutiqueDashboard />,
  reservations:         () => <ReservationsDashboard />,
  guests:               () => <GuestsDashboard />,
  'guest-segments':     () => <GuestsDashboard />,
  billing:              () => <BillingDashboard />,
  invoices:             () => <BillingDashboard />,
  channels:             () => <ChannelManagerDashboard />,
  'channel-manager':    () => <ChannelManagerDashboard />,
  strategy:             () => <StrategyDashboard />,
  'strategic-intelligence': () => <StrategyDashboard />,
  subscriptions:        () => <SubscriptionDashboard logs={[]} onAddLog={() => {}} />,
  security:             () => <SecurityDashboard logs={[]} onAddLog={() => {}} />,
  energy:               () => <EnergyDashboard />,
  'digital-twin':       () => <DigitalTwinDashboard theme="dark" />,
  'document-vault':     () => <DocumentVaultDashboard />,
  maintenance:          () => <MaintenanceDashboard logs={[]} onAddLog={() => {}} />,
  drones:               () => <DroneDashboard logs={[]} onAddLog={() => {}} />,
  'omni-stream':        () => <OmniStreamDashboard />,
  'admin-center':       () => <AdminCommandCenter theme="dark" onAddLog={() => {}} />,
  'master-switch':      () => <MasterSwitchDashboard onAddLog={() => {}} />,
};

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const activeTab = location.pathname.slice(1) || 'arrivals';
  
  const handleTabChange = (tab: string) => navigate(`/${tab}`);

  const renderDashboard = () => {
    const Dashboard = DASHBOARD_ROUTES[activeTab];
    if (!Dashboard) {
      return (
        <div className="p-8 text-center text-muted">
          <p className="text-4xl mb-4">🚧</p>
          <p className="font-mono text-sm">Section "{activeTab}" — bientôt disponible</p>
        </div>
      );
    }
    
    const content = Dashboard();
    
    if (isTabRestricted(activeTab) && currentUser) {
      return renderWithRBAC({
        tabId: activeTab,
        currentUser,
        onElevate: () => window.dispatchEvent(new CustomEvent('elevate-role')),
        children: content,
      });
    }
    
    return content;
  };

  return (
    <div className="flex min-h-screen app-shell" style={{ backgroundColor: 'var(--bg-primary, #05060A)' }}>
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        collapsed={!sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentUser={currentUser}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          currentUser={currentUser}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={logout}
        />
        
        <main className="flex-1 overflow-auto">
          {renderDashboard()}
        </main>
      </div>
    </div>
  );
}
