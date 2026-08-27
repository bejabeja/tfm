# To Be a Traveller - Roadmap

Plataforma para viajeros donde descubrir, compartir y planificar itinerarios de viaje.

---

## Navegación objetivo

```
Home (discovery + feed)  |  Explore (buscar itinerarios)  |  + Crear  |  Mi espacio
```

---

## Por hacer

> Priorizado para el momento actual: app en producción pero sin usuarios todavía. El criterio es qué mueve signups/activación ahora vs. qué solo aporta con masa crítica de usuarios y contenido.

### Hacer ya (alto impacto ahora, o bloquean crecimiento)

Todos los items de esta lista están hechos (ver "Hecho" abajo). Antes de sumar algo nuevo aquí, revisar si alguno de "Esperar a tener tracción" ya tiene sentido dado el crecimiento real.

### Esperar a tener tracción (dependen de masa crítica de usuarios/contenido)

- [ ] **Respuestas en comentarios**: reply threads con @mención para que haya conversaciones reales en los itinerarios. Necesita volumen de comentarios para justificarse.
- [ ] **Itinerarios similares/relacionados** al fondo del detalle de un itinerario. Necesita suficiente volumen de itinerarios para que la similitud tenga sentido.
- [ ] **Actividad social en el feed**: mezclar entre los viajes eventos como "Ana empezó a seguir a Luis" o "3 personas guardaron este viaje". Con pocos usuarios se siente vacío o falso, puede transmitir lo contrario de lo que busca.

### Descartar o repensar (mal ratio esfuerzo/valor para esta etapa, no solo "más adelante")

- [ ] **Colecciones / listas temáticas**: agrupar itinerarios favoritos por tema ("Viajes en solitario", "Con niños"...). Feature de power user, bajo volumen de contenido no la justifica.
- [ ] **Estadísticas para el creador**: vistas, guardados y likes de cada itinerario en un dashboard propio. Sin tráfico no hay nada que mostrar.
- [ ] **Tags / hashtags** en itinerarios para mejorar búsqueda y descubrimiento. Requiere densidad de contenido que hoy no existe.
- [ ] **Geolocalización en Explore**: filtro "cerca de mí" para descubrir itinerarios por zonas en un mapa interactivo. Alto esfuerzo (mapa interactivo), bajo valor con el volumen actual.
- [ ] **Exportar itinerario como PDF**: descargar el planning completo para consultar offline o imprimir. Utilidad de nicho, no afecta crecimiento ni retención.
- [ ] **Desglose de presupuesto por día o categoría**: asignar parte del budget a alojamiento, comida, transporte, actividades. Feature de nicho.
- [ ] **Modo lectura offline / PWA**: ya hay `manifest.json` (instalable a pantalla de inicio) pero no hay service worker, así que no hay caché ni lectura offline real. La parte cara (service worker) da valor a usuarios frecuentes que todavía no existen; prematuro pre-lanzamiento.

---

## Hecho

- [x] Auth con JWT (login, registro, logout)
- [x] Login por email (migrado desde username)
- [x] Perfiles de usuario con follow/unfollow
- [x] Crear, editar y eliminar itinerarios
- [x] Creación de itinerario con estructura día a día (form con Day 1, Day 2...)
- [x] Generación de itinerario con IA (Groq / openai/gpt-oss-120b) con contexto de días, categoría, presupuesto y viajeros; extracción de JSON robusta a razonamiento filtrado en la respuesta
- [x] Detalle de itinerario con mapa, comentarios y favoritos
- [x] Botón de compartir en detalle (navigator.share + fallback a clipboard)
- [x] Likes en itinerarios: toggle optimista, persistido en BD, contador sincronizado al montar
- [x] Comentarios en itinerarios: contador actualizado en tiempo real en las cards
- [x] Subida de imagen de portada (drag & drop, preview, Cloudinary)
- [x] Páginas My Trips y Saved Trips
- [x] Explore con filtros de categoría y destino + paginación
- [x] Community: búsqueda y listado de usuarios
- [x] Botón Crear siempre visible en la navbar
- [x] Diseño responsive con menú hamburguesa
- [x] Skeleton loaders en listas de itinerarios y usuarios
- [x] Sistema de botones unificado (4 variantes, pill shape)
- [x] Split de vendor bundles para reducir tamaño del chunk principal
- [x] Feed personalizado en Home: tabs "Descubrir" y "Siguiendo" para usuarios autenticados
- [x] Onboarding social al registrarse: pantalla de bienvenida con usuarios sugeridos, foto de su último viaje, contador de progreso y CTA dinámico
- [x] Notificaciones automáticas: polling cada 30s + refresh al volver a la pestaña/app; badge en navbar siempre actualizado sin entrar en la página
- [x] Filtro público/privado en Mis Viajes y en el perfil: toggle All / Público / Privado; endpoint `/mine` autenticado que devuelve todos los viajes del usuario
- [x] Seguidores/Siguiendo como modal: se abre sobre el perfil sin cambiar de página; dos tabs con carga lazy; en mobile sube como bottom sheet nativa
- [x] i18n completo: español e inglés con detección automática y selector en perfil
- [x] Vista día a día en el detalle del itinerario: places agrupados visualmente por Día 1, Día 2...
- [x] Destinos dinámicos en Home: los más populares según datos reales de la BD, sin hardcodear
- [x] JSON-LD structured data para itinerarios, perfiles y home (SEO)
- [x] Open Graph / preview al compartir: metatags dinámicos servidos server-side a bots (WhatsApp, Twitter, iMessage) vía Vercel Edge Middleware + endpoints `/og/itinerary/:id` y `/og/profile/:id`
- [x] Búsqueda por texto libre en Explore: filtro por título o descripción, combinable con categoría y destino
- [x] Clonar itinerario: copiar un itinerario público (propio o ajeno) como borrador privado de partida
- [x] Galería de imágenes por itinerario: fotos adicionales a la portada, carrusel propio (sin librería) en el detalle, subida/borrado múltiple en crear y editar
- [x] Búsqueda global en navbar: overlay que busca itinerarios y usuarios a la vez (ranking de usuarios verificados primero), con contenido destacado por defecto al abrirse vacío. Sustituye a Community en la navegación principal (sidebar y bottom-nav); la ruta `/community` se mantiene viva como browse completo
- [x] Sugerencias de personas a seguir: widget persistente "People to follow" en el sidebar del perfil propio, reutiliza el endpoint `/users/suggested` ya usado en el onboarding

---

## Contexto para Claude

> Copia y pega esto al inicio de cada sesión nueva:

```
Estoy desarrollando "To Be a Traveller", una plataforma web y móvil para viajeros donde pueden descubrir, compartir y planificar itinerarios de viaje.

Stack: React + Redux (cliente web), React Native / Expo (mobile), Node.js + Express (API), PostgreSQL (BD), Leaflet/OSM (mapas), Cloudinary (imágenes), JWT (auth), Groq (IA). Monorepo con paquete @tobeatraveller/shared que comparten web y mobile.

La app tiene: auth, perfiles con follows, crear/editar/eliminar itinerarios (con destinos, fechas, presupuesto, viajeros, imagen de portada, estructura día a día y generación con IA), comentarios, likes, favoritos, explorar con filtros, community de usuarios, feed social con tabs Descubrir/Siguiendo, onboarding social al registrarse, notificaciones con polling automático, filtro público/privado en mis viajes, modal de seguidores/siguiendo, i18n ES/EN.

El roadmap está en ROADMAP.md. Lee ese archivo para ver qué hay hecho, qué está pendiente y cuál es la visión del producto.
```
