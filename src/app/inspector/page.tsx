'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const colors = {
  navy: '#0B1F3A', navyLight: '#142235', gold: '#C9A24A', goldLight: '#D4B366',
  white: '#FFFFFF', gray: '#6B7280', grayLight: '#E5E7EB', grayLighter: '#F3F4F6',
  green: '#10B981', greenLight: '#D1FAE5', red: '#EF4444', redLight: '#FEE2E2',
  blue: '#3B82F6', blueLight: '#DBEAFE', amber: '#F59E0B', amberLight: '#FEF3C7',
  purple: '#8B5CF6', purpleLight: '#EDE9FE',
};

export default function InspectorDashboard() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/inspection/dashboard');
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setData(result.data);
          setLastSync(new Date());
        }
      }
    } catch (err) {
      console.error('Failed to fetch inspection data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    if (['passed', 'completed', 'approved'].includes(status)) return colors.green;
    if (['failed', 'rejected'].includes(status)) return colors.red;
    if (['in_progress', 'sample_collected', 'lab_processing'].includes(status)) return colors.blue;
    if (['scheduled', 'accepted'].includes(status)) return colors.purple;
    return colors.gray;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: colors.grayLighter }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: colors.navy }}>Loading Inspection Portal</h2>
        </div>
      </div>
    );
  }

  // Mock data for demo
  const mockData = {
    inspector: { full_name: 'Ahmed Ibrahim', email: 'ahmed@sgs-ng.com' },
    kpis: { todayJobs: 3, assigned: 5, inProgress: 2, pendingReports: 1, completed: 47, passRate: 94 },
    assignments: [
      { id: '1', inspectionNumber: 'INSP-2026-00482', type: 'PRE_SHIPMENT', status: 'scheduled', scheduledAt: '2026-08-30T10:30:00', location: 'Kano Industrial Area', commodity: 'Soybean', quantity: '500 MT', exporter: 'Kaduna Cashew Ltd', buyer: 'Al Rajhi Foods' },
      { id: '2', inspectionNumber: 'INSP-2026-00483', type: 'QUALITY', status: 'accepted', scheduledAt: '2026-08-30T14:00:00', location: 'Lagos Port Warehouse', commodity: 'Sesame', quantity: '1000 MT', exporter: 'Nigerian Sesame Co.', buyer: 'Jeddah Trading' },
      { id: '3', inspectionNumber: 'INSP-2026-00484', type: 'PRE_SHIPMENT', status: 'requested', scheduledAt: '2026-08-31T09:00:00', location: 'Kaduna Processing Plant', commodity: 'Cashew', quantity: '200 MT', exporter: 'Kaduna Cashew Ltd', buyer: 'DCT Dubai' },
    ],
    inspections: [
      { id: '1', inspectionNumber: 'INSP-2026-00480', status: 'in_progress', startedAt: '2026-08-29T08:00:00', location: 'Lagos Warehouse', commodity: 'Sesame', progress: 75 },
      { id: '2', inspectionNumber: 'INSP-2026-00481', status: 'sample_collected', location: 'Kano Factory', commodity: 'Soybean', progress: 45 },
    ],
    exceptions: [
      { id: '1', type: 'quality_variance', severity: 'high', description: 'Moisture content above specification', transactionNumber: 'MAS-SES-2026-000002' },
    ],
  };

  const displayData = data || mockData;

  return (
    <>
      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        @media (max-width: 767px) {
          .desktop-only { display: none !important; }
          .mobile-bottom-nav { display: flex !important; }
        }
        @media (min-width: 768px) {
          .mobile-only { display: none !important; }
          .mobile-bottom-nav { display: none !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', background: colors.grayLighter, paddingBottom: isMobile ? '70px' : '0' }}>
        {/* Header */}
        <div style={{ 
          background: colors.navy, 
          padding: isMobile ? '12px 16px' : '16px 24px',
          position: 'sticky', top: 0, zIndex: 100
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: colors.white }}>MASAR</span>
                <span style={{ fontSize: '11px', color: colors.gold, padding: '2px 6px', background: 'rgba(201,162,74,0.2)', borderRadius: '4px' }}>Inspection</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: isOnline ? colors.green : colors.red }} />
                <span style={{ fontSize: '11px', color: colors.gray }}>
                  {isOnline ? 'Online' : `Offline • Last sync: ${lastSync?.toLocaleTimeString() || 'Never'}`}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>🔔</button>
              <button style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>☰</button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ padding: isMobile ? '16px' : '24px 32px', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Greeting */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: isMobile ? '24px' : '28px', fontWeight: 700, color: colors.navy, margin: '0 0 4px 0' }}>
              {getGreeting()}, {displayData.inspector?.full_name?.split(' ')[0] || 'Inspector'}
            </h1>
            <p style={{ fontSize: '14px', color: colors.gray }}>Here's your inspection overview for today</p>
          </div>

          {/* KPI Cards - Horizontal scroll on mobile */}
          <div style={{ 
            display: 'flex', 
            gap: '12px', 
            overflowX: 'auto', 
            paddingBottom: '8px',
            marginBottom: '24px',
            WebkitOverflowScrolling: 'touch'
          }}>
            {[
              { label: "Today's Jobs", value: displayData.kpis.todayJobs, icon: '📋', color: colors.blue },
              { label: 'Assigned', value: displayData.kpis.assigned, icon: '📌', color: colors.purple },
              { label: 'In Progress', value: displayData.kpis.inProgress, icon: '🔄', color: colors.amber },
              { label: 'Pending Reports', value: displayData.kpis.pendingReports, icon: '📝', color: colors.amber },
              { label: 'Completed', value: displayData.kpis.completed, icon: '✅', color: colors.green },
              { label: 'Pass Rate', value: `${displayData.kpis.passRate}%`, icon: '📊', color: colors.green },
            ].map((kpi, i) => (
              <div key={i} style={{
                minWidth: '140px',
                padding: '16px',
                background: colors.white,
                borderRadius: '12px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                borderTop: `3px solid ${kpi.color}`,
                flexShrink: 0
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: colors.gray }}>{kpi.label}</span>
                  <span style={{ fontSize: '16px' }}>{kpi.icon}</span>
                </div>
                <p style={{ fontSize: '28px', fontWeight: 700, color: colors.navy, margin: 0 }}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Next Inspection Card */}
          {displayData.assignments.length > 0 && (
            <div style={{
              background: `linear-gradient(135deg, ${colors.navy} 0%, ${colors.navyLight} 100%)`,
              borderRadius: '16px',
              padding: isMobile ? '20px' : '24px',
              marginBottom: '24px',
              color: colors.white
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', color: colors.gold, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Inspection</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '4px 0 0 0' }}>
                    {displayData.assignments[0].inspectionNumber}
                  </h3>
                </div>
                <span style={{
                  padding: '4px 10px',
                  background: colors.amber,
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 600
                }}>
                  {displayData.assignments[0].type.replace(/_/g, ' ')}
                </span>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: colors.gray, margin: 0 }}>Product</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>{displayData.assignments[0].commodity} • {displayData.assignments[0].quantity}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: colors.gray, margin: 0 }}>Exporter</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>{displayData.assignments[0].exporter}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: colors.gray, margin: 0 }}>Location</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>📍 {displayData.assignments[0].location}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: colors.gray, margin: 0 }}>Time</p>
                  <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>🕐 {formatTime(displayData.assignments[0].scheduledAt)}</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{
                  flex: 1,
                  padding: '14px',
                  background: colors.gold,
                  color: colors.navy,
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}>
                  🗺️ Start Navigation
                </button>
                <button style={{
                  padding: '14px 20px',
                  background: 'rgba(255,255,255,0.15)',
                  color: colors.white,
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>
                  View
                </button>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.navy, margin: '0 0 12px 0' }}>Quick Actions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '12px' }}>
              {[
                { icon: '📋', label: 'Start Inspection', color: colors.blue, action: () => {} },
                { icon: '📷', label: 'Capture Evidence', color: colors.green, action: () => {} },
                { icon: '🔍', label: 'Scan QR', color: colors.purple, action: () => {} },
                { icon: '📝', label: 'Submit Report', color: colors.amber, action: () => {} },
              ].map((action, i) => (
                <button key={i} onClick={action.action} style={{
                  padding: isMobile ? '20px 16px' : '16px',
                  background: colors.white,
                  border: `2px solid ${action.color}20`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s'
                }}>
                  <span style={{ fontSize: '28px' }}>{action.icon}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: colors.navy }}>{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Inspections */}
          {displayData.inspections.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.navy, margin: '0 0 12px 0' }}>Active Inspections</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {displayData.inspections.map((insp: any) => (
                  <div key={insp.id} style={{
                    background: colors.white,
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                    borderLeft: `4px solid ${getStatusColor(insp.status)}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <p style={{ fontSize: '15px', fontWeight: 600, color: colors.navy, margin: 0 }}>{insp.inspectionNumber}</p>
                        <p style={{ fontSize: '12px', color: colors.gray, margin: '2px 0 0 0' }}>{insp.commodity} • {insp.location}</p>
                      </div>
                      <span style={{
                        padding: '3px 8px',
                        background: getStatusColor(insp.status) + '20',
                        color: getStatusColor(insp.status),
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: 600
                      }}>
                        {insp.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: colors.grayLight, borderRadius: '3px' }}>
                      <div style={{ width: `${insp.progress}%`, height: '100%', background: colors.green, borderRadius: '3px' }} />
                    </div>
                    <p style={{ fontSize: '11px', color: colors.gray, margin: '6px 0 0 0' }}>{insp.progress}% complete</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Assignments */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.navy, margin: 0 }}>Upcoming Assignments</h3>
              <button style={{ background: 'none', border: 'none', color: colors.blue, fontSize: '13px', cursor: 'pointer' }}>View All</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {displayData.assignments.map((assignment: any) => (
                <div key={assignment.id} style={{
                  background: colors.white,
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: colors.navy, margin: 0 }}>{assignment.inspectionNumber}</p>
                      <p style={{ fontSize: '12px', color: colors.gray, margin: '2px 0 0 0' }}>{assignment.commodity} • {assignment.quantity}</p>
                    </div>
                    <span style={{
                      padding: '3px 8px',
                      background: assignment.status === 'scheduled' ? colors.blueLight : colors.amberLight,
                      color: assignment.status === 'scheduled' ? colors.blue : colors.amber,
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 600
                    }}>
                      {assignment.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: colors.gray }}>
                    <span>📍 {assignment.location}</span>
                    <span>🕐 {formatTime(assignment.scheduledAt)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: colors.gray, marginTop: '4px' }}>
                    <span>📦 {assignment.exporter}</span>
                    <span>🛒 {assignment.buyer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Exceptions */}
          {displayData.exceptions.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: colors.navy, margin: '0 0 12px 0' }}>
                Exceptions
                <span style={{
                  marginLeft: '8px',
                  padding: '2px 8px',
                  background: colors.redLight,
                  color: colors.red,
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 600
                }}>
                  {displayData.exceptions.length}
                </span>
              </h3>
              {displayData.exceptions.map((exc: any) => (
                <div key={exc.id} style={{
                  background: colors.white,
                  borderRadius: '12px',
                  padding: '16px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  borderLeft: `4px solid ${colors.red}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '10px', fontWeight: 600, color: colors.red, textTransform: 'uppercase' }}>{exc.severity}</span>
                    <span style={{ fontSize: '11px', color: colors.gray }}>{exc.transactionNumber}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: colors.navy, margin: 0 }}>{exc.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="mobile-bottom-nav" style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: colors.white,
          borderTop: `1px solid ${colors.grayLight}`,
          display: 'none',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: '8px 0',
          zIndex: 100,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)'
        }}>
          {[
            { id: 'home', icon: '🏠', label: 'Home' },
            { id: 'assignments', icon: '📋', label: 'Jobs' },
            { id: 'scan', icon: '📷', label: 'Scan', primary: true },
            { id: 'alerts', icon: '🔔', label: 'Alerts' },
            { id: 'profile', icon: '👤', label: 'Me' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 12px',
              minWidth: '60px'
            }}>
              <span style={{
                fontSize: tab.primary ? '28px' : '20px',
                background: tab.primary ? colors.navy : 'transparent',
                color: tab.primary ? colors.white : colors.gray,
                width: tab.primary ? '48px' : 'auto',
                height: tab.primary ? '48px' : 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: tab.primary ? '50%' : '0',
                boxShadow: tab.primary ? '0 4px 12px rgba(11,31,58,0.3)' : 'none'
              }}>
                {tab.icon}
              </span>
              <span style={{
                fontSize: '10px',
                color: activeTab === tab.id ? colors.navy : colors.gray,
                fontWeight: activeTab === tab.id ? 600 : 400
              }}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
