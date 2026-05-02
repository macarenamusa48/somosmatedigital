import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const projectFiles = {
  html: path.join(projectRoot, "index.html"),
  css: path.join(projectRoot, "styles.css"),
  js: path.join(projectRoot, "script.js"),
  readme: path.join(projectRoot, "README.md"),
  vercel: path.join(projectRoot, "vercel.json"),
};

const projectSections = [
  "Header / Navbar",
  "Hero",
  "Authority / Quienes somos",
  "Benefits / Por que Mate Digital",
  "Services / Servicios",
  "Features / Capacidades",
  "Process / Proceso",
  "Stories / Impacto esperado",
  "Testimonials / Confianza",
  "FAQ",
  "Comparison / Nuestro enfoque",
  "Team / Equipo",
  "CTA / Contacto",
  "Footer",
];

const projectSummary = [
  "Mate Digital es una landing estatica para una agencia de automatizacion y transformacion digital.",
  "El sitio esta construido con HTML, CSS y JavaScript vanilla.",
  "La identidad actual prioriza una estetica dark premium inspirada en Landio.",
  "Los archivos clave del proyecto son index.html, styles.css, script.js, README.md y vercel.json.",
].join(" ");

function toTextResult(text) {
  return {
    content: [
      {
        type: "text",
        text,
      },
    ],
  };
}

function toResourceResult(uri, text, mimeType = "text/plain") {
  return {
    contents: [
      {
        uri,
        mimeType,
        text,
      },
    ],
  };
}

async function readProjectFile(key) {
  const filePath = projectFiles[key];
  if (!filePath) {
    throw new Error(`Archivo no reconocido: ${key}`);
  }

  return readFile(filePath, "utf8");
}

function clipText(text, maxChars = 4000) {
  if (text.length <= maxChars) {
    return text;
  }

  return `${text.slice(0, maxChars)}\n\n[contenido truncado: ${text.length - maxChars} caracteres omitidos]`;
}

function searchInText(text, query) {
  const normalizedQuery = query.trim().toLowerCase();
  const lines = text.split(/\r?\n/);

  return lines
    .map((line, index) => ({ lineNumber: index + 1, line }))
    .filter(({ line }) => line.toLowerCase().includes(normalizedQuery));
}

const server = new McpServer(
  {
    name: "mate-digital-mcp",
    version: "1.0.0",
  },
  {
    instructions:
      "Usa este servidor para inspeccionar la landing de Mate Digital, leer archivos clave, buscar copy y entender la estructura del proyecto.",
  }
);

server.registerResource(
  "project-summary",
  "mate-digital://summary",
  {
    title: "Resumen del proyecto",
    description: "Resumen corto del sitio y su stack actual.",
    mimeType: "text/plain",
  },
  async () => toResourceResult("mate-digital://summary", projectSummary)
);

server.registerResource(
  "site-sections",
  "mate-digital://sections",
  {
    title: "Secciones del sitio",
    description: "Orden narrativo actual de la landing.",
    mimeType: "text/plain",
  },
  async () =>
    toResourceResult(
      "mate-digital://sections",
      projectSections.map((section, index) => `${index + 1}. ${section}`).join("\n")
    )
);

server.registerTool(
  "project_overview",
  {
    title: "Resumen del proyecto",
    description: "Devuelve un resumen corto del proyecto Mate Digital y sus archivos principales.",
  },
  async () => {
    return toTextResult(
      `${projectSummary}\n\nArchivos disponibles:\n- index.html\n- styles.css\n- script.js\n- README.md\n- vercel.json`
    );
  }
);

server.registerTool(
  "list_site_sections",
  {
    title: "Listar secciones",
    description: "Devuelve el orden actual de secciones de la landing.",
  },
  async () => {
    return toTextResult(projectSections.map((section, index) => `${index + 1}. ${section}`).join("\n"));
  }
);

server.registerTool(
  "read_project_file",
  {
    title: "Leer archivo del proyecto",
    description: "Lee uno de los archivos principales del proyecto y devuelve su contenido, opcionalmente truncado.",
    inputSchema: {
      file: z.enum(["html", "css", "js", "readme", "vercel"]),
      maxChars: z.number().int().positive().max(20000).optional(),
    },
  },
  async ({ file, maxChars }) => {
    const content = await readProjectFile(file);
    return toTextResult(clipText(content, maxChars ?? 4000));
  }
);

server.registerTool(
  "search_project_text",
  {
    title: "Buscar texto en el proyecto",
    description: "Busca una frase dentro de los archivos principales y devuelve coincidencias con linea.",
    inputSchema: {
      query: z.string().min(2),
      file: z.enum(["html", "css", "js", "readme", "vercel"]).optional(),
      limit: z.number().int().positive().max(50).optional(),
    },
  },
  async ({ query, file, limit }) => {
    const keys = file ? [file] : Object.keys(projectFiles);
    const matches = [];

    for (const key of keys) {
      const content = await readProjectFile(key);
      const results = searchInText(content, query).map(({ lineNumber, line }) => ({
        file: key,
        lineNumber,
        line: line.trim(),
      }));

      matches.push(...results);
    }

    if (matches.length === 0) {
      return toTextResult(`No encontre coincidencias para "${query}".`);
    }

    const visibleMatches = matches
      .slice(0, limit ?? 12)
      .map((match) => `${match.file}:${match.lineNumber} ${match.line}`)
      .join("\n");

    return toTextResult(visibleMatches);
  }
);

server.registerPrompt(
  "review-section",
  {
    title: "Revisar una seccion",
    description: "Prompt para revisar visualmente una seccion de la landing sin cambiar su contenido.",
    argsSchema: {
      section: z.string().min(2),
    },
  },
  ({ section }) => {
    return {
      description: `Revision de la seccion ${section}`,
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `Revisa la seccion "${section}" de la landing de Mate Digital. Conserva el contenido y la estructura actual, y propone mejoras unicamente visuales: jerarquia, espaciado, contraste, profundidad, motion sutil y consistencia con la direccion dark premium del sitio.`,
          },
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();

await server.connect(transport);
