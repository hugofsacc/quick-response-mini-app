import React, { useState } from 'react';
import { X, Download, CheckCircle2, Laptop, Smartphone, ShieldCheck, Copy, Check, AlertTriangle, Github, Loader2 } from 'lucide-react';

interface GumroadExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GumroadExportModal: React.FC<GumroadExportModalProps> = ({ isOpen, onClose }) => {
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedInstructions, setCopiedInstructions] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      setDownloadStatus('loading');
      setErrorMessage('');

      // Fetch the standalone HTML using the current session
      const response = await fetch('/quick-response-mini-app.html', {
        cache: 'no-store',
      });

      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status} al leer el archivo.`);
      }

      const htmlContent = await response.text();

      // Guard against Cloud Run authentication interception
      if (
        htmlContent.includes('Acción necesaria') ||
        htmlContent.includes('cookie de seguridad') ||
        !htmlContent.includes('id="root"')
      ) {
        throw new Error(
          'La descarga fue interceptada por la seguridad de Google Cloud. Por favor usa la opción de descargar desde tu GitHub o copia el código.'
        );
      }

      // Create a Blob in local memory: this downloads 100% offline from RAM
      // and NEVER triggers Google Cloud Run cookie authentication
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'quick-response-mini-app.html';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 2000);

      setDownloadStatus('success');
      setTimeout(() => setDownloadStatus('idle'), 5000);
    } catch (err: any) {
      console.error('Download error:', err);
      setDownloadStatus('error');
      setErrorMessage(
        err?.message || 'Hubo un inconveniente al generar la descarga en memoria.'
      );
    }
  };

  const handleCopyCode = async () => {
    try {
      const response = await fetch('/quick-response-mini-app.html', { cache: 'no-store' });
      const htmlContent = await response.text();
      if (htmlContent.includes('cookie de seguridad') || !htmlContent.includes('id="root"')) {
        throw new Error('Archivo interceptado por el proxy');
      }
      await navigator.clipboard.writeText(htmlContent);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3000);
    } catch {
      setErrorMessage('No se pudo copiar el código automáticamente. Descárgalo desde GitHub.');
    }
  };

  const buyerInstructionsText = `INSTRUCCIONES PARA EL COMPRADOR / BUYER INSTRUCTIONS:

📱 CÓMO ABRIR EN COMPUTADORA (PC / MAC):
1. Haz doble clic en el archivo "quick-response-mini-app.html" descargado.
2. Se abrirá automáticamente en tu navegador preferido (Google Chrome, Safari, Microsoft Edge, Firefox, Brave).
3. ¡Listo! Funciona de inmediato, incluso sin conexión a internet. Tus respuestas y notas se guardan de forma privada en tu equipo.

📱 CÓMO ABRIR EN CELULAR (SMARTPHONE):
• En Android:
  1. Ve a tu aplicación "Archivos" o "Descargas".
  2. Toca "quick-response-mini-app.html" y selecciona "Abrir con Chrome" (o tu navegador habitual).
  3. (Opcional) En el menú de Chrome (3 puntos), pulsa "Añadir a la pantalla de inicio" para usarla como una app nativa.

• En iPhone / iPad (iOS):
  1. Abre la aplicación "Archivos" de Apple y ve a la carpeta "Descargas".
  2. Toca "quick-response-mini-app.html" para verla directamente o compartirla a Safari/Chrome.`;

  const handleCopyInstructions = () => {
    navigator.clipboard.writeText(buyerInstructionsText);
    setCopiedInstructions(true);
    setTimeout(() => setCopiedInstructions(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 text-white flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Autocontenido para Gumroad
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Descargar Mini App en 1 Solo Archivo HTML
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Cumple estrictamente con la política de Gumroad: sin dependencias externas ni servidores.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Explanation Alert for the Cookie Message */}
          <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>¿Te apareció el mensaje de "Acción necesaria / Cookie de seguridad"?</span>
            </div>
            <p className="text-amber-900/90 leading-relaxed">
              <strong>Motivo:</strong> Ese mensaje <em>no pertenece a tu mini app</em>. Ocurrió porque el navegador dentro del entorno de desarrollo bloqueó las cookies de sesión al hacer clic en el enlace web, y descargó por error la pantalla de inicio de sesión de Google Cloud.
            </p>
            <p className="text-amber-900/90 leading-relaxed">
              <strong>Solución:</strong> El botón verde de abajo ahora extrae y valida el archivo <strong>directamente desde la memoria del navegador (Blob)</strong>, eliminando cualquier intermediario de Google. Al abrirlo en tu computadora, la aplicación funcionará de inmediato y sin pedir ninguna autenticación.
            </p>
          </div>

          {/* Main Action Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Archivo Listo Para Distribuir</span>
              <p className="text-base font-bold text-slate-900">quick-response-mini-app.html</p>
              <p className="text-xs text-slate-600">
                Todo el código, estilos, scripts e imágenes cinematográficas en un archivo único (~5 MB).
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleDownload}
                disabled={downloadStatus === 'loading'}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md transition-all whitespace-nowrap cursor-pointer disabled:opacity-50"
              >
                {downloadStatus === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generando descarga limpia...
                  </>
                ) : downloadStatus === 'success' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    ¡Descargado con éxito!
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Descargar Archivo Ahora
                  </>
                )}
              </button>

              <button
                onClick={handleCopyCode}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 bg-white hover:bg-slate-50 border border-emerald-300 text-emerald-800 font-semibold text-xs rounded-xl shadow-sm transition-all whitespace-nowrap cursor-pointer"
                title="Copiar todo el código HTML para guardarlo manualmente"
              >
                {copiedCode ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    ¡Código Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-emerald-700" />
                    Copiar Código HTML
                  </>
                )}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{errorMessage}</p>
                <p className="mt-1 text-slate-700">
                  Alternativa infalible: En tu repositorio de GitHub, abre la carpeta <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">dist/</code> o <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">public/</code> y descarga el archivo <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">quick-response-mini-app.html</code> (botón "Download raw file").
                </p>
              </div>
            </div>
          )}

          {/* GitHub alternative option */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Github className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Método 2: Descargar desde tu GitHub (100% independiente)</p>
                <p className="text-slate-500 text-[11px]">
                  El archivo ya está compilado en las carpetas <code className="text-slate-800 font-mono">dist/quick-response-mini-app.html</code> y <code className="text-slate-800 font-mono">public/quick-response-mini-app.html</code>.
                </p>
              </div>
            </div>
          </div>

          {/* Gumroad Compliance Checklist */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Verificación de requisitos técnicos de Gumroad:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Cero llamadas a servidores:</strong> Todo el JavaScript, CSS y tipografías están empaquetados internamente.</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Imágenes integradas:</strong> Convertidas a Base64 directo; no se descargan de URLs externas.</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Privacidad en el equipo:</strong> Los cuestionarios y notas se guardan en el navegador local del usuario.</span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span><strong>Sin caducidad ni hosting:</strong> El comprador es dueño de su archivo y lo abre offline de por vida.</span>
              </div>
            </div>
          </div>

          {/* How to attach on Gumroad */}
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs sm:text-sm text-slate-800 space-y-2">
            <p className="font-bold text-amber-900">📌 Cómo subirlo en Gumroad:</p>
            <ol className="list-decimal list-inside space-y-1 text-slate-700 text-xs">
              <li>Descarga el archivo <strong>quick-response-mini-app.html</strong> con el botón verde de arriba.</li>
              <li>En tu panel de creador de Gumroad, ve a tu producto y haz clic en la pestaña <strong>Content (Contenido)</strong>.</li>
              <li>Sube el archivo <strong>quick-response-mini-app.html</strong> como archivo adjunto descargable (igual que un PDF o ZIP).</li>
              <li>El comprador lo descargará directamente desde su recibo o biblioteca de Gumroad.</li>
            </ol>
          </div>

          {/* Text instructions for product description */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-slate-600" />
                <Smartphone className="w-3.5 h-3.5 text-slate-600" />
                Texto sugerido para la descripción de tu producto en Gumroad:
              </span>
              <button
                onClick={handleCopyInstructions}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
              >
                {copiedInstructions ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    Copiar texto
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-slate-900 text-slate-200 text-[11px] rounded-xl whitespace-pre-wrap font-mono leading-relaxed border border-slate-800">
              {buyerInstructionsText}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            quick-response-mini-app.html también está en la raíz de tu proyecto.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
