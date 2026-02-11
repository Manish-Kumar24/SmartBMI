import React, { useState, useMemo } from 'react';
import {
  X,
  Trash2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Clock,
  TrendingUp,
  BarChart3,
  Table2,
  CalendarDays,
} from 'lucide-react';

import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
  Legend,
} from 'recharts';

import {
  BMIHistoryEntry,
  removeEntry,
  clearAllHistory,
  getCategoryColor,
  getSimpleCategory,
} from '@/lib/bmiHistory';

interface BMIHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: BMIHistoryEntry[];
  onHistoryChange: (entries: BMIHistoryEntry[]) => void;
}

type SortField = 'date' | 'weight' | 'bmi' | 'category';
type SortDir = 'asc' | 'desc';

const BMIHistoryPanel: React.FC<BMIHistoryPanelProps> = ({
  isOpen,
  onClose,
  history,
  onHistoryChange,
}) => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [activeView, setActiveView] = useState<'chart' | 'table'>('chart');
  const [confirmClearAll, setConfirmClearAll] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sortedHistory = useMemo(() => {
    const copy = [...history];
    copy.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'date':
          cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'weight':
          cmp = a.weight - b.weight;
          break;
        case 'bmi':
          cmp = a.bmi - b.bmi;
          break;
        case 'category':
          cmp = a.category.localeCompare(b.category);
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [history, sortField, sortDir]);

  // Chart data: sorted chronologically (oldest first)
  const chartData = useMemo(() => {
    return [...history]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((entry) => ({
        date: new Date(entry.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        fullDate: new Date(entry.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        bmi: parseFloat(entry.bmi.toFixed(1)),
        weight: entry.weight,
        category: getSimpleCategory(entry.category),
      }));
  }, [history]);

  const handleRemove = (id: string) => {
    const updated = removeEntry(id);
    onHistoryChange(updated);
  };

  const handleClearAll = () => {
    if (!confirmClearAll) {
      setConfirmClearAll(true);
      setTimeout(() => setConfirmClearAll(false), 3000);
      return;
    }
    const updated = clearAllHistory();
    onHistoryChange(updated);
    setConfirmClearAll(false);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryBadge = (category: string) => {
    const simple = getSimpleCategory(category);
    const styles: Record<string, string> = {
      Underweight: 'bg-blue-100 text-blue-700',
      Normal: 'bg-emerald-100 text-emerald-700',
      Overweight: 'bg-amber-100 text-amber-700',
      Obese: 'bg-red-100 text-red-700',
    };
    return styles[simple] || 'bg-slate-100 text-slate-700';
  };

  const SortIcon: React.FC<{ field: SortField }> = ({ field }) => {
    if (sortField !== field)
      return <ArrowUpDown className="w-3.5 h-3.5 text-slate-300" />;
    return sortDir === 'asc' ? (
      <ArrowUp className="w-3.5 h-3.5 text-teal-500" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-teal-500" />
    );
  };

  // Stats
  const stats = useMemo(() => {
    if (history.length === 0) return null;
    const bmis = history.map((h) => h.bmi);
    const latest = history.reduce((a, b) =>
      new Date(a.date) > new Date(b.date) ? a : b
    );
    const oldest = history.reduce((a, b) =>
      new Date(a.date) < new Date(b.date) ? a : b
    );
    const change = history.length >= 2 ? latest.bmi - oldest.bmi : 0;
    return {
      count: history.length,
      avg: bmis.reduce((s, v) => s + v, 0) / bmis.length,
      min: Math.min(...bmis),
      max: Math.max(...bmis),
      latest: latest.bmi,
      change,
    };
  }, [history]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-3 text-xs">
          <p className="font-semibold text-slate-700 mb-1">{data.fullDate}</p>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">BMI:</span>
            <span className="font-bold text-slate-800">{data.bmi}</span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getCategoryBadge(data.category)}`}
            >
              {data.category}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-slate-500">Weight:</span>
            <span className="font-bold text-slate-800">{data.weight} kg</span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-8 sm:pt-16 px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-200">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">BMI History</h2>
              <p className="text-xs text-slate-500">
                {history.length} calculation{history.length !== 1 ? 's' : ''} tracked
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  confirmClearAll
                    ? 'bg-red-500 text-white shadow-lg shadow-red-200'
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                {confirmClearAll ? 'Confirm Clear All?' : 'Clear All'}
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Clock className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-400 mb-2">
                No History Yet
              </h3>
              <p className="text-sm text-slate-400 max-w-xs">
                Calculate your BMI and click "Track Progress" to start building your history and tracking trends over time.
              </p>
            </div>
          ) : (
            <>
              {/* Stats Row */}
              {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {[
                    {
                      label: 'Latest BMI',
                      value: stats.latest.toFixed(1),
                      sub: `of ${stats.count} entries`,
                      color: 'text-violet-600',
                      bg: 'bg-violet-50',
                    },
                    {
                      label: 'Average BMI',
                      value: stats.avg.toFixed(1),
                      sub: 'across all entries',
                      color: 'text-blue-600',
                      bg: 'bg-blue-50',
                    },
                    {
                      label: 'BMI Range',
                      value: `${stats.min.toFixed(1)} – ${stats.max.toFixed(1)}`,
                      sub: 'min to max',
                      color: 'text-teal-600',
                      bg: 'bg-teal-50',
                    },
                    {
                      label: 'Overall Change',
                      value: `${stats.change >= 0 ? '+' : ''}${stats.change.toFixed(1)}`,
                      sub: 'first to latest',
                      color:
                        stats.change === 0
                          ? 'text-slate-600'
                          : stats.change > 0
                          ? 'text-red-600'
                          : 'text-emerald-600',
                      bg:
                        stats.change === 0
                          ? 'bg-slate-50'
                          : stats.change > 0
                          ? 'bg-red-50'
                          : 'bg-emerald-50',
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className={`${stat.bg} rounded-xl p-3.5 border border-slate-100`}
                    >
                      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">
                        {stat.label}
                      </p>
                      <p className={`text-lg font-bold ${stat.color}`}>
                        {stat.value}
                      </p>
                      <p className="text-[10px] text-slate-400">{stat.sub}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* View Toggle */}
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex bg-slate-100 rounded-lg p-0.5 gap-0.5">
                  <button
                    onClick={() => setActiveView('chart')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                      activeView === 'chart'
                        ? 'bg-white text-teal-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" />
                    Chart
                  </button>
                  <button
                    onClick={() => setActiveView('table')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                      activeView === 'table'
                        ? 'bg-white text-teal-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Table2 className="w-3.5 h-3.5" />

                    Table
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  {history.length} record{history.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Chart View */}
              {activeView === 'chart' && (
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-4 h-4 text-teal-500" />
                    <h3 className="text-sm font-bold text-slate-700">
                      BMI Trend Over Time
                    </h3>
                  </div>
                  {chartData.length < 2 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <BarChart3 className="w-8 h-8 text-slate-300 mb-2" />
                      <p className="text-sm text-slate-400">
                        Track at least 2 calculations to see your BMI trend chart.
                      </p>
                    </div>
                  ) : (
                    <div className="h-64 sm:h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          data={chartData}
                          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient
                              id="bmiGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#14b8a6"
                                stopOpacity={0.2}
                              />
                              <stop
                                offset="95%"
                                stopColor="#14b8a6"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#e2e8f0"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                            tickLine={false}
                            axisLine={{ stroke: '#e2e8f0' }}
                          />
                          <YAxis
                            domain={['auto', 'auto']}
                            tick={{ fontSize: 11, fill: '#94a3b8' }}
                            tickLine={false}
                            axisLine={false}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Legend
                            verticalAlign="top"
                            height={30}
                            formatter={(value: string) => (
                              <span className="text-xs text-slate-500">{value}</span>
                            )}
                          />
                          {/* Reference lines for BMI zones */}
                          <ReferenceLine
                            y={18.5}
                            stroke="#3b82f6"
                            strokeDasharray="4 4"
                            strokeOpacity={0.5}
                          />
                          <ReferenceLine
                            y={25}
                            stroke="#f59e0b"
                            strokeDasharray="4 4"
                            strokeOpacity={0.5}
                          />
                          <ReferenceLine
                            y={30}
                            stroke="#ef4444"
                            strokeDasharray="4 4"
                            strokeOpacity={0.5}
                          />
                          <Area
                            type="monotone"
                            dataKey="bmi"
                            fill="url(#bmiGradient)"
                            stroke="none"
                            name="BMI Trend"
                          />
                          <Line
                            type="monotone"
                            dataKey="bmi"
                            stroke="#14b8a6"
                            strokeWidth={2.5}
                            dot={{
                              r: 5,
                              fill: '#14b8a6',
                              stroke: '#fff',
                              strokeWidth: 2,
                            }}
                            activeDot={{
                              r: 7,
                              fill: '#0d9488',
                              stroke: '#fff',
                              strokeWidth: 2,
                            }}
                            name="BMI Score"
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  {/* Zone Legend */}
                  <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-slate-200">
                    {[
                      { label: 'Underweight < 18.5', color: '#3b82f6' },
                      { label: 'Normal 18.5–24.9', color: '#10b981' },
                      { label: 'Overweight 25–29.9', color: '#f59e0b' },
                      { label: 'Obese 30+', color: '#ef4444' },
                    ].map((zone, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: zone.color }}
                        />
                        <span className="text-[10px] text-slate-500">
                          {zone.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Table View */}
              {activeView === 'table' && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-200">
                    <button
                      onClick={() => handleSort('date')}
                      className="col-span-3 px-4 py-3 flex items-center gap-1.5 text-left"
                    >
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Date
                      </span>
                      <SortIcon field="date" />
                    </button>
                    <button
                      onClick={() => handleSort('weight')}
                      className="col-span-2 px-3 py-3 flex items-center gap-1.5 text-left"
                    >
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Weight
                      </span>
                      <SortIcon field="weight" />
                    </button>
                    <div className="col-span-2 px-3 py-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Height
                      </span>
                    </div>
                    <button
                      onClick={() => handleSort('bmi')}
                      className="col-span-2 px-3 py-3 flex items-center gap-1.5 text-left"
                    >
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        BMI
                      </span>
                      <SortIcon field="bmi" />
                    </button>
                    <button
                      onClick={() => handleSort('category')}
                      className="col-span-2 px-3 py-3 flex items-center gap-1.5 text-left"
                    >
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Status
                      </span>
                      <SortIcon field="category" />
                    </button>
                    <div className="col-span-1 px-3 py-3" />
                  </div>

                  {/* Table Rows */}
                  <div className="max-h-72 overflow-y-auto">
                    {sortedHistory.map((entry, i) => (
                      <div
                        key={entry.id}
                        className={`grid grid-cols-12 items-center border-b border-slate-50 last:border-b-0 hover:bg-slate-50/70 transition-colors group ${
                          i % 2 === 0 ? '' : 'bg-slate-50/30'
                        }`}
                      >
                        <div className="col-span-3 px-4 py-3">
                          <p className="text-xs font-semibold text-slate-700">
                            {formatDate(entry.date)}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {formatTime(entry.date)}
                          </p>
                        </div>
                        <div className="col-span-2 px-3 py-3">
                          <span className="text-xs font-medium text-slate-700">
                            {entry.weight} kg
                          </span>
                        </div>
                        <div className="col-span-2 px-3 py-3">
                          <span className="text-xs font-medium text-slate-700">
                            {entry.heightFeet}'{entry.heightInches}"
                          </span>
                        </div>
                        <div className="col-span-2 px-3 py-3">
                          <span
                            className="text-sm font-bold"
                            style={{
                              color: getCategoryColor(
                                getSimpleCategory(entry.category)
                              ),
                            }}
                          >
                            {entry.bmi.toFixed(1)}
                          </span>
                        </div>
                        <div className="col-span-2 px-3 py-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${getCategoryBadge(
                              entry.category
                            )}`}
                          >
                            {getSimpleCategory(entry.category)}
                          </span>
                        </div>
                        <div className="col-span-1 px-3 py-3 flex justify-end">
                          <button
                            onClick={() => handleRemove(entry.id)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all duration-200"
                            title="Remove entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Card View for small screens (table alternative) */}
              {activeView === 'table' && (
                <div className="sm:hidden mt-4 space-y-2">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium mb-2">
                    Mobile view — scroll table above or view cards below
                  </p>
                  {sortedHistory.slice(0, 10).map((entry) => (
                    <div
                      key={`mobile-${entry.id}`}
                      className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-medium text-slate-600">
                            {formatDate(entry.date)}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemove(entry.id)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-[10px] text-slate-400">Weight</p>
                            <p className="text-xs font-semibold text-slate-700">
                              {entry.weight} kg
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400">Height</p>
                            <p className="text-xs font-semibold text-slate-700">
                              {entry.heightFeet}'{entry.heightInches}"
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className="text-lg font-black"
                            style={{
                              color: getCategoryColor(
                                getSimpleCategory(entry.category)
                              ),
                            }}
                          >
                            {entry.bmi.toFixed(1)}
                          </p>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${getCategoryBadge(
                              entry.category
                            )}`}
                          >
                            {getSimpleCategory(entry.category)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BMIHistoryPanel;
