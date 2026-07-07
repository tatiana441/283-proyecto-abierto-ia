import { useState } from 'react';
import { NOTIFICATIONS } from '../../constants/copy';
import { supabase } from '../../lib/supabase';

type Channel = 'email' | 'whatsapp';

interface AlertType {
  id: string;
  label: string;
  description: string;
  icon: string;
}

const ALERT_TYPES: AlertType[] = [
  { id: 'shortage',   label: 'Desabastecimiento',     description: 'Alertas cuando hay riesgo de escasez', icon: '⚠️' },
  { id: 'price',      label: 'Cambio de precio',      description: 'Variaciones significativas de precio',  icon: '💰' },
  { id: 'regulatory', label: 'Cambio regulatorio',    description: 'Actualizaciones de INVIMA y MSPS',      icon: '🏛️' },
  { id: 'substitute', label: 'Alternativas nuevas',   description: 'Nuevas opciones terapéuticas',          icon: '🔄' },
];

export default function NotificationsSubscription() {
  const [channel,   setChannel]   = useState<Channel>('email');
  const [selected,  setSelected]  = useState(new Set(['shortage']));
  const [contact,   setContact]   = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const toggleAlert = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim() || selected.size === 0) return;
    setLoading(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    const { error: err } = await supabase.from('suscripciones').insert({
      user_id: user?.id,
      canal: channel,
      contacto: contact.trim(),
      alertas: [...selected].join(','),
    });
    setLoading(false);
    if (err) {
      setError('No pudimos guardar tu suscripción. Intenta de nuevo en unos segundos.');
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className="bg-low-bg border border-low rounded-2xl p-8 text-center flex flex-col items-center gap-4 animate-[fade-in_0.35s_ease]"
        role="status"
        aria-live="polite"
      >
        <div className="text-5xl" aria-hidden="true">✅</div>
        <h3 className="text-lg font-bold text-low-text tracking-[-0.02em]">
            Suscripción exitosa
          </h3>
        <p className="text-sm text-slate-500 leading-relaxed max-w-[260px]">
          {NOTIFICATIONS.successMessage}
        </p>
        <button
          className="text-sm font-semibold text-primary border border-primary/30 bg-white px-4 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-150 cursor-pointer"
          onClick={() => setSubmitted(false)}
        >
          Gestionar suscripción
        </button>
      </div>
    );
  }

  return (
    <section
      className="bg-white border border-slate-200 rounded-2xl shadow-card overflow-hidden"
      aria-labelledby="notif-section-title"
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 bg-linear-to-r from-primary-bg to-white">
        <span className="text-[22px]" aria-hidden="true">🔔</span>
        <h2 id="notif-section-title" className="text-base font-bold text-slate-900 tracking-[-0.02em]">
          {NOTIFICATIONS.sectionTitle}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5" noValidate>

        {/* Channel tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg" role="tablist" aria-label="Canal de notificación">
          {(['email', 'whatsapp'] as Channel[]).map(ch => (
            <button
              key={ch}
              type="button"
              role="tab"
              aria-selected={channel === ch}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-sm font-semibold transition-all duration-150 cursor-pointer ${
                channel === ch
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              onClick={() => setChannel(ch)}
            >
              {ch === 'email' ? '✉️' : '💬'} {ch === 'email' ? 'Email' : 'WhatsApp'}
            </button>
          ))}
        </div>

        {/* Contact input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="notif-contact" className="text-xs font-semibold text-slate-500 tracking-[0.04em] uppercase">
            {channel === 'email' ? NOTIFICATIONS.emailTab : NOTIFICATIONS.whatsappTab}
          </label>
          <input
            id="notif-contact"
            type={channel === 'email' ? 'email' : 'tel'}
            placeholder={channel === 'email' ? NOTIFICATIONS.emailPlaceholder : NOTIFICATIONS.whatsappPlaceholder}
            value={contact}
            onChange={e => setContact(e.target.value)}
            required
            aria-required="true"
            className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-900 bg-white outline-none transition-colors focus:border-primary focus:ring-3 focus:ring-primary/10 placeholder:text-slate-400"
          />
        </div>

        {/* Alert type toggles */}
        <fieldset className="flex flex-col gap-2">
          <legend className="text-xs font-semibold text-slate-500 tracking-[0.04em] uppercase mb-1">
            Tipos de alerta
          </legend>
          {ALERT_TYPES.map(type => (
            <div
              key={type.id}
              className="flex items-center justify-between gap-3 py-2.5 px-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <span className="text-base shrink-0" aria-hidden="true">{type.icon}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 leading-none">{type.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{type.description}</p>
                </div>
              </div>

              {/* Toggle switch — uses Tailwind peer utilities (no custom CSS needed) */}
              <label
                className="relative inline-block w-11 h-6 shrink-0 cursor-pointer"
                htmlFor={`toggle-${type.id}`}
                aria-label={`Activar alerta de ${type.label}`}
              >
                <input
                  type="checkbox"
                  id={`toggle-${type.id}`}
                  className="peer absolute opacity-0 w-0 h-0"
                  checked={selected.has(type.id)}
                  onChange={() => toggleAlert(type.id)}
                />
                <span className="
                  absolute inset-0 rounded-full cursor-pointer transition-colors duration-250
                  bg-slate-300 peer-checked:bg-primary
                  peer-focus-visible:ring-3 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-1
                  before:content-[''] before:absolute before:h-[18px] before:w-[18px]
                  before:left-[3px] before:bottom-[3px]
                  before:bg-white before:rounded-full
                  before:transition-transform before:duration-250 before:shadow-sm
                  peer-checked:before:translate-x-5
                " />
              </label>
            </div>
          ))}
        </fieldset>

        <button
          type="submit"
          disabled={loading || selected.size === 0 || !contact.trim()}
          className="w-full bg-linear-to-r from-primary to-primary-light text-white font-semibold text-sm py-3.5 px-6 rounded-xl border-none cursor-pointer transition-all duration-250 hover:-translate-y-0.5 hover:shadow-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          aria-label={NOTIFICATIONS.subscribeButton}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
              Suscribiendo…
            </span>
          ) : NOTIFICATIONS.subscribeButton}
        </button>

        {error && (
          <p className="text-xs text-high-text bg-high-bg border border-high rounded-lg px-3 py-2 mt-1" role="alert">
            {error}
          </p>
        )}
      </form>
    </section>
  );
}
