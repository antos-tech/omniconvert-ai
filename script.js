const { useState, useRef, useEffect } = React;
const { createFFmpeg, fetchFile } = FFmpeg;

const ffmpeg = createFFmpeg({ log: false });

const App = () => {
    const [isDark, setIsDark] = useState(true);
    const [files, setFiles] = useState([]);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef(null);

    // Gestione reale del tema sul body
    useEffect(() => {
        if (isDark) {
            document.body.classList.remove('light-mode');
        } else {
            document.body.classList.add('light-mode');
        }
    }, [isDark]);

    useEffect(() => {
        ffmpeg.load();
    }, []);

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
        try {
            const { name, data, targetFormat } = fileObj;
            ffmpeg.FS('writeFile', name, await fetchFile(data));
            await ffmpeg.run('-i', name, `output.${targetFormat}`);
            const result = ffmpeg.FS('readFile', `output.${targetFormat}`);
            const url = URL.createObjectURL(new Blob([result.buffer]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `converted_${name.split('.')[0]}.${targetFormat}`;
            a.click();
        } catch (e) {
            console.error(e);
        }
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
                    <button 
                        onClick={() => setIsDark(!isDark)}
                        className="p-2 rounded-lg hover:bg-white/10 transition text-xl"
                    >
                        {isDark ? '☀️' : '🌙'}
                    </button>
                    {/* LINK GITHUB SISTEMATO */}
                    <a 
                        href="https://github.com" 
                        target="_blank" 
                        className="flex items-center gap-2 text-slate-400 text-sm font-medium hover:text-indigo-500 transition"
                    >
                        GitHub <span className="text-xs opacity-50">Source</span>
                    </a>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 pt-20 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-[11px] font-bold uppercase mb-10">
                    ✨ New: Advanced Video Conversion
                </div>

                <h2 className="text-6xl font-extrabold mb-6 tracking-tight">Convert Everything.<br/>Better Quality.</h2>
                <p className="text-slate-400 text-lg mb-16 max-w-2xl mx-auto">Universal converter with AI-powered upscaling, automatic tagging, and resolution optimization.</p>
                
                <div className="upload-box p-20 mb-16 cursor-pointer hover:border-indigo-500/40 transition" onClick={() => fileInputRef.current.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
                    <div className="text-4xl mb-4">📥</div>
                    <h3 className="text-2xl font-bold mb-2">Ready for Transformation?</h3>
                    <p className="text-slate-500 text-sm mb-10">Drop Images, Videos or Audio files here</p>

                    {isConverting && (
                        <div className="mb-8">
                            <div className="text-indigo-500 font-bold text-xs mb-2">CONVERTING... {progress}%</div>
                            <div className="progress-bar-container">
                                <div className="progress-bar-fill" style={{width: `${progress}%`}}></div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center gap-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <span className="text-green-500">✅ Fully Private</span>
                        <span>✨ Gemini Powered</span>
                        <span>📹 Multi-Res</span>
                    </div>
                </div>

                <div className="space-y-4 mb-20">
                    {files.map(f => (
                        <div key={f.id} className="feature-card p-4 flex items-center justify-between animate-fade-in">
                            <span className="text-sm font-medium truncate w-64 text-left ml-4">{f.name}</span>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); convertFile(f); }}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-2 rounded-xl text-xs font-bold uppercase transition shadow-lg shadow-indigo-500/20"
                                >
                                    Convert
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
