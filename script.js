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
        setStatus('Caricamento...');
        if (!ffmpeg.isLoaded()) await ffmpeg.load();
        setStatus('Conversione...');
        ffmpeg.FS('writeFile', fileObj.name, await fetchFile(fileObj.data));
        await ffmpeg.run('-i', fileObj.name, 'output.mp4');
        const data = ffmpeg.FS('readFile', 'output.mp4');
        const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = `convertito_${fileObj.name.split('.')[0]}.mp4`;
        a.click();
        setStatus('');
    };

    return (
        <div className="hero-gradient">
            <header className="w-full flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">O</div>
                    <h1 className="font-bold text-xl tracking-tighter text-[var(--text)]">OmniConvert AI</h1>
                </div>
                <div className="flex items-center gap-6">
                    <button onClick={() => setIsDark(!isDark)} className="text-2xl hover:scale-110 transition">
                        {isDark ? '☀️' : '🌙'}
                    </button>
                    <a href="#" className="text-sm font-medium opacity-50 hover:opacity-100 transition">Source</a>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
                <div className="text-center max-w-3xl">
                    <div className="inline-block px-4 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-500 text-[10px] font-bold uppercase tracking-widest mb-8">
                        ✨ Pro version active
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight text-[var(--text)]">
                        Convert Everything.<br/>Better Quality.
                    </h2>
                    <p className="text-[var(--text-sec)] text-lg mb-12 max-w-xl mx-auto">
                        Powerful browser-based converter with resolution optimization.
                    </p>
                </div>

                <div 
                    className="upload-box w-full max-w-2xl p-12 md:p-20 text-center cursor-pointer"
                    onClick={() => fileInputRef.current.click()}
                >
                    <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" multiple />
                    <div className="text-5xl mb-6">📥</div>
                    <h3 className="text-2xl font-bold mb-2">Ready for Transformation?</h3>
                    <p className="text-[var(--text-sec)] mb-4">Click or drag files here</p>
                    {status && <p className="text-indigo-500 font-bold animate-pulse">{status}</p>}
                </div>

                <div className="w-full max-w-2xl space-y-4 mt-10">
                    {files.map(f => (
                        <div key={f.id} className="feature-card p-5 flex justify-between items-center">
                            <span className="font-medium text-sm truncate pr-4">{f.name}</span>
                            <button 
                                onClick={(e) => { e.stopPropagation(); convert(f); }}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase transition shrink-0"
                            >
                                Convert
                            </button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
