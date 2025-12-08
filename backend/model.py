# model.py
import math
import torch
import torch.nn as nn
import pytorch_lightning as pl

# PositionalEncoding (exact as extracted from your notebook)
class PositionalEncoding(nn.Module):
    def __init__(self, d_model, max_len=10000):
        super().__init__()
        pe = torch.zeros(max_len, d_model)
        pos = torch.arange(0, max_len).unsqueeze(1).float()
        div = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))
        pe[:, 0::2] = torch.sin(pos * div)
        pe[:, 1::2] = torch.cos(pos * div)
        self.register_buffer("pe", pe.unsqueeze(0))  # (1, max_len, d)

    def forward(self, x):
        return x + self.pe[:, :x.size(1), :].to(x.device)


# TransformerV3 exactly as in your notebook PDF
class TransformerV3(pl.LightningModule):
    def __init__(self, num_features, num_series, d_model=256, nhead=8,
                 num_layers=4, pred_len=7, lr=3e-4,
                 weight_decay=1e-5, dropout=0.1):
        super().__init__()
        self.save_hyperparameters()
        self.input_proj = nn.Linear(num_features, d_model)
        self.pos_enc = PositionalEncoding(d_model)

        encoder_layer = nn.TransformerEncoderLayer(
            d_model=d_model,
            nhead=nhead,
            dim_feedforward=1024,
            dropout=dropout,
            batch_first=True
        )
        self.transformer = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)

        self.series_emb = nn.Embedding(num_series, 64)

        self.head = nn.Sequential(
            nn.Linear(d_model + 64, d_model // 2),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(d_model // 2, pred_len)
        )

        self.loss_fn = nn.SmoothL1Loss()
        self.lr = lr
        self.weight_decay = weight_decay

    def forward(self, x, s):
        # x: (B, seq_len, num_features)
        # s: (B,) long tensor of series ids
        x = self.input_proj(x)            # B S d
        x = self.pos_enc(x)
        x = self.transformer(x)           # B S d
        x_last = x[:, -1, :]
        s_emb = self.series_emb(s)
        out = torch.cat([x_last, s_emb], dim=1)
        out = self.head(out)
        return out

    def training_step(self, batch, batch_idx):
        x, y, s = batch
        y_hat = self(x, s)
        loss = self.loss_fn(y_hat, y)
        self.log("train_loss", loss, prog_bar=True)
        return loss

    def validation_step(self, batch, batch_idx):
        x, y, s = batch
        y_hat = self(x, s)
        loss = self.loss_fn(y_hat, y)
        self.log("val_loss", loss, prog_bar=True)
        return loss

    def configure_optimizers(self):
        opt = torch.optim.AdamW(self.parameters(), lr=self.lr, weight_decay=self.weight_decay)
        scheduler = {
            'scheduler': torch.optim.lr_scheduler.ReduceLROnPlateau(opt, mode='min', factor=0.5, patience=4, min_lr=1e-6),
            'monitor': 'val_loss',
            'interval': 'epoch',
            'frequency': 1,
        }
        return [opt], [scheduler]
