const { useState, useRef, useEffect } = React;
const { createFFmpeg, fetchFile } = FFmpeg;

const ffmpeg = createFFmpeg({ log: false });

const App = () => {
    const [isDark, setIsDark] = useState(true);
    const [files, setFiles] = useState([]);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef(null);

    useEffect(() => {
        ffmpeg.load();
        // Applica la classe al body per il CSS
        document.body.className = isDark ? '' : 'light-mode';
    }, [isDark]);

    ffmpeg.setProgress(({ ratio }) => {
        setProgress(Math.round(ratio * 100));
    });

    const handleFileChange = (e) => {
        const selected = Array.from(e.target.files).map(f => ({
            id: Math.random(),
            data: f,
            name: f.name,
            targetFormat: 'mp4'
        }));
        setFiles([...files, ...selected]);
    };

    const convertFile = async (fileObj) => {
        setIsConverting(true);
        const { name, data, targetFormat } = fileObj;
        ffmpeg.FS('writeFile', name, await fetchFile(data));
        await ffmpeg.run('-i', name, `out.${targetFormat}`);
        const result = ffmpeg.FS('readFile', `out.${targetFormat}`);
        const url = URL.createObjectURL(new Blob([result.buffer]));
        const a = document.createElement('a');
        a.href = url;
        a.download = `conv_${name.split('.')[0]}.${targetFormat}`;
        a.click();
        setIsConverting(false);
        setProgress(0);
    };

    return (
        <div className="hero-gradient">
            <header className="flex items-center justify-between px-12 py-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold italic">O</div>
                    <div>
                        <h1 className="font-bold text-lg">OmniConvert <span className="text-indigo-500">AI</span></h1>
                        <p className="text-[10px] uppercase tracking-widest text-slate-500">Smart Media Transformation</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    {/* TASTO LIGHT/DARK MODE */}
                    <button 
                        onClick={() => setIsDark(!isDark)}
                        className="text-xl hover:scale-110 transition"
                    >
                        {isDark ? '☀️' : '🌙'}
                    </button>
                    <span className="text-slate-400 text-sm">Source</span>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 pt-20 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-[11px] font-bold uppercase mb-10">
                    ✨ New: Advanced Video Conversion
                </div>

                <h2 className="text-6xl font-extrabold mb-6 leading-tight">Convert Everything.<br/>Better Quality.</h2>
                <p className="text-slate-400 text-lg mb-16">Universal converter with AI-powered upscaling and optimization.</p>
                
                <div className="upload-box p-20 mb-16 cursor-pointer" onClick={() => fileInputRef.current.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
                    <div className="text-4xl mb-4 text-indigo-500">📥</div>
                    <h3 className="text-2xl font-bold mb-2">Ready for Transformation?</h3>
                    <p className="text-slate-500 text-sm mb-10">Drop files here</p>

                    {isConverting && (
                        <div className="mb-8">
                            <div className="text-indigo-500 font-bold text-xs mb-2">CONVERTING... {progress}%</div>
                            <div className="progress-bar-container"><div className="progress-bar-fill" style={{width: `${progress}%`}}></div></div>
                        </div>
                    )}
                </div>

                <div className="space-y-4 mb-20">
                    {files.map(f => (
                        <div key={f.id} className="feature-card p-4 flex items-center justify-between">
                            <span className="text-sm font-medium">{f.name}</span>
                            <button onClick={() => convertFile(f)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase">Convert</button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
