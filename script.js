const { useState, useEffect, useRef } = React;
const { createFFmpeg, fetchFile } = FFmpeg;

const ffmpeg = createFFmpeg({ log: false });

const App = () => {
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState('');
    const [targetFormat, setTargetFormat] = useState('mp4');
    const fileInputRef = useRef();

    const handleFile = (e) => {
        const selected = Array.from(e.target.files).map(f => ({ id: Math.random(), data: f, name: f.name }));
        setFiles(selected);
    };

    const convert = async (fileObj) => {
        try {
            setStatus('Inizializzazione...');
            if (!ffmpeg.isLoaded()) await ffmpeg.load();
            setStatus(`Conversione in ${targetFormat}...`);
            const outName = `output.${targetFormat}`;
            ffmpeg.FS('writeFile', fileObj.name, await fetchFile(fileObj.data));
            await ffmpeg.run('-i', fileObj.name, outName);
            const data = ffmpeg.FS('readFile', outName);
            const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
            const a = document.createElement('a');
            a.href = url;
            a.download = `OmniConvert_${fileObj.name.split('.')[0]}.${targetFormat}`;
            a.click();
            setStatus('Fatto!');
            setTimeout(() => setStatus(''), 3000);
        } catch (e) {
            setStatus('Errore di sistema!');
            console.error(e);
        }
    };

    return (
        <div className="hero-gradient flex flex-col items-center text-white">
            <header className="w-full max-w-7xl flex justify-between items-center px-8 py-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold">O</div>
                    <span className="font-bold text-xl tracking-tighter">OmniConvert AI</span>
                </div>
                <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-xl border border-white/10">
                    <span className="text-[10px] font-bold uppercase pl-2 text-slate-400">Converti in:</span>
                    <select 
                        value={targetFormat} 
                        onChange={(e) => setTargetFormat(e.target.value)}
                        className="bg-indigo-600 text-xs font-bold rounded-lg px-3 py-1 outline-none"
                    >
                        <option value="mp4">MP4</option>
                        <option value="mkv">MKV</option>
                        <option value="avi">AVI</option>
                        <option value="mp3">MP3 (Solo Audio)</option>
                    </select>
                </div>
            </header>

            <main className="w-full max-w-3xl px-6 flex flex-col items-center text-center">
                <h2 className="text-6xl font-black mb-6 tracking-tight">Convert Everything.</h2>
                <p className="text-slate-400 mb-12">Private browser-based converter. Your files never leave your computer.</p>

                <div className="w-full p-16 border-2 border-dashed border-indigo-500/30 rounded-[2.5rem] bg-slate-900/40 hover:border-indigo-500 transition-all cursor-pointer" onClick={() => fileInputRef.current.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" />
                    <div className="text-5xl mb-4">📤</div>
                    <p className="font-bold text-xl">Carica il video</p>
                    {status && <p className="text-indigo-400 mt-4 animate-pulse font-bold">{status}</p>}
                </div>

                <div className="w-full mt-10 space-y-4">
                    {files.map(f => (
                        <div key={f.id} className="flex justify-between items-center bg-slate-900/80 p-6 rounded-2xl border border-white/5">
                            <span className="text-sm truncate max-w-[200px]">{f.name}</span>
                            <button onClick={() => convert(f)} className="bg-white text-black px-6 py-2 rounded-xl font-bold text-xs uppercase hover:bg-indigo-500 hover:text-white transition">Inizia Conversione</button>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
