# Mate Digital Landing

Landing one-page estatica inspirada en una arquitectura premium dark-tech, preparada para versionado en Git y deploy directo en Vercel.

## Archivos principales

- `index.html`: estructura completa de la landing.
- `styles.css`: sistema visual, layout responsive y componentes.
- `script.js`: menu movil, tabs del proceso, toggle de pricing y animaciones de entrada.
- `vercel.json`: configuracion minima para deploy estatico en Vercel.

## Deploy

1. Subi el repositorio a GitHub.
2. Importalo en Vercel.
3. Vercel detectara el proyecto como sitio estatico y lo desplegara sin build adicional.

## Personalizacion

- Reemplaza el email `hola@matedigital.com` por el real.
- Si tenes logo, fotos o links legales, se pueden sumar en una segunda iteracion.

## MCP

El proyecto incluye una integracion minima con `@modelcontextprotocol/sdk` para exponer contexto del sitio como servidor MCP local.

### Ejecutar el servidor MCP

```bash
npm run mcp:server
```

### Que expone

- recurso `mate-digital://summary` con resumen del proyecto
- recurso `mate-digital://sections` con el orden de secciones
- herramienta `project_overview`
- herramienta `list_site_sections`
- herramienta `read_project_file`
- herramienta `search_project_text`
- herramienta `analyze-ui`
- herramienta `generate-ui`
- herramienta `get-components`
- prompt `review-section`
