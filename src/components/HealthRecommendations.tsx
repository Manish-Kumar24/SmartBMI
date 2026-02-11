import React from 'react';
import { Heart, Apple, Dumbbell, Moon, Droplets, Brain, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface HealthRecommendationsProps {
  bmi: number | null;
  category: string;
}

interface Recommendation {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const HealthRecommendations: React.FC<HealthRecommendationsProps> = ({ bmi, category }) => {
  if (!bmi) return null;

  const getStatusConfig = () => {
    switch (category) {
      case 'Underweight':
        return {
          color: 'blue',
          bgGradient: 'from-blue-50 to-cyan-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-700',
          badgeBg: 'bg-blue-100',
          icon: <Info className="w-5 h-5 text-blue-500" />,
          title: 'You are Underweight',
          summary: 'Your BMI indicates you may be underweight. This could be associated with nutritional deficiencies, weakened immunity, and other health concerns. Consider consulting a healthcare professional.',
        };
      case 'Normal':
        return {
          color: 'emerald',
          bgGradient: 'from-emerald-50 to-green-50',
          borderColor: 'border-emerald-200',
          textColor: 'text-emerald-700',
          badgeBg: 'bg-emerald-100',
          icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
          title: 'Healthy Weight',
          summary: 'Congratulations! Your BMI falls within the healthy range. Maintaining this weight reduces your risk of developing serious health conditions. Keep up your healthy lifestyle!',
        };
      case 'Overweight':
        return {
          color: 'amber',
          bgGradient: 'from-amber-50 to-yellow-50',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-700',
          badgeBg: 'bg-amber-100',
          icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
          title: 'You are Overweight',
          summary: 'Your BMI suggests you are overweight. This may increase your risk of heart disease, type 2 diabetes, and high blood pressure. Small lifestyle changes can make a big difference.',
        };
      default:
        return {
          color: 'red',
          bgGradient: 'from-red-50 to-orange-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700',
          badgeBg: 'bg-red-100',
          icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
          title: 'Obesity Detected',
          summary: 'Your BMI indicates obesity, which significantly increases the risk of various health conditions including heart disease, diabetes, and joint problems. Please consult a healthcare professional for personalized guidance.',
        };
    }
  };

  const getRecommendations = (): Recommendation[] => {
    const common: Recommendation[] = [
      {
        icon: <Droplets className="w-5 h-5" />,
        title: 'Stay Hydrated',
        description: 'Drink at least 8 glasses (2L) of water daily to support metabolism and overall health.',
        color: 'text-cyan-500',
      },
      {
        icon: <Moon className="w-5 h-5" />,
        title: 'Quality Sleep',
        description: 'Aim for 7-9 hours of quality sleep each night to support hormonal balance and recovery.',
        color: 'text-indigo-500',
      },
      {
        icon: <Brain className="w-5 h-5" />,
        title: 'Mental Wellness',
        description: 'Practice stress management through meditation, deep breathing, or mindfulness exercises.',
        color: 'text-purple-500',
      },
    ];

    if (category === 'Underweight') {
      return [
        {
          icon: <Apple className="w-5 h-5" />,
          title: 'Increase Caloric Intake',
          description: 'Focus on nutrient-dense foods like nuts, avocados, whole grains, and lean proteins to gain weight healthily.',
          color: 'text-green-500',
        },
        {
          icon: <Dumbbell className="w-5 h-5" />,
          title: 'Strength Training',
          description: 'Incorporate resistance exercises to build muscle mass. Focus on compound movements like squats and deadlifts.',
          color: 'text-blue-500',
        },
        {
          icon: <Heart className="w-5 h-5" />,
          title: 'Regular Check-ups',
          description: 'Visit your doctor to rule out underlying conditions that may be causing low weight.',
          color: 'text-red-500',
        },
        ...common,
      ];
    }

    if (category === 'Normal') {
      return [
        {
          icon: <Apple className="w-5 h-5" />,
          title: 'Balanced Diet',
          description: 'Continue eating a balanced diet rich in fruits, vegetables, lean proteins, and whole grains.',
          color: 'text-green-500',
        },
        {
          icon: <Dumbbell className="w-5 h-5" />,
          title: 'Stay Active',
          description: 'Maintain at least 150 minutes of moderate exercise per week to keep your body in great shape.',
          color: 'text-blue-500',
        },
        {
          icon: <Heart className="w-5 h-5" />,
          title: 'Preventive Care',
          description: 'Schedule regular health screenings and maintain your healthy habits for long-term wellness.',
          color: 'text-red-500',
        },
        ...common,
      ];
    }

    // Overweight and Obese
    return [
      {
        icon: <Apple className="w-5 h-5" />,
        title: 'Mindful Eating',
        description: 'Reduce processed foods and sugary drinks. Focus on portion control and whole, unprocessed foods.',
        color: 'text-green-500',
      },
      {
        icon: <Dumbbell className="w-5 h-5" />,
        title: 'Regular Exercise',
        description: 'Start with 30 minutes of moderate activity daily. Walking, swimming, or cycling are excellent choices.',
        color: 'text-blue-500',
      },
      {
        icon: <Heart className="w-5 h-5" />,
        title: 'Medical Consultation',
        description: 'Consult with a healthcare provider to create a safe, personalized weight management plan.',
        color: 'text-red-500',
      },
      ...common,
    ];
  };

  const status = getStatusConfig();
  const recommendations = getRecommendations();

  return (
    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Status Card */}
      <div className={`bg-gradient-to-r ${status.bgGradient} border ${status.borderColor} rounded-2xl p-5`}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0">{status.icon}</div>
          <div>
            <h3 className={`font-bold text-lg ${status.textColor}`}>{status.title}</h3>
            <p className="text-slate-600 text-sm mt-1 leading-relaxed">{status.summary}</p>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" />
          Personalized Recommendations
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div className={`${rec.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                {rec.icon}
              </div>
              <h4 className="font-semibold text-slate-800 text-sm mb-1">{rec.title}</h4>
              <p className="text-slate-500 text-xs leading-relaxed">{rec.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HealthRecommendations;
