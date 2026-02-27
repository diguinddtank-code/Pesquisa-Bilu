import { useLocation, useNavigate } from 'react-router-dom';
import { translations, Language } from '../i18n';
import { CheckCircle } from 'lucide-react';

export default function ThankYou() {
  const location = useLocation();
  const navigate = useNavigate();
  const lang = (location.state?.lang as Language) || 'en';
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center space-y-6">
        <img src="https://bilusoccer.com/wp-content/uploads/2025/03/h2-3.png" alt="Bilu Soccer" className="h-16 mx-auto mb-4 object-contain" />
        <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{t.thankYou}</h1>
        <p className="text-lg text-slate-600 pb-4">{t.thankYouMessage}</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors"
        >
          Voltar / Back / Volver
        </button>
      </div>
    </div>
  );
}
