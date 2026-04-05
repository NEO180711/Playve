import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const site = (env.VITE_SITE_URL || "").replace(/\/$/, "");

  const structuredData =
    site &&
    JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": `${site}/#website`,
          name: "Playve",
          url: `${site}/`,
          description:
            "브라우저에서 바로 즐기는 사다리·룰렛·제비·추첨 미니게임 모음. 교육·모임용 공정 추첨 도구.",
          inLanguage: "ko",
          publisher: { "@id": `${site}/#organization` },
        },
        {
          "@type": "Organization",
          "@id": `${site}/#organization`,
          name: "Playve",
          url: site,
          description: "무료 미니게임·추첨 웹 서비스를 제공합니다.",
        },
      ],
    });

  return {
    plugins: [
      vue(),
      {
        name: "playve-html-meta",
        transformIndexHtml(html) {
          if (!site || !structuredData) return html;
          const inject = [
            `<link rel="canonical" href="${site}/" />`,
            `<meta property="og:url" content="${site}/" />`,
            `<meta property="og:image" content="${site}/favicon.svg" />`,
            `<script type="application/ld+json">${structuredData}</script>`,
          ].join("\n    ");
          return html.replace("</head>", `    ${inject}\n  </head>`);
        },
      },
      {
        name: "playve-sitemap",
        closeBundle() {
          if (!site) return;
          const paths = [
            "",
            "/about",
            "/faq",
            "/terms",
            "/contact",
            "/privacy",
            "/ladder",
            "/wheel",
            "/paper",
            "/number",
            "/coin",
            "/names",
          ];
          const lines = paths.map((p) => {
            const loc = p === "" ? `${site}/` : `${site}${p}`;
            const pr = p === "" ? "1.0" : "0.85";
            return `  <url><loc>${loc}</loc><changefreq>weekly</changefreq><priority>${pr}</priority></url>`;
          });
          const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines.join("\n")}\n</urlset>`;
          writeFileSync(resolve(process.cwd(), "dist", "sitemap.xml"), xml, "utf8");
        },
      },
    ],
  };
});
