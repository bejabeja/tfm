# tobeatraveller - Directrices de implementación

Monorepo con tres paquetes: `api/` (backend), `client/` (web), `mobile/` (Expo, ver `mobile/CLAUDE.md` → `mobile/AGENTS.md`), y `shared/` (código común entre client y mobile).

> Nota: el skill `new-endpoint` describe una arquitectura TypeScript + tsoa + Drizzle. **No es el estado actual del código.** `api/` es JS plano (ESM) con SQL crudo vía `pg`. Estas directrices documentan lo que el código realmente hace hoy; ignora la parte de tsoa/Drizzle del skill hasta que haya una migración real.

## Arquitectura API (`api/src`)

Capas estrictas, no saltarse ninguna ni mezclar responsabilidades:

- **Router** (`routes/*Router.js`): construye el grafo de dependencias a mano (`new XRepository()`, `new XService(...)`, `new XController(...)`) y registra las rutas con `.bind(controller)`. No hay contenedor de IoC central; cada router arma lo que necesita.
- **Controller** (`controllers/*Controller.js`): solo HTTP. Valida el body con Zod (`safeParse`), si falla llama a `next(new ValidationError(...))`. El resto va en `try/catch` con `next(error)`. Nunca contiene lógica de negocio ni queries.
- **Service** (`services/*Service.js`): lógica de negocio. Lanza los errores custom (nunca el repositorio). Orquesta varios repositorios/servicios (p. ej. `CommentsService` dispara `NotificationsService` de forma fire-and-forget con `.catch(() => {})` cuando el efecto secundario no debe romper la respuesta principal).
- **Repository** (`repositories/*Repository.js`): acceso a datos con SQL parametrizado (`client.query(text, params)`, nunca interpolación de strings). No lanza errores de negocio; devuelve `null`/`undefined`/filas crudas y deja que el service decida.

### Errores

- Clases en `errors/`: `AuthError`, `ConflictError`, `NotFoundError`, `ValidationError`, todas extendiendo `BaseError` (con `statusCode`).
- Se lanzan desde el service, se capturan en el controller y se pasan con `next(error)`.
- `middlewares/errorHandler.js` es el único sitio que traduce `BaseError` a la respuesta HTTP, loguea con `logger.error` si `status >= 500` y reporta a Sentry. No dupliques ese mapeo en otro sitio.

### Validación

- Esquemas Zod centralizados en `utils/schemasValidation.js` (o en `@tobeatraveller/shared` si el esquema se comparte con el cliente). No definas esquemas ad hoc dentro de un controller.
- Controller valida con `safeParse`; si falla, primer mensaje de error (`result.error.errors[0]?.message`) o un mensaje fijo, envuelto en `ValidationError`.

### Logging

- Usa `logger` de `utils/logger.js` (`info`/`warn`/`error`/`debug`), no `console.*` directo, salvo casos fire-and-forget ya existentes que solo loguean a `console.error` en un `.catch()` puntual.

### Convenciones generales API

- ESM: imports siempre con extensión `.js`.
- IDs: `uuidv4()` (paquete `uuid`), no autoincrementales.
- Nombres de archivo: `xxxController.js`, `xxxService.js`, `xxxRepository.js`, `xxxRouter.js` (camelCase, sin guiones).
- Columnas SQL en `snake_case`, mapeadas a `camelCase` en el objeto que devuelve el repository.
- `standard` está en `devDependencies` pero no refleja el estilo real: el código existente usa punto y coma e indentación de 4 espacios en todo `api/src`, mientras que `standard` exige sin punto y coma y 2 espacios (`npx standard` reporta cientos de errores en archivos ya existentes sin tocar). No ejecutes `standard --fix`: reescribiría casi todo el código. Sigue el estilo real (punto y coma, 4 espacios), no el que sugiere el nombre del paquete. Ejecuta `npm run test` en `api/` antes de dar por cerrado un cambio de lógica de negocio.

## Testing (`api/src/__tests__`)

- Framework: Vitest. Estructura en espejo: `__tests__/services/`, `__tests__/repositories/`, `__tests__/models/`.
- Testea `services` con repositorios mockeados a mano (objetos planos con `vi.fn()` por método usado), no mocks automáticos de módulo salvo que ya sea el patrón en ese archivo.
- Los tests de repository que sí existen (p. ej. `itineraryRepository.buildFilters.test.js`) prueban construcción de queries/lógica pura, no contra una DB real.
- No añadas tests de integración contra Postgres real a menos que el usuario lo pida explícitamente; no es el patrón actual.
- Añade test siempre que tenga sentido, no solo en `api/`: lógica de negocio nueva o modificada, un bug que se acaba de arreglar (regresión), o una función en `shared/` cuyo comportamiento es fácil de romper en silencio (p. ej. que dependa de `authFetch` en vez de `fetch`). Si `shared/` u otro paquete no tiene infraestructura de test todavía, es válido añadirla cuando el fix concreto lo justifique, no como preparación especulativa.
- Sigue las prácticas habituales del oficio (en la línea de Kent Beck/Martin Fowler), adaptadas al estilo ya existente en este repo:
  - **Comportamiento, no implementación**: testea lo que la función devuelve o el efecto que produce (la query que construye, el error que lanza, el header que manda), no sus detalles internos. Si refactorizas sin cambiar el comportamiento, los tests no deberían necesitar tocarse.
  - **Arrange-Act-Assert**: cada test prepara el estado, ejecuta una única acción y verifica el resultado; nombres de test que describan el comportamiento esperado ("arroja NotFoundError si el itinerario no existe"), no el nombre del método.
  - **Al arreglar un bug, el test es el que documenta el bug**: escribe el caso que reproduce el fallo (falla con el código viejo, pasa con el fix) en vez de solo un test genérico de la función; ese test es la prueba de que no vuelve a pasar.
  - **TDD cuando la lógica es no trivial**: para reglas de negocio o parsing/validación con casos borde, escribir el test antes de la implementación ayuda a acotar el comportamiento esperado; no es obligatorio para cambios triviales.
  - **Pirámide de tests**: prioriza unitarios rápidos con dependencias mockeadas (el patrón ya usado en `api/`); evita tests de integración lentos o frágiles salvo que aporten algo que el unitario no puede cubrir.

## Frontend (`client/src`)

Stack: React 19, Redux Toolkit-style con **thunks manuales** (no slices de RTK, no `createAsyncThunk`), React Router v7, react-hook-form + Zod, react-i18next, Sass.

- **Store** (`store/<domain>/`): `xxxActions.js` (action types como constantes + thunks `(dispatch) => {...}` con patrón start/success/fail), `xxxReducer.js`, `xxxSelectors.js` (selectors puros `state => ...`). No metas lógica de fetch en el componente ni en el reducer.
- **Services** (`services/*.js`): wrappers de `fetch` puro. Patrón: construir `baseUrl` desde `import.meta.env.VITE_API_URL`, `if (!response.ok) await parseError(response, 'mensaje')`, devolver `response.json()`. Si el endpoint ya existe en `@tobeatraveller/shared` (usado también por mobile), re-exporta desde ahí (`export { fn } from '@tobeatraveller/shared'`) en vez de duplicar la implementación.
- **Hooks** (`hooks/use*.js`): lógica de UI con estado local + llamada a `services/`; no acceden a `fetch` directamente.
- **Componentes**: funcionales, un componente por carpeta bajo `components/<área>/` o `pages/<página>/`. Estilos en Sass co-ubicados.
- Errores de usuario visibles vía `react-hot-toast`, no `alert`.

## Código compartido (`shared/`)

- `@tobeatraveller/shared` centraliza `services/`, `utils/` (incluye `schemasValidation.js`, `parseError.js`, `authFetch.js`) y `store/store.js` usados por `client` y `mobile`.
- Antes de escribir un service, util o schema de validación nuevo en `client/`, comprueba si ya existe (o debería vivir) en `shared/` para que mobile lo reutilice.

## Reglas generales (todo el repo)

- No introducir TypeScript, tsoa ni Drizzle en `api/` salvo que el usuario lo pida explícitamente como migración; mantener consistencia con el JS plano existente.
- No añadir abstracciones, capas o "por si acaso" que el código actual no tiene (ej. no crear un IoC container, no envolver `fetch` en una librería nueva).
- Antes de tocar `mobile/`, lee `mobile/AGENTS.md`: Expo SDK 56 cambió respecto a versiones previas, no asumas comportamiento de versiones anteriores.
- No usar em-dashes (—) en código, comentarios, commits ni en la documentación. Usar coma, punto y coma o punto seguido en su lugar.
- Seguir principios SOLID y Clean Code:
  - **SRP**: cada clase/función hace una sola cosa (un service no valida HTTP, un repository no decide reglas de negocio).
  - **Acoplamiento**: inyectar dependencias por constructor (como ya hace el código), no importar/instanciar una dependencia concreta dentro de la lógica de otra capa.
  - **Naming**: nombres descriptivos y sin abreviar (`itineraryRepository`, no `itinRepo`); mismo término para el mismo concepto en toda la capa.
  - **Dead code**: no dejar código comentado, imports sin usar ni funciones/ramas inalcanzables; si algo deja de usarse, se borra.
  - **Magic values**: sin números o strings mágicos sueltos en la lógica; extraer a una constante con nombre cuando el valor no es evidente por sí mismo.
- No añadir comentarios innecesarios en el código. Solo comentar cuando explique un porqué no obvio (una restricción oculta, un workaround, un comportamiento que sorprendería a quien lea el código); nunca comentar qué hace el código si el nombre ya lo dice.
