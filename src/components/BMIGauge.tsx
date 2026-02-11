import React from 'react';

interface BMIGaugeProps {
  bmi: number | null;
}

const BMIGauge: React.FC<BMIGaugeProps> = ({ bmi }) => {
  const categories = [
    { label: 'Underweight', range: '< 18.5', color: 'from-blue-400 to-blue-500', bgColor: 'bg-blue-400', min: 0, max: 18.5 },
    { label: 'Normal', range: '18.5 - 24.9', color: 'from-emerald-400 to-emerald-500', bgColor: 'bg-emerald-400', min: 18.5, max: 24.9 },
    { label: 'Overweight', range: '25 - 29.9', color: 'from-amber-400 to-amber-500', bgColor: 'bg-amber-400', min: 25, max: 29.9 },
    { label: 'Obese I', range: '30 - 34.9', color: 'from-orange-400 to-orange-500', bgColor: 'bg-orange-400', min: 30, max: 34.9 },
    { label: 'Obese II', range: '35 - 39.9', color: 'from-red-400 to-red-500', bgColor: 'bg-red-400', min: 35, max: 39.9 },
    { label: 'Obese III', range: '40+', color: 'from-red-600 to-red-700', bgColor: 'bg-red-600', min: 40, max: 50 },
  ];

  // Calculate pointer position (0-100%)
  const getPointerPosition = () => {
    if (!bmi) return -1;
    const clampedBmi = Math.min(Math.max(bmi, 10), 50);
    return ((clampedBmi - 10) / 40) * 100;
  };

  const pointerPos = getPointerPosition();

  const getActiveCategory = () => {
    if (!bmi) return -1;
    return categories.findIndex(cat => bmi >= cat.min && bmi < cat.max + 0.1);
  };

  const activeIndex = getActiveCategory();

  return (
    <div className="w-full mt-6">
      {/* Gauge bar */}
      <div className="relative mb-8">
        <div className="flex h-4 rounded-full overflow-hidden shadow-inner">
          {categories.map((cat, i) => (
            <div
              key={i}
              className={`flex-1 bg-gradient-to-r ${cat.color} ${activeIndex === i ? 'ring-2 ring-white ring-inset opacity-100' : 'opacity-70'} transition-all duration-500`}
            />
          ))}
        </div>

        {/* Pointer */}
        {bmi && pointerPos >= 0 && (
          <div
            className="absolute top-0 transition-all duration-700 ease-out"
            style={{ left: `${pointerPos}%`, transform: 'translateX(-50%)' }}
          >
            <div className="relative">
              {/* Arrow pointing down */}
              <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[10px] border-l-transparent border-r-transparent border-t-slate-800 mx-auto -mb-[2px] -mt-[12px]" />
              {/* BMI value bubble */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                {bmi.toFixed(1)}
              </div>
            </div>
          </div>
        )}

        {/* Scale labels */}
        <div className="flex justify-between mt-2 px-1">
          <span className="text-[10px] text-slate-400">10</span>
          <span className="text-[10px] text-slate-400">18.5</span>
          <span className="text-[10px] text-slate-400">25</span>
          <span className="text-[10px] text-slate-400">30</span>
          <span className="text-[10px] text-slate-400">35</span>
          <span className="text-[10px] text-slate-400">40</span>
          <span className="text-[10px] text-slate-400">50</span>
        </div>
      </div>

      {/* Category legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {categories.map((cat, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
              activeIndex === i
                ? 'bg-white shadow-md ring-1 ring-slate-200 scale-105'
                : 'bg-slate-50/50'
            }`}
          >
            <div className={`w-3 h-3 rounded-full ${cat.bgColor} flex-shrink-0 ${activeIndex === i ? 'ring-2 ring-offset-1 ring-slate-300' : ''}`} />
            <div className="min-w-0">
              <p className={`text-xs font-semibold truncate ${activeIndex === i ? 'text-slate-800' : 'text-slate-500'}`}>
                {cat.label}
              </p>
              <p className="text-[10px] text-slate-400">{cat.range}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BMIGauge;
