import torch
import torch.nn as nn
from torch.nn import functional as F
import argparse

# Model Components ------------------------------------------------------------
class Head(nn.Module):
    def __init__(self, n_embd, head_size, block_size, dropout, device):
        super().__init__()
        self.key = nn.Linear(n_embd, head_size, bias=False)
        self.query = nn.Linear(n_embd, head_size, bias=False)
        self.value = nn.Linear(n_embd, head_size, bias=False)
        self.register_buffer('tril', torch.tril(torch.ones(block_size, block_size)))
        self.dropout = nn.Dropout(dropout)
    
    def forward(self, x):
        B, T, C = x.shape
        k = self.key(x)
        q = self.query(x)
        wei = q @ k.transpose(-2, -1) * C**-0.5
        wei = wei.masked_fill(self.tril[:T, :T] == 0, float('-inf'))
        wei = F.softmax(wei, dim=-1)
        wei = self.dropout(wei)
        v = self.value(x)
        out = wei @ v
        return out

class MultiHeadAttention(nn.Module):
    def __init__(self, n_embd,num_heads, head_size, block_size, dropout, device):
        super().__init__()
        self.heads = nn.ModuleList([
            Head(n_embd, head_size, block_size, dropout, device) for _ in range(num_heads)
        ])
        self.proj = nn.Linear(n_embd, n_embd)
        self.dropout = nn.Dropout(dropout)
    
    def forward(self, x):
        out = torch.cat([h(x) for h in self.heads], dim=-1)
        out = self.dropout(self.proj(out))
        return out

class FeedFoward(nn.Module):
    def __init__(self, n_embd, dropout):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(n_embd, 4 * n_embd),
            nn.ReLU(),
            nn.Linear(4 * n_embd, n_embd),
            nn.Dropout(dropout),
        )
    
    def forward(self, x):
        return self.net(x)

class Block(nn.Module):
    def __init__(self, n_embd, n_head, block_size, dropout, device):
        super().__init__()
        head_size = n_embd // n_head
        self.sa = MultiHeadAttention(n_embd, n_head, head_size, block_size, dropout, device)
        self.ffwd = FeedFoward(n_embd, dropout)
        self.ln1 = nn.LayerNorm(n_embd)
        self.ln2 = nn.LayerNorm(n_embd)
    
    def forward(self, x):
        x = x + self.sa(self.ln1(x))
        x = x + self.ffwd(self.ln2(x))
        return x

class BigramLanguageModel(nn.Module):
    def __init__(self, config):
        super().__init__()
        # Unpack config
        vocab_size = config['vocab_size']
        block_size = config['block_size']
        n_embd = config['n_embd']
        n_head = config['n_head']
        n_layer = config['n_layer']
        dropout = config.get('dropout', 0.2)
        device = config.get('device', 'cpu')
        
        # Initialize layers
        self.token_embedding_table = nn.Embedding(vocab_size, n_embd)
        self.position_embedding_table = nn.Embedding(block_size, n_embd)
        self.blocks = nn.Sequential(*[
            Block(n_embd, n_head, block_size, dropout, device) for _ in range(n_layer)
        ])
        self.ln_f = nn.LayerNorm(n_embd)
        self.ln_head = nn.Linear(n_embd, vocab_size)
        self.block_size = block_size
        self.device = device

    def forward(self, idx, targets=None):
        B, T = idx.shape
        tok_emb = self.token_embedding_table(idx)
        # create positional indices on the same device as input
        pos_emb = self.position_embedding_table(torch.arange(T, device=idx.device))
        x = tok_emb + pos_emb
        x = self.blocks(x)
        x = self.ln_f(x)
        logits = self.ln_head(x)
        
        if targets is None:
            loss = None
        else:
            B, T, C = logits.shape
            logits = logits.view(B*T, C)
            targets = targets.view(B*T)
            loss = F.cross_entropy(logits, targets)
        return logits, loss
    
    def generate(self, idx, max_new_tokens, temperature=1.0, top_k=None):
        for _ in range(max_new_tokens):
            idx_cond = idx[:, -self.block_size:]
            logits, _ = self(idx_cond)
            logits = logits[:, -1, :] / temperature
            
            if top_k is not None:
                v, _ = torch.topk(logits, min(top_k, logits.size(-1)))
                logits[logits < v[:, [-1]]] = -float('Inf')
            
            probs = F.softmax(logits, dim=-1)
            idx_next = torch.multinomial(probs, num_samples=1)
            idx = torch.cat((idx, idx_next), dim=1)
        return idx

# Loading and Generation Functions --------------------------------------------
def load_model(path='model_checkpoint.pt'):
    checkpoint = torch.load(path, map_location='cpu')
    config = checkpoint['config']
    model = BigramLanguageModel(config)
    model.load_state_dict(checkpoint['model_state'])
    return model, checkpoint['stoi'], checkpoint['itos']

def generate_text(model, stoi, itos, max_tokens=200, temperature=1.0, top_k=40):
    device = 'cuda' if torch.cuda.is_available() else 'cpu'
    model.to(device)
    model.eval()
    
    # Start with empty context
    context = torch.zeros((1, 1), dtype=torch.long, device=device)
    
    with torch.no_grad():
        output = model.generate(
            context, 
            max_new_tokens=max_tokens,
            temperature=temperature,
            top_k=top_k
        )
    return ''.join([itos[i] for i in output[0].tolist()])

# Main Execution --------------------------------------------------------------
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Generate Trump-style tweets')
    parser.add_argument('--max_tokens', type=int, default=200, help='Max tokens to generate')
    parser.add_argument('--temperature', type=float, default=1.0, help='Sampling temperature')
    parser.add_argument('--top_k', type=int, default=40, help='Top-k sampling')
    
    args = parser.parse_args()
    
    print("Loading model...")
    model, stoi, itos = load_model()
    print("Generating text...")
    generated_text = generate_text(
        model, 
        stoi, 
        itos,
        max_tokens=args.max_tokens,
        temperature=args.temperature,
        top_k=args.top_k
    )
    
    print("\nGenerated Trump Tweet:")
    print("---------------------")
    print(generated_text)
    print("---------------------")
