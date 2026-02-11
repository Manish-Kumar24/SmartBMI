import React, { useState } from 'react';
import { BookOpen, AlertCircle, ChevronDown, ChevronUp, Activity, Users, Stethoscope, BarChart3, ShieldCheck, Lightbulb } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'What is BMI and how is it calculated?',
    answer: 'Body Mass Index (BMI) is a numerical value calculated from your weight and height. The formula is: BMI = weight (kg) / height (m)². It provides a simple screening measure to categorize individuals as underweight, normal weight, overweight, or obese.',
  },
  {
    question: 'How accurate is BMI as a health indicator?',
    answer: 'BMI is a useful screening tool but has limitations. It does not directly measure body fat, muscle mass, bone density, or fat distribution. Athletes with high muscle mass may have a high BMI despite being healthy. It should be used alongside other health assessments for a complete picture.',
  },
  {
    question: 'Does BMI apply equally to all ages and genders?',
    answer: 'Standard BMI categories apply to adults aged 20 and older. For children and teens, BMI is age- and sex-specific (BMI-for-age percentile). Women naturally have more body fat than men at the same BMI, so interpretation may differ slightly between genders.',
  },
  {
    question: 'What should I do if my BMI is outside the normal range?',
    answer: 'If your BMI indicates you are underweight, overweight, or obese, consider consulting a healthcare professional. They can perform additional assessments including body composition analysis, blood tests, and lifestyle evaluation to create a personalized health plan.',
  },
  {
    question: 'Can BMI predict specific health conditions?',
    answer: 'Research shows that higher BMI is associated with increased risk of type 2 diabetes, cardiovascular disease, hypertension, certain cancers, and sleep apnea. However, BMI alone cannot predict individual health outcomes — other factors like genetics, diet, activity level, and waist circumference also play important roles.',
  },
  {
    question: 'Why do you use feet and inches for height?',
    answer: 'Many people are more familiar with their height in feet and inches (imperial system). Our calculator accepts height in feet and inches and automatically converts it to meters for the BMI calculation, making it convenient for users worldwide.',
  },
];

const BMIInfoSection: React.FC = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'about' | 'limitations' | 'tips'>('about');

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const tabs = [
    { id: 'about' as const, label: 'About BMI', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'limitations' as const, label: 'Limitations', icon: <AlertCircle className="w-4 h-4" /> },
    { id: 'tips' as const, label: 'Health Tips', icon: <Lightbulb className="w-4 h-4" /> },
  ];

  return (
    <div id="about" className="w-full">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 text-teal-600 text-sm font-medium mb-4">
          <BookOpen className="w-4 h-4" />
          Learn More
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-3">
          Understanding BMI
        </h2>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Everything you need to know about Body Mass Index, its methodology, limitations, and how to use it effectively for health monitoring.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-slate-100 rounded-xl p-1 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-white text-teal-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300">
        {activeTab === 'about' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: 'The BMI Formula',
                description: 'BMI is calculated by dividing your weight in kilograms by the square of your height in meters. A BMI of 18.5-24.9 is considered healthy for most adults.',
                color: 'from-teal-400 to-emerald-500',
                shadow: 'shadow-teal-200',
              },
              {
                icon: <Activity className="w-6 h-6" />,
                title: 'Health Screening Tool',
                description: 'BMI serves as an initial screening tool used by healthcare professionals worldwide to identify potential weight-related health risks in populations.',
                color: 'from-blue-400 to-indigo-500',
                shadow: 'shadow-blue-200',
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: 'Population-Level Metric',
                description: 'Originally developed by Adolphe Quetelet in the 1830s, BMI was designed for population studies. It remains one of the most widely used health metrics globally.',
                color: 'from-purple-400 to-violet-500',
                shadow: 'shadow-purple-200',
              },
              {
                icon: <Stethoscope className="w-6 h-6" />,
                title: 'Clinical Applications',
                description: 'Doctors use BMI alongside other measurements like waist circumference, blood pressure, and blood tests to assess overall health risk and guide treatment plans.',
                color: 'from-rose-400 to-pink-500',
                shadow: 'shadow-rose-200',
              },
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                title: 'WHO Standards',
                description: 'The World Health Organization defines BMI categories: Underweight (<18.5), Normal (18.5-24.9), Overweight (25-29.9), and Obese (30+) for adult populations.',
                color: 'from-amber-400 to-orange-500',
                shadow: 'shadow-amber-200',
              },
              {
                icon: <Lightbulb className="w-6 h-6" />,
                title: 'Beyond the Number',
                description: 'While BMI provides a useful starting point, true health assessment requires considering factors like body composition, fitness level, family history, and lifestyle habits.',
                color: 'from-cyan-400 to-teal-500',
                shadow: 'shadow-cyan-200',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} ${card.shadow} shadow-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{card.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{card.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'limitations' && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-amber-800 text-lg mb-2">Important Disclaimer</h3>
                  <p className="text-amber-700 text-sm leading-relaxed">
                    BMI is a screening tool, not a diagnostic measure. It does not account for muscle mass, bone density, age, sex, ethnicity, or fat distribution. Always consult with a healthcare professional for a comprehensive health assessment.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: 'Does Not Measure Body Fat Directly',
                  description: 'BMI uses weight and height only. Two people with the same BMI can have very different body compositions — one might have high muscle mass while another has high body fat.',
                },
                {
                  title: 'Athletes May Be Misclassified',
                  description: 'Muscular individuals, including athletes and bodybuilders, often have high BMIs despite having low body fat percentages. Muscle weighs more than fat per unit volume.',
                },
                {
                  title: 'Age and Gender Differences',
                  description: 'Older adults tend to have more body fat than younger adults at the same BMI. Women typically have more body fat than men at equivalent BMI values.',
                },
                {
                  title: 'Ethnic Variations',
                  description: 'Health risks associated with BMI can vary across ethnic groups. For example, Asian populations may face higher health risks at lower BMI thresholds compared to Caucasian populations.',
                },
                {
                  title: 'Does Not Consider Fat Distribution',
                  description: 'Where fat is stored matters. Abdominal (visceral) fat carries higher health risks than fat stored in hips and thighs. BMI cannot distinguish between these patterns.',
                },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-amber-600 font-bold text-sm">{i + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: 'Eat Whole Foods',
                  description: 'Prioritize fruits, vegetables, lean proteins, and whole grains. Minimize processed foods, added sugars, and excessive sodium.',
                  gradient: 'from-green-400 to-emerald-500',
                },
                {
                  title: 'Move Every Day',
                  description: 'Aim for at least 30 minutes of moderate physical activity daily. Walking, cycling, swimming, or dancing all count.',
                  gradient: 'from-blue-400 to-indigo-500',
                },
                {
                  title: 'Manage Stress',
                  description: 'Chronic stress can lead to weight gain and poor health. Practice relaxation techniques like yoga, meditation, or deep breathing.',
                  gradient: 'from-purple-400 to-violet-500',
                },
                {
                  title: 'Sleep Well',
                  description: 'Get 7-9 hours of quality sleep nightly. Poor sleep disrupts hormones that regulate appetite and metabolism.',
                  gradient: 'from-indigo-400 to-blue-500',
                },
                {
                  title: 'Stay Hydrated',
                  description: 'Drink plenty of water throughout the day. Sometimes thirst is mistaken for hunger, leading to unnecessary calorie intake.',
                  gradient: 'from-cyan-400 to-teal-500',
                },
                {
                  title: 'Regular Check-ups',
                  description: 'Visit your healthcare provider annually for comprehensive health screenings including blood pressure, cholesterol, and blood sugar levels.',
                  gradient: 'from-rose-400 to-pink-500',
                },
              ].map((tip, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tip.gradient} flex items-center justify-center text-white font-bold text-sm mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    {i + 1}
                  </div>
                  <h4 className="font-semibold text-slate-800 mb-1">{tip.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{tip.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div id="faq" className="mt-16">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Frequently Asked Questions</h3>
          <p className="text-slate-500">Common questions about BMI and health assessment</p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`bg-white rounded-xl border transition-all duration-300 ${
                openFAQ === i ? 'border-teal-200 shadow-md shadow-teal-50' : 'border-slate-100 shadow-sm'
              }`}
            >
              <button
                onClick={() => toggleFAQ(i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className={`font-semibold text-sm sm:text-base pr-4 transition-colors duration-200 ${openFAQ === i ? 'text-teal-700' : 'text-slate-700'}`}>
                  {faq.question}
                </span>
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  openFAQ === i ? 'bg-teal-100 text-teal-600 rotate-180' : 'bg-slate-100 text-slate-400'
                }`}>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openFAQ === i ? 'max-h-60' : 'max-h-0'}`}>
                <div className="px-5 pb-5 pt-0">
                  <p className="text-sm text-slate-500 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BMIInfoSection;
