import React from 'react';
import { useFetchData } from '../hooks/useFetchData';
import { fetchDashboardData } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Loader, ErrorState } from '../components/ui/Loader';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Component, ActivitySquare, Database } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const StatCard = ({ title, value, icon: Icon, colorClass, delay = 0 }) => (
  <div className={`rise-in`} style={{ animationDelay: `${delay}ms` }}>
    <Card className="hover:shadow-lg group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`p-2.5 rounded-xl ${colorClass} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={18} className="text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <div className="h-1 w-12 mt-3 rounded-full bg-gradient-to-r from-accent/60 to-transparent" />
      </CardContent>
    </Card>
  </div>
);

const Dashboard = () => {
  const { data, loading, error, refetch } = useFetchData(fetchDashboardData);
  const { t } = useTranslation();

  if (loading) return <Loader message={t('extractingDashboard')} />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <div className="space-y-6 lg:space-y-8 perspective-container">
      <div className="rise-in">
        <h2 className="text-2xl font-bold tracking-tight">{t('dashboardOverview')}</h2>
        <p className="text-muted-foreground mt-1 text-sm">{t('etlPipelineSummary')}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title={t('totalWarehouses')} 
          value={data.summaries.totalWarehouses} 
          icon={Component} 
          colorClass="bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30"
          delay={50}
        />
        <StatCard 
          title={t('totalEmployees')} 
          value={data.summaries.totalEmployees} 
          icon={Users} 
          colorClass="bg-gradient-to-br from-purple-500 to-purple-600 shadow-purple-500/30"
          delay={100}
        />
        <StatCard 
          title={t('activeBackorders')} 
          value={data.summaries.activeBackorders} 
          icon={ActivitySquare} 
          colorClass="bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-500/30"
          delay={150}
        />
        <StatCard 
          title={t('totalParts')} 
          value={data.summaries.totalParts} 
          icon={Database} 
          colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-emerald-500/30"
          delay={200}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rise-in" style={{ animationDelay: '250ms' }}>
          <Card>
            <CardHeader>
              <CardTitle>{t('backordersOverview')}</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.backordersOverTime}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="name" className="text-xs" tickLine={false} axisLine={false} />
                  <YAxis className="text-xs" tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    activeDot={{ r: 7, strokeWidth: 3, fill: 'hsl(var(--card))' }} 
                    dot={{ r: 4, fill: 'hsl(var(--card))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="rise-in" style={{ animationDelay: '300ms' }}>
          <Card>
            <CardHeader>
              <CardTitle>{t('partsDistribution')}</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.partsPerWarehouse}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" vertical={false} />
                  <XAxis dataKey="name" className="text-xs" tickLine={false} axisLine={false} />
                  <YAxis className="text-xs" tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', minWidth:'100px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
                    cursor={{ fill: 'hsl(var(--muted) / 0.3)' }}
                  />
                  <Bar dataKey="parts" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
