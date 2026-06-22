# NutriScan - Analizador de Etiquetas Nutricionales con IA

[🇬🇧 English Documentation below](#english-documentation)

NutriScan es una aplicación web moderna y adaptable que utiliza inteligencia artificial para analizar etiquetas nutricionales y códigos de barras. Ofrece recomendaciones de salud personalizadas basadas en tus objetivos y condiciones dietéticas únicas.

## 🌟 Características

- 📸 **Escaneo de Etiquetas**: Sube o toma una foto de una etiqueta nutricional para un análisis instantáneo impulsado por la IA de Gemini.
- 🔍 **Escáner de Códigos de Barras**: Escanea rápidamente códigos de barras de productos usando la cámara o imágenes de tu galería para obtener datos nutricionales.
- 🧠 **Evaluación con IA**: Evalúa los productos según tus objetivos de salud específicos (ej. "diabético", "bajo en sodio", "evitar ultraprocesados").
- 📱 **Diseño Profesional "Liquid Glass"**: Interfaz oscura, elegante y moderna optimizada para dispositivos móviles y de escritorio, fácil de usar con una sola mano.
- 💾 **Historial de Escaneos**: Mantén un registro local de tus productos escaneados y analizados previamente directamente en tu navegador.

## 🛠 Tecnologías Utilizadas

- **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion
- **Herramientas de construcción:** Vite
- **Integraciones e IA:** Google Gemini API (`@google/genai`), Open Food Facts API, React Webcam, Zxing (`react-zxing`)

## 🚀 Cómo Empezar

### Requisitos Previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- Una clave de API de **Google Gemini** (puedes obtenerla desde [Google AI Studio](https://aistudio.google.com/app/apikey))

### Instalación Local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/your-username/nutriscan.git
   ```
2. Entra al directorio del proyecto:
   ```bash
   cd nutriscan
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Configura tus variables de entorno:
   - Renombra el archivo `.env.example` a `.env`
   - Añade tu clave de API de Gemini en el archivo `.env`:
     ```env
     GEMINI_API_KEY=tu_clave_de_api_aqui
     ```
5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
6. Abre `http://localhost:3000` en tu navegador.

---

<a name="english-documentation"></a>

# NutriScan - AI Nutrition Label Analyzer

NutriScan is a modern, responsive web application that leverages artificial intelligence to analyze nutrition labels and product barcodes. It provides personalized health recommendations based on your unique dietary goals and conditions.

## 🌟 Features

- 📸 **Label Scanning**: Upload or take a picture of a nutrition label for instant AI-powered analysis using Gemini.
- 🔍 **Barcode Scanner**: Quickly scan product barcodes via your camera or photo gallery to fetch nutritional data automatically.
- 🧠 **AI Evaluation**: Evaluates products against your specific health goals (e.g., "diabetic", "low sodium", "avoid ultra-processed foods").
- 📱 **Professional "Liquid Glass" Design**: A sleek, modern dark UI designed for single-handed usability and responsiveness on mobile and desktop devices.
- 💾 **Scan History**: Keep track of your previously scanned products locally in your browser.

## 🛠 Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, Framer Motion
- **Build Tooling:** Vite
- **Integrations & AI:** Google Gemini API (`@google/genai`), Open Food Facts API, React Webcam, Zxing (`react-zxing`)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- A **Google Gemini API Key** (obtainable from [Google AI Studio](https://aistudio.google.com/app/apikey))

### Local Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/nutriscan.git
   ```
2. Navigate into the directory:
   ```bash
   cd nutriscan
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up your environment variables:
   - Rename `.env.example` to `.env`
   - Add your Gemini API key in the `.env` file:
     ```env
     GEMINI_API_KEY=your_api_key_here
     ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000` in your browser.
