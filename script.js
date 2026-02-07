const { useState, useEffect, useRef } = React;
const { createFFmpeg, fetchFile } = FFmpeg;

const ffmpeg = createFFmpeg({ log: false });

const App = () => {
    const [isDark, setIsDark] = useState(true);
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState('');
    const fileInputRef = useRef();

    useEffect(() => {
        document.body.className = isDark ? '' : 'light-mode';
    }, [isDark]);

    const handleFile = (e) => {
        const selected = Array.from(e.target.files).map(f => ({ id: Math.random(), data: f, name: f.name }));
        setFiles(prev => [...prev, ...selected]);
    };

    const convert = async (fileObj) => {
        try {
            setStatus('Inizializzazione...');
            if (!ffmpeg.isLoaded()) await ffmpeg.load();
            setStatus('Conversione in corso...');
            ffmpeg.FS('writeFile', fileObj.name, await fetchFile(fileObj.data));
            await ffmpeg.run('-i', fileObj.name, 'output.mp4');
            const data = ffmpeg.FS('readFile', 'output.mp4');
            const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            const a = document.createElement('a');
            a.href = url;
            a.download = `converted_${fileObj.name.split('.')[0]}.mp4`;
            a.click();
            setStatus('Fatto!');
            setTimeout(() => setStatus(''), 3000);
        } catch (err) {
            console.error(err);
            setStatus('Errore Permessi!');
        }
    };

    return (
        <div className="hero-gradient flex flex-col items-center">
            <header className="w-full flex justify-between items-center px-8 py-6 max-w-7xl">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">O</div>
                    <h1 className="font-bold text-xl tracking-tighter">OmniConvert AI</h1>
                </div>
                <div className="flex items-center gap-6">
                    <button onClick={() => setIsDark(!isDark)} className="text-2xl hover:scale-110 transition">
                        {isDark ? '☀️' : '🌙'}
                    </button>
                    <a href="#" className="text-sm font-medium opacity-50 hover:opacity-100 transition">Source</a>
                </div>
            </header>

            <main className="w-full max-w-4xl px-6 py-12 flex flex-col items-center">
                <div className="text-center mb-12">
                    <div className="inline-block px-4 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-500 text-[10px] font-bold uppercase tracking-widest mb-6">
                        ✨ Pro version 2.0
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight">
                        Convert Everything.<br/>Better Quality.
                    </h2>
                    <p className="text-[var(--text-sec)] text-lg max-w-xl mx-auto">
                        Powerful browser-based converter with resolution optimization.
                    </p>
                </div>

                <div className="upload-box w-full p-12 md:p-16 text-center cursor-pointer mb-10" onClick={() => fileInputRef.current.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" multiple />
                    <div className="text-5xl mb-4">📥</div>
                    <h3 className="text-2xl font-bold mb-2">Ready for Transformation?</h3>
                    <p className="text-[var(--text-sec)]">Click or drag files here</p>
                    {status && <p className="text-indigo-500 font-bold mt-4 animate-pulse">{status}</p>}
                </div>

                {/* Lista File Caricati */}
                <div className="w-full space-y-3 mb-16">
                    {files.map(f => (
                        <div key={f.id} className="feature-card p-4 flex justify-between items-center">
                            <span className="font-medium text-sm truncate">{f.name}</span>
                            <button onClick={(e) => { e.stopPropagation(); convert(f); }} className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-xs font-bold uppercase">Convert</button>
                        </div>
                    ))}
                </div>

                {/* SEZIONE FEATURES (Pulsanti sotto) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <div className="feature-card p-6">
                        <div className="text-indigo-500 mb-4 text-xl">🛡️</div>
                        <h4 className="font-bold mb-2">Private & Secure</h4>
                        <p className="text-xs text-[var(--text-sec)]">I file non lasciano mai il tuo browser. 100% Privacy.</p>
                    </div>
                    <div className="feature-card p-6">
                        <div className="text-indigo-500 mb-4 text-xl">⚡</div>
                        <h4 className="font-bold mb-2">Fast Engine</h4>
                        <p className="text-xs text-[var(--text-sec)]">Ottimizzato per conversioni rapide e alta qualità.</p>
                    </div>
                    <div className="feature-card p-6">
                        <div className="text-indigo-500 mb-4 text-xl">💎</div>
                        <h4 className="font-bold mb-2">AI Upscaling</h4>
                        <p className="text-xs text-[var(--text-sec)]">Migliora la risoluzione dei tuoi file automaticamente.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
