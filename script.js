const { useState, useEffect, useRef } = React;
const { createFFmpeg, fetchFile } = FFmpeg;

const ffmpeg = createFFmpeg({ log: true });

const App = () => {
    const [isDark, setIsDark] = useState(true);
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState('Pronto');
    const fileInputRef = useRef();

    useEffect(() => {
        document.body.className = isDark ? '' : 'light-mode';
    }, [isDark]);

    const handleFile = (e) => {
        const selected = Array.from(e.target.files).map(f => ({ id: Math.random(), data: f, name: f.name }));
        setFiles(prev => [...prev, ...selected]);
    };

    const startConversion = async (fileObj) => {
        try {
            setStatus('Inizializzazione...');
            if (!ffmpeg.isLoaded()) await ffmpeg.load();
            
            setStatus('Conversione...');
            const { data, name } = fileObj;
            ffmpeg.FS('writeFile', name, await fetchFile(data));
            
            // Esempio: Converte in MP4
            await ffmpeg.run('-i', name, 'output.mp4');
            
            const result = ffmpeg.FS('readFile', 'output.mp4');
            const url = URL.createObjectURL(new Blob([result.buffer], { type: 'video/mp4' }));
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `conv_${name.split('.')[0]}.mp4`;
            a.click();
            setStatus('Completato!');
        } catch (err) {
            console.error(err);
            setStatus('Errore permessi!');
        }
    };

    return (
        <div className="hero-gradient">
            <header className="flex justify-between items-center px-12 py-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white italic shadow-lg shadow-indigo-500/20">O</div>
                    <div>
                        <h1 className="font-bold text-lg">OmniConvert <span className="text-indigo-500">AI</span></h1>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500">Smart Media Transformation</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <button onClick={() => setIsDark(!isDark)} className="text-xl p-2 hover:scale-110 transition">
                        {isDark ? '☀️' : '🌙'}
                    </button>
                    <a href="https://github.com" target="_blank" className="text-slate-400 text-sm font-medium hover:text-white transition">GitHub <span className="opacity-50">Source</span></a>
                </div>
            </header>

            <main className="max-w-4xl mx-auto pt-20 px-6 text-center">
                <div className="inline-block px-4 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-[11px] font-bold uppercase mb-10">
                    ✨ New: Advanced Video Conversion
                </div>
                <h2 className="text-6xl font-black mb-6 tracking-tight">Convert Everything.<br/>Better Quality.</h2>
                <p className="text-slate-400 text-lg mb-16">Universal converter with AI-powered upscaling and resolution optimization.</p>
                
                <div className="upload-box p-20 mb-16 cursor-pointer hover:border-indigo-500/50 transition" onClick={() => fileInputRef.current.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" multiple />
                    <div className="text-4xl mb-4 text-indigo-500">📥</div>
                    <h3 className="text-2xl font-bold mb-2">Ready for Transformation?</h3>
                    <p className="text-slate-500 text-sm">Trascina i file qui o clicca per caricare</p>
                    <p className="text-[10px] text-indigo-400 mt-4 uppercase font-bold tracking-widest">{status}</p>
                </div>

                <div className="space-y-4 mb-20">
                    {files.map(f => (
                        <div key={f.id} className="feature-card p-4 flex justify-between items-center">
                            <span className="text-sm font-medium ml-4">{f.name}</span>
                            <button onClick={() => startConversion(f)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2 rounded-xl text-xs font-bold uppercase shadow-lg shadow-indigo-500/20 transition">Convert</button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
