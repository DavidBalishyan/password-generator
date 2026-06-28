import { useState, useCallback } from "react";
import generatePassword from "./generate";

const App = () => {
    const [length, setLength] = useState(12);
    const [password, setPassword] = useState("");
    const [copied, setCopied] = useState(false);
    const [options, setOptions] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: false,
    });

    const createPass = useCallback(() => {
        const pw = generatePassword(length, options);
        setPassword(pw);
        setCopied(false);
    }, [length, options]);

    const toggleOption = (key: keyof typeof options) => {
        setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const copyToClipboard = async () => {
        if (!password) return;
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const strength =
        password.length === 0
            ? 0
            : Math.min(
                100,
                (password.length / 16) * 40 +
                Object.values(options).filter(Boolean).length * 15
            );

    const strengthColor =
        strength < 30 ? "bg-red-500" : strength < 60 ? "bg-yellow-500" : "bg-green-500";

    return (
        <div className="min-h-screen bg-[#0d1117] flex items-center justify-center p-4"
            style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(48,54,61,0.4) 1px, transparent 0)`,
                backgroundSize: "24px 24px",
            }}
        >
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <h1 className="text-[28px] font-semibold text-[#e6edf3]">
                        password generator
                    </h1>
                    <p className="text-[13px] text-[#8b949e] mt-1.5">
                        get a strong password in one click
                    </p>
                </div>

                <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-5 space-y-5">
                    <div className="space-y-2">
                        <div
                            className="bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2.5 flex items-center justify-between min-h-[42px]"
                        >
                            {password ? (
                                <span className="text-[15px] text-[#e6edf3] font-mono break-all select-all">
                                    {password}
                                </span>
                            ) : (
                                <span className="text-[13px] text-[#484f58]">
                                    click generate
                                </span>
                            )}
                            <button
                                onClick={copyToClipboard}
                                disabled={!password}
                                className="shrink-0 ml-3 px-2.5 py-1 text-[12px] font-medium rounded
                                    text-[#8b949e] border border-[#30363d] hover:bg-[#30363d] hover:text-[#e6edf3]
                                    disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            >
                                {copied ? "copied" : "copy"}
                            </button>
                        </div>

                        {password && (
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1 bg-[#21262d] rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${strengthColor}`}
                                        style={{ width: `${strength}%` }}
                                    />
                                </div>
                                <span className="text-[11px] text-[#8b949e] w-12 text-right">
                                    {strength < 30
                                        ? "weak"
                                        : strength < 60
                                            ? "okay"
                                            : "strong"}
                                </span>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={createPass}
                        className="w-full py-2 bg-[#238636] hover:bg-[#2ea043] text-[13px] font-semibold text-white rounded-md transition-colors active:scale-[0.98] cursor-pointer"
                    >
                        generate
                    </button>

                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[12px] text-[#e6edf3] font-medium uppercase tracking-wider">
                                    Length
                                </span>
                                <span className="text-[13px] text-[#58a6ff] font-mono font-semibold tabular-nums">
                                    {length}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="4"
                                max="64"
                                value={length}
                                onChange={(e) => {
                                    setLength(Number(e.target.value));
                                    setCopied(false);
                                }}
                                className="w-full h-1.5 bg-[#21262d] rounded-full appearance-none cursor-pointer accent-[#58a6ff]
                                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
                                    [&::-webkit-slider-thumb]:bg-[#58a6ff] [&::-webkit-slider-thumb]:rounded-full
                                    [&::-webkit-slider-thumb]:cursor-pointer
                                    [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5
                                    [&::-moz-range-thumb]:bg-[#58a6ff] [&::-moz-range-thumb]:rounded-full
                                    [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                            />
                            <div className="flex justify-between text-[11px] text-[#484f58] mt-1">
                                <span>4</span>
                                <span>64</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <span className="text-[12px] text-[#e6edf3] font-medium uppercase tracking-wider block">
                                Include
                            </span>
                            {Object.keys(options).map((key) => (
                                <label
                                    key={key}
                                    className="flex items-center justify-between cursor-pointer group py-0.5"
                                >
                                    <span className="text-[13px] text-[#8b949e] capitalize group-hover:text-[#e6edf3] transition-colors">
                                        {key}
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={options[key as keyof typeof options]}
                                        onChange={() =>
                                            toggleOption(key as keyof typeof options)
                                        }
                                        className="sr-only peer"
                                    />
                                    <div className="w-8 h-4 bg-[#21262d] rounded-full peer-checked:bg-[#238636] transition-colors
                                        after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-3 after:h-3
                                        after:bg-[#e6edf3] after:rounded-full after:shadow after:transition-all
                                        peer-checked:after:translate-x-4 relative" />
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
