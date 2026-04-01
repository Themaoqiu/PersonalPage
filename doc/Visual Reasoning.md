# Survey
:::color1
供学习的材料，帮助扫清知识gap，应该自行安排时间选择性阅读，和下面细分方向的调研同步

:::

[Video-LMM Post-Training: A Deep Dive into Video Reasoning with Large Multimodal Models](https://arxiv.org/abs/2510.05034)

[Thinking with Images for Multimodal Reasoning: Foundations, Methods, and Future Frontiers](https://arxiv.org/abs/2506.23918)

[A Survey on Agentic Multimodal Large Language Models](https://arxiv.org/abs/2510.10991)

# 细分方向
# Grounding-driven Visual Reasoning
## Image
| Title | 总结 | 研究问题 | 解决方案 |
| --- | --- | --- | --- |
| [VTPerception-R1: Enhancing Multimodal Reasoning via Explicit Visual and Textual Perceptual Grounding](https://arxiv.org/abs/2509.24776) | 系统性地量化三种grounding策略对推理的影响，得出 explicit perception notes始终能够带来提升的结论，并提出了 VTPerception-R1，一个通过两阶段微调（主要显式的感知描述）与强化学习（视觉感知、文本感知、一致性感知）的提升多模态模型推理准确性与稳健性的训练框架。 | 没有进行全面的实验来系统地评估显式视觉感知在推理和通用基准上的有效性;   现有方法很少结合文本感知，导致过度依赖视觉输入，增加产生幻觉推理的风险 | |
| [Ground-R1: Incentivizing Grounded Visual Reasoning via Reinforcement Learning](https://arxiv.org/abs/2505.20272) | 提出了Ground-R1框架，引入SRPO以GRPO 的 grounded reasoning 中存在的规模驱动偏差，并验证在LVLM,high-resolution, and visual grounding的测试中Ground-R1由于先前方法，SRPO优于GRPO | 推理时，模型倾向于优先考虑视觉上突出的对象，而忽略小型但语义上关键的证据。 | |
| [Grounded Reinforcement Learning for Visual Reasoning](https://arxiv.org/abs/2505.23678) | 提出了一种名为 ViGoRL 的视觉语言模型训练范式，通过 MCTS 数据引导和空间锚定的强化学习，显著提升了模型在复杂视觉推理和网页定位任务中的准确性与可解释性。 | | |
| [Zooming without Zooming: Region-to-Image Distillation for Fine-Grained Multimodal Perception](https://arxiv.org/abs/2602.11858) | 在细粒度推理时，用区域到图像蒸馏方法将推理阶段调用工具放大的操作移到了训练时放大图像；为了衡量这一能力提出了 ZoomBench | 如何在不增加推断延迟和迭代工具调用的前提下，提升多模态模型在全图视野下捕捉和理解微小局部细节的能力 | |
| [CodeDance: A Dynamic Tool-integrated MLLM for Executable Visual Reasoning](https://arxiv.org/abs/2512.17312) | 提出CodeDance 是一个开源的多模态大型语言模型（MLLM）框架，它通过将可执行的 Python 代码作为推理媒介，过程透明、并且涌现了新的能力（表明一种通用且可扩展的可执行视觉推理机制），在多个数据集上验证了超过一些闭源模型。 | 现有的开源 MLLM 推理通常依赖于固定的视觉工作流或文本链式思考（CoT），导致在处理复杂任务时缺乏灵活性、难以观察中间步骤，且容易出现工具调用不足或过度调用的平衡问题。 | 用SFT教授原子能力，用RL进一步提升基于工具的推理能力，并在RL阶段设计了一种难度自适应的奖励机制（RBAT），通过强化学习平衡工具调用的效率与准确性。 |
| [VGR: Visual Grounded Reasoning](https://arxiv.org/abs/2506.11991) | 提出 VGR，一种通过“按需检索”局部视觉细节来增强多模态大模型推理能力的方法，并构建了带有视觉提示的推理数据集VGR-SFT，并验证了VGR 在需要全面理解图像细节的多模态基准测试中实现了卓越性能。 | 现有的多模态链式思考（CoT）推理主要依赖文本空间，容易产生语言偏见（Language Bias），且在处理需要精确视觉细节（如图表分析、细粒度感知）的复杂任务时表现不佳。 | 设计了一种自驱动的选择性视觉重放机制，使模型在推理过程中能主动生成重放信号，精准定位并融合关键局部区域的高清特征，并配合自动构建的大规模 VGR-SFT 数据集进行训练。<br/>    |


## Video
| Title | 总结 | 研究问题 | 解决方案 |
| --- | --- | --- | --- |
| [Video-Thinker: Sparking “Thinking with Videos” via Reinforcement Learning](https://arxiv.org/abs/2510.23473) | 本文提出了 Video-Thinker 框架，通过强化学习赋予多模态大模型在视频推理过程中自主进行“时间定位（Grounding）”和“内容描述（Captioning）”的能力，提出来一个Video-Thinker-10K ，在 7B 级模型中达到了前沿（SOTA）性能。 | 现有的多模态模型在处理视频推理时，往往难以像处理图像那样动态地操纵和分析时间序列，通常依赖预设的思维链模板或外部工具，缺乏内在的自主时间推理机制。 | 构建了包含 10K 条具有自主工具化思维轨迹的 Video-Thinker-10K 数据集，并采用监督微调（SFT）结合组相对策略优化（GRPO）强化学习的两阶段训练策略，使模型能够在思维链（CoT）中自发调用时间操作 |
| [SAMA: Towards Multi-Turn Referential Grounded Video Chat with Large Language Models](https://arxiv.org/abs/2505.18812) | 通过构建大规模统一指令数据集 SAMA-239K、提出融合时空聚合器与 SAM2 的 SAMA 模型以及设立专门的评测基准 SAMA-Bench，实现了能够进行精准像素级接地的多轮视频对话系统。 | 尽管当前的 Video LMMs在全局场景理解方面表现出色，但它们往往在细粒度时空推理方面存在不足。 | |
| [Vidi2.5: Large Multimodal Models for Video Understanding and Creation](https://arxiv.org/abs/2511.19529) | 介绍了 Vidi2.5 模型和Vidi2.50think及 VUE-TR-V2（时空定位）和VUE-PLOT （细粒度感知和高级情节理解）基准，展示了其在精细化视频时空定位和复杂剧情推理上的领先性能，并验证了其在自动化视频编辑规划中的实用价值。 | 如何在长视频语境下实现端到端的精细化时空对象定位，并结合推理能力解决深层次的剧情理解与创作辅助问题 | |


# Thinking with image
和Grounding-driven Visual Reasoning相比更强调工具调用与grounding之外的其他功能

| Title | 总结 | 研究问题 | 解决方案 |
| --- | --- | --- | --- |
| [Thyme: Think Beyond Images](https://arxiv.org/abs/2508.11630) | 提出了名为 Thyme的范式，通过让模型自主生成并执行代码来进行图像处理（如裁剪、旋转、增强）和数学运算，从而显著提升了模型在复杂感知与逻辑推理任务中的性能。 |  如何通过有效的训练策略（如 SFT 与强化学习）和自适应采样机制，使多模态模型能够克服现有“视觉思考”方案的功能局限，实现具有高度自主性且精准的图像操作与代码化推理能力 | 采用两阶段训练策略——首先通过监督微调（SFT）在50万高质量样本上教会模型生成代码进行图像操作和计算，然后通过提出的 GRPO-ATS 强化学习算法（对文本生成使用高温度鼓励探索，对代码生成使用零温度确保精确性）结合沙盒执行环境，实现模型自主决策何时以及如何通过可执行代码处理图像并完成复杂推理。 |
| [Thinking with Generated Images](https://arxiv.org/abs/2505.22525) | 提出了名为Thinking with Generated Images的范式，让大模型产生并自我批判修正中间视觉子目标，在处理复杂多对象场景时实现了高达 50%（从 38%到 57%）的相对提升。 | 当前多模态模型在视觉推理时受限于固定的输入图像或纯文本的思维链（CoT），难以处理需要视觉预见、空间规划及迭代优化等高度依赖“视觉想象力”的复杂任务。 | 引入了“原生多模态思维过程（Native Long-multimodal Thought Process）”，通过在统一的自回归模型中交替生成文本和视觉标记，实现视觉子目标的分解与自我批判修正。 |
| [Visual Planning: Let’s Think Only with Images](https://arxiv.org/abs/2505.11409) | 提出了一种名为“Visual Planning”的新范式，提出了VPRL的两阶段训练框架，通过强化学习训练模型直接生成图像序列进行推理，并验证VPRL在空间规划上优于传统文本推理范式和监督基线，并具有更好的泛化性。 | 模型能否直接在非语言模态（如图像）中进行规划，而无需文本中介？ | 提出 VPRL 框架，利用组相对策略优化（GRPO）对大型视觉模型进行两阶段强化学习，通过“进度奖励”机制引导模型在不借助任何语言中介的情况下，纯粹在视觉域内预测下一步状态。 |
| [DeepEyes: Incentivizing “Thinking with Images” via Reinforcement Learning](https://arxiv.org/abs/2505.14362) | 提出了一种名为 DeepEyes 的开源视觉语言模型，通过强化学习使其能够调用工具裁取图片进行推理，并验证了在不需要冷启动微调的情况下显著提升了高分辨率图像的感知与推理水平。 | 将先进的视觉输入处理有效地融入推理机制 | 该研究通过端到端强化学习（GRPO算法），引入一种“图像缩放”工具调用机制，并配合面向工具使用的奖励策略和数据筛选方案，诱导模型在推理过程中自主选择对关键区域进行局部裁剪与观察。 |
| [Reliable Thinking with Images](https://arxiv.org/abs/2602.12916) | 针对多模态大模型在Thinking with Images过程中存在的错误累积问题，提出了一种名为 RTWI 的可靠推理框架，通过评估推理链的可靠性并进行过滤和加权投票，显著提升了模型在复杂多模态任务中的表现。 | 解决NT问题（即在挖掘视觉线索或进行答案推理阶段，由于视觉理解的局限性导致产生的错误步骤会随推理链传播，从而损害最终答案的准确性。） | 提出 RTWI方法，即采用统一的以文本为中心的机制来估计视觉线索和推理步骤的可靠性，并结合双阶段过滤模块和基于“可靠性跃迁”特征的稳健投票模块，从而剔除不可靠的推理路径并锁定正确答案。 |
| [https://drive.google.com/file/d/1KjnL6DS1sIE1ZljGQFEqiU_KC4tNelWg/view?usp=sharing](https://drive.google.com/file/d/1KjnL6DS1sIE1ZljGQFEqiU_KC4tNelWg/view?usp=sharing) | 本文提出了一种名为 DeepScan 的免训练框架，旨在通过模拟人类从局部线索到全局证据的认知过程，增强大型视觉语言模型（LVLMs）,验证了在复杂场景下的视觉定位与推理能力 ,V* 和 TreeBench 。 | 现有的视觉推理方法多采用“自上而下”的粗放定位策略，在处理高分辨率或含有噪声背景、相似物干扰的图像时，容易产生注意力偏移或错误感知，导致模型出现“幻觉”或推理失败 。 | DeepScan 引入了由局部线索探索驱动的“自下而上”**分层扫描（Hierarchical Scanning）**，并结合 **重新对焦（Refocusing）** 机制优化证据视图，最后通过 **证据增强推理（Evidence-Enhanced Reasoning）** 整合多粒度视觉信息以给出准确答案  |
| [TikArt: Aperture-Guided Observation for Fine-Grained Visual Reasoning via Reinforcement Learning](https://arxiv.org/abs/2602.14482) |  |  |  |


# Thinking with Code/Structure
| Title | 总结 | 研究问题 | 解决方案 |
| --- | --- | --- | --- |
| [MomaGraph: State-Aware Unified Scene Graphs with Vision-Language Model for Embodied Task Planning](https://arxiv.org/abs/2512.16909) | 提出了名为MomaGraph的新型场景表示方法，并构建了MomaGraph-Scenes家庭场景图数据集，提出了MomaGraph-R1的7B 视觉语言模型用以生成准确且导向图，给出了MomaGraph-Bench评估套件（用于评估任务导向场景图是否以及如何提升规划性能） | 解决现有的场景图（Scene Graphs）通常将空间与功能关系分离，且大多处理静态场景难以应对机器人执行任务需求的问题 | |
| [SceneAlign: Aligning Multimodal Reasoning to Scene Graphs in Complex Visual Scenes](https://arxiv.org/abs/2601.05600) | 本文针对多模态大语言模型在复杂视觉场景中推理不忠实（如幻觉和逻辑断层）的问题，提出了一种基于场景图引导的偏好对齐框架 SceneAlign，显著提升了模型在视觉推理任务中的准确性与 grounding 能力。 | 现有的偏好对齐方法通常依赖文本微调或答案驱动的解释，无法有效解决模型过度依赖语言先验而忽略视觉细粒度结构（物体、属性及关系）的问题，导致推理过程与实际视觉证据脱节。 | SceneAlign 通过构建场景图来定位关键推理节点，并设计了交换、替换、缩减和过度思考四种结构化干预策略来生成“语义连贯但视觉矛盾”的负面推理链，最后利用直接偏好优化（DPO）训练模型更倾向于选择结构忠实度高的推理路径。 |
| [VCode: a Multimodal Coding Benchmark with SVG as Symbolic Visual Representation](https://arxiv.org/abs/2511.02778) | 本文提出了一个名为 VCode 的多模态编程基准测试，旨在评估模型将自然图像转化为可执行的 SVG 代码以保留其符号语义的能力。 | 现有的多模态编程研究多侧重于语言中心任务或合成资产生成，缺乏对模型能否将复杂的现实世界视觉信息转化为紧凑、可解释且可推理的符号化表示（如 SVG）的探索。 | 作者引入了 VCode 基准和 CodeVQA 评测协议，并提出了 VCoder 框架，通过“修正思维”（迭代细化代码）和“视觉工具辅助”（利用检测器提供结构化线索）来增强视觉编程能力。<br/><font style="background-color:rgb(250, 250, 250);">   </font> |
| [RECODE: Reasoning Through Code Generation for Visual Question Answering](https://arxiv.org/abs/2510.13756) | 本文提出了一种名为 RECODE 的智能体框架，通过将图表和几何图形反向工程（Derendering）为可执行代码，在 CharXiv、ChartQA 和 Geometry3K 等多种视觉推理基准测试中显著优于不利用代码的方法或仅使用代码绘制辅助线或裁剪的方法，证明“将视觉感知与可执行代码相结合，为更准确和可验证的多模态推理提供了新途径”。<br/>  | 现有的多模态大模型在处理含有结构化逻辑和精确数值的视觉图像（如科学图表、流程图和几何题）时，往往由于缺乏验证机制而难以进行精确推理和计算。 | 提出了一种基于“生成-评估-修正”循环的闭环框架，即先生成多个代码候选方案，利用像素级判别器(MSE)筛选最优者和分层去渲染策略（将视觉图像分解为高级和低级组件，并整合 OCR 技术进行文本定位）生成高质量候选，并根据重渲染图像与原图的差异进行迭代优化。，最终利用高质量代码辅助逻辑推理。 |
| [CodePercept: Code-Grounded Visual STEM Perception for MLLMs](https://arxiv.org/abs/2603.10757) | 该研究通过量化分析发现视觉感知是限制多模态大模型（MLLM）在STEM领域推理能力的核心瓶颈，并提出了一种以可执行代码为媒介的“代码落地（Code-Grounded）”感知增强框架，显著提升了模型对复杂科学图形的理解与重建精度。 | <font style="color:rgb(51, 51, 51);">在解决STEM视觉推理任务时，MLLM的表现受限究竟是因为推理逻辑不足，还是因为无法准确感知图像中的空间定位、定量关系和结构化语义（即“感知瓶颈”问题）？</font> | 提出 STEM2Code-Eval，直接评估模型对STEM视觉结构的理解能力；    构建了包含100万对“图像-描述-代码”的三元组数据集ICC-1M，通过让模型学习生成能够精准重建图像的Python代码（STEM Image-to-Code）以及基于代码校验的准确描述（Code-Grounded Caption），并辅以强化学习（RL）来系统性地强化模型的视觉感知能力。 |


# Multimodal Agent
与thinking with xxx系列相比更强调调用工具的策略

## Image
| Title | 总结 | 研究问题 | 解决方案 |
| --- | --- | --- | --- |
| [ImAgent: A Unified Multimodal Agent Framework for Test-Time Scalable Image Generation](https://arxiv.org/abs/2511.11483) | 该研究提出了 ImAgent，一个基于统一多模态模型的训练免（training-free）智能体框架，通过在推理阶段动态规划和执行多种生成与修复动作，显著提升了图像生成和编辑的质量与语义一致性。 | 现有的文本生成图像模型在处理模糊提示词时存在随机性大、语义不一致的问题，且现有的优化手段（如重写、采样）往往相互独立、依赖外部模型，导致推理缩放（test-time scaling）效率低下。 | 引入一个由策略控制器驱动的统一框架，将推理、生成和自我评估集成在单个模型中，通过自动选择“思维链增强”、“图像细节修正”及“Best-of-N 采样”等动作，实现自组织的图像迭代优化。    |
| [ChartAgent: A Multimodal Agent for Visually Grounded Reasoning in Complex Chart Question Answering](https://arxiv.org/abs/2510.04514) | 该研究提出了一种名为 ChartAgent 的多模态智能体框架，通过模拟人类的视觉推理过程，显著提升了大型多模态模型在复杂图表（尤其是无标注图表）上的数值理解和问答能力。 | 现有的大型多模态模型（MLLMs）在处理缺乏显式数值标注的图表时性能大幅下降，难以仅凭视觉特征进行精确的数值提取和空间推理。 | 引入了一个包含专门图表视觉工具库（如坐标定位、颜色提取、区域分割）的智能体框架，通过“思考-行动-观察”的迭代循环和视觉自我验证机制，在图表的空间域内进行显式的视觉推理。 |
| [Efficient Multimodal Planning Agent for Visual Question-Answering](https://arxiv.org/abs/2601.20676) | 该研究开发了一种用于视觉问答（VQA）的高效多模态规划智能体，通过动态优化多模态检索增强生成（mRAG）流水线，在提升任务准确率的同时显著降低了计算成本和延迟。 | 现有的多模态检索增强生成系统通常采用固定的多阶段流水线（如图像检索、查询改写、文本检索等）且原本的步骤之间也可能存在固有的依赖关系，导致在处理简单问题时产生大量冗余计算，且难以应对不同类型查询的动态需求。 | 提出一种基于细粒度数据标注训练的规划智能体，能够根据输入的 VQA 查询智能判断是否需要检索以及需要哪种类型的检索（仅图像、仅文本、两者都要或均不需要），从而实现计算资源的按需分配。 |
| [Agent0-VL: Exploring Self-Evolving Agent for Tool-Integrated Vision-Language Reasoning](https://arxiv.org/abs/2511.19900) | 论文提出了 Agent0-VL，一个能够在无人类标注或外部奖励监督下，通过集成工具的使用、自我验证和自我修复来实现持续自我进化的多模态智能体。 | 传统的视觉语言智能体受限于人类标注数据的上限，且纯文本的自我评估在处理复杂的视觉推理（如几何、科学分析）时容易产生评估幻觉和逻辑验证偏差。 | 该方案将 LVLM 统一为“解题者（Solver）”和“验证者（Verifier）”双重角色，通过自我进化推理周期（SERC），利用外部工具（如 Python 代码）生成证据来核实推理步骤，并通过强化学习（GRPO）实现模型能力的迭代提升 |
| [AdaReasoner: Dynamic Tool Orchestration for Iterative Visual Reasoning](https://arxiv.org/abs/2601.18631) | 论文提出了 AdaReasoner，一个通过大规模多步工具调用数据和强化学习训练而成的多模态大模型家族，实现了在视觉推理任务中超越 GPT-5 的性能，并具备极强的零样本工具泛化能力。 | 现有的多模态模型在视觉推理中往往只能被动、机械地使用单一或预定义的工具，缺乏像人类一样根据任务需求自主决定何时使用、如何组合以及快速适应新工具的动态规划能力。 | 论文引入了支持长程交互的自动化数据生成管线、优化工具选择与排序的 Tool-GRPO 强化学习算法，以及通过随机化工具定义来解耦逻辑与任务的自适应学习机制。 |
|  |  |  |  |


## Video
| Title | 总结 | 研究问题 | 解决方案 |
| --- | --- | --- | --- |
| [Seeing, Listening, Remembering, and Reasoning: A Multimodal Agent with Long-Term Memory](https://arxiv.org/abs/2508.09736) | <font style="background-color:rgb(250, 250, 250);">本文通过引入实体中心的记忆结构和多轮推理机制，显著提升了智能体在长视频理解及机器人视角基准测试（M3-Bench）中的任务成功率。</font> | <font style="background-color:rgb(250, 250, 250);">多模态智能体在处理长视频流时，难以通过持续感知构建具有实体一致性的长期记忆，并在复杂指令下进行有效的跨模态推理。</font> | <font style="background-color:rgb(250, 250, 250);">提出了 </font>**<font style="background-color:rgb(250, 250, 250);">M3-Agent</font>**<font style="background-color:rgb(250, 250, 250);"> 框架，通过并行处理生成</font>**<font style="background-color:rgb(250, 250, 250);">情节记忆</font>**<font style="background-color:rgb(250, 250, 250);">（具体事件）与</font>**<font style="background-color:rgb(250, 250, 250);">语义记忆</font>**<font style="background-color:rgb(250, 250, 250);">（实体知识），并结合强化学习训练的控制策略实现多轮推理与检索；并提出了 一个旨在评估多模态智能体的记忆和基于记忆的推理的有效性的 LVQA 基准测试M3-Bench。</font> |
| [LongVideoAgent: Multi-Agent Reasoning with Long Videos](https://arxiv.org/abs/2512.20618) | <font style="background-color:rgb(250, 250, 250);">本文提出了 LongVideoAgent，一个通过强化学习训练、协调多个专用智能体（Grounding 和 Vision）来处理长视频问答任务的多智能体推理框架。</font> | <font style="background-color:rgb(250, 250, 250);">现有的长视频理解方法通常依赖于有损的内容压缩或有限的工具集，导致在处理小时级视频时缺乏细粒度的视觉线索和精确的时间定位能力。</font> | <font style="background-color:rgb(250, 250, 250);">设计了一个由主智能体（Master Agent）协调时间定位智能体（Grounding Agent）和视觉观测智能体（Vision Agent）的多轮交互系统，并利用 GRPO 强化学习算法优化主智能体的推理路径，以实现高效、准确的证据搜集与问答；</font><br/><font style="background-color:rgb(250, 250, 250);">设计了奖励驱动的智能体强化学习训练方案；</font><br/><font style="background-color:rgb(250, 250, 250);">并提出了剧集级长视频数据集 LongTVQA 和 LongTVQA+</font> |
| [Thinking With Videos: Multimodal Tool-Augmented Reinforcement Learning for Long Video Reasoning](https://arxiv.org/abs/2508.04416) | <font style="background-color:rgb(250, 250, 250);">本文提出了一个名为 VITAL 的端到端智能视频推理框架，通过引入视觉工具箱实现了从文本思维链（CoT）到</font><font style="background-color:rgb(250, 250, 250);">多模态思维链</font><font style="background-color:rgb(250, 250, 250);">的演进，显著提升了长视频的理解与推理能力。</font> | <font style="background-color:rgb(250, 250, 250);">现有的多模态大模型在处理长视频时，往往因跨模态交互不足和推理链条过长而导致严重的幻觉问题，难以实现精确的时间定位和复杂的逻辑推理。</font> | <font style="background-color:rgb(250, 250, 250);">该研究开发了一个可调用视频剪辑等工具的代理框架，并构建了用于全面的视频推理学习的两个大规模、高质量的多任务视频推理数据集：MTVR-CoT-72k (SFT)和 MTVRRL-110k(RL)，同时提出“难度感知组相对策略优化”（DGRPO）算法来解决多任务强化学习中的难度不平衡问题。</font> |
| [VCA: Video Curious Agent for Long Video Understanding](https://arxiv.org/abs/2412.10471) | <font style="background-color:rgb(250, 250, 250);">本文提出了一种名为 VCA（Video Curious Agent）的自驱动视频智能体，它通过模仿人类“全局感知后局部探索”的认知模式，利用树搜索结构和自生成的内在奖励，在极低计算成本下实现了对长视频的高效理解。</font> | <font style="background-color:rgb(250, 250, 250);">传统的长视频理解方法通常采用密集均匀采样或 LLM 辅助工具（如每帧标注），这在处理长达数小时、信息密度极不平衡的视频时，会产生高昂的计算开销并引入大量冗余信息。</font> | <font style="background-color:rgb(250, 250, 250);">VCA 引入了一种无需训练的框架，通过</font>**<font style="background-color:rgb(250, 250, 250);">树搜索探索</font>**<font style="background-color:rgb(250, 250, 250);">结构定位关键片段，利用 VLM 自生成的</font>**<font style="background-color:rgb(250, 250, 250);">内在奖励</font>**<font style="background-color:rgb(250, 250, 250);">引导搜索方向，并配合</font>**<font style="background-color:rgb(250, 250, 250);">固定大小的记忆缓存</font>**<font style="background-color:rgb(250, 250, 250);">管理关键帧，从而在观察更少帧数的情况下超越了现有 SOTA 模型的性能。</font> |
| [Conan: Progressive Learning to Reason Like a Detective over Multi-Scale Visual Evidence](https://arxiv.org/abs/2510.20470) | 该研究提出了一个名为 Conan 的视频推理框架，通过模拟侦探多步推理的过程，显著提升了多模态大语言模型在处理复杂视频逻辑和长视频理解任务中的准确性与可靠性。 | 现有的视频推理方法要么依赖缺乏视觉根据（Grounding）的纯文本推理链，导致模型容易产生幻觉；要么在视觉证据定位上不够准确，难以在长视频中有效捕捉关键线索。 | 研究者构建了包含 9.1 万条推理轨迹的 Conan-91k 数据集，并设计了一套结合“多阶段渐进式冷启动”与“识别-推理-动作（AIR）强化学习”的训练体系，使模型学会主动识别证据帧并进行多步闭环推理；   使用两阶段训练：多阶段渐进式冷启动（Multi-stage Progressive Cold-start）：利用 Conan-CoT-60k 数据集，按照“纯文本推理>多模态对齐推理>以视觉为中心的演绎”的顺序，由易到难地激活模型的证据定位与多步推理能力；联合“识别-推理-决策”强化学习（Joint AIR RLVR）：在 Conan-RLVR-31k 上使模型能够自主判断何时该继续搜寻证据、何时该给出最终结论。 |


## Image+Video
| Title | 总结 | 研究问题 | 解决方案 |
| --- | --- | --- | --- |
| [MMCTAgent: Multi-modal Critical Thinking Agent Framework for Complex Visual Reasoning](https://arxiv.org/abs/2405.18358) | 本文提出了 MMCTAgent，一个受人类认知和批判性思维启发的多模态智能体框架，通过动态规划、工具增强和视觉评论机制显著提升了多模态大模型在复杂视觉推理任务中的表现。 | 当前多模态大语言模型（MLLMs）在处理精细化多模态理解、复杂任务逻辑分解以及长视频/图像中的空间与时空依赖推理方面仍存在局限。 | 引入了一个包含动态规划器、20 多个外部感知工具以及首创的“视觉评论员（Vision-based Critic）”的迭代推理框架，通过自动生成评价准则对推理链和多模态证据进行验证与自我反思。   (Reasoner+Tools+Critic)     |
| [PyVision-RL: Forging Open Agentic Vision Models via RL](https://arxiv.org/abs/2602.20739) | 本文提出了 PyVision-RL 强化学习框架，通过动态 Python 工具链和优化的训练策略，成功开发出能够稳定进行多轮交互且高效处理图像与视频的开源智能体模型。 | 多模态智能体在强化学习中容易出现“交互崩溃”（Interaction Collapse）现象，即模型倾向于减少工具调用和多轮推理，导致无法通过增加推理时计算来提升视觉理解性能。 | 引入了“超采样-过滤-排序”的 Rollout 生成机制以稳定训练，结合“累积工具奖励”激励多轮交互，并针对视频任务设计了“按需上下文构建”策略，通过 Python 脚本自主采样关键帧以大幅提升视觉 Token 效率。      测试集：WeMath、VSI-Bench 等 |
|  |  |  |  |


# 3D/Space Reasoning
基于图像/视频/点云的空间位置推理

| Title | 总结 | 研究问题 | 解决方案 |
| --- | --- | --- | --- |
| [SpatialThinker: Reinforcing 3D Reasoning in Multimodal LLMs via Spatial Rewards](https://arxiv.org/abs/2511.07403) | SPATIALTHINKER 是一款 3D 感知多模态大语言模型（MLLM），它通过强化学习（RL）将结构化场景图（Scene Graph）与多步推理相结合，仅需极小规模的合成数据即可在空间理解和现实世界 VQA 任务中超越 GPT-4o 等大型模型。 | 现有的空间感知 MLLM 往往面临数据需求极大（动辄百万级采样）、依赖特定的 3D 输入或架构修改，以及缺乏针对视觉对齐推理过程的有效监督信号等挑战。 | 该研究提出了一个自动化的 STVQA-7K 高质量空间数据集生成流水线，并设计了包含格式、计数、准确度和 CIoU 空间奖励在内的<font style="background-color:#FBDE28;">多目标稠密奖励函数</font>，通过在线强化学习（GRPO）引导模型在推理中构建局部场景子图并实现精确的物体定位；<br/>推出了 STVQA-7K，这是一个基于场景图的高质量空间 VQA 数据集 |
| [Tool-Augmented Spatiotemporal Reasoning for Streamlining Video Question Answering Task](https://arxiv.org/abs/2512.10359) | 本文提出了一种名为 STAR 的训练自免（training-free）推理框架，通过为多模态大模型配备涵盖 22 种工具的<font style="background-color:#FBDE28;">视频工具箱</font>，显著提升了模型在复杂视频问答任务中的时空推理能力。 | 现有的多模态大模型在处理推理密集型视频问答时，难以同时精确建模视频帧内的复杂空间关系以及理解随时间演变的因果动力学。 | 论文构建了一个可扩展的视频工具箱，并提出了 STAR 推理框架，该框架通过交替调用空间工具和时间工具的策略，逐步定位视频中的 <font style="background-color:#FBDE28;">3D 感兴趣区域</font>（3D RoI），从而实现精准推理。<br/>VideoMME、LongVideoBench |
| [GitHub - InternRobotics/PointLLM: [ECCV 2024 Best Paper Candidate & TPAMI 2025] PointLLM: Empowering Large Language Models to Understand Point Clouds](https://github.com/InternRobotics/PointLLM) |  |  |  |
| [SpaceR: Reinforcing MLLMs in Video Spatial Reasoning](https://arxiv.org/abs/2504.01805) | 本文提出了 SpaceR 框架，通过构建<font style="background-color:#FBDE28;">高质量空间推理数据集</font> SpaceR-151k 并引入空间引导的强化学习机制（SG-RLVR），显著提升了多模态大模型在视频空间推理任务上的能力。 | 现有的多模态大语言模型（MLLMs）由于缺乏高质量的专用数据集以及有效的推理训练策略，在推断视频底层 3D 空间结构（如相对位置、尺寸等）方面表现不佳。 | 构建了包含 91k 条可验证空间推理问答的 SpaceR-151k 数据集，并空间引导强化学习视觉推理（SG-RLVR），这是一种新颖的强化学习方法。<br/>空间推理基准测试（ VSI-Bench、STI-Bench 和 SPAR-Bench）<br/>视频理解基准测试（例如 Video-MME、TempCompass 和 LongVideoBench） |
| [VLM-3R: Vision-Language Models Augmented with Instruction-Aligned 3D Reconstruction](https://arxiv.org/abs/2505.20279) | 本文提出了 VLM-3R 框架，通过在视觉语言模型中引入 3D 重建指令微调，实现了仅凭单目视频即可进行鲁棒的 3D 空间与时空推理。 |  现有的 3D 大语言模型高度依赖外部深度传感器或预构建的 3D 地图，导致其在处理常见的单目视频输入时扩展性差且难以理解复杂的空间时空关系 | 该模型采用端到端架构，利用几何编码器提取隐式 3D 标记，配合空间-视觉-视图融合机制以及大规模（200K+）3D 重建指令微调数据，使模型能够直接从原始视频中感知空间上下文。 |
| [Scene-R1: Video-Grounded Large Language Models for 3D Scene Reasoning without 3D Annotations](https://arxiv.org/abs/2506.17545) | 本文提出了 Scene-R1 框架，这是首个通过强化学习（RL）驱动、利用 RGB-D 视频实现透明化 3D 场景推理的大语言模型，无需任何 3D 实例级标注。 | 现有的 3D 大语言模型（3DLLMs）通常表现为“黑盒”状态，缺乏决策过程的解释，且高度依赖成本昂贵的预训练 3D 检测器及密集的点云标注。 | 通过<font style="background-color:#FBDE28;">两阶段接Grounding流程</font>，利用 DeepSeek-R1 风格的 GRPO 强化学习算法优化模型，使其能生成思维链（CoT）并配合 SAM2 将 2D 预测投影至 3D 空间，从而实现高效且可解释的场景理解。 |
| [Think3D: Thinking with Space for Spatial Reasoning](https://arxiv.org/abs/2601.13029) | 本文提出了 Think3D 框架，通过引入 3D 重建工具和交互式探索机制，将多模态大模型的二维感知提升为三维空间推理，显著增强了模型在复杂空间任务中的表现。 | 针对当前视觉语言模型（VLM）虽然擅长 2D 视觉理解，但由于缺乏空间几何一致性，在处理多视角理解、路径规划等真实 3D 推理任务时表现低效且缺乏深度的问题。 | 开发了一个包含 3D 点云重建、相机位姿锚定及视角切换的工具箱，使模型能以“空间思维”进行迭代式 3D 链式思考（CoT），并辅以强化学习（RL）策略优化小模型的视角选择能力。<br/><br/>BLINK Multi-view 和 MindCube 、VSIBench测试 |
| [Geometrically-Constrained Agent for Spatial Reasoning](https://arxiv.org/abs/2511.22659) | 本文提出了一种名为几何约束智能体（GCA）的训练免（training-free）架构，旨在通过引入形式化的任务约束来弥合视觉语言模型（VLM）在空间推理中存在的“语义到几何”的鸿沟。 | 研究的核心问题是如何解决 VLM 在处理空间推理时，因其推理过程基于有损的文本语义空间而导致无法准确把握高保真几何细节、容易产生逻辑错误的缺陷。 | GCA 将推理过程解耦为两个阶段：首先由 VLM 作为“语义分析师”将模糊的查询转化为包含参考系和目标的形式化任务约束；随后由 VLM 作为“任务执行者”在这些确定性的约束边界内调度外部工具进行高精度几何计算。 |


待分类

| Title | 总结 | 研究问题 | 解决方案 | 备注 |
| --- | --- | --- | --- | --- |
| [MM-CondChain: A Programmatically Verified Benchmark for Visually Grounded Deep Compositional Reasoning](https://arxiv.org/abs/2603.12266) | 本文提出了 MM-CondChain，这是首个针对多模态大模型（MLLMs）在视觉环境下进行深度组合逻辑推理能力的基准测试，并评估了十个MLLM，证明使是最先进的模型，在对组合视觉条件进行细粒度验证方面也存在困难 | 现有的基准测试多侧重于浅层的视觉属性识别或独立的指令遵循，缺乏对复杂、多层级且依赖视觉验证的条件逻辑工作流（如“如果 A 且 B 则执行 C”）的评估。 | 提出了一种基于可验证程序中间表示（VPIR）的智能体合成管线，通过将逻辑构造与自然语言描述解耦，自动生成具有机械可验证性、深层逻辑链以及近乎同构的“硬负样本”测试数据；   推出了 MM-CondChain，首个专门评估多模态大模型（MLLMs）在视觉环境下执行多层级、深度组合逻辑推理能力的基准测试。 |  |
| [A Training-Free Framework for Long Video Understanding via...](https://openreview.net/forum?id=hfMfYMoRLk) |  |  |  | 长视频理解 |
| [FactGuard: Agentic Video Misinformation Detection via Reinforcement Learning](https://arxiv.org/abs/2602.22963) |  |  |  |  |
| [UniT: Unified Multimodal Chain-of-Thought Test-time Scaling](https://arxiv.org/abs/2602.12279) |  |  |  |  |
| [Imagination Helps Visual Reasoning, But Not Yet in Latent Space](https://arxiv.org/abs/2602.22766) |  |  |  |  |
| [VisionReasoner: Unified Reasoning-Integrated Visual Perception via Reinforcement Learning](https://arxiv.org/abs/2505.12081) |  |  |  |  |
| [UniVideo: Unified Understanding, Generation, and Editing for Videos](https://arxiv.org/abs/2510.08377) |  |  |  | [ICLR 2026｜滑铁卢大学联合可灵提出UniVideo：统一视频理解、生成、编辑多模态](https://mp.weixin.qq.com/s/QetTRddhwoYoQo46_YERCQ) |
| [Visual-ERM: Reward Modeling for Visual Equivalence](https://arxiv.org/abs/2603.13224) | 证明基于文本的指标和视觉编码器相似性都不足以进行忠实的视觉评估，本文提出了 Visual-ERM，一个专门用于“视觉到代码”任务（如图表、表格、SVG解析）的多模态生成式奖励模型，通过在渲染后的视觉空间提供细粒度反馈，显著提升了强化学习阶段的模型性能。 | 现有的视觉到代码任务奖励机制主要依赖文本规则（容易被奖励黑客攻击）或粗粒度的视觉嵌入相似度（缺乏可解释性且难以捕捉微小视觉差异），导致强化学习信号失真。 | 开发了 8B 规模的 Visual-ERM 模型，它能对比原始图与渲染图并生成包含错误类别、位置及严重程度的结构化诊断反馈，并同步推出了用于评估此类细粒度差异判断能力的基准测试 VC-RewardBench。<br/> |  |
| [GitHub - NVlabs/VideoITG: [CVPR2026] VideoITG: Multimodal Video Understanding with Instructed Temporal Grounding](https://github.com/NVlabs/VideoITG) | 本文提出了 VideoITG 框架，通过引入由指令驱动的时间重定位（Instructed Temporal Grounding）机制，使视频大语言模型能够根据用户指令自适应地选择关键帧，从而在减少计算开销的同时显著提升视频理解性能。 | 现有的视频大语言模型在处理长视频时，通常采用简单的均匀采样策略，这往往会遗漏关键的语义或时序信息，导致模型在需要精确时序建模和复杂指令遵循的场景下表现不佳。 | 设计了自动化的数据标注流水线 VidThinker，构建了包含 50 万条指令对齐标注的 VideoITG-40K 数据集，并提出了三种可即插即用的 VideoITG 模型变体，通过文本生成或判别式分类实现指令引导的精细化帧选择。 |  |
|  |  |  |  |  |


