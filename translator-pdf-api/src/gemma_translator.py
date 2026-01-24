#!/usr/bin/env python3
"""
Classe de tradução usando Gemma 2 2B treinado com LoRA
"""

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
from pathlib import Path


class GemmaTranslator:
    """
    Tradutor técnico EN→PT usando Gemma 2 2B fine-tuned
    """
    
    def __init__(self, model_dir=None):
        """
        Inicializa o tradutor.
        
        Args:
            model_dir: Caminho para o diretório do modelo LoRA treinado
        """
        if model_dir is None:
            # Caminho padrão relativo ao diretório do script
            base_dir = Path(__file__).parent.parent
            model_dir = base_dir / "translator-model" / "final_model_gemma_sft"
        
        self.model_dir = str(model_dir)
        self.base_model_name = 'google/gemma-2-2b-it'
        
        self.model = None
        self.tokenizer = None
        self._loaded = False
    
    def load_model(self):
        """Carrega o modelo e tokenizer (lazy loading)"""
        if self._loaded:
            return
        
        print(f"🔧 Carregando modelo de tradução...")
        print(f"   Base: {self.base_model_name}")
        print(f"   LoRA: {self.model_dir}")
        print(f"   ⚠️  Isso pode demorar alguns segundos...")
        
        # Carregar tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(
            self.model_dir,
            trust_remote_code=True
        )
        
        # Carregar modelo base
        base_model = AutoModelForCausalLM.from_pretrained(
            self.base_model_name,
            torch_dtype=torch.float32,
            device_map='cpu',
            trust_remote_code=True,
            low_cpu_mem_usage=True,
        )
        
        # Carregar adaptadores LoRA
        self.model = PeftModel.from_pretrained(base_model, self.model_dir)
        self.model.eval()
        
        self._loaded = True
        print(f"   ✅ Modelo carregado com sucesso!")
    
    def translate(self, text, max_new_tokens=128, temperature=0.3):
        """
        Traduz texto técnico EN→PT.
        
        Args:
            text: Texto em inglês para traduzir
            max_new_tokens: Máximo de tokens a gerar
            temperature: Temperatura de geração (0=determinístico, >0=criativo)
        
        Returns:
            Texto traduzido em português
        """
        # Lazy loading: carregar modelo só quando necessário
        if not self._loaded:
            self.load_model()
        
        # Validar entrada
        if not text or not text.strip():
            return text
        
        # Formatar prompt no template Gemma 2
        instruction = "Traduza o texto técnico em inglês para português brasileiro mantendo a precisão técnica de peças de motocicleta."
        
        prompt = f"""<bos><start_of_turn>user
{instruction}

Texto: {text}<end_of_turn>
<start_of_turn>model
"""
        
        # Tokenizar
        inputs = self.tokenizer(prompt, return_tensors='pt')
        
        # Gerar tradução
        try:
            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_new_tokens=max_new_tokens,
                    temperature=temperature,
                    top_p=0.9,
                    top_k=50,
                    repetition_penalty=1.2,
                    do_sample=True if temperature > 0 else False,
                    pad_token_id=self.tokenizer.pad_token_id,
                    eos_token_id=self.tokenizer.eos_token_id,
                )
            
            # Decodificar
            full_output = self.tokenizer.decode(outputs[0], skip_special_tokens=False)
            
            # Extrair apenas a resposta do modelo
            if '<start_of_turn>model' in full_output:
                translation = full_output.split('<start_of_turn>model')[1]
                translation = translation.split('<end_of_turn>')[0].split('<eos>')[0]
                translation = translation.strip()
                return translation
            else:
                # Fallback: retornar texto original se parsing falhar
                return text
                
        except Exception as e:
            print(f"⚠️  Erro ao traduzir: {e}")
            return text
    
    def __call__(self, text):
        """Permite usar a classe como função: translator(text)"""
        return self.translate(text)


# =============================================================================
# EXEMPLO DE USO
# =============================================================================

if __name__ == "__main__":
    # Criar tradutor
    translator = GemmaTranslator()
    
    # Casos de teste
    test_cases = [
        "Brake hose (black)",
        "Clutch cable (brown)",
        "Use clamp (B02) to fix the wire",
        "Front wheel speed sensor wire (yellow-green)",
    ]
    
    print("\n" + "="*70)
    print("TESTANDO GEMMA TRANSLATOR")
    print("="*70)
    print()
    
    for text in test_cases:
        translation = translator.translate(text)
        print(f"EN: {text}")
        print(f"PT: {translation}")
        print()

