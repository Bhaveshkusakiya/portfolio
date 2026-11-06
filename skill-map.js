(function () {
    "use strict";

    const CATEGORIES = [
        {
            id: "backend", label: "Backend & languages", short: "Backend",
            description: "Services, APIs, and data code written in Python, with supporting work in SQL and Node.js.",
            skills: ["Python", "SQL", "R", "FastAPI", "Uvicorn", "Flask", "Node.js", "REST APIs", "asyncio", "aiohttp", "Pydantic"]
        },
        {
            id: "frontend", label: "Frontend", short: "Frontend",
            description: "Interfaces built with React and TypeScript, with attention to structure, styling, and testing.",
            skills: ["TypeScript", "JavaScript", "React", "Vite", "Tailwind CSS", "Fluent UI", "CSS Modules", "React Router", "HTML/CSS"]
        },
        {
            id: "cloud", label: "Cloud & serverless", short: "Cloud",
            description: "Azure services for serverless functions, data storage, search, identity, and deployment.",
            skills: ["Azure Functions", "Azure Cosmos DB", "Gremlin API", "Azure Blob Storage", "Azure AI Search", "Azure App Service", "Azure Key Vault", "Entra ID", "Azure CLI", "AWS"]
        },
        {
            id: "security", label: "Security & access", short: "Security",
            description: "Authentication, access control, and data protection for enterprise applications.",
            skills: ["JWT validation", "OAuth2 / MSAL", "Role-based access control", "AES-GCM encryption", "Field-level PII masking", "Security audit logging", "Secrets management"]
        },
        {
            id: "genai", label: "Generative AI & NLP", short: "GenAI & NLP",
            description: "LLM-based analysis, embeddings, and natural language processing that produce structured outputs.",
            skills: ["OpenAI API", "Azure OpenAI", "Structured JSON outputs", "Embeddings", "Vector search", "Retrieval-augmented generation", "Prompt engineering", "NLP", "Sentiment & theme analysis", "Entity extraction", "TF-IDF & cosine similarity"]
        },
        {
            id: "data", label: "Data engineering", short: "Data pipelines",
            description: "Ingestion, deduplication, checkpointing, and scheduling for repeatable data pipelines.",
            skills: ["Incremental ingestion", "Checkpointing", "Deduplication", "Fuzzy matching", "APScheduler", "ETL workflows", "Medallion architecture", "Geo inference", "Background jobs"]
        },
        {
            id: "graph", label: "Graph & visualization", short: "Graph & viz",
            description: "Graph data models and visualization libraries for networks, maps, charts, and dashboards.",
            skills: ["Knowledge-graph modeling", "Gremlin traversal", "Cytoscape.js", "D3.js", "vis-network", "React Flow", "Deck.gl", "MapLibre GL", "ECharts", "Tableau", "Power BI", "Matplotlib", "Plotly"]
        },
        {
            id: "ml", label: "Machine learning & analytics", short: "ML & analytics",
            description: "Machine learning models and statistical analysis for prediction and forecasting.",
            skills: ["Scikit-Learn", "TensorFlow", "PyTorch", "XGBoost", "OpenCV", "Pandas", "NumPy", "Predictive modeling", "Time-series forecasting", "ARIMA & Prophet", "Feature engineering", "Statistics & probability", "Jupyter", "SPSS"]
        },
        {
            id: "docs", label: "Documents & export", short: "Documents",
            description: "Reports and documents exported to Excel, PowerPoint, and PDF.",
            skills: ["Excel", "openpyxl", "xlsxwriter", "SheetJS", "python-pptx", "jsPDF"]
        },
        {
            id: "testing", label: "Testing & tools", short: "Testing & tools",
            description: "Testing, code quality, version control, and day-to-day engineering tools.",
            skills: ["pytest", "Vitest", "Playwright", "React Testing Library", "Mocking", "ESLint", "Prettier", "Git", "Docker", "Bash", "Linux"]
        },
        {
            id: "arch", label: "Architecture & algorithms", short: "Architecture",
            description: "System design patterns and algorithms used in pipelines, matching logic, and financial analysis.",
            skills: ["Layered architecture", "Event-driven pipelines", "Idempotent upserts", "Checkpoint and resume", "Adapter pattern", "Dependency injection", "State machines", "Exact and fuzzy matching", "Graph traversal (BFS)", "Concurrency control", "Retry with exponential backoff", "Financial ratio analysis", "Audit trails"]
        }
    ];

    // Projects list the skills they were built with; this drives the "Applied in" and "Appears with" views.
    const PROJECTS = [
        { name: "Loan Risk Analyzer", tags: ["Python", "XGBoost", "Predictive modeling"] },
        { name: "Customer Churn Prediction", tags: ["Python", "Scikit-Learn", "Predictive modeling"] },
        { name: "Twitter Sentiment Analysis", tags: ["NLP", "Python", "Scikit-Learn"] },
        { name: "E-commerce Sales Forecasting", tags: ["Time-series forecasting", "ARIMA & Prophet", "Pandas"] }
    ];

    const graph = document.getElementById("skillGraphNodes");
    const lines = document.getElementById("skillGraphLines");
    const tree = document.getElementById("skillTree");
    const detail = document.getElementById("skillDetail");
    if (!graph || !lines || !tree || !detail) return;

    const SVG_NS = "http://www.w3.org/2000/svg";
    const HUB_RADIUS = 36;
    const LEAF_RADIUS = 13;
    const LEAF_STEP = 0.2;
    const LEAF_SPREAD = 2.2;

    const categoryOf = new Map();
    CATEGORIES.forEach((category) => category.skills.forEach((name) => categoryOf.set(name, category)));
    const totalSkills = categoryOf.size;

    const state = { category: null, skill: null };
    const treeButtons = new Map();

    function el(tag, attrs, text) {
        const node = document.createElement(tag);
        Object.entries(attrs || {}).forEach(([key, value]) => node.setAttribute(key, value));
        if (text !== undefined) node.textContent = text;
        return node;
    }

    function polar(x, y, radius, angle) {
        return { x: x + radius * Math.cos(angle), y: y + radius * Math.sin(angle) };
    }

    function place(node, pos) {
        node.style.left = `${pos.x}%`;
        node.style.top = `${pos.y}%`;
    }

    function relatedSkills(name) {
        const related = new Set();
        PROJECTS.forEach((project) => {
            if (!project.tags.includes(name)) return;
            project.tags.forEach((tag) => { if (tag !== name && categoryOf.has(tag)) related.add(tag); });
        });
        return related;
    }

    function projectsFor(name) {
        return PROJECTS.filter((project) => project.tags.includes(name)).map((project) => project.name);
    }

    function addLine(x1, y1, x2, y2, active) {
        const line = document.createElementNS(SVG_NS, "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        if (active) line.classList.add("is-active");
        lines.appendChild(line);
    }

    function renderGraph(animate) {
        graph.replaceChildren();
        lines.replaceChildren();

        const related = state.skill ? relatedSkills(state.skill) : new Set();
        const hubs = CATEGORIES.map((category, index) => {
            const angle = -Math.PI / 2 + (index * 2 * Math.PI) / CATEGORIES.length;
            return { category, angle, pos: polar(50, 50, HUB_RADIUS, angle) };
        });

        hubs.forEach((hub) => addLine(50, 50, hub.pos.x, hub.pos.y, hub.category.id === state.category));

        const center = el("button", { type: "button", class: "sg-node sg-center", "aria-label": "Clear selection and show all skill areas" }, "All skills");
        place(center, { x: 50, y: 50 });
        center.addEventListener("click", clearSelection);
        graph.appendChild(center);

        hubs.forEach((hub) => {
            const active = hub.category.id === state.category;
            const button = el("button", { type: "button", class: "sg-node sg-hub", "aria-pressed": String(active) }, hub.category.short);
            place(button, hub.pos);
            button.addEventListener("click", () => selectCategory(hub.category.id));
            graph.appendChild(button);
        });

        const open = hubs.find((hub) => hub.category.id === state.category);
        if (!open) return;

        const names = open.category.skills;
        names.forEach((name, index) => {
            const pos = leafPos(open.category, index);
            const isSelected = state.skill === name;
            addLine(open.pos.x, open.pos.y, pos.x, pos.y, isSelected);

            const classes = ["sg-node", "sg-skill"];
            if (animate) classes.push("sg-enter");
            if (isSelected) classes.push("is-selected");
            else if (related.has(name)) classes.push("is-related");

            const node = el("button", { type: "button", class: classes.join(" "), "aria-label": name, "aria-pressed": String(isSelected) });
            node.style.animationDelay = `${index * 30}ms`;
            place(node, pos);
            node.addEventListener("mouseenter", () => showTip(name, pos));
            node.addEventListener("focus", () => showTip(name, pos));
            node.addEventListener("mouseleave", refreshTip);
            node.addEventListener("blur", refreshTip);
            node.addEventListener("click", () => selectSkill(name));
            graph.appendChild(node);
        });
        refreshTip();
    }

    function leafPos(category, index) {
        const hubIndex = CATEGORIES.indexOf(category);
        const hubAngle = -Math.PI / 2 + (hubIndex * 2 * Math.PI) / CATEGORIES.length;
        const hub = polar(50, 50, HUB_RADIUS, hubAngle);
        const radius = index % 2 === 0 ? LEAF_RADIUS : LEAF_RADIUS + 6;
        const angle = hubAngle + (index - (category.skills.length - 1) / 2) * LEAF_STEP;
        return polar(hub.x, hub.y, radius, angle);
    }

    function showTip(name, pos) {
        graph.querySelectorAll(".sg-tip").forEach((node) => node.remove());
        const tip = el("div", { class: "sg-tip" }, name);
        place(tip, pos);
        graph.appendChild(tip);
    }

    function refreshTip() {
        graph.querySelectorAll(".sg-tip").forEach((node) => node.remove());
        if (!state.skill) return;
        const category = categoryOf.get(state.skill);
        showTip(state.skill, leafPos(category, category.skills.indexOf(state.skill)));
    }

    function buildTree() {
        CATEGORIES.forEach((category) => {
            const group = el("details", { class: "skill-group" });
            const summary = el("summary", {});
            summary.appendChild(el("span", {}, category.label));
            summary.appendChild(el("span", { class: "skill-count" }, String(category.skills.length)));
            group.appendChild(summary);

            const list = el("ul", {});
            category.skills.forEach((name) => {
                const button = el("button", { type: "button", class: "chip", "aria-pressed": "false" }, name);
                button.addEventListener("click", () => selectSkill(name));
                treeButtons.set(name, button);
                list.appendChild(el("li", {})).appendChild(button);
            });
            group.appendChild(list);
            tree.appendChild(group);
        });
    }

    function syncTree() {
        treeButtons.forEach((button, name) => {
            button.setAttribute("aria-pressed", String(name === state.skill));
        });
    }

    function chipList(names) {
        const list = el("ul", { class: "skill-detail-list" });
        names.filter((name) => categoryOf.has(name)).forEach((name) => {
            const button = el("button", { type: "button", class: "chip" }, name);
            button.addEventListener("click", () => selectSkill(name));
            list.appendChild(el("li", {})).appendChild(button);
        });
        return list;
    }

    function tagList(names) {
        const list = el("ul", { class: "skill-detail-list" });
        names.forEach((name) => list.appendChild(el("li", { class: "tag" }, name)));
        return list;
    }

    function renderIntro() {
        detail.append(
            el("h3", {}, "Explore the skill map"),
            el("p", {}, "Select an area to see its skills. Select a skill to see where I applied it and which other skills it appears with."),
            el("p", { class: "skill-summary" }, `${totalSkills} skills across ${CATEGORIES.length} areas.`)
        );
    }

    function renderCategory(category) {
        detail.append(
            el("h3", {}, category.label),
            el("p", { class: "skill-meta" }, `${category.skills.length} skills`),
            el("p", {}, category.description),
            el("h4", {}, "Skills in this area"),
            chipList(category.skills)
        );
    }

    function renderSkill(name) {
        const category = categoryOf.get(name);
        const projects = projectsFor(name);
        const related = [...relatedSkills(name)];
        const peers = category.skills.filter((other) => other !== name).slice(0, 8);

        const back = el("button", { type: "button", class: "chip skill-back" }, `Back to ${category.label}`);
        back.addEventListener("click", () => selectCategory(category.id));

        detail.append(
            el("h3", {}, name),
            el("p", { class: "skill-meta" }, category.label),
            el("h4", {}, "Applied in")
        );
        if (projects.length) {
            detail.append(tagList(projects));
        } else {
            detail.append(el("p", {}, "Applied in professional work. Details available on request."));
        }
        detail.append(el("h4", {}, related.length ? "Appears with" : "Works alongside"));
        detail.append(chipList(related.length ? related : peers), back);
    }

    function renderDetail() {
        detail.replaceChildren();
        if (state.skill) {
            renderSkill(state.skill);
        } else if (state.category) {
            renderCategory(CATEGORIES.find((category) => category.id === state.category));
        } else {
            renderIntro();
        }
        detail.classList.remove("is-updated");
        void detail.offsetWidth;
        detail.classList.add("is-updated");
    }

    function render(options) {
        renderGraph(Boolean(options && options.animate));
        syncTree();
        renderDetail();
    }

    function selectCategory(id) {
        const closing = state.category === id && state.skill === null;
        state.category = closing ? null : id;
        state.skill = null;
        render({ animate: !closing });
    }

    function selectSkill(name) {
        state.category = categoryOf.get(name).id;
        state.skill = name;
        render({ animate: false });
        if (window.matchMedia("(max-width: 1023px)").matches) {
            detail.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    function clearSelection() {
        state.category = null;
        state.skill = null;
        render({ animate: false });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") clearSelection();
    });

    buildTree();
    render({ animate: false });
})();
