import React, { useState } from 'react';
import {
  GraduationCap, Eye, EyeOff, ArrowLeft, Loader2,
  LayoutDashboard, BookOpen, Users, User, CheckCircle2, AlertCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ROLES = [
  {
    id: 'admin',
    label: 'Administrateur',
    desc: 'Gestion complète de l\'établissement',
    icon: LayoutDashboard,
    color: 'from-violet-500 to-purple-600',
    border: 'border-violet-500/50',
    bg:    'bg-violet-500/10',
  },
  {
    id: 'teacher',
    label: 'Professeur',
    desc: 'Saisie des notes & emploi du temps',
    icon: BookOpen,
    color: 'from-sky-500 to-blue-600',
    border: 'border-sky-500/50',
    bg:    'bg-sky-500/10',
  },
  {
    id: 'parent',
    label: 'Parent',
    desc: 'Suivi des résultats de votre enfant',
    icon: Users,
    color: 'from-emerald-500 to-teal-600',
    border: 'border-emerald-500/50',
    bg:    'bg-emerald-500/10',
  },
  {
    id: 'student',
    label: 'Élève',
    desc: 'Bulletin & emploi du temps personnel',
    icon: User,
    color: 'from-orange-500 to-amber-600',
    border: 'border-orange-500/50',
    bg:    'bg-orange-500/10',
  },
];

export default function AuthPage({ onBack }) {
  const [mode,       setMode]       = useState('login');   // 'login' | 'signup'
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [fullName,   setFullName]   = useState('');
  const [role,       setRole]       = useState('parent');
  const [showPwd,    setShowPwd]    = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) setError(err.message);
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    if (!fullName.trim()) { setError('Veuillez entrer votre nom complet.'); setLoading(false); return; }
    if (password.length < 6) { setError('Le mot de passe doit contenir au moins 6 caractères.'); setLoading(false); return; }

    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role },
      },
    });

    if (err) {
      setError(err.message);
    } else {
      setSuccess('Compte créé ! Vérifiez votre email pour confirmer, puis connectez-vous.');
      setMode('login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex font-sans">

      {/* ── LEFT PANEL ─────────────────────────────────────── */}
      <div className="hidden lg:flex w-2/5 relative flex-col justify-between p-10
                      border-r border-white/5 overflow-hidden">
        {/* BG */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]" />

        <div className="relative">
          <button onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white
                       text-sm transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
          </button>
          <div className="flex items-center gap-2.5 mb-12">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600
                            flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">
              Edu<span className="text-emerald-400">master</span>
            </span>
          </div>
          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
            La plateforme scolaire<br />de nouvelle génération
          </h2>
          <p className="text-slate-400 leading-relaxed mb-10">
            Connectez-vous pour accéder à votre espace personnalisé — résultats,
            emploi du temps, finances, tout en un seul endroit.
          </p>
          <ul className="space-y-4">
            {[
              'Données sécurisées et chiffrées',
              'Accès immédiat aux résultats',
              'Notifications en temps réel',
              'Support dédié 7j/7',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-xs text-slate-600">
          © 2025-2026 Edumaster SaaS
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile back */}
        <button onClick={onBack}
          className="lg:hidden self-start flex items-center gap-2 text-slate-400
                     hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Accueil
        </button>

        <div className="w-full max-w-md">
          {/* Mode tabs */}
          <div className="flex bg-white/5 rounded-2xl p-1 mb-8">
            {[['login', 'Se connecter'], ['signup', 'Créer un compte']].map(([m, label]) => (
              <button
                key={m}
                id={`auth-tab-${m}`}
                onClick={() => { setMode(m); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all ${
                  mode === m
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-white mb-1">
              {mode === 'login' ? 'Bon retour 👋' : 'Créez votre compte'}
            </h1>
            <p className="text-slate-400 text-sm">
              {mode === 'login'
                ? 'Entrez vos identifiants pour accéder à votre espace.'
                : 'Rejoignez Edumaster et connectez-vous à votre école.'}
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border
                            border-red-500/30 text-red-400 text-sm mb-6">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/10 border
                            border-emerald-500/30 text-emerald-400 text-sm mb-6">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {success}
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-5">
              <Field label="Adresse e-mail" id="login-email">
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className={INPUT_CLS}
                />
              </Field>
              <Field label="Mot de passe" id="login-password">
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPwd ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`${INPUT_CLS} pr-12`}
                  />
                  <button type="button" onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400
                               hover:text-white transition-colors">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>
              <SubmitBtn loading={loading} label="Se connecter" />
            </form>
          )}

          {/* ── SIGNUP FORM ── */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-5">
              <Field label="Nom complet" id="signup-name">
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Prénom et Nom"
                  className={INPUT_CLS}
                />
              </Field>
              <Field label="Adresse e-mail" id="signup-email">
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className={INPUT_CLS}
                />
              </Field>
              <Field label="Mot de passe" id="signup-password">
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPwd ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 caractères"
                    className={`${INPUT_CLS} pr-12`}
                  />
                  <button type="button" onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400
                               hover:text-white transition-colors">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </Field>

              {/* Role selector */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase
                                  tracking-widest mb-3">
                  Je suis…
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {ROLES.map(({ id, label, desc, icon: Icon, border, bg }) => (
                    <button
                      key={id}
                      type="button"
                      id={`role-${id}`}
                      onClick={() => setRole(id)}
                      className={`flex flex-col items-start gap-2 p-4 rounded-2xl border
                                  text-left transition-all ${
                        role === id
                          ? `${border} ${bg} border-2`
                          : 'border-white/8 hover:border-white/20'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br
                                       flex items-center justify-center`}
                        style={{ background: role === id ? undefined : 'rgba(255,255,255,0.05)' }}>
                        <Icon className={`w-4 h-4 ${role === id ? 'text-white' : 'text-slate-400'}`} />
                      </div>
                      <div>
                        <div className={`text-sm font-bold ${role === id ? 'text-white' : 'text-slate-300'}`}>
                          {label}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 leading-tight">{desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <SubmitBtn loading={loading} label="Créer mon compte" />
            </form>
          )}

          {/* Footer link */}
          <p className="text-center text-slate-500 text-sm mt-6">
            {mode === 'login' ? (
              <>Pas encore de compte ?{' '}
                <button onClick={() => setMode('signup')}
                  className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
                  S'inscrire
                </button>
              </>
            ) : (
              <>Déjà inscrit ?{' '}
                <button onClick={() => setMode('login')}
                  className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
                  Se connecter
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Shared sub-components ────────────────────────────── */
const INPUT_CLS = `w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10
  text-white placeholder-slate-500 text-sm
  focus:outline-none focus:border-emerald-500/60 focus:bg-white/8
  transition-all`;

function Field({ label, id, children }) {
  return (
    <div>
      <label htmlFor={id}
        className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}

function SubmitBtn({ loading, label }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60
                 text-white font-bold text-sm transition-all
                 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-400/30"
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {label}
    </button>
  );
}
