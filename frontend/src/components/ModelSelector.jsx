import { ChevronDown } from 'lucide-react';

const models = [
    {
        id: 'mistral_2',
        name: 'Mistral AI',
        icon: '🇪🇺',
        color: 'var(--model-mistral)',
        description: 'France • Open Source'
    },
    {
        id: 'gpt_5',
        name: 'GPT-5',
        icon: '🇺🇸',
        color: 'var(--model-gpt)',
        description: 'USA • OpenAI'
    },
    {
        id: 'claude_opus',
        name: 'Claude Opus',
        icon: '🇺🇸',
        color: 'var(--model-claude)',
        description: 'USA • Anthropic'
    },
    {
        id: 'gemini_3_pro',
        name: 'Gemini 3 Pro',
        icon: '🇺🇸',
        color: 'var(--model-gemini)',
        description: 'USA • Google'
    },
    {
        id: 'midjourney_v6',
        name: 'Midjourney v6',
        icon: '🇺🇸',
        color: 'var(--model-midjourney)',
        description: 'USA • Image Gen'
    },
];

const ModelSelector = ({ value, onChange, disabled = false }) => {
    const selectedModel = models.find(m => m.id === value) || models[0];

    return (
        <div className="relative">
            <label className="input-label">Modèle IA Cible</label>
            <div
                className="relative"
                style={{ '--model-color': selectedModel.color }}
            >
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className="input-field appearance-none cursor-pointer pr-10 border-2 transition-all"
                    style={{ borderColor: selectedModel.color }}
                >
                    {models.map((model) => (
                        <option key={model.id} value={model.id}>
                            {model.icon} {model.name} — {model.description}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                    style={{ color: selectedModel.color }}
                />
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
                {selectedModel.icon} {selectedModel.description}
            </p>
        </div>
    );
};

export const getModelInfo = (modelId) => {
    return models.find(m => m.id === modelId) || models[0];
};

export default ModelSelector;
