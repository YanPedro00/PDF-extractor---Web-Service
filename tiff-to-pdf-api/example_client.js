/**
 * Exemplo de cliente JavaScript/TypeScript para consumir a API TIFF to PDF
 * Use este código no Next.js para integrar a API no site
 */

// Exemplo 1: Converter TIFF para PDF (Node.js)
async function convertTiffToPdf_Node(tiffFilePath) {
  const FormData = require('form-data');
  const fs = require('fs');
  const fetch = require('node-fetch');

  const form = new FormData();
  form.append('file', fs.createReadStream(tiffFilePath));

  const response = await fetch('http://localhost:8001/convert?optimize=true', {
    method: 'POST',
    body: form,
  });

  if (response.ok) {
    const buffer = await response.buffer();
    fs.writeFileSync('output.pdf', buffer);
    console.log('PDF gerado com sucesso!');
  } else {
    console.error('Erro:', await response.text());
  }
}

// Exemplo 2: Converter TIFF para PDF (Browser/Next.js)
async function convertTiffToPdf_Browser(fileInput) {
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  try {
    const response = await fetch('http://localhost:8001/convert?optimize=true', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();
      
      // Criar link de download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'converted.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      
      console.log('PDF gerado e baixado com sucesso!');
    } else {
      const error = await response.text();
      console.error('Erro:', error);
    }
  } catch (error) {
    console.error('Erro na conversão:', error);
  }
}

// Exemplo 3: Obter informações do TIFF
async function getTiffInfo(fileInput) {
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  try {
    const response = await fetch('http://localhost:8001/convert/info', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const info = await response.json();
      console.log('Informações do TIFF:');
      console.log('  Páginas:', info.pages);
      console.log('  Tamanho:', info.size_mb, 'MB');
      console.log('  Dimensões:', info.width, 'x', info.height);
      console.log('  Modo:', info.mode);
      return info;
    } else {
      console.error('Erro:', await response.text());
    }
  } catch (error) {
    console.error('Erro ao obter informações:', error);
  }
}

// Exemplo 4: React Component (Next.js)
/*
'use client'

import { useState } from 'react'

export default function TiffToPdfConverter() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [info, setInfo] = useState(null)

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0]
    setFile(selectedFile)

    // Obter informações do arquivo
    const formData = new FormData()
    formData.append('file', selectedFile)

    const response = await fetch('http://localhost:8001/convert/info', {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      const data = await response.json()
      setInfo(data)
    }
  }

  const handleConvert = async () => {
    if (!file) return

    setLoading(true)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:8001/convert?optimize=true', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = file.name.replace(/\.(tiff?|TIF)$/i, '.pdf')
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      } else {
        alert('Erro na conversão')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro na conversão')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">TIFF para PDF</h1>
      
      <input
        type="file"
        accept=".tiff,.tif"
        onChange={handleFileChange}
        className="mb-4"
      />

      {info && (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h2 className="font-bold mb-2">Informações do arquivo:</h2>
          <p>Páginas: {info.pages}</p>
          <p>Tamanho: {info.size_mb} MB</p>
          <p>Dimensões: {info.width} x {info.height}</p>
        </div>
      )}

      <button
        onClick={handleConvert}
        disabled={!file || loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
      >
        {loading ? 'Convertendo...' : 'Converter para PDF'}
      </button>
    </div>
  )
}
*/

module.exports = {
  convertTiffToPdf_Node,
  convertTiffToPdf_Browser,
  getTiffInfo
}

