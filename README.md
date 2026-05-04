# Portafolio Interactivo 3D

> **Sujeto:** Joel Jesús Marcori  
> **Perfil Operativo:** Software Engineer & Technical Artist  

## Resumen del Proyecto

Este repositorio contiene el código fuente de mi portafolio web. 
Diseñado como una experiencia inmersiva híbrida, el proyecto fusiona ingeniería de software frontend con arte técnico (Technical Art). 

La aplicación simula una Oficina de Detective interactiva, permitiendo a los usuarios transitar fluidamente entre un entorno WebGL renderizado en tiempo real (una oficina en 3D) y una interfaz de base de datos plana altamente optimizada y accesible.

## Stack Tecnológico y Arquitectura

El ecosistema fue construido enfocándose en el rendimiento, la escalabilidad de componentes y la gestión eficiente de recursos gráficos pesados.

*   **Núcleo Frontend:** React.js, Vite
*   **Motor Gráfico (WebGL):** Three.js, React Three Fiber (R3F), @react-three/drei
*   **Post-Procesamiento:** @react-three/postprocessing (Bloom, Tone Mapping)
*   **Estilos y UI:** Tailwind CSS
*   **Gestión de Estado global / UI:** React Hooks, renderizado condicional optimizado
*   **Internacionalización (i18n):** `i18next` y `react-i18next` (Soporte dinámico ES/EN basado en diccionarios JSON aislados)

## Características Técnicas Destacadas

*   **Integración 3D/2D Dinámica:** Los objetos interactivos del lienzo 3D (como el monitor) actúan como puentes de enrutamiento visual hacia el DOM estándar (React).
*   **Materiales Emisivos y Shaders:** Uso de `meshBasicMaterial` y umbrales de luminancia personalizados para lograr efectos de Bloom fotorrealistas sin comprometer los FPS.
*   **Optimización de Assets Gráficos:** Modelos exportados con coordenadas UV mapeadas dinámicamente y jerarquías limpias (`useGLTF`) para reducir los tiempos de carga (TTFB y FCP).
*   **Arquitectura de Datos Desacoplada:** Toda la información del portafolio (experiencia, proyectos, perfil) se consume desde archivos estáticos `.json`, asegurando que la capa de presentación esté completamente separada de la capa de datos.

---

# 3D Interactive Portfolio

> **Subject:** Joel Jesús Marcori  
> **Operative Profile:** Software Engineer & Technical Artist  


## Project Summary

This repository contains the source code for my web portfolio. Designed as a hybrid immersive experience, the project merges frontend software engineering with Technical Art. 

The application simulates an interactive Detective Office, allowing users to seamlessly transition between a real-time WebGL environment (a 3D detective's office) and a highly optimized, accessible flat-text database interface.

## Tech Stack & Architecture

The ecosystem was built with a strong focus on technical performance, component scalability, and efficient management of heavy graphic resources.

*   **Frontend Core:** React.js, Vite
*   **Graphics Engine (WebGL):** Three.js, React Three Fiber (R3F), @react-three/drei
*   **Post-Processing:** @react-three/postprocessing (Bloom, Tone Mapping)
*   **Styling & UI:** Tailwind CSS
*   **State Management:** React Hooks, optimized conditional rendering
*   **Internationalization (i18n):** `i18next` and `react-i18next` (Dynamic ES/EN support based on isolated JSON dictionaries)

## Key Technical Features

*   **Dynamic 3D/2D Integration:** Interactive objects within the 3D canvas (such as the in-game monitor) act as visual routing bridges to the standard DOM (React).
*   **Emissive Materials & Shaders:** Implementation of `meshBasicMaterial` and custom luminance thresholds to achieve photorealistic Bloom effects without compromising FPS.
*   **Graphic Asset Optimization:** Models exported with dynamically mapped UV coordinates and clean hierarchies (`useGLTF`) to reduce load times (TTFB and FCP).
*   **Decoupled Data Architecture:** All portfolio data (experience, projects, profile) is consumed from static `.json` files, ensuring the presentation layer is entirely separated from the data layer.

---

# License & Intellectual Property
Copyright (c) 2026 Joel Marcori. All rights reserved.

This repository is public exclusively for technical auditing, portfolio review, and educational/personal learning purposes. The source code, 3D models (.glb), textures, and UI design are proprietary material.

Commercial use, monetization, or repurposing this repository as your own professional portfolio is strictly prohibited. You may study and modify the code for non-commercial educational purposes. Please review the attached LICENSE file in the root of this repository for full terms and conditions.