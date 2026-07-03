window.FRONTIER_DATA = {
  fields: {
    agi: {
      label: "AGI / ML", short: "AGI", color: "#2a78d6", text: "#185FA5",
      metricLabel: "task time horizon", metricUnit: "min",
      methodology: {
        metric: "METR's task time horizon: the length of a task (measured in the time a skilled human needs to complete it) that a model can finish autonomously with 50% reliability.",
        formula: "index = 100 \u00d7 log\u2082(horizon \u00f7 2 sec) \u00f7 log\u2082(30 days \u00f7 2 sec), clamped to 0\u2013100",
        anchors: "0 = GPT-2's ~2-second horizon (2019). 100 = a 30-day autonomous task horizon \u2014 the scale researchers currently discuss as the next major threshold, not yet reached.",
        basisNote: "Points marked \u201cmeasured\u201d are taken directly from METR's published benchmark for that specific model. Points marked \u201cestimated\u201d are interpolated along the field's documented ~7-month doubling trend between real measurements \u2014 they are not independent benchmarks of that specific system.",
        sources: [
          { label: "METR \u2014 Task-Completion Time Horizons of Frontier AI Models", url: "https://metr.org/time-horizons/" },
          { label: "METR \u2014 Measuring AI Ability to Complete Long Tasks (2025 paper)", url: "https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/" }
        ]
      }
    },
    quantum: {
      label: "Quantum", short: "QNT", color: "#1baf7a", text: "#0F6E56",
      metricLabel: "physical qubits", metricUnit: "qubits",
      methodology: {
        metric: "Physical qubit count of the leading publicly announced processor at each point in time.",
        formula: "index = 100 \u00d7 log\u2081\u2080(qubits) \u00f7 log\u2081\u2080(1,000,000), clamped to 0\u2013100",
        anchors: "100 \u2248 1,000,000 physical qubits, roughly the scale most fault-tolerant hardware roadmaps cite as necessary for commercially useful error-corrected computation.",
        basisNote: "This tracks raw qubit count only \u2014 it can't capture error rate or logical-qubit quality. That's why Willow's index sits below Condor's despite being the more important 2024 result: the field's frontier shifted from \u201cmore qubits\u201d to \u201cbetter qubits\u201d, and a single count can't show that pivot. Read each event's description for context a number alone can't carry.",
        sources: [
          { label: "Google Quantum AI \u2014 Willow processor", url: "https://blog.google/innovation-and-ai/technology/research/google-willow-quantum-chip/" },
          { label: "Nature \u2014 quantum supremacy using a programmable superconducting processor", url: "https://www.nature.com/articles/s41586-019-1666-5" }
        ]
      }
    },
    fusion: {
      label: "Fusion", short: "FUS", color: "#eda100", text: "#854F0B",
      metricLabel: "Q (energy gain)", metricUnit: "Q",
      methodology: {
        metric: "Q \u2014 fusion energy gain factor (fusion energy released \u00f7 energy delivered to the target or plasma), tracking the best figure posted anywhere in the field to date.",
        formula: "index = 100 \u00d7 Q \u00f7 10, clamped to 0\u2013100",
        anchors: "100 = Q of 10 \u2014 ITER's own design target, and the figure most commonly cited as reactor-relevant.",
        basisNote: "Only NIF's inertial-confinement shots have posted a Q figure so far. Tokamak milestones (JT-60SA, SPARC) are earlier-stage engineering steps toward their own future Q measurement, so they're shown flat at the field's current record rather than assigned an invented number. The two confinement approaches aren't directly comparable either \u2014 this index is illustrative of overall momentum, not a head-to-head ranking.",
        sources: [
          { label: "LLNL \u2014 NIF sets power and energy records", url: "https://lasers.llnl.gov/about/keys-to-success/nif-sets-power-energy-records" },
          { label: "DOE \u2014 National Laboratory achieves fusion ignition", url: "https://www.energy.gov/articles/doe-national-laboratory-makes-history-achieving-fusion-ignition" }
        ]
      }
    },
    bci: {
      label: "BCI", short: "BCI", color: "#4a3aa7", text: "#3C3489",
      metricLabel: "information transfer rate", metricUnit: "bits/sec",
      methodology: {
        metric: "Information transfer rate (bits per second) achieved by the best-performing publicly reported BCI, tracking the field's cumulative record.",
        formula: "index = 100 \u00d7 bits/sec \u00f7 10, clamped to 0\u2013100",
        anchors: "100 = 10 bits/sec, the throughput researchers use as an \u201cable-bodied mouse-use\u201d benchmark for comparison.",
        basisNote: "Early milestones (2020\u20132023) predate any published bits/sec benchmark and are shown as qualitative context, not measurements \u2014 their index values are placeholders for ordering, not a metric. The 2026 non-invasive decoder milestone uses a different metric entirely (word-decoding accuracy, not bits/sec), since non-invasive and invasive interfaces aren't measured the same way; its index reflects that it hasn't beaten the invasive throughput record, not that it's a lesser achievement.",
        sources: [
          { label: "MIT Technology Review \u2014 What to expect from Neuralink in 2025", url: "https://www.technologyreview.com/2025/01/16/1110017/what-to-expect-from-neuralink-in-2025/" }
        ]
      }
    }
  },
  events: [
    { field: "agi", date: "2019-Q1", score: 0, title: "GPT-2 announced (staged release)", desc: "OpenAI announces a 1.5B parameter LM but withholds full release citing potential misuse risks. This is the earliest point on METR's benchmark curve \u2014 a roughly 2-second task time horizon.", metric: { value: 2, unit: "sec", basis: "measured" }, links: [{ type: "post", label: "OpenAI blog", url: "https://openai.com/research/better-language-models" }] },
    { field: "agi", date: "2020-Q2", score: 12, title: "GPT-3 paper", desc: "175B parameter model demonstrates few-shot learning at scale \u2014 the first hint that scaling alone continues to work.", metric: { value: 10.6, unit: "sec", label: "task time horizon (trend estimate)", basis: "estimated" }, links: [{ type: "paper", label: "arXiv", url: "https://arxiv.org/abs/2005.14165" }] },
    { field: "agi", date: "2022-Q2", score: 29, title: "Diffusion image models go mainstream", desc: "DALL-E 2, Imagen, and Stable Diffusion release within months of each other. A parallel capability track to language agents \u2014 not directly measured on the time-horizon benchmark, so its index reflects the field's general trend at this date.", metric: { value: 2.0, unit: "min", label: "task time horizon (trend estimate, not diffusion-specific)", basis: "estimated" }, links: [{ type: "post", label: "SD announcement", url: "https://stability.ai/news/stable-diffusion-public-release" }] },
    { field: "agi", date: "2022-Q4", score: 32, title: "ChatGPT launch", desc: "The consumer moment for LLMs \u2014 100M users in two months. Chat interface, not the model, is the product surface.", metric: { value: 3.2, unit: "min", label: "task time horizon (trend estimate)", basis: "estimated" }, links: [{ type: "post", label: "OpenAI announcement", url: "https://openai.com/blog/chatgpt" }] },
    { field: "agi", date: "2023-Q1", score: 35, title: "GPT-4 and the multimodal frontier", desc: "GPT-4 launches with image input and stronger reasoning. Claude and open-weight LLaMA follow within the same quarter.", metric: { value: 4.3, unit: "min", label: "task time horizon (trend estimate)", basis: "estimated" }, links: [{ type: "post", label: "GPT-4 report", url: "https://openai.com/research/gpt-4" }] },
    { field: "agi", date: "2024-Q1", score: 43, title: "Sora, Claude 3, Gemini 1.5", desc: "Video generation, 200K context, and million-token context arrive together. Long-context becomes table stakes.", metric: { value: 14.7, unit: "min", label: "task time horizon (trend estimate)", basis: "estimated" }, links: [] },
    { field: "agi", date: "2024-Q3", score: 50, title: "o1-style reasoning models", desc: "Test-time compute scaling shows durable gains on hard reasoning benchmarks. A second scaling axis opens.", metric: { value: 36.8, unit: "min", label: "task time horizon (trend estimate)", basis: "estimated" }, links: [] },
    { field: "agi", date: "2025-Q1", score: 52, title: "METR clocks Claude 3.7 Sonnet at a 50-minute horizon", desc: "One of METR's directly-benchmarked data points: Claude 3.7 Sonnet completes tasks that take a skilled human about 50 minutes, at 50% reliability.", metric: { value: 50, unit: "min", basis: "measured" }, links: [{ type: "post", label: "METR time horizons", url: "https://metr.org/time-horizons/" }] },
    { field: "agi", date: "2025-Q2", score: 58, title: "Agentic frontier consolidation", desc: "Claude 4, GPT-5, and Gemini 2 push multi-step agent capabilities into production. METR measures o3's horizon at roughly two hours in the same window.", metric: { value: 120, unit: "min", label: "o3 task time horizon", basis: "measured" }, links: [{ type: "post", label: "METR time horizons", url: "https://metr.org/time-horizons/" }] },
    { field: "agi", date: "2026-Q1", score: 71, title: "Opus 4.6 crosses a 12-hour time horizon", desc: "METR's latest measurement puts Opus 4.6's 50%-reliability horizon at roughly 718 minutes \u2014 about 12 hours, continuing the field's accelerated doubling rate since 2023.", added: "2026-06-28", metric: { value: 718, unit: "min", label: "Opus 4.6 task time horizon (~12 hr)", basis: "measured" }, links: [{ type: "post", label: "METR time horizons", url: "https://metr.org/time-horizons/" }] },

    { field: "quantum", date: "2019-Q4", score: 29, title: "Google quantum supremacy claim", desc: "Sycamore samples a distribution classical supercomputers cannot practically reproduce. Contested, but a threshold moment.", metric: { value: 53, unit: "qubits", basis: "measured" }, links: [{ type: "paper", label: "Nature paper", url: "https://www.nature.com/articles/s41586-019-1666-5" }] },
    { field: "quantum", date: "2021-Q4", score: 35, title: "IBM Eagle \u2014 127 qubits", desc: "First >100 qubit processor from IBM. Qubit-count race begins in earnest.", metric: { value: 127, unit: "qubits", basis: "measured" }, links: [] },
    { field: "quantum", date: "2022-Q4", score: 44, title: "IBM Osprey \u2014 433 qubits", desc: "Qubit count more than triples in a year, but coherence and gate fidelity remain the binding constraints.", metric: { value: 433, unit: "qubits", basis: "measured" }, links: [] },
    { field: "quantum", date: "2023-Q4", score: 51, title: "IBM Condor \u2014 1,121 qubits", desc: "First >1000 qubit device \u2014 the high-water mark for raw qubit count in this dataset. Focus shifts from count to error correction.", metric: { value: 1121, unit: "qubits", basis: "measured" }, links: [] },
    { field: "quantum", date: "2024-Q4", score: 34, title: "Google Willow: below-threshold error correction", desc: "Willow has fewer qubits than Condor (105 vs 1,121), so its index actually drops here \u2014 but it's the more important result: error rate falls as qubit count scales up, the crossover the field had been waiting for since 1995.", metric: { value: 105, unit: "qubits", label: "qubits (first below-threshold error correction demonstrated)", basis: "measured" }, links: [{ type: "post", label: "Google blog", url: "https://blog.google/innovation-and-ai/technology/research/google-willow-quantum-chip/" }] },
    { field: "quantum", date: "2025-Q3", score: 51, title: "Multiple platforms reach 1,000+ qubits", desc: "Superconducting, trapped-ion, and neutral-atom systems reach comparable scales. Modality competition sharpens.", metric: { value: 1200, unit: "qubits (approx., leading platforms)", basis: "estimated" }, links: [] },
    { field: "quantum", date: "2026-Q2", score: 45, title: "Independent lab confirms below-threshold on a second architecture", desc: "A second team replicates surface-code error suppression on a different platform. Not a one-off \u2014 but this is a quality milestone, not a qubit-count record, so it's marked qualitative rather than assigned a false qubit figure.", added: "2026-06-28", metric: { value: null, unit: "", label: "logical error-rate suppression replicated on a second platform", basis: "qualitative" }, links: [] },

    { field: "fusion", date: "2020-Q1", score: 5, title: "JET prepares for D-T campaign", desc: "European tokamak begins deuterium-tritium campaign planning with ITER-like walls. Pre-ignition era \u2014 no energy-gain record has been posted anywhere yet.", metric: { value: null, unit: "", label: "pre-ignition era, no Q record yet", basis: "qualitative" }, links: [] },
    { field: "fusion", date: "2021-Q3", score: 7, title: "NIF first burning plasma", desc: "Self-heating from fusion alphas exceeds external heating for the first time. NIF's first measured energy-gain figure.", metric: { value: 0.7, unit: "Q", basis: "measured" }, links: [{ type: "post", label: "LLNL announcement", url: "https://www.llnl.gov/news/national-ignition-facility-experiment-puts-researchers-threshold-fusion-ignition" }] },
    { field: "fusion", date: "2022-Q4", score: 15, title: "NIF net energy gain (Q>1)", desc: "The first controlled fusion reaction to produce more energy than the laser input drove into the target: 3.15 MJ out from 2.05 MJ in. Symbolic more than practical, but symbolic matters.", metric: { value: 1.54, unit: "Q", basis: "measured" }, links: [{ type: "post", label: "DOE announcement", url: "https://www.energy.gov/articles/doe-national-laboratory-makes-history-achieving-fusion-ignition" }] },
    { field: "fusion", date: "2023-Q3", score: 19, title: "NIF repeats gain shot", desc: "A July 2023 shot beats the December record: 3.88 MJ out from the same 2.05 MJ input. The result is reproducible, not a fluke.", metric: { value: 1.89, unit: "Q", basis: "measured" }, links: [] },
    { field: "fusion", date: "2024-Q1", score: 24, title: "NIF sets a new gain record", desc: "A February 2024 shot delivers an estimated 5.2 MJ from 2.2 MJ of laser input \u2014 more than double the input energy.", metric: { value: 2.36, unit: "Q", basis: "measured" }, links: [{ type: "post", label: "LLNL \u2014 NIF energy records", url: "https://lasers.llnl.gov/about/keys-to-success/nif-sets-power-energy-records" }] },
    { field: "fusion", date: "2024-Q2", score: 24, title: "JT-60SA first plasma", desc: "World's largest superconducting tokamak reaches first plasma. Steady-state operations research bridge to ITER \u2014 an engineering milestone on a different (magnetic-confinement) path, not a new Q record, so the index carries forward flat.", metric: { value: null, unit: "", label: "no new Q record \u2014 tokamak engineering milestone", basis: "qualitative" }, links: [] },
    { field: "fusion", date: "2025-Q1", score: 41, title: "NIF's highest-yield shot to date", desc: "An April 2025 experiment delivers roughly 8.6 MJ from 2.08 MJ of laser input, the eighth successful ignition shot and NIF's best Q figure yet.", metric: { value: 4.13, unit: "Q", basis: "measured" }, links: [{ type: "post", label: "LLNL \u2014 NIF energy records", url: "https://lasers.llnl.gov/about/keys-to-success/nif-sets-power-energy-records" }] },
    { field: "fusion", date: "2025-Q2", score: 41, title: "SPARC construction milestone", desc: "Commonwealth Fusion Systems completes cryostat integration on schedule \u2014 still pre-plasma, so no Q figure yet. Index carries forward flat from NIF's current record.", metric: { value: null, unit: "", label: "no new Q record \u2014 construction milestone", basis: "qualitative" }, links: [] },
    { field: "fusion", date: "2026-Q2", score: 41, title: "SPARC first-plasma window slips to Q1 2027", desc: "Not every quarter is a breakthrough. The integration delay was noted in the latest investor update \u2014 honest tracking beats hype, and the index reflects that no new gain record was set.", added: "2026-06-28", metric: { value: null, unit: "", label: "schedule slip, no new Q record", basis: "qualitative" }, links: [] },

    { field: "bci", date: "2020-Q3", score: 5, title: "Neuralink pig demo", desc: "Live demonstration of a wireless implant reading neural signals. Pre-benchmark era \u2014 no throughput figure has been published for any device yet.", metric: { value: null, unit: "", label: "pre-benchmark era", basis: "qualitative" }, links: [] },
    { field: "bci", date: "2021-Q2", score: 10, title: "Monkey plays Pong via BCI", desc: "Neuralink shows real-time cursor control from motor-cortex signals in a primate.", metric: { value: null, unit: "", label: "pre-benchmark era", basis: "qualitative" }, links: [] },
    { field: "bci", date: "2023-Q2", score: 15, title: "FDA clears Neuralink human trial", desc: "PRIME study approved for first-in-human implant \u2014 a regulatory milestone, not a performance measurement.", metric: { value: null, unit: "", label: "regulatory milestone", basis: "qualitative" }, links: [] },
    { field: "bci", date: "2024-Q1", score: 46, title: "First human implant recipient", desc: "Noland Arbaugh uses the implant for cursor control and gaming. Within weeks he sets an early throughput record for invasive interfaces, despite thread-retraction issues later addressed by a decoding update.", metric: { value: 4.6, unit: "bits/sec", label: "information transfer rate", basis: "measured" }, links: [] },
    { field: "bci", date: "2024-Q3", score: 46, title: "Synchron trials expand", desc: "Stentrode-based non-craniotomy approach adds patients across multiple sites. Synchron trades some throughput for a substantially less invasive procedure, so this doesn't set a new field-wide rate record \u2014 index carries forward flat.", metric: { value: null, unit: "", label: "no new throughput record \u2014 less-invasive procedure, different trade-off", basis: "qualitative" }, links: [] },
    { field: "bci", date: "2025-Q2", score: 95, title: "Multi-patient BCI cohort data", desc: "Cross-patient data shows durable channel counts and improving throughput. One participant sets a new world-record rate, closing in on the able-bodied benchmark.", metric: { value: 9.5, unit: "bits/sec", basis: "measured" }, links: [] },
    { field: "bci", date: "2026-Q2", score: 95, title: "Non-invasive fMRI-to-speech decoder crosses 60%", desc: "A UT Austin team pushes past the previous ceiling using transformer-based semantic decoding \u2014 a genuine advance, but measured in word-decoding accuracy, not bits/sec, so it isn't directly comparable to the invasive throughput record above.", added: "2026-06-28", metric: { value: 60, unit: "% word-decoding accuracy", label: "non-invasive semantic decoding accuracy (different metric)", basis: "measured" }, links: [] }
  ]
};
