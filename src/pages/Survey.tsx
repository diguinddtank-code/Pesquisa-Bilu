import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { translations, Language } from '../i18n';
import { Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Survey() {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    q1: '', q2: '', q3: '', q4: '', q5: '', q6: '', q7: '', q8: '', q9: '', q10: ''
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields (1-8)
    const newErrors: Record<string, boolean> = {};
    let hasError = false;
    for (let i = 1; i <= 8; i++) {
      if (!formData[`q${i}` as keyof typeof formData]) {
        newErrors[`q${i}`] = true;
        hasError = true;
      }
    }

    if (hasError) {
      setErrors(newErrors);
      // Scroll to top or first error
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      if (supabase) {
        // Save to Supabase if configured
        const { error } = await supabase
          .from('feedback')
          .insert([
            {
              q1: formData.q1,
              q2: formData.q2,
              q3: formData.q3,
              q4: formData.q4,
              q5: formData.q5,
              q6: formData.q6,
              q7: formData.q7,
              q8: formData.q8,
              q9: formData.q9,
              q10: formData.q10,
              language: lang
            }
          ]);

        if (error) throw error;
      } else {
        // Fallback to localStorage if Supabase is not configured
        const existingData = JSON.parse(localStorage.getItem('feedback_data') || '[]');
        const newFeedback = {
          ...formData,
          language: lang,
          created_at: new Date().toISOString()
        };
        existingData.push(newFeedback);
        localStorage.setItem('feedback_data', JSON.stringify(existingData));
      }
      
      navigate('/thank-you', { state: { lang } });
    } catch (err) {
      console.error('Submission error:', err);
      alert('Error submitting feedback. Please try again.');
    }
  };

  const renderRadioGroup = (questionKey: string, questionText: string, options: string[]) => (
    <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-lg font-medium text-slate-800 mb-4">{questionText}</h3>
      <div className="space-y-3">
        {options.map((opt, idx) => (
          <label key={idx} className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative flex items-center justify-center">
              <input
                type="radio"
                name={questionKey}
                value={opt}
                checked={formData[questionKey as keyof typeof formData] === opt}
                onChange={() => handleChange(questionKey, opt)}
                className="peer sr-only"
              />
              <div className="w-5 h-5 rounded-full border-2 border-slate-300 peer-checked:border-emerald-600 peer-checked:bg-emerald-600 transition-all"></div>
              <div className="absolute w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
            </div>
            <span className="text-slate-700 group-hover:text-slate-900 transition-colors">{opt}</span>
          </label>
        ))}
      </div>
      {errors[questionKey] && (
        <p className="mt-3 text-sm text-red-500 font-medium">{t.requiredField}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        
        {/* Language Selector - Modern Segmented Control */}
        <div className="flex justify-center mb-10 px-2">
          <div className="bg-white p-1.5 rounded-full shadow-sm border border-slate-200 flex items-center w-full max-w-lg">
            {[
              { code: 'en', label: 'English', flag: '🇺🇸' },
              { code: 'es', label: 'Español', flag: '🇪🇸' },
              { code: 'pt', label: 'Português', flag: '🇧🇷' }
            ].map(({ code, label, flag }) => (
              <button
                key={code}
                onClick={() => setLang(code as Language)}
                className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-1 sm:px-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 ${
                  lang === code 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span className="text-lg sm:text-xl leading-none drop-shadow-sm">{flag}</span>
                <span className="tracking-wide">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10 px-2">
          <img src="https://bilusoccer.com/wp-content/uploads/2025/03/h2-3.png" alt="Bilu Soccer" className="h-20 sm:h-24 mx-auto mb-6 object-contain" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">{t.title}</h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium">{t.subtitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderRadioGroup('q1', t.q1, t.q1_options)}
          {renderRadioGroup('q2', t.q2, t.q2_options)}
          {renderRadioGroup('q3', t.q3, t.q3_options)}
          {renderRadioGroup('q4', t.q4, t.q4_options)}
          {renderRadioGroup('q5', t.q5, t.q5_options)}
          {renderRadioGroup('q6', t.q6, t.q6_options)}
          {renderRadioGroup('q7', t.q7, t.q7_options)}
          {renderRadioGroup('q8', t.q8, t.q8_options)}

          {/* Open text questions */}
          <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-medium text-slate-800 mb-4">{t.q9}</h3>
            <textarea
              value={formData.q9}
              onChange={(e) => handleChange('q9', e.target.value)}
              placeholder={t.openTextPlaceholder}
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none h-32"
            />
          </div>

          <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-medium text-slate-800 mb-4">{t.q10}</h3>
            <textarea
              value={formData.q10}
              onChange={(e) => handleChange('q10', e.target.value)}
              placeholder={t.openTextPlaceholder}
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none h-32"
            />
          </div>

          <div className="pt-4 pb-12">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-medium rounded-xl shadow-sm hover:shadow-md transition-all flex justify-center items-center mx-auto"
            >
              {t.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
