from fastapi import FastAPI
from pydantic import BaseModel
from inference import load_model, generate_text

app = FastAPI()


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or restrict to your frontend's domain for more security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and vocab at startup
model, stoi, itos = load_model("model_checkpoint.pt")

class GenerationParams(BaseModel):
    temperature: float = 1.0
    top_k: int = 40
    max_tokens: int = 200

@app.post("/generate")
def generate(params: GenerationParams):
    result = generate_text(
        model, stoi, itos,
        max_tokens=params.max_tokens,
        temperature=params.temperature,
        top_k=params.top_k
    )
    return {"output": result}
