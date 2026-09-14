import React, { useEffect, useRef, useState } from 'react';
import {
  GraduationCap, LayoutDashboard, BookOpen, Users, Star,
  ChevronRight, CheckCircle2, ArrowRight, School, Shield, Zap,
  TrendingUp, Bell, CreditCard, Award
} from 'lucide-react';

/* ─── Animated counter hook ─── */
function useCounter(end, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);
  return count;
}

const FEATURES = [
  {
    icon: LayoutDashboard,
    role: 'Administrateur',
    color: 'from-violet-500 to-purple-600',
    glow: 'rgba(139,92,246,0.3)',
    items: [
      'Tableau de bord temps réel',
      'Gestion complète des élèves',
      'Suivi financier & paiements',
      'Gestion des professeurs',
    ],
  },
  {
    icon: BookOpen,
    role: 'Professeur',
    color: 'from-sky-500 to-blue-600',
    glow: 'rgba(14,165,233,0.3)',
    items: [
      'Saisie des notes & évaluations',
      'Emploi du temps interactif',
      'Suivi par classe & matière',
      'Bulletins imprimables',
    ],
  },
  {
    icon: Users,
    role: 'Parent',
    color: 'from-emerald-500 to-teal-600',
    glow: 'rgba(16,185,129,0.3)',
    items: [
      'Résultats en temps réel',
      'Historique des paiements',
      'Emploi du temps de l\'enfant',
      'Alertes & notifications',
    ],
  },
  {
    icon: GraduationCap,
    role: 'Élève',
    color: 'from-orange-500 to-amber-600',
    glow: 'rgba(249,115,22,0.3)',
    items: [
      'Bulletin numérique personnel',
      'Notes par matière & trimestre',
      'Emploi du temps de classe',
      'Statistiques de progression',
    ],
  },
];

const STEPS = [
  {
    num: '01',
    title: "L'école configure les élèves",
    desc: "L'administrateur inscrit les élèves, crée les classes et renseigne les informations de chaque enfant dans le système.",
    icon: School,
  },
  {
    num: '02',
    title: 'Le parent crée son compte',
    desc: "En quelques secondes, le parent s'inscrit et recherche son enfant par nom ou matricule pour lier son compte.",
    icon: Users,
  },
  {
    num: '03',
    title: 'Accès immédiat aux résultats',
    desc: "Dès la liaison effectuée, le parent consulte les notes, l'emploi du temps et les paiements en temps réel.",
    icon: TrendingUp,
  },
];

export default function LandingPage({ onGetStarted, onLogin }) {
  const statsRef    = useRef(null);
  const [inView, setInView] = useState(false);

  const schools  = useCounter(500,  1600, inView);
  const students = useCounter(50000, 2000, inView);
  const rating   = useCounter(98,   1400, inView);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden">

      {/* ── NAVBAR ─────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5"
        style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(16px)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600
                            flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Edu<span className="text-emerald-400">master</span>
            </span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            {['Fonctionnalités', 'Comment ça marche', 'Tarifs'].map((l) => (
              <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <button
              id="nav-login-btn"
              onClick={onLogin}
              className="hidden sm:block px-4 py-2 text-sm font-medium text-slate-300
                         hover:text-white border border-white/10 rounded-lg
                         hover:border-white/30 transition-all"
            >
              Se connecter
            </button>
            <button
              id="nav-signup-btn"
              onClick={onGetStarted}
              className="px-4 py-2 text-sm font-bold bg-emerald-500 hover:bg-emerald-400
                         rounded-lg text-white transition-all shadow-lg shadow-emerald-500/25"
            >
              Commencer
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px]
                        bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px]
                        bg-violet-500/8 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                          border border-emerald-500/30 bg-emerald-500/10 mb-8
                          text-emerald-400 text-sm font-medium">
            <Zap className="w-3.5 h-3.5" />
            ✨ Plateforme N°1 de gestion scolaire en Afrique
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6
                         leading-tight">
            Gérez votre école avec
            <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              intelligence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Edumaster connecte administrateurs, professeurs, parents et élèves
            dans une plateforme unique. Résultats en temps réel, finances simplifiées,
            emploi du temps centralisé.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              id="hero-signup-btn"
              onClick={onGetStarted}
              className="group flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400
                         rounded-2xl text-white font-bold text-lg shadow-2xl shadow-emerald-500/30
                         transition-all hover:scale-105 hover:shadow-emerald-400/40"
            >
              Créer un compte gratuitement
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              id="hero-login-btn"
              onClick={onLogin}
              className="flex items-center gap-2 px-8 py-4 border border-white/15
                         rounded-2xl text-slate-300 hover:text-white hover:border-white/30
                         font-medium text-lg transition-all"
            >
              Se connecter
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div ref={statsRef}
            className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            {[
              { value: `${schools}+`,  label: 'Écoles' },
              { value: `${students.toLocaleString()}+`, label: 'Élèves' },
              { value: `${rating}%`, label: 'Satisfaction' },
            ].map(({ value, label }) => (
              <div key={label}
                className="p-4 rounded-2xl border border-white/8"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                <div className="text-2xl font-extrabold text-emerald-400">{value}</div>
                <div className="text-xs text-slate-500 mt-1 font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-3">
              Fonctionnalités
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Une solution pour chaque acteur
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              Chaque rôle dispose d'un espace personnalisé avec uniquement les informations
              qui le concernent.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, role, color, glow, items }) => (
              <div key={role}
                className="group relative p-6 rounded-3xl border border-white/8 overflow-hidden
                           hover:border-white/20 transition-all hover:-translate-y-1"
                style={{ background: 'rgba(255,255,255,0.03)' }}>
                {/* Glow on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity
                                rounded-3xl pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 0%, ${glow}, transparent 70%)` }} />
                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color}
                                 flex items-center justify-center mb-5 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-4">{role}</h3>
                <ul className="space-y-2.5">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-emerald-400 text-sm font-bold uppercase tracking-widest mb-3">
              Comment ça marche
            </p>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Opérationnel en 3 étapes
            </h2>
          </div>

          <div className="relative grid md:grid-cols-3 gap-8">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-px
                            bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

            {STEPS.map(({ num, title, desc, icon: Icon }) => (
              <div key={num} className="relative flex flex-col items-center text-center p-6">
                <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br
                                from-emerald-500/20 to-teal-600/20 border border-emerald-500/30
                                flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-emerald-400" />
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full
                                  bg-emerald-500 flex items-center justify-center
                                  text-xs font-black text-white">
                    {num.slice(1)}
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-3">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAND ───────────────────────────────────────── */}
      <section className="py-16 px-6 border-y border-white/5"
        style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: Shield, title: 'Sécurisé & RGPD', desc: 'Données chiffrées, isolation par rôle, conformité totale.' },
              { icon: Zap,    title: 'Rapide & Fiable',  desc: 'Infrastructure cloud Supabase, disponibilité 99.9%.' },
              { icon: Award,  title: 'Support dédié',    desc: 'Équipe locale disponible 7j/7 pour vous accompagner.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20
                                flex items-center justify-center">
                  <Icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="font-bold">{title}</h3>
                <p className="text-slate-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ───────────────────────────────────────── */}
      <section className="py-28 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-teal-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.15)_0%,_transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto">
          <div className="text-5xl mb-6">🎓</div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
            Prêt à transformer votre établissement ?
          </h2>
          <p className="text-slate-300 text-lg mb-10 leading-relaxed">
            Rejoignez des centaines d'écoles qui font confiance à Edumaster
            pour gérer leur quotidien avec efficacité et transparence.
          </p>
          <button
            id="cta-final-btn"
            onClick={onGetStarted}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-white hover:bg-slate-100
                       rounded-2xl text-slate-900 font-bold text-lg shadow-2xl shadow-black/40
                       transition-all hover:scale-105"
          >
            Démarrer gratuitement
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-10 px-6"
        style={{ background: 'rgba(2,6,23,0.8)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30
                            flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="font-bold">Edu<span className="text-emerald-400">master</span></span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2025-2026 Edumaster SaaS. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Conditions</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
