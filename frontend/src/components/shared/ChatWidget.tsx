// Asistente conversacional flotante con trazabilidad de fuentes.
// Solo visible para usuarios autenticados; consume POST /api/chat.

import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { enviarChat, type ChatSource } from '../../lib/api';

interface Mensaje {
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
}

const SUGERENCIAS = [
  '¿Qué riesgo tiene el metotrexato?',
  '¿Cuáles medicamentos están en riesgo crítico?',
  '¿Cuánto cuesta la lidocaína?',
];

export default function ChatWidget() {
  const { isSignedIn, user } = useAuth();
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [texto, setTexto] = useState('');
  const [cargando, setCargando] = useState(false);
  const finRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, cargando]);

  if (!isSignedIn) return null;

  const enviar = async (pregunta: string) => {
    const q = pregunta.trim();
    if (!q || cargando) return;
    setTexto('');
    setMensajes((prev) => [...prev, { role: 'user', content: q }]);
    setCargando(true);
    try {
      const historial = mensajes.map((m) => ({ role: m.role, content: m.content }));
      const r = await enviarChat(q, historial, user?.id);
      setMensajes((prev) => [...prev, { role: 'assistant', content: r.respuesta, sources: r.sources }]);
    } catch {
      setMensajes((prev) => [
        ...prev,
        { role: 'assistant', content: 'El asistente no está disponible en este momento. Intenta de nuevo.' },
      ]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setAbierto((p) => !p)}
        aria-label={abierto ? 'Cerrar asistente' : 'Abrir asistente MediWatch'}
        className="fixed bottom-6 right-6 z-[1100] w-14 h-14 rounded-full bg-primary text-white text-2xl shadow-lg cursor-pointer hover:scale-105 transition-transform flex items-center justify-center"
      >
        {abierto ? '✕' : '💬'}
      </button>

      {/* Panel */}
      {abierto && (
        <div
          role="dialog"
          aria-label="Asistente MediWatch"
          className="fixed bottom-24 right-6 z-[1100] w-[min(420px,calc(100vw-3rem))] h-[540px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          <header className="px-4 py-3 bg-primary text-white">
            <p className="font-bold text-sm">Asistente MediWatch</p>
            <p className="text-xs opacity-80">Responde solo con datos oficiales y cita sus fuentes</p>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 bg-slate-50">
            {mensajes.length === 0 && (
              <div className="text-center mt-6">
                <p className="text-sm text-slate-500 mb-4">Pregúntame por disponibilidad, riesgo o precios de medicamentos en Colombia.</p>
                <div className="flex flex-col gap-2">
                  {SUGERENCIAS.map((s) => (
                    <button
                      key={s}
                      onClick={() => enviar(s)}
                      className="text-sm text-primary bg-white border border-blue-200 rounded-full px-4 py-2 cursor-pointer hover:bg-blue-50 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mensajes.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'self-end max-w-[85%]' : 'self-start max-w-[90%]'}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-primary text-white rounded-br-sm'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
                  }`}
                >
                  {m.content}
                </div>
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-1.5 flex flex-col gap-1">
                    {m.sources.map((s, j) => (
                      <p key={j} className="text-[11px] text-slate-400 leading-snug pl-2 border-l-2 border-slate-200">
                        📄 {s.dataset} · {s.registros} registro{s.registros === 1 ? '' : 's'}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {cargando && (
              <div className="self-start bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-2.5 shadow-sm">
                <span className="inline-flex gap-1">
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce [animation-delay:300ms]" />
                </span>
              </div>
            )}
            <div ref={finRef} />
          </div>

          <form
            className="flex gap-2 p-3 border-t border-slate-200 bg-white"
            onSubmit={(e) => {
              e.preventDefault();
              enviar(texto);
            }}
          >
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe tu pregunta…"
              aria-label="Pregunta para el asistente"
              className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={cargando || !texto.trim()}
              className="bg-primary text-white font-semibold text-sm px-4 rounded-full cursor-pointer disabled:opacity-40"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </>
  );
}
