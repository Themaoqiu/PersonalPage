dia

:::warning
1. 三天：找文章
    1. 数量覆盖够
    2. 符合
    3. 高质量
2. 一周
    1. 借助llm
    2. 总结、问题、方案

:::

# 3D LLM
:::warning
[@猫柒-](https://www.yuque.com/maoqi-wrts4)1. pointllm、shapellm比较典型；2. 最新的、有代表性的；3. 最好覆盖的3d数据模态多一些

:::

| Title | 3D模态 | 总结 | 研究问题 | 解决方案 |
| --- | --- | --- | --- | :---: |
| [PointLLM: Empowering Large Language Models to Understand Point Clouds](http://arxiv.org/abs/2308.16911) | 点云 | 通过点云编码器 + 强大LLM，融合几何、外观与语言信息；构建大规模点云-文本指令数据（约 1.8M 样本），提出生成式3D分类和3D物体描述两大新基准，在多项任务上超越2D与传统3D方法，甚至在3D物体描述任务上超过人工标注表现 |  | |
| [ShapeLLM: Universal 3D Object Understanding for Embodied Interaction](https://arxiv.org/abs/2402.17766) | 点云 | 通过点云编码器 + 强大LLM，融合几何、外观与语言信息；构建大规模点云-文本指令数据（约 1.8M 样本），提出生成式3D分类和3D物体描述两大新基准，在多项任务上超越2D与传统3D方法，甚至在3D物体描述任务上超过人工标注表现 |  | |
| [ShapeLLM-Omni: A Native Multimodal LLM for 3D Generation and Understanding](https://arxiv.org/abs/2506.01853) | mesh | 从「3D理解」扩展到「3D理解 + 3D生成 + 3D编辑」，构建原生 3D 多模态 LLM：通过 3D VQVAE 将体素编码成离散 token，配合 3D-Alpaca 大规模多任务数据（生成、理解、编辑），在统一的自回归 token 预测框架下，实现文本、图像与3D资产的任意序列交互。 |  | |
| [3D-LLaVA: Towards Generalist 3D LMMs with Omni Superpoint Transformer](https://arxiv.org/abs/2501.01163) | 点云 | 在 LLaVA 框架基础上扩展到 3D，提出 Omni Superpoint Transformer (OST)，统一处理点云、文本与交互式视觉提示，实现 3D VQA、dense captioning、3D referring segmentation 等多任务，面向「通用 3D 多模态模型」。 |  | |
| [MiniGPT-3D: Efficiently Aligning 3D Point Clouds with Large Language Models using 2D Priors](https://arxiv.org/abs/2405.01413) | 点云 | 面向「高效」的 3D LLM，对齐 3D 点云和 LLM 仅需约 27 小时、单张 RTX 3090 即可完成训练，却在多项目标上达到或接近 SOTA，证明了通过引入 2D 先验可以极大降低 3D LLM 的训练成本。 |  | |
| [Part-X-MLLM: Part-aware 3D Multimodal Large Language Model](https://arxiv.org/abs/2511.13647) | RGB点云 | 首个系统性「三维部件感知」的 3D MLLM，用统一的程序式接口（part grammar）描述生成、编辑和推理任务：输入 RGB 点云 + 文本，输出一段包含部件 bbox、语义描述和编辑命令的 token 序列，作为下游几何引擎的「控制程序」，在 grounded Q&A、组合生成和局部编辑上达 SOTA。 |  | |
| [3D-R1: Enhancing Reasoning in 3D VLMs for Unified Scene Understanding](https://arxiv.org/abs/2507.23478) | 点云 |  |  | |
| [3D-LLM: Injecting the 3D World into Large Language Models](https://arxiv.org/abs/2307.12981) | mesh处理成点云输入 |  |  | |
| [MeshLLM: Empowering Large Language Models to Progressively Understand and Generate 3D Mesh](https://arxiv.org/abs/2508.01242) | mesh |  |  | |
|  |  |  |  | |


# 3D Agent
:::warning
[@艾言](https://www.yuque.com/aiyan-ysjhk)1. 要和下面的区分好；2. 最好覆盖的3d数据模态多一些

:::

| Title | 3D模态 | 总结 | 研究问题 | 解决方案 |
| --- | --- | --- | --- | --- |
| [An Embodied Generalist Agent in 3D World](https://arxiv.org/abs/2311.12871) | 点云 |  提出了 LEO，一个统一的 3D 具身智能模型。它把 2D 图像、3D 点云和机器人动作都表示成 token，接入大语言模型，通过两阶段训练（3D 视觉语言对齐 + 指令微调），让同一个模型同时完成 3D 描述、问答、对话、任务规划、导航和操作等任务。实验表明，统一框架不仅在多项 3D 视觉语言任务上达到或超过专用模型性能，还具备一定的具身泛化能力。   | 如何让一个 LLM 真正理解并在 3D 物理世界中行动，从而成为一个具身的通用智能体？   | 使用 object-centric 3D 表示 + 空间增强 Transformer + 动作离散化，将所有 3D 视觉、语言和行动任务统一为大语言模型的自回归序列预测问题，并通过两阶段训练实现 3D 对齐与具身能力学习。   |
| [SIMA 2: A Gemini-Powered AI Agent for 3D Virtual Worlds](https://deepmind.google/blog/sima-2-an-agent-that-plays-reasons-and-learns-with-you-in-virtual-3d-worlds/) | <font style="color:rgb(43, 45, 49);">RGB 视频流</font> |  |  | |
| [3D-Agent:Tri-Modal Multi-Agent Collaboration for Scalable 3D Object Annotation](https://arxiv.org/abs/2601.04404) | 点云 |  |  | |
| [Agent3D-Zero: An Agent for Zero-shot 3D Understanding](https://arxiv.org/abs/2403.11835) | 多视角图 |  |  | |
| [VoxPoser: Composable 3D Value Maps for Robotic Manipulation with Language Models](https://arxiv.org/abs/2307.05973) |  3D 体素   |  |  | |
| [WorldCraft: Photo-Realistic 3D World Creation and Customization via LLM Agents](https://arxiv.org/abs/2502.15601) | NA (llm agent 做 3d 生成) |  |  | |
| [L3GO: Language Agents with Chain-of-3D-Thoughts for Generating Unconventional Objects](https://arxiv.org/abs/2402.09052) | NA (llm agent 做 3d 生成) |  |  | |


# Embodied Agent
:::warning
[@艾言](https://www.yuque.com/aiyan-ysjhk)1. 要和上面的区分好

:::

| Title | 总结 | 研究问题 | 解决方案 |
| --- | --- | --- | :---: |
| [Embodied AI Agents: Modeling the World](https://arxiv.org/abs/2506.22355) |  |  | |
| [SAGE: Scalable Agentic 3D Scene Generation for Embodied AI](https://arxiv.org/abs/2602.10116) |  |  | |
| [3D-VLA: A 3D Vision-Language-Action Generative World Model](https://arxiv.org/abs/2403.09631) |  |  | |
| [GraphPad: Inference-Time 3D Scene Graph Updates for Embodied Question Answering](https://arxiv.org/abs/2506.01174) |  |  | |
| [LLM-Planner: Few-Shot Grounded Planning for Embodied Agents with Large Language Models](https://arxiv.org/abs/2212.04088) |  |  | |
| [STMA: A Spatio-Temporal Memory Agent for Long-Horizon Embodied Task Planning](https://arxiv.org/abs/2502.10177) |  |  | |
| [KARMA: Augmenting Embodied AI Agents with Long-and-short Term Memory Systems](https://arxiv.org/abs/2409.14908) |  |  | |


# Spatial Intelligence (Image/Video)
:::warning
[@猫柒-](https://www.yuque.com/maoqi-wrts4)

:::

| Title | 总结 | 研究问题 | 解决方案 |
| --- | --- | --- | --- |
| [Spatial-MLLM: Boosting MLLM Capabilities in Visual-based Spatial Intelligence](https://arxiv.org/abs/2505.23747) |  |  | |
| [Thinking in Space: How Multimodal Large Language Models See, Remember, and Recall Spaces](https://arxiv.org/abs/2412.14171) |  |  | |
| [SpatialThinker: Reinforcing 3D Reasoning in Multimodal LLMs via Spatial Rewards](https://arxiv.org/abs/2511.07403) |  |  |  |
| [Tool-Augmented Spatiotemporal Reasoning for Streamlining Video Question Answering Task](https://arxiv.org/abs/2512.10359) |  |  |  |
| [SpaceR: Reinforcing MLLMs in Video Spatial Reasoning](https://arxiv.org/abs/2504.01805) |  |  |  |
| [VLM-3R: Vision-Language Models Augmented with Instruction-Aligned 3D Reconstruction](https://arxiv.org/abs/2505.20279) |  |  |  |
| [Scene-R1: Video-Grounded Large Language Models for 3D Scene Reasoning without 3D Annotations](https://arxiv.org/abs/2506.17545) |  |  |  |
| [Think3D: Thinking with Space for Spatial Reasoning](https://arxiv.org/abs/2601.13029) |  |  |  |
| [Data-Driven Loss Functions for Inference-Time Optimization in Text-to-Image](https://arxiv.org/abs/2509.02295) |  |  |  |
| [RL-RIG: A Generative Spatial Reasoner via Intrinsic Reflection](https://arxiv.org/abs/2602.19974) |  |  |  |
| [Spatial Chain-of-Thought: Bridging Understanding and Generation Models for Spatial Reasoning Generation](https://arxiv.org/abs/2602.11980) |  |  |  |
| [Video4Spatial: Towards Visuospatial Intelligence with Context-Guided Video Generation](https://arxiv.org/abs/2512.03040) |  |  |  |
| [Spatial-MLLM: Boosting MLLM Capabilities in Visual-based Spatial Intelligence](https://arxiv.org/abs/2505.23747) |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |


# 4D Understanding and Generation
| Title | Type | 总结 | 研究问题 | 解决方案 |
| --- | --- | --- | --- | :---: |
| [Uni4D-LLM: A Unified SpatioTemporal-Aware VLM for 4D Understanding and Generation](https://arxiv.org/abs/2509.23828) | 理解 |  |  | |
| [Comp4D: LLM-Guided Compositional 4D Scene Generation](https://arxiv.org/abs/2403.16993) | 生成 |  |  | |
| [B4DL: A Benchmark for 4D LiDAR LLM in Spatio-Temporal Understanding](https://arxiv.org/abs/2508.05269) | 理解 |  |  | |
| [LLaVA-4D: Embedding SpatioTemporal Prompt into LMMs for 4D Scene Understanding](https://arxiv.org/abs/2505.12253) | 理解 |  |  | |
| [Birth and Death of a Rose](https://arxiv.org/abs/2412.05278) | 生成 |  |  | |


# 3D LLM/Agent for Medical Application
| Title | Type | 总结 | 研究问题 | 解决方案 |
| --- | --- | --- | --- | :---: |
| [3DMedAgent: Unified Perception-to-Understanding for 3D Medical Analysis](https://arxiv.org/abs/2602.18064v1) | 3D Agent |  |  | |
| [CT-Agent: A Multimodal-LLM Agent for 3D CT Radiology Question Answering](https://arxiv.org/abs/2505.16229) | 3D Agent |  |  | |
| [MedSAM3: Delving into Segment Anything with Medical Concepts](https://arxiv.org/abs/2511.19046) | 可以处理3D CT的medical agent，但创新点不针对于3D |  |  | |
| [MedSAM-Agent: Empowering Interactive Medical Image Segmentation with Multi-turn Agentic Reinforcement Learning](https://arxiv.org/abs/2602.03320v1) | 可以处理3D CT的medical agent，但创新点不针对于3D |  |  | |
| [Staged Voxel-Level Deep Reinforcement Learning for 3D Medical Image Segmentation with Noisy Annotations](https://arxiv.org/abs/2601.03875) | 不是传统的agent概念，而是把voxel当成agent |  |  | |


# 3D LLM/Agent for Industrial Application
| Title | Type | 总结 | 研究问题 | 解决方案 |
| --- | --- | --- | --- | :---: |
|  |  |  |  | |


# 3D LLM/Agent for Other Application
| Title | Type | 总结 | 研究问题 | 解决方案 |
| --- | --- | --- | --- | :---: |
|  |  |  |  | |




