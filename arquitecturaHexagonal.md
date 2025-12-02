# Arquitectura Hexagonal - BluPersonasApp & BluCoreDCE

```plaintext
                +--------------------------------------+
                |         BluPersonasApp (UI)          |
                |  (React Native, Pantallas, Navegación)|
                +-------------------+------------------+
                                    |
                                    v
                +-------------------+------------------+
                |   Adaptadores de Entrada (Hooks,      |
                |   Actions, Controllers, Redux, etc.)  |
                +-------------------+------------------+
                                    |
                                    v
        +-------------------------------------------------------+
        |                Núcleo de Negocio (BluCoreDCE)         |
        | +-------------------+   +--------------------------+  |
        | |   Dominio         |   |   Aplicación             |  |
        | | (Entidades,       |   | (Casos de uso,           |  |
        | |  reglas, servicios)|   |  orquestación)           |  |
        | +-------------------+   +--------------------------+  |
        +-------------------+-------------------+---------------+
                                    |
                                    v
                +-------------------+------------------+
                | Adaptadores de Salida (Infraestructura,      |
                | Helpers, Servicios, Storage, APIs, etc.)      |
                +-------------------+------------------+
                                    |
                                    v
                +--------------------------------------+
                |      Servicios Externos              |
                | (APIs, DB, FacePhi, Firebase, etc.)  |
                +--------------------------------------+
```

---

**¿Cómo funciona?**

- El usuario interactúa con la app (UI).
- La UI usa adaptadores de entrada para comunicarse con el núcleo de negocio.
- El núcleo contiene la lógica principal y se comunica con el exterior solo a través de adaptadores de salida.
- Los servicios externos (APIs, biometría, almacenamiento, etc.) están desacoplados del núcleo.
