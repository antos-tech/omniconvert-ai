const { useState, useEffect, useRef } = React;
const { createFFmpeg, fetchFile } = FFmpeg;

const ffmpeg = createFFmpeg({ log: true });

const App = () => {
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState('');
    const [format, setFormat] = useState('mp4'); // Selezione formato
    const fileInputRef = useRef();

    const handleFile = (e) => {
        const selected = Array.from(e.target.files).map(f => ({ id: Math.random(), data: f, name: f.name }));
        setFiles(prev => [...prev, ...selected]);
    };

    const convert = async (fileObj) => {
        try {
            setStatus('Caricamento motore...');
            if (!ffmpeg.isLoaded()) await ffmpeg.load();
            
            setStatus('Conversione in corso...');
            const outName = `output.${format}`;
            ffmpeg.FS('writeFile', fileObj.name, await fetchFile(fileObj.data));
            
            await ffmpeg.run('-i', fileObj.name, outName);
            
            const data = ffmpeg.FS('readFile', outName);
            const url = URL.createObjectURL(new Blob([data.buffer], { type: `video/${format}` }));
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `OmniConvert_${fileObj.name.split('.')[0]}.${format}`;
            a.click();
            setStatus('Completato!');
            setTimeout(() => setStatus(''), 3000);
        } catch (e) {
            console.error(e);
            setStatus('Errore! Controlla console');
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center bg-[#020617] text-white font-sans" style={{background: 'radial-gradient(circle at 50% -20%, #1e1b4b 0%, #020617 80%)'}}>
            <header className="w-full max-w-7xl flex justify-between items-center px-8 py-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-indigo-500/30">O</div>
                    <h1 className="font-bold text-xl tracking-tighter">OmniConvert AI</h1>
                </div>
                <div className="flex items-center gap-4">
                    <label className="text-xs font-bold uppercase text-slate-500">Formato:</label>
                    <select 
                        value={format} 
                        onChange={(e) => setFormat(e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-indigo-500"
                    >
                        <option value="mp4">MP4 (Video)</option>
                        <option value="mkv">MKV (Video)</option>
                        <option value="avi">AVI (Video)</option>
                        <option value="mp3">MP3 (Audio)</option>
                    </select>
                </div>
            </header>

            <main className="w-full max-w-4xl px-6 py-12 flex flex-col items-center text-center">
                <div className="inline-block px-4 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-8">
                    ✨ Browser Engine 2.0
                </div>
                
                <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-tight">
                    Convert Everything.
                </h2>
                
                <div className="w-full p-12 border-2 border-dashed border-indigo-500/30 rounded-[2rem] bg-slate-900/40 backdrop-blur-md cursor-pointer hover:border-indigo-500 transition-all mb-10" onClick={() => fileInputRef.current.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" multiple />
                    <div className="text-5xl mb-4">📥</div>
                    <h3 className="text-2xl font-bold">Trascina i file qui</h3>
                    <p className="text-slate-500 mt-2 italic text-sm">Seleziona il formato sopra prima di convertire</p>
                    {status && <p className="text-indigo-400 mt-4 font-bold animate-pulse">{status}</p>}
                </div>

                <div className="w-full space-y-4 mb-16">
                    {files.map(f => (
                        <div key={f.id} className="flex justify-between items-center bg-slate-900/60 p-5 rounded-2xl border border-indigo-500/20">
                            <span className="text-sm font-medium">{f.name}</span>
                            <button onClick={(e) => { e.stopPropagation(); convert(f); }} className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-xl text-xs font-bold uppercase transition shadow-lg shadow-indigo-500/20">
                                Converti in {format.toUpperCase()}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
                    <div className="p-6 bg-slate-900/40 border border-indigo-500/10 rounded-2xl">
                        <div className="text-indigo-500 mb-2">🛡️</div>
                        <h4 className="font-bold text-sm">Privacy Totale</h4>
                        <p className="text-[10px] text-slate-500">I file non vengono inviati a nessun server.</p>
                    </div>
                    <div className="p-6 bg-slate-900/40 border border-indigo-500/10 rounded-2xl">
                        <div className="text-indigo-500 mb-2">⚡</div>
                        <h4 className="font-bold text-sm">Potenza Locale</h4>
                        <p className="text-[10px] text-slate-500">Usa la CPU del tuo computer per la massima velocità.</p>
                    </div>
                    <div className="p-6 bg-slate-900/40 border border-indigo-500/10 rounded-2xl">
                        <div className="text-indigo-500 mb-2">💎</div>
                        <h4 className="font-bold text-sm">Multi-Formato</h4>
                        <p className="text-[10px] text-slate-500">Supporta i principali formati video e audio.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
