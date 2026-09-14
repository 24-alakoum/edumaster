import React, { useState } from 'react';
import {
  GraduationCap, Search, Loader2, CheckCircle2,
  User, School, Hash, AlertCircle, LogOut, Plus
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';

export default function ParentOnboarding() {
  const { userProfile, completeParentOnboarding, signOut } = useApp();

  const [query,    setQuery]    = useState('');
  const [results,  setResults]  = useState(null);  // null = not searched yet
  const [loading,  setLoading]  = useState(false);
  const [linking,  setLinking]  = useState(null);  // studentId being linked
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setError(''); setResults(null); setLoading(true);

    const { data, error: err } = await supabase
      .from('students')
      .select('id, name, matricule, parent_name, parent_phone, classes(name)')
      .or(`name.ilike.%${query.trim()}%,matricule.ilike.%${query.trim()}%`)
      .limit(10);

    if (err) {
      setError('Erreur lors de la recherche. Réessayez.');
    } else {
      setResults(data || []);
    }
    setLoading(false);
  };

  const handleLink = async (student) => {
    setError(''); setLinking(student.id);
    const res = await completeParentOnboarding(student);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(true);
    }
    setLinking(null);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6 font-sans">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 rounded-full bg-emerald-500/20 border border-emerald-500/40
                          flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-3">Compte lié avec succès !</h2>
          <p className="text-slate-400 mb-8">
            Vous allez être redirigé vers votre espace parent dans quelques instants…
          </p>
          <div className="flex gap-1 justify-center">
            {[0,1,2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans flex flex-col">

      {/* Navbar */}
      <nav className="border-b border-white/5 px-6 h-16 flex items-center justify-between"
        style={{ background: 'rgba(2,6,23,0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600
                          flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">
            Edu<span className="text-emerald-400">master</span>
          </span>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
        >
          <LogOut className="w-4 h-4" /> Déconnexion
        </button>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/15 border border-emerald-500/30
                            flex items-center justify-center mx-auto mb-5">
              <Users className="w-8 h-8 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-extrabold text-white mb-3">
              Bienvenue, {userProfile?.full_name?.split(' ')[0] || 'Parent'} 👋
            </h1>
            <p className="text-slate-400 leading-relaxed">
              Pour voir les résultats et le suivi de votre enfant, recherchez-le
              dans notre système par son <strong className="text-slate-300">nom</strong> ou
              son <strong className="text-slate-300">matricule</strong>.
            </p>
          </div>

          {/* Search form */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="child-search-input"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ex : Kouassi Amani ou EDU-2025-123"
                  className="w-full pl-11 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10
                             text-white placeholder-slate-500 text-sm
                             focus:outline-none focus:border-emerald-500/60 focus:bg-white/8
                             transition-all"
                />
              </div>
              <button
                id="child-search-btn"
                type="submit"
                disabled={loading || !query.trim()}
                className="px-6 py-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50
                           rounded-2xl text-white font-bold text-sm transition-all
                           shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                {loading
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Search className="w-4 h-4" />}
                {loading ? 'Recherche…' : 'Chercher'}
              </button>
            </div>
          </form>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border
                            border-red-500/30 text-red-400 text-sm mb-6">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* No results */}
          {results !== null && results.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              <div className="text-4xl mb-3">🔍</div>
              <p className="font-medium text-slate-300 mb-1">Aucun élève trouvé</p>
              <p className="text-sm">
                Vérifiez l'orthographe ou contactez l'administration de l'école.
              </p>
            </div>
          )}

          {/* Results list */}
          {results && results.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest px-1">
                {results.length} résultat(s) — Sélectionnez votre enfant
              </p>
              {results.map((student) => (
                <div key={student.id}
                  className="flex items-center justify-between gap-4 p-5 rounded-2xl
                             border border-white/8 hover:border-emerald-500/30
                             transition-all group"
                  style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20
                                    to-teal-600/20 border border-emerald-500/20 flex items-center
                                    justify-center flex-shrink-0">
                      <User className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white text-sm truncate">{student.name}</div>
                      <div className="flex items-center gap-3 mt-1 flex-wrap">
                        {student.classes && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <School className="w-3 h-3" />
                            {student.classes.name}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Hash className="w-3 h-3" />
                          {student.matricule}
                        </span>
                        {student.parent_name && (
                          <span className="text-xs text-slate-600 truncate">
                            Parent enregistré : {student.parent_name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    id={`link-student-${student.id}`}
                    onClick={() => handleLink(student)}
                    disabled={!!linking}
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/10
                               hover:bg-emerald-500 border border-emerald-500/40
                               hover:border-emerald-500 rounded-xl text-emerald-400
                               hover:text-white text-xs font-bold transition-all
                               disabled:opacity-50 flex-shrink-0"
                  >
                    {linking === student.id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Plus className="w-3.5 h-3.5" />}
                    {linking === student.id ? 'Liaison…' : 'Lier cet enfant'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Hint */}
          <div className="mt-8 p-4 rounded-2xl border border-white/5 text-center"
            style={{ background: 'rgba(255,255,255,0.02)' }}>
            <p className="text-xs text-slate-500">
              Votre enfant n'apparaît pas ?{' '}
              <span className="text-slate-400">
                Contactez l'administration de l'école pour qu'il soit inscrit dans le système.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
