
import transformers
import numpy as np
import librosa

pipe = transformers.pipeline(
    model='fixie-ai/ultravox-v0_4', trust_remote_code=True)

path = " ./audio/OSR_us_000_0010_8k.wav"
audio, sr = librosa.load(path, sr=16000)


turns = [
    {
        "role": "system",
        "content": "You are a friendly and helpful character. You love to answer questions for people."
    },
]
pipe({'audio': audio, 'turns': turns, 'sampling_rate': sr}, max_new_tokens=30)
