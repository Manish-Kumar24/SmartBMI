import React from 'react';
import { TrendingDown, TrendingUp, Minus, ArrowUp } from 'lucide-react';

const bmiData = [
  { category: 'Severe Thinness', range: '< 16', risk: 'High', icon: <TrendingDown className="w-4 h-4" />, color: 'bg-blue-600', textColor: 'text-blue-600', lightBg: 'bg-blue-50' },
  { category: 'Moderate Thinness', range: '16 - 16.9', risk: 'Moderate', icon: <TrendingDown className="w-4 h-4" />, color: 'bg-blue-400', textColor: 'text-blue-500', lightBg: 'bg-blue-50' },
  { category: 'Mild Thinness', range: '17 - 18.4', risk: 'Low', icon: <TrendingDown className="w-4 h-4" />, color: 'bg-blue-300', textColor: 'text-blue-400', lightBg: 'bg-blue-50' },
  { category: 'Normal', range: '18.5 - 24.9', risk: 'Low', icon: <Minus className="w-4 h-4" />, color: 'bg-emerald-500', textColor: 'text-emerald-600', lightBg: 'bg-emerald-50' },
  { category: 'Overweight', range: '25 - 29.9', risk: 'Increased', icon: <TrendingUp className="w-4 h-4" />, color: 'bg-amber-400', textColor: 'text-amber-600', lightBg: 'bg-amber-50' },
  { category: 'Obese Class I', range: '30 - 34.9', risk: 'High', icon: <TrendingUp className="w-4 h-4" />, color: 'bg-orange-500', textColor: 'text-orange-600', lightBg: 'bg-orange-50' },
  { category: 'Obese Class II', range: '35 - 39.9', risk: 'Very High', icon: <ArrowUp className="w-4 h-4" />, color: 'bg-red-500', textColor: 'text-red-600', lightBg: 'bg-red-50' },
  { category: 'Obese Class III', range: '40+', risk: 'Extremely High', icon: <ArrowUp className="w-4 h-4" />, color: 'bg-red-700', textColor: 'text-red-700', lightBg: 'bg-red-50' },
];

const BMIChart: React.FC = () => {
  return (
    <div id="chart" className="w-full">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-4">
          <TrendingUp className="w-4 h-4" />
          Reference Chart
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-3">
          BMI Classification Table
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          The World Health Organization (WHO) BMI classification for adults. Use this table to understand what different BMI ranges mean for your health.
        </p>
      </div>

      {/* Table */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-4 bg-slate-50 border-b border-slate-200">
            <div className="px-4 sm:px-6 py-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</span>
            </div>
            <div className="px-4 sm:px-6 py-4 text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">BMI Range</span>
            </div>
            <div className="px-4 sm:px-6 py-4 text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Health Risk</span>
            </div>
            <div className="px-4 sm:px-6 py-4 text-center">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Indicator</span>
            </div>
          </div>

          {/* Rows */}
          {bmiData.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-4 items-center border-b border-slate-50 last:border-b-0 hover:bg-slate-50/50 transition-colors duration-150 ${
                row.category === 'Normal' ? 'bg-emerald-50/30' : ''
              }`}
            >
              <div className="px-4 sm:px-6 py-3.5 flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${row.color} flex-shrink-0`} />
                <span className="text-sm font-medium text-slate-700 truncate">{row.category}</span>
              </div>
              <div className="px-4 sm:px-6 py-3.5 text-center">
                <span className="text-sm font-mono text-slate-600">{row.range}</span>
              </div>
              <div className="px-4 sm:px-6 py-3.5 text-center">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${row.lightBg} ${row.textColor}`}>
                  {row.risk}
                </span>
              </div>
              <div className="px-4 sm:px-6 py-3.5 flex justify-center">
                <div className={`${row.textColor}`}>
                  {row.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <p className="text-xs text-slate-400 text-center mt-4 max-w-lg mx-auto">
          Source: World Health Organization (WHO). These classifications apply to adults aged 20 years and older. Different thresholds may apply for children, adolescents, and certain ethnic groups.
        </p>
      </div>
    </div>
  );
};

export default BMIChart;
