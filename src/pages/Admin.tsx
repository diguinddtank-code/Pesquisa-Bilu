import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { translations } from '../i18n';
import { Lock, LogOut, Download, Trash2, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Use PT translations for the dashboard labels
  const t = translations.pt;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      fetchData();
    } else {
      alert('Senha incorreta');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: storedData, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      setData(storedData || []);
    } catch (err) {
      console.error('Supabase fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Tem certeza que deseja apagar TODOS os dados de feedback? Esta ação não pode ser desfeita.')) {
      setLoading(true);
      try {
        const { error } = await supabase
          .from('feedback')
          .delete()
          .neq('id', 0); // Deletes all rows where id is not 0 (which is all rows)

        if (error) {
          throw error;
        }

        setData([]);
        alert('Dados apagados com sucesso.');
      } catch (err) {
        console.error('Supabase delete error:', err);
        alert('Erro ao apagar os dados.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <img src="https://bilusoccer.com/wp-content/uploads/2025/03/h2-3.png" alt="Bilu Soccer" className="h-20 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-center text-slate-900 mb-6">Acesso Administrativo</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const getChartData = (questionKey: string, options: string[]) => {
    const counts: Record<string, number> = {};
    options.forEach(opt => counts[opt] = 0);
    
    data.forEach(row => {
      const val = row[questionKey];
      if (val && counts[val] !== undefined) {
        counts[val]++;
      }
    });

    return options.map(opt => ({
      name: opt,
      value: counts[opt] || 0
    }));
  };

  const renderChart = (title: string, dataKey: string, options: string[]) => {
    const chartData = getChartData(dataKey, options);
    const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full">
        <h3 className="text-lg font-medium text-slate-800 mb-6 flex-grow-0">{title}</h3>
        <div className="h-64 w-full flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 flex-grow-0">
          {chartData.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg">
              <div className="flex items-center space-x-2 overflow-hidden">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                <span className="text-sm text-slate-600 truncate" title={item.name}>{item.name}</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 ml-2 flex-shrink-0">
                {item.value} ({total > 0 ? Math.round((item.value / total) * 100) : 0}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center space-x-4">
            <img src="https://bilusoccer.com/wp-content/uploads/2025/03/h2-3.png" alt="Bilu Soccer" className="h-12 object-contain hidden sm:block" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard de Resultados</h1>
              <p className="text-slate-500 mt-1">Total de respostas: {data.length}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-medium rounded-lg transition-colors flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Zerar Dados
            </button>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-lg transition-colors flex items-center"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {renderChart(t.q1, 'q1', t.q1_options)}
            {renderChart(t.q2, 'q2', t.q2_options)}
            {renderChart(t.q3, 'q3', t.q3_options)}
            {renderChart(t.q4, 'q4', t.q4_options)}
            {renderChart(t.q5, 'q5', t.q5_options)}
            {renderChart(t.q6, 'q6', t.q6_options)}
            {renderChart(t.q7, 'q7', t.q7_options)}
            {renderChart(t.q8, 'q8', t.q8_options)}
          </div>
        )}

        {/* Text Responses */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-medium text-slate-800 mb-4">{t.q9}</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {data.filter(d => d.q9?.trim()).map((d, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-700">
                  {d.q9}
                </div>
              ))}
              {data.filter(d => d.q9?.trim()).length === 0 && (
                <p className="text-slate-500 italic">Nenhuma resposta ainda.</p>
              )}
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-medium text-slate-800 mb-4">{t.q10}</h3>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {data.filter(d => d.q10?.trim()).map((d, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-700">
                  {d.q10}
                </div>
              ))}
              {data.filter(d => d.q10?.trim()).length === 0 && (
                <p className="text-slate-500 italic">Nenhuma resposta ainda.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
