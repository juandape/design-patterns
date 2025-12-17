# Mastra

## Explicación Sencilla

Mastra es un framework para construir aplicaciones de IA que simplifica la integración de agentes, workflows y herramientas de inteligencia artificial. Permite crear chatbots, automatizaciones y sistemas inteligentes con configuración mínima.

**Analogía:** Es como un **asistente personal programable** que puede conversar, ejecutar tareas y aprender de las interacciones. Mastra coordina la comunicación entre tu aplicación y modelos de IA, manteniendo contexto de conversaciones y ejecutando acciones específicas.

## Conceptos Clave

### Agent

Un agente de IA que puede mantener conversaciones, tomar decisiones y ejecutar acciones. En Mastra, los agentes tienen personalidad, instrucciones y acceso a herramientas específicas.

### Workflow

Secuencia de pasos automatizados que el agente puede ejecutar. Similar a un proceso de negocio que el bot sigue paso a paso.

### Thread

Hilo de conversación que mantiene el contexto entre múltiples mensajes. Permite que el bot recuerde conversaciones previas.

### Storage

Sistema de almacenamiento para guardar conversaciones, evaluaciones y datos de observabilidad. Puede ser en memoria o persistente.

### Logger

Sistema de registro que permite rastrear y depurar las operaciones del agente, útil para debugging y monitoreo.

### Observability

Capacidad de rastrear y analizar el comportamiento del agente, incluyendo métricas, logs y trazas de ejecución.

## Diferencias: Mastra vs Otros Frameworks de IA

| Framework Tradicional | Mastra                     |
| --------------------- | -------------------------- |
| Configuración compleja | Setup simplificado         |
| Manejo manual de estado | Threads automáticos       |
| Sin persistencia built-in | Storage integrado       |
| Logging personalizado | PinoLogger incluido        |
| Sin observability | Tracing automático          |
| APIs específicas de LLM | Abstracción unificada    |

## Uso en React/Next.js

Mastra es útil para:

- **Chatbots inteligentes** - Asistentes conversacionales con contexto
- **Automatización de tareas** - Workflows que ejecutan acciones complejas
- **Soporte al cliente** - Agentes especializados en atención
- **Procesamiento de lenguaje natural** - Análisis y generación de texto
- **Sistemas multi-agente** - Varios bots colaborando en tareas

## Ejercicio Implementado

### Sistema de Chatbot con Contexto

Se implementó un chatbot interactivo que mantiene el contexto de la conversación y puede responder preguntas de forma inteligente.

**Componentes principales:**

1. **mastra/src/mastra/index.ts** - Configuración central

   - Inicializa instancia de Mastra
   - Registra agentes (weatherAgent, supportAgent)
   - Configura workflows (weatherWorkflow)
   - Define scorers para evaluaciones
   - Storage: LibSQLStore en memoria
   - Logger: PinoLogger para debugging
   - Observability: Tracing habilitado

2. **ChatBot.tsx** - Componente React del chat

   - **Estado local:**
     - `messages` - Historial de mensajes (usuario y bot)
     - `input` - Texto actual del input
     - `isLoading` - Estado de carga durante peticiones
     - `threadId` - ID del hilo de conversación
   - **Función sendMessage:**
     - Envía mensaje a `/api/chat`
     - Mantiene threadId para contexto
     - Maneja errores de conexión
     - Actualiza UI con respuestas

3. **app/api/chat/route.ts** - API Route de Next.js

   - Recibe mensaje y threadId
   - Genera o reutiliza thread
   - Llama al agente de Mastra
   - Retorna respuesta del bot
   - Maneja contexto entre mensajes

4. **Agentes configurados:**

   - **weatherAgent** - Especializado en clima
   - **supportAgent** - Asistente de soporte general

5. **UI del ChatBot:**
   - Input con submit on Enter
   - Mensajes del usuario (derecha, azul)
   - Mensajes del bot (izquierda, rojo)
   - Botón de envío con estado disabled
   - Scroll automático en área de mensajes
   - Diseño responsive con Tailwind CSS

**Flujo de conversación:**

1. Usuario escribe mensaje en input
2. Se agrega mensaje al estado local (UI optimista)
3. POST a `/api/chat` con mensaje y threadId
4. API genera/usa thread y llama a Mastra
5. Mastra procesa con el agente configurado
6. Respuesta del bot se agrega al estado
7. UI se actualiza mostrando respuesta
8. threadId se guarda para próxima interacción

**Ventajas:**

- Contexto persistente entre mensajes
- Manejo automático de errores
- UI responsive y moderna
- Fácil agregar nuevos agentes
- Observability para debugging
- Escalable a múltiples workflows

## Arquitectura de Mastra

```
┌─────────────────┐
│  ChatBot.tsx    │ (UI)
└────────┬────────┘
         │ 1. POST /api/chat
         ▼
┌─────────────────┐
│  API Route      │ (Next.js)
└────────┬────────┘
         │ 2. mastra.agents.call()
         ▼
┌─────────────────┐
│  Mastra Core    │
└────────┬────────┘
         │ 3. procesa con agent
         ▼
┌─────────────────┐
│  AI Model       │ (LLM)
└────────┬────────┘
         │ 4. genera respuesta
         ▼
┌─────────────────┐
│  Response       │
└────────┬────────┘
         │ 5. retorna a UI
         ▼
┌─────────────────┐
│  ChatBot.tsx    │ (actualiza estado)
└─────────────────┘
```

## Conceptos Avanzados

### 1. Threads (Hilos de Conversación)

**¿Qué es?**
Sistema de gestión de contexto que permite que el chatbot recuerde conversaciones previas y mantenga coherencia en respuestas.

**Implementación:**

- ID único por conversación
- Almacenamiento en LibSQLStore
- Reutilización en múltiples mensajes
- Permite crear nuevas conversaciones

**Beneficios:**

- Conversaciones más naturales
- El bot "recuerda" contexto previo
- Permite seguimiento de tareas
- Mejora precisión de respuestas

### 2. Agents (Agentes Especializados)

**¿Qué son?**
Bots configurados con personalidad, instrucciones y herramientas específicas para tareas particulares.

**Ejemplos en el proyecto:**

- **weatherAgent** - Consulta clima y da recomendaciones
- **supportAgent** - Asistencia general al usuario

**Configuración:**

- Instrucciones de sistema (system prompt)
- Herramientas disponibles (tools)
- Modelo de IA subyacente
- Parámetros de generación

### 3. Workflows

**¿Qué son?**
Secuencias automatizadas de pasos que el agente ejecuta para completar tareas complejas.

**Ejemplo del proyecto:**

- **weatherWorkflow** - Obtiene clima, analiza datos, genera respuesta

**Ventajas:**

- Automatización de procesos
- Lógica de negocio reutilizable
- Fácil testing y debugging
- Composición de tareas complejas

### 4. Observability & Scorers

**¿Qué son?**
Herramientas para monitorear, evaluar y mejorar el rendimiento del agente.

**Scorers configurados:**

- **toolCallAppropriatenessScorer** - Evalúa uso correcto de herramientas
- **completenessScorer** - Verifica que respuestas sean completas
- **translationScorer** - Valida calidad de traducciones

**Observability:**

- Tracing de peticiones
- Logs estructurados con Pino
- Métricas de rendimiento
- Debugging en tiempo real

## Estructura del Proyecto Mastra

```
mastra/
├── src/
│   └── mastra/
│       ├── index.ts (configuración principal)
│       ├── agents/ (agentes especializados)
│       ├── workflows/ (flujos automatizados)
│       └── scorers/ (evaluadores)
├── package.json
└── tsconfig.json

src/mastra/
└── ChatBot/
    └── ChatBot.tsx (componente UI)

app/
├── api/
│   └── chat/
│       └── route.ts (API endpoint)
└── mastra/
    └── page.tsx (página del chat)
```

## Próximos Pasos de Aprendizaje

1. ✅ **Setup básico** - Configuración de Mastra con agentes
2. ✅ **Chat UI** - Interfaz de usuario conversacional
3. ✅ **Thread Management** - Contexto persistente
4. ✅ **Observability** - Tracing y logging
5. **Custom Tools** - Crear herramientas propias para agentes
6. **Multiple Agents** - Orquestar varios agentes colaborando
7. **Streaming Responses** - Respuestas en tiempo real
8. **RAG (Retrieval Augmented Generation)** - Conectar con base de conocimiento
9. **Memory Integration** - Memoria de largo plazo para agentes
10. **Production Deployment** - Deploy con storage persistente

## Comandos Útiles

```bash
# Desarrollo
cd mastra
npm run dev

# Build para producción
npm run build

# Iniciar servidor
npm run start
```

## Configuración de Entorno

Crea un archivo `.env` en la carpeta `mastra/`:

```bash
# API Keys de modelos de IA
OPENAI_API_KEY=tu_api_key
# o
ANTHROPIC_API_KEY=tu_api_key

# Configuración de base de datos (opcional)
DATABASE_URL=file:./mastra.db
```

## Recursos Adicionales

- [Documentación oficial de Mastra](https://mastra.ai/docs)
- [Repositorio en GitHub](https://github.com/mastra-ai)
- [Ejemplos de agentes](https://mastra.ai/examples)