// ============================================================
//  portfolioData.js  — Fahad Qaseem Khawar
//  Drop this file into your src/data/ folder and replace all
//  dummy-data imports/references with this file.
//  SAFE TO USE: only data changes — zero layout/style edits.
// ============================================================

// ── EXPERIENCE ──────────────────────────────────────────────
export const experience = [
  {
    id: 1,
    company: "Wayne State University",
    role: "Graduate Research Assistant (AI/ML)",
    location: "Detroit, MI, USA",
    period: "May 2026 – Present",
    current: true,
    bullets: [
      "Build AI pipelines that extract structured data from historical and geospatial document archives for Wayne State's Grand Challenges deep-mapping research initiative.",
      "Engineered a Python OCR evaluation framework benchmarking GPT-4o, Gemini 2.0 Flash, GLM-4V, AWS Textract, and PaddleOCR on structured extraction tasks.",
      "Standardized outputs into predictions.jsonl, summary.json, and document-level audit artifacts so cross-model comparisons stay repeatable and reviewable.",
      "Hardened the evaluation pipeline with 42 regression tests covering row matching, unmatched rows, schema handling, and scoring edge cases.",
    ],
  },
  {
    id: 2,
    company: "Wayne State University",
    role: "Graduate Research Assistant (Medical Imaging AI)",
    location: "Detroit, MI, USA",
    period: "August 2025 – April 2026",
    current: false,
    bullets: [
      "Developed diffusion-based generative models in PyTorch for temporal super-resolution of breast DCE-MRI.",
      "Designed a Regularized Brownian Bridge framework for high-fidelity medical image reconstruction and quantitative imaging analysis.",
      "Achieved PSNR 35.49, SSIM 0.94, and LPIPS 0.038 on a 58-patient breast cancer MRI dataset.",
      "Contributed to published research on deterministic medical image translation via Brownian Bridges.",
    ],
    link: "https://arxiv.org/abs/2503.22531",
  },
  {
    id: 3,
    company: "Wayne State University",
    role: "Research Intern / Deep Learning Specialist",
    location: "Detroit, MI, USA",
    period: "May 2025 – July 2025",
    current: false,
    bullets: [
      "Built a weather-informed ML data pipeline combining NOAA, geographic, socioeconomic, and infrastructure datasets for Michigan power-outage risk prediction.",
      "Re-architected the forecasting model from LSTM to spatio-temporal graph neural networks to better capture spatial dependencies.",
      "Improved training stability and outage-risk analytics through stronger preprocessing, feature engineering, and county-level spatial mapping.",
      "Built dashboard views to visualize outage-risk metrics and model behavior.",
    ],
    link: "https://www.notion.so/fahadqaseem/Weather-Informed-Spatio-Temporal-Graph-Neural-Networks-for-Power-Outage-Risk-Prediction-in-Michigan-216f490045f680ffa362c591a8363083",
  },
  {
    id: 4,
    company: "Image2work",
    role: "AI/ML Training Operations Lead",
    location: "Copenhagen, Denmark (Remote)",
    period: "June 2023 – November 2024",
    current: false,
    bullets: [
      "Owned secure, SLA-driven data pipelines for large-scale computer-vision training datasets using encrypted SFTP delivery workflows and QA gates.",
      "Scaled AI data operations from 1 to 20 team members with SOPs, annotation workflows, and predictable 1-hour and 12-hour delivery processes.",
      "Supported deep-learning image-segmentation development through production-ready dataset operations, access controls, and quality assurance.",
      "Balanced speed, reliability, and client trust across sensitive image data pipelines.",
    ],
  },
  {
    id: 5,
    company: "Truck It In",
    role: "Software and CRM Systems Engineer",
    location: "Islamabad, Pakistan",
    period: "October 2021 – January 2022",
    current: false,
    bullets: [
      "Implemented and configured HubSpot CRM for a high-growth logistics startup to improve sales tracking and operational visibility.",
      "Built dashboards, market-intelligence workflows, and KPI reporting systems for better cross-functional decision-making.",
      "Created CRM SOPs and trained 20+ team members to improve adoption, data quality, and execution consistency.",
    ],
  },
  {
    id: 6,
    company: "Ecombranding.co",
    role: "Co-Founder / Creative Project Manager",
    location: "Islamabad, Pakistan",
    period: "February 2021 – November 2024",
    current: false,
    bullets: [
      "Built and led a cross-functional digital branding and e-commerce team serving 200+ clients and generating more than $200K in revenue.",
      "Shipped production storefronts, landing pages, and brand systems using Next.js, Shopify, Webflow, and conversion-focused content workflows.",
      "Managed creative delivery across design, client communication, execution, and quality control in a fast-paced agency setting.",
    ],
  },
];

// ── PROJECTS ─────────────────────────────────────────────────
export const projects = [
  {
    id: 1,
    title: "LLM and OCR Evaluation Framework",
    description:
      "Built a Python evaluation system for benchmarking multimodal OCR and vision-language models on structured document extraction with auditable scoring and artifact generation.",
    tech: ["Python", "JSON Schema", "AWS Textract", "PaddleOCR", "GPT-4o", "Gemini"],
    highlights: [
      "Benchmarked 5 extraction models with precision, recall, F1, field accuracy, and CER",
      "Generated repeatable outputs including predictions.jsonl, summary.json, and document-level reports",
      "Backed the evaluator with 42 automated regression tests for matching and scoring logic",
    ],
    liveUrl: "",
    githubUrl: "",
    type: "AI / Evaluation",
  },
  {
    id: 2,
    title: "Full-Stack IoT Device Monitoring and Control Platform",
    description:
      "Designed a FastAPI and Flutter system for smart-device telemetry, remote commands, and live operational visibility across multiple client platforms.",
    tech: ["FastAPI", "WebSockets", "Flutter", "Dart", "REST APIs", "Material 3"],
    highlights: [
      "Exposed REST endpoints and persistent WebSocket streams for real-time device telemetry and commands",
      "Shipped a single Flutter codebase across Android, iOS, web, Windows, Linux, and macOS",
      "Improved UX with asynchronous state handling, live status views, and reusable feedback components",
    ],
    liveUrl: "",
    githubUrl: "",
    type: "Full Stack",
  },
  {
    id: 3,
    title: "TerraRescue Vision-Language SAR System",
    description:
      "Built a trustworthy search-and-rescue terrain-analysis pipeline that combines segmentation, vision-language reasoning, and safety-focused evaluation.",
    tech: ["PyTorch", "LLaVA-1.5-7B", "QLoRA", "CLIP", "SAM", "Computer Vision"],
    highlights: [
      "Fine-tuned LLaVA-1.5-7B on 4,500 terrain samples, reducing training loss from 4.25 to 1.26 in 3 epochs",
      "Combined CLIP, SAM, and multimodal reasoning for terrain classification, hazard detection, and route guidance",
      "Achieved ECE 0.061 and 100% agentic task completion in safety-oriented evaluation",
    ],
    liveUrl: "",
    githubUrl: "",
    type: "AI / Research",
  },
  {
    id: 4,
    title: "Deterministic Medical Image Translation via Brownian Bridges",
    description:
      "Developed a Generative AI–based diffusion model (Regularized Brownian Bridge) for temporal super-resolution of clinical breast DCE-MRI, enabling better pharmacokinetic analysis and precision oncology.",
    tech: ["Python", "PyTorch", "Diffusion Models", "Reinforcement Learning", "Computer Vision"],
    highlights: [
      "PSNR: 35.49 | SSIM: 0.94 | LPIPS: 0.038 — state-of-the-art reconstruction results",
      "Processed 58-patient breast cancer MRI dataset to derive quantitative imaging biomarkers",
      "Published on arXiv",
    ],
    liveUrl: "https://arxiv.org/abs/2503.22531",
    githubUrl: "",
    type: "Research",
  },
  {
    id: 5,
    title: "Weather-Informed Power Outage Risk Prediction in Michigan",
    description:
      "Re-architected a deep learning pipeline from LSTM to Spatio-Temporal Graph Neural Networks (ST-GNNs) to predict power outage risk across Michigan counties using meteorological and infrastructure data.",
    tech: ["Python", "ST-GNNs", "Scikit-learn", "NOAA Weather API", "Git", "Data Visualization"],
    highlights: [
      "Integrated meteorological, geographical, and socioeconomic datasets across Michigan counties",
      "Significant performance improvement over LSTM baseline after ST-GNN transition",
      "Built Scikit-based analytics dashboard for visualizing outage risk metrics",
    ],
    liveUrl:
      "https://www.notion.so/fahadqaseem/Weather-Informed-Spatio-Temporal-Graph-Neural-Networks-for-Power-Outage-Risk-Prediction-in-Michigan-216f490045f680ffa362c591a8363083",
    githubUrl: "",
    type: "Research / Engineering",
  },
  {
    id: 6,
    title: "ML-Driven EMG-Based 3D Prosthetic Arm (5 DOF)",
    description:
      "Co-authored IEEE-published research on a flexible, low-cost, non-invasive prosthetic arm with 5 degrees of freedom using EMG signals and machine learning classifiers.",
    tech: ["Python", "SVM", "ANN", "Decision Trees", "EMG Signal Processing", "Vibrotactile Feedback"],
    highlights: [
      "Achieved up to 92.35% accuracy in real-time gesture recognition",
      "Validated with vibrotactile feedback (p = 0.04, r = 0.9985)",
      "Published at IEEE eIT 2025 Conference",
    ],
    liveUrl: "https://ieeexplore.ieee.org/abstract/document/11103684",
    githubUrl: "",
    type: "Research / Publication",
  },
];

// ── SKILLS ───────────────────────────────────────────────────
export const skills = {
  "AI & Deep Learning": [
    "Machine Learning",
    "Deep Learning",
    "Generative AI",
    "Diffusion Models",
    "ST-GNNs",
    "Reinforcement Learning",
    "LLMs",
    "Vision-Language Models",
    "AI Agents",
    "Computer Vision",
    "Medical Imaging",
    "OCR and Document Extraction",
    "Anomaly Detection",
  ],
  "Languages": [
    "Python",
    "TypeScript",
    "SQL",
    "C++",
    "C#",
    "Java",
    "Kotlin",
    "Go",
    "Dart",
    "Bash",
  ],
  "Libraries & Frameworks": [
    "PyTorch",
    "TensorFlow",
    "scikit-learn",
    "NumPy",
    "OpenCV",
    "Pandas",
    "Flask",
    "FastAPI",
    "Django",
    "Node.js",
    "Next.js",
    "Flutter",
    "XGBoost",
    "LightGBM",
  ],
  "Tools & Platforms": [
    "Linux",
    "Git",
    "Docker",
    "AWS",
    "Azure",
    "MongoDB",
    "WebSockets",
    "Selenium",
    "SonarQube",
    "Jupyter Notebooks",
    "CMake",
    "GitHub Copilot",
    "Codex",
  ],
  "Other": [
    "REST APIs",
    "JSON and JSONL Pipelines",
    "Pydantic",
    "Data Modeling",
    "Feature Engineering",
    "Data Visualization",
    "Cross-validation",
    "ROC AUC",
    "F1",
    "PSNR",
    "SSIM",
    "LPIPS",
    "SMOTE",
    "Secure SFTP Pipelines",
  ],
};
