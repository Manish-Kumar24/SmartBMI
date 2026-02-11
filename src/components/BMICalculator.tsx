import React, { useState, useCallback, useEffect } from 'react';
import { Calculator, RotateCcw, ArrowRight, Scale, Ruler, TrendingUp, Bookmark, Clock, CheckCircle } from 'lucide-react';
import BMIGauge from './BMIGauge';
import HealthRecommendations from './HealthRecommendations';
import BMIHistoryPanel from './BMIHistoryPanel';
import { BMIHistoryEntry, addEntry, loadHistory } from '@/lib/bmiHistory';

interface BMIResult {
  bmi: number;
  category: string;
  categoryColor: string;
  idealWeightMin: number;
  idealWeightMax: number;
}

const BMICalculator: React.FC = () => {
  const [weight, setWeight] = useState('');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [result, setResult] = useState<BMIResult | null>(null);
  const [errors, setErrors] = useState<{ weight?: string; feet?: string; inches?: string }>({});
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [history, setHistory] = useState<BMIHistoryEntry[]>([]);
  const [saved, setSaved] = useState(false);

  // Load history on mount
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const getCategory = (bmi: number): { category: string; color: string } => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-500' };
    if (bmi < 25) return { category: 'Normal', color: 'text-emerald-500' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-amber-500' };
    if (bmi < 35) return { category: 'Obese Class I', color: 'text-orange-500' };
    if (bmi < 40) return { category: 'Obese Class II', color: 'text-red-500' };
    return { category: 'Obese Class III', color: 'text-red-700' };
  };

  const getCategoryBg = (category: string): string => {
    if (category === 'Underweight') return 'bg-blue-50 border-blue-200';
    if (category === 'Normal') return 'bg-emerald-50 border-emerald-200';
    if (category === 'Overweight') return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  const getCategoryRingColor = (category: string): string => {
    if (category === 'Underweight') return 'ring-blue-400';
    if (category === 'Normal') return 'ring-emerald-400';
    if (category === 'Overweight') return 'ring-amber-400';
    return 'ring-red-400';
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    const w = parseFloat(weight);
    const f = parseInt(feet);
    const i = parseInt(inches);

    if (!weight || isNaN(w) || w <= 0) {
      newErrors.weight = 'Please enter a valid weight';
    } else if (w < 20 || w > 300) {
      newErrors.weight = 'Weight must be between 20-300 kg';
    }

    if (!feet || isNaN(f) || f < 0) {
      newErrors.feet = 'Please enter valid feet';
    } else if (f < 1 || f > 8) {
      newErrors.feet = 'Feet must be between 1-8';
    }

    if (inches === '' || isNaN(i) || i < 0 || i > 11) {
      newErrors.inches = 'Inches must be 0-11';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateBMI = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsCalculating(true);
    setSaved(false);

    // Simulate brief calculation animation
    setTimeout(() => {
      const w = parseFloat(weight);
      const f = parseInt(feet);
      const i = parseInt(inches) || 0;

      // Convert feet and inches to meters
      const totalInches = f * 12 + i;
      const heightInMeters = totalInches * 0.0254;

      // BMI = weight(kg) / height(m)^2
      const bmi = w / (heightInMeters * heightInMeters);
      const { category, color } = getCategory(bmi);

      // Calculate ideal weight range (BMI 18.5-24.9)
      const idealMin = 18.5 * heightInMeters * heightInMeters;
      const idealMax = 24.9 * heightInMeters * heightInMeters;

      setResult({
        bmi,
        category,
        categoryColor: color,
        idealWeightMin: idealMin,
        idealWeightMax: idealMax,
      });
      setHasCalculated(true);
      setIsCalculating(false);
    }, 600);
  }, [weight, feet, inches]);

  const handleReset = () => {
    setWeight('');
    setFeet('');
    setInches('');
    setResult(null);
    setErrors({});
    setHasCalculated(false);
    setSaved(false);
  };

  const handleTrackProgress = () => {
    if (!result || saved) return;
    const w = parseFloat(weight);
    const f = parseInt(feet);
    const i = parseInt(inches) || 0;

    const updated = addEntry({
      weight: w,
      heightFeet: f,
      heightInches: i,
      bmi: result.bmi,
      category: result.category,
    });
    setHistory(updated);
    setSaved(true);
    // Auto-reset saved indicator after 3 seconds
    setTimeout(() => setSaved(false), 3000);
  };

  const simpleCategory = result?.category.startsWith('Obese') ? 'Obese' : result?.category || '';

  return (
    <div id="calculator" className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Input Form */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 relative overflow-hidden">
          {/* Decorative gradient */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400" />

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-200">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Calculate Your BMI</h2>
                <p className="text-sm text-slate-500">Enter your measurements below</p>
              </div>
            </div>
            {/* History Button */}
            <button
              onClick={() => setHistoryOpen(true)}
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-600 text-xs font-semibold transition-all duration-200 active:scale-[0.97]"
            >
              <Clock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">History</span>
              {history.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-violet-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {history.length > 99 ? '99+' : history.length}
                </span>
              )}
            </button>
          </div>

          <form onSubmit={calculateBMI} className="space-y-5">
            {/* Weight Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Scale className="w-4 h-4 text-teal-500" />
                Weight (kg)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.target.value);
                    if (errors.weight) setErrors(prev => ({ ...prev, weight: undefined }));
                  }}
                  placeholder="e.g., 70"
                  className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-200 text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-100 ${
                    errors.weight ? 'border-red-300 bg-red-50/50' : 'border-slate-200 hover:border-slate-300 focus:border-teal-400'
                  }`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">kg</span>
              </div>
              {errors.weight && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-500" />
                  {errors.weight}
                </p>
              )}
            </div>

            {/* Height Input */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                <Ruler className="w-4 h-4 text-teal-500" />
                Height
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="relative">
                    <input
                      type="number"
                      value={feet}
                      onChange={(e) => {
                        setFeet(e.target.value);
                        if (errors.feet) setErrors(prev => ({ ...prev, feet: undefined }));
                      }}
                      placeholder="5"
                      className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-200 text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-100 ${
                        errors.feet ? 'border-red-300 bg-red-50/50' : 'border-slate-200 hover:border-slate-300 focus:border-teal-400'
                      }`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">ft</span>
                  </div>
                  {errors.feet && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-500" />
                      {errors.feet}
                    </p>
                  )}
                </div>
                <div>
                  <div className="relative">
                    <input
                      type="number"
                      value={inches}
                      onChange={(e) => {
                        setInches(e.target.value);
                        if (errors.inches) setErrors(prev => ({ ...prev, inches: undefined }));
                      }}
                      placeholder="8"
                      className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-200 text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-teal-100 ${
                        errors.inches ? 'border-red-300 bg-red-50/50' : 'border-slate-200 hover:border-slate-300 focus:border-teal-400'
                      }`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">in</span>
                  </div>
                  {errors.inches && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-red-500" />
                      {errors.inches}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isCalculating}
                className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-300 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isCalculating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    Calculate BMI
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              {hasCalculated && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-3.5 rounded-xl border-2 border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 flex items-center gap-2 active:scale-[0.98]"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}
            </div>
          </form>

          {/* Quick reference */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">Quick Reference</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Underweight', color: 'bg-blue-100 text-blue-600' },
                { label: 'Normal', color: 'bg-emerald-100 text-emerald-600' },
                { label: 'Overweight', color: 'bg-amber-100 text-amber-600' },
                { label: 'Obese', color: 'bg-red-100 text-red-600' },
              ].map((item) => (
                <span key={item.label} className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.color}`}>
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className={`transition-all duration-500 ${result ? 'opacity-100 translate-y-0' : 'opacity-60'}`}>
          {result ? (
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 relative overflow-hidden">
              {/* Decorative gradient matching category */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                simpleCategory === 'Underweight' ? 'bg-gradient-to-r from-blue-400 to-cyan-400' :
                simpleCategory === 'Normal' ? 'bg-gradient-to-r from-emerald-400 to-green-400' :
                simpleCategory === 'Overweight' ? 'bg-gradient-to-r from-amber-400 to-yellow-400' :
                'bg-gradient-to-r from-red-400 to-orange-400'
              }`} />

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                    simpleCategory === 'Underweight' ? 'bg-gradient-to-br from-blue-400 to-cyan-500 shadow-blue-200' :
                    simpleCategory === 'Normal' ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-emerald-200' :
                    simpleCategory === 'Overweight' ? 'bg-gradient-to-br from-amber-400 to-yellow-500 shadow-amber-200' :
                    'bg-gradient-to-br from-red-400 to-orange-500 shadow-red-200'
                  }`}>
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Your Results</h2>
                    <p className="text-sm text-slate-500">Based on your measurements</p>
                  </div>
                </div>
              </div>

              {/* BMI Score Display */}
              <div className="text-center mb-6">
                <div className={`inline-flex flex-col items-center justify-center w-36 h-36 rounded-full border-4 ${getCategoryBg(simpleCategory)} ${getCategoryRingColor(simpleCategory)} ring-4 ring-offset-4 transition-all duration-500`}>
                  <span className="text-4xl font-black text-slate-800">{result.bmi.toFixed(1)}</span>
                  <span className="text-xs font-medium text-slate-500 mt-1">BMI Score</span>
                </div>
                <div className="mt-4">
                  <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${result.categoryColor} ${getCategoryBg(simpleCategory)} border`}>
                    {result.category}
                  </span>
                </div>
              </div>

              {/* Track Progress Button */}
              <button
                onClick={handleTrackProgress}
                disabled={saved}
                className={`w-full mb-4 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] ${
                  saved
                    ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-200 cursor-default'
                    : 'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300'
                }`}
              >
                {saved ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Saved to History
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    Track Progress
                  </>
                )}
              </button>

              {/* Ideal Weight Range */}
              <div className="bg-slate-50 rounded-xl p-4 mb-4">
                <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Ideal Weight Range for Your Height</p>
                <p className="text-lg font-bold text-slate-800">
                  {result.idealWeightMin.toFixed(1)} kg — {result.idealWeightMax.toFixed(1)} kg
                </p>
                {simpleCategory !== 'Normal' && (
                  <p className="text-xs text-slate-500 mt-1">
                    {result.bmi < 18.5
                      ? `You need to gain approximately ${(result.idealWeightMin - parseFloat(weight)).toFixed(1)} kg to reach a healthy BMI.`
                      : `You need to lose approximately ${(parseFloat(weight) - result.idealWeightMax).toFixed(1)} kg to reach a healthy BMI.`
                    }
                  </p>
                )}
              </div>

              {/* BMI Gauge */}
              <BMIGauge bmi={result.bmi} />

              {/* View History Link */}
              {history.length > 0 && (
                <button
                  onClick={() => setHistoryOpen(true)}
                  className="w-full mt-4 py-2.5 rounded-xl border-2 border-dashed border-violet-200 text-violet-500 hover:bg-violet-50 hover:border-violet-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200"
                >
                  <Clock className="w-3.5 h-3.5" />
                  View {history.length} Past Calculation{history.length !== 1 ? 's' : ''}
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-slate-200 p-6 sm:p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
                <TrendingUp className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-400 mb-2">Your Results Will Appear Here</h3>
              <p className="text-sm text-slate-400 max-w-xs mb-6">
                Enter your weight and height, then click "Calculate BMI" to see your health assessment.
              </p>
              {history.length > 0 && (
                <button
                  onClick={() => setHistoryOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-600 text-sm font-semibold flex items-center gap-2 transition-all duration-200"
                >
                  <Clock className="w-4 h-4" />
                  View Past Calculations ({history.length})
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Health Recommendations (Full Width Below) */}
      {result && (
        <HealthRecommendations bmi={result.bmi} category={simpleCategory} />
      )}

      {/* History Panel Modal */}
      <BMIHistoryPanel
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onHistoryChange={setHistory}
      />
    </div>
  );
};

export default BMICalculator;
