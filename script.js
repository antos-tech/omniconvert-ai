const { useState, useRef, useEffect } = React;
const { createFFmpeg, fetchFile } = FFmpeg;

const ffmpeg = createFFmpeg({ log: false });

const App = () => {
    const [files, setFiles] = useState([]);
    const [isConverting, setIsConverting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [ready, setReady] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        loadFFmpeg();
    }, []);

    const loadFFmpeg = async () => {
        try {
            await ffmpeg.load();
            setReady(true);
        } catch (e) {
            console.error("Errore caricamento motore:", e);
        }
    };

    ffmpeg.setProgress(({ ratio }) => {
        setProgress(Math.round(ratio * 100));
    });

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files).map(file => ({
            id: Math.random().toString(36).substr(2, 9),
            data: file,
            name: file.name,
            format: file.type.split('/')[1] || 'mp4',
            targetFormat: 'mp4'
        }));
        setFiles([...files, ...selectedFiles]);
    };

    const convertFile = async (fileObj) => {
        if (!ready) return;
        setIsConverting(true);
        setProgress(0);

        const { name, data, targetFormat } = fileObj;
        ffmpeg.FS('writeFile', name, await fetchFile(data));
        
        const outputName = `output.${targetFormat}`;
        await ffmpeg.run('-i', name, outputName);

        const result = ffmpeg.FS('readFile', outputName);
        const url = URL.createObjectURL(new Blob([result.buffer], { type: `video/${targetFormat}` }));
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `converted_${name.split('.')[0]}.${targetFormat}`;
        a.click();

        setIsConverting(false);
        setProgress(0);
    };

    return (
        <div className="hero-gradient">
            {/* Header identico alla foto */}
            <header className="flex items-center justify-between px-12 py-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <span className="text-white font-bold italic">O</span>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight">OmniConvert <span className="text-indigo-500">AI</span></h1>
                        <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-medium">Smart Media Transformation</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <button className="text-slate-400 hover:text-white transition">☀️</button>
                    <div className="flex items-center gap-2 text-slate-400 text-sm font-medium cursor-pointer hover:text-white">
                        <span>GitHub</span>
                        <span className="text-xs">Source</span>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 pt-20 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-[11px] font-bold uppercase mb-10 tracking-wider">
                    ✨ New: Advanced Video Conversion
                </div>

                <h2 className="text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                    Convert Everything.<br/>Better Quality.
                </h2>
                
                <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-16 leading-relaxed">
                    Universal converter with AI-powered upscaling, automatic tagging, and resolution optimization.
                </p>
                
                <div className="upload-box p-20 mb-16">
                    <div onClick={() => fileInputRef.current.click()} className="cursor-pointer group">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
                        <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-500/20 transition">
                            <span className="text-3xl text-indigo-400">↑</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-2">Ready for Transformation?</h3>
                        <p className="text-slate-500 text-sm mb-10">Drop Images, Videos or Audio files here</p>
                        
                        {/* PROGRESS BAR CHE APPARE DURANTE IL CARICAMENTO */}
                        {isConverting && (
                            <div className="mb-8">
                                <div className="text-indigo-400 font-bold text-xs mb-2 uppercase tracking-widest">Converting... {progress}%</div>
                                <div className="progress-bar-container">
                                    <div className="progress-bar-fill" style={{width: `${progress}%`}}></div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center gap-8 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <span className="flex items-center gap-2 text-green-500/80">● Fully Private</span>
                            <span className="flex items-center gap-2 italic">✨ Gemini Powered</span>
                            <span className="flex items-center gap-2">📹 Multi-Res</span>
                        </div>
                    </div>
                </div>

                {/* File List Section */}
                <div className="space-y-4 mb-20">
                    {files.map(file => (
                        <div key={file.id} className="feature-card p-4 flex items-center justify-between bg-indigo-500/5 border-indigo-500/20">
                            <span className="text-sm font-medium text-slate-200 ml-4">{file.name}</span>
                            <div className="flex items-center gap-4">
                                <select 
                                    value={file.targetFormat}
                                    onChange={(e) => {
                                        const newFiles = files.map(f => f.id === file.id ? {...f, targetFormat: e.target.value} : f);
                                        setFiles(newFiles);
                                    }}
                                >
                                    <option value="mp4">MP4</option>
                                    <option value="avi">AVI</option>
                                    <option value="mkv">MKV</option>
                                    <option value="mp3">MP3</option>
                                </select>
                                <button 
                                    onClick={() => convertFile(file)}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase transition"
                                    disabled={isConverting}
                                >
                                    {isConverting ? 'Processing...' : 'Convert'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Cards identiche alla foto */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left pb-20">
                    <div className="feature-card p-10">
                        <div className="text-2xl mb-6 text-orange-500">✨</div>
                        <h4 className="font-bold text-[11px] uppercase tracking-[0.2em] mb-4 text-slate-100">Intelligent Metadata</h4>
                        <p className="text-[13px] text-slate-500 leading-relaxed font-medium">Gemini visual analysis adds professional tags and renames files meaningfully based on content.</p>
                    </div>
                    <div className="feature-card p-10">
                        <div className="text-2xl mb-6 text-indigo-500">📹</div>
                        <h4 className="font-bold text-[11px] uppercase tracking-[0.2em] mb-4 text-slate-100">High-Res Video</h4>
                        <p className="text-[13px] text-slate-500 leading-relaxed font-medium">Convert to MP4, AVI or MKV with up to 1080p resolution simulation and AI quality enhancement.</p>
                    </div>
                    <div className="feature-card p-10">
                        <div className="text-2xl mb-6 text-green-500">📄</div>
                        <h4 className="font-bold text-[11px] uppercase tracking-[0.2em] mb-4 text-slate-100">Deep Conversion</h4>
                        <p className="text-[13px] text-slate-500 leading-relaxed font-medium">Support for BMP, GIF, PNG, and more with optimized data buffers for maximum fidelity.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);