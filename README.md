# Trump Tweet Generator

A simple project that trains a bigram-based language model on President Trump's tweets, provides an inference API, and offers a modern web interface to generate new tweets with adjustable parameters.

---

## 🔧 Model

This section describes the data pipeline, model, and inference setup.

### 1. Data Cleaning & Processing
- **`dataProcessing.py`**: Reads raw tweet text (`input3.txt`), cleans unwanted characters, builds a vocabulary and mappings (string-to-index and index-to-string).  
- Generates a cleaned corpus (`input3_cleaned.txt`) and precomputes bigram counts.

### 2. Bigram Model Implementation
- **`bigramsTrump.py`**: Implements a character-level bigram language model using a Transformer-inspired architecture, built in PyTorch.

#### Model Architecture
- **Embedding Layers:**
  - **Token Embedding:** Each character in the vocabulary is mapped to a dense vector (`n_embd` dimensions).
  - **Position Embedding:** Adds information about the position of each character in the sequence, enabling the model to capture order.

- **Transformer Blocks:** Stacked blocks, each containing:
  - **Multi-Head Self-Attention:** Allows the model to attend to different positions in the input sequence, capturing dependencies between characters.
  - **Feedforward Network:** A two-layer fully connected network applied independently at each position.
  - **Layer Normalization:** Applied before attention and feedforward sub-layers for stable training.
  - **Residual Connections:** Input to each sub-layer is added to its output, helping gradients flow and enabling deeper networks.
  - **Dropout:** Randomly zeroes out elements during training to prevent overfitting.

- **Output Layer:** A linear projection from final embeddings to vocabulary size, producing logits for next-character prediction.

#### Optimization Techniques
- **Dropout:** Used throughout attention, feedforward, and output layers to improve generalization.
- **Residual Connections:** Enable deeper architectures and faster convergence by learning modifications to inputs.
- **Layer Normalization:** Normalizes activations before each sub-layer, enhancing training stability.

#### Training & Inference
- The model is trained to maximize the likelihood of the next character given prior context, using cross-entropy loss.
- After training, parameters and vocabulary mappings are saved in `model_checkpoint.pt` via `torch.save`.

### 3. Checkpoint & Inference
- **`model_checkpoint.pt`**: Serialized model weights and vocabulary mappings stored via `torch.save`.  
- **`inference.py`**: 
  - **`load_model(path)`**: Loads the checkpoint and restores the model and token mappings (stoi, itos).  
  - **`generate_text(model, stoi, itos, temperature, top_k, max_tokens)`**: Samples tokens step-by-step, applying temperature scaling and top-k filtering to produce a new tweet.

> All model code and data files live under the `model/` directory.

---

## 🌐 Web App

A Next.js + Tailwind frontend that calls the model API to generate tweets with user-adjustable sliders.

### Deployment & API
- The model inference service is deployed as a Hugging Face Space:  
  https://huggingface.co/spaces/AnandVishesh1301/tweet-prediction-hf/tree/main 
- The frontend sends a POST request to `/generate` with JSON payload `{ temperature, top_k, max_tokens }`.

### Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Components**:  
  - **`ParameterSlider`**: Reusable slider with label, current value, and info tooltip.  
  - **`page.tsx`**: Home page implementing sliders, loading indicator, and output area.

### User Controls
- **Temperature** (0.1 – 2.0): Higher values make outputs more random and creative.  
- **Top-K** (1 – 100): Limits sampling to the top K probable tokens, balancing diversity and coherence.  
- **Max Tokens** (10 – 500): Sets the maximum length of the generated tweet.

When the user clicks **Generate Tweet**, the app shows an animated spinner and clear message until inference completes.  
Users can adjust sliders in real time to explore different styles of generated text.

> All frontend code lives under the `web/` directory and references the public `flag.png` and `president.png` assets.

---

## 🚀 Getting Started

1. **Clone the repo**:
   ```bash
   git clone <repo-url>
   cd tweet-predicton-transformer
   ```

2. **Model Setup** (optional if you only use the hosted API):
   ```bash
   cd model
   pip install -r requirements.txt
   python dataProcessing.py
   python bigramsTrump.py
   ```

3. **Frontend**:
   ```bash
   cd web
   npm install
   npm run dev
   ```

Visit the live app at https://tweetpredictiontransformer.vercel.app/ and enjoy generating Trump-style tweets!  
(This project is for educational purposes only.)
