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

### Pivote: vida en furgo/camper

> Decisión (ver contexto en memoria del proyecto): tobeatraveller se está redirigiendo hacia una app social de vida en movimiento en furgo/camper. Se mantiene el código y features actuales; las nuevas features se construyen pensando en esto, no en "esperar tracción" del producto genérico de antes.

- [ ] **Recetas ligadas al inventario**: espacio para ver y añadir recetas propias, con indicador de "con lo que tienes en inventario puedes hacer esto". Empezar privado (recetas propias del usuario), no público/UGC compartido todavía (eso necesita moderación que hoy no existe en ningún sitio de la app).

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

## Contexto para Claude

> Copia y pega esto al inicio de cada sesión nueva:

```
Estoy desarrollando "To Be a Traveller", una plataforma web y móvil para viajeros donde pueden descubrir, compartir y planificar itinerarios de viaje.

Stack: React + Redux (cliente web), React Native / Expo (mobile), Node.js + Express (API), PostgreSQL (BD), Leaflet/OSM (mapas), Cloudinary (imágenes), JWT (auth), Groq (IA). Monorepo con paquete @tobeatraveller/shared que comparten web y mobile.

La app tiene: auth, perfiles con follows, crear/editar/eliminar itinerarios (con destinos, fechas, presupuesto, viajeros, imagen de portada, estructura día a día y generación con IA), comentarios, likes, favoritos, explorar con filtros, community de usuarios, feed social con tabs Descubrir/Siguiendo, onboarding social al registrarse, notificaciones con polling automático, filtro público/privado en mis viajes, modal de seguidores/siguiendo, i18n ES/EN.

El roadmap está en ROADMAP.md. Lee ese archivo para ver qué está pendiente y cuál es la visión del producto (el historial de lo ya construido no vive ahí; usa git log/el código para eso).
```
