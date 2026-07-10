package com.aitasker;

import com.aitasker.entity.*;
import com.aitasker.enums.*;
import com.aitasker.repository.*;
import com.aitasker.service.ConversationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@Profile("dev")
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepo;
    private final JobPostRepository jobRepo;
    private final ServiceRepository serviceRepo;
    private final CategoryRepository categoryRepo;
    private final ProposalRepository proposalRepo;
    private final ProjectRepository projectRepo;
    private final MilestoneRepository milestoneRepo;
    private final ReviewRepository reviewRepo;
    private final MessageRepository messageRepo;
    private final ConversationService conversationService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepo.count() > 0) {
            log.info("Database already seeded, skipping...");
            return;
        }
        log.info("Seeding database...");

        String pass = passwordEncoder.encode("123456");

        // ─── CATEGORIES ──────────────────────────────────────────────────────
        List.of("NLP & LLMs", "Computer Vision", "Data Engineering", "MLOps",
                        "Reinforcement Learning", "AI Chatbot", "Automation", "Other")
                .forEach(name -> categoryRepo.save(Category.builder().name(name).build()));

        // ─── ADMIN ───────────────────────────────────────────────────────────
        userRepo.save(User.builder()
                .email("admin@aitasker.com").password(pass)
                .fullName("Admin AITasker").role(UserRole.ADMIN)
                .isVerified(true).build());

        // ─── CLIENTS ─────────────────────────────────────────────────────────
        User c1 = userRepo.save(User.builder()
                .email("client@aitasker.com").password(pass)
                .fullName("Nguyen Van An").role(UserRole.CLIENT)
                .location("Ho Chi Minh City")
                .avatarUrl("https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150")
                .bio("CTO at TechViet Corp. Building AI-first products.")
                .isVerified(true).build());

        User c2 = userRepo.save(User.builder()
                .email("client2@aitasker.com").password(pass)
                .fullName("Tran Thi Bich").role(UserRole.CLIENT)
                .location("Ha Noi")
                .avatarUrl("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150")
                .bio("Product Manager at Nexus Digital. Focused on automation.")
                .isVerified(true).build());

        User c3 = userRepo.save(User.builder()
                .email("client3@aitasker.com").password(pass)
                .fullName("Le Minh Duc").role(UserRole.CLIENT)
                .location("Da Nang")
                .avatarUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150")
                .bio("Founder at HealthAI Vietnam. Digitising healthcare.")
                .isVerified(false).build());

        User c4 = userRepo.save(User.builder()
                .email("client4@aitasker.com").password(pass)
                .fullName("Pham Quoc Hung").role(UserRole.CLIENT)
                .location("Ho Chi Minh City")
                .avatarUrl("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150")
                .bio("Head of Data at FinanceEdge JSC.").build());

        // ─── EXPERTS ─────────────────────────────────────────────────────────
        User e1 = userRepo.save(User.builder()
                .email("expert@aitasker.com").password(pass)
                .fullName("Le Van Khoa").role(UserRole.EXPERT)
                .location("Da Nang").hourlyRate(55.0)
                .avatarUrl("https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150")
                .bio("NLP specialist with 6 years experience. Built chatbots for top Vietnamese banks. LangChain & RAG expert.")
                .skills(List.of("Python", "NLP", "LangChain", "TensorFlow", "FastAPI", "RAG"))
                .isVerified(true).build());

        User e2 = userRepo.save(User.builder()
                .email("expert2@aitasker.com").password(pass)
                .fullName("Pham Thi Lan").role(UserRole.EXPERT)
                .location("Ho Chi Minh City").hourlyRate(65.0)
                .avatarUrl("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150")
                .bio("MLOps engineer with 5 years deploying production ML at scale. Kubernetes & MLflow certified.")
                .skills(List.of("Docker", "Kubernetes", "MLflow", "Python", "AWS", "Terraform", "Prometheus"))
                .isVerified(true).build());

        User e3 = userRepo.save(User.builder()
                .email("expert3@aitasker.com").password(pass)
                .fullName("Hoang Quang Minh").role(UserRole.EXPERT)
                .location("Ha Noi").hourlyRate(60.0)
                .avatarUrl("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150")
                .bio("Computer Vision engineer. YOLO, Detectron2, and medical imaging specialist.")
                .skills(List.of("Python", "PyTorch", "OpenCV", "YOLO", "Detectron2", "ONNX"))
                .isVerified(true).build());

        User e4 = userRepo.save(User.builder()
                .email("expert4@aitasker.com").password(pass)
                .fullName("Nguyen Thi Thu").role(UserRole.EXPERT)
                .location("Ho Chi Minh City").hourlyRate(70.0)
                .avatarUrl("https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150")
                .bio("Data Engineer & Architect. Apache Spark, Kafka, Flink at petabyte scale.")
                .skills(List.of("Apache Spark", "Kafka", "Flink", "Airflow", "dbt", "Snowflake", "Python"))
                .isVerified(true).build());

        User e5 = userRepo.save(User.builder()
                .email("expert5@aitasker.com").password(pass)
                .fullName("Tran Duc Long").role(UserRole.EXPERT)
                .location("Ha Noi").hourlyRate(80.0)
                .avatarUrl("https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150")
                .bio("LLM fine-tuning specialist. HuggingFace top contributor. RLHF and DPO expert.")
                .skills(List.of("Python", "HuggingFace", "PyTorch", "RLHF", "LoRA", "vLLM", "CUDA"))
                .isVerified(true).build());

        User e6 = userRepo.save(User.builder()
                .email("expert6@aitasker.com").password(pass)
                .fullName("Vo Thi Cam").role(UserRole.EXPERT)
                .location("Da Nang").hourlyRate(50.0)
                .avatarUrl("https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150")
                .bio("Data Scientist with focus on recommendation systems and A/B testing.")
                .skills(List.of("Python", "Scikit-learn", "SQL", "Spark", "Statistics", "Tableau"))
                .isVerified(false).build());

        // ─── SERVICES ────────────────────────────────────────────────────────
        serviceRepo.save(Service.builder().expert(e1)
                .title("NLP Chatbot with LangChain & RAG")
                .description("Production-grade chatbot using LangChain, OpenAI/Gemini, and a vector database (Chroma/Pinecone). Includes RAG pipeline, memory management, and API endpoint.")
                .price(1800.0).deliveryDays(14).category("NLP & LLMs")
                .imageUrl("https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600")
                .tags(List.of("chatbot", "langchain", "rag", "openai")).build());

        serviceRepo.save(Service.builder().expert(e1)
                .title("Vietnamese NLP & Text Classification")
                .description("Custom Vietnamese NLP models: sentiment analysis, topic classification, named entity recognition. Trained on 10M+ Vietnamese tokens.")
                .price(900.0).deliveryDays(10).category("NLP & LLMs")
                .imageUrl("https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600")
                .tags(List.of("vietnamese", "sentiment", "ner", "nlp")).build());

        serviceRepo.save(Service.builder().expert(e2)
                .title("End-to-End MLOps Pipeline")
                .description("Full MLOps setup: experiment tracking (MLflow), model registry, CI/CD (GitHub Actions + ArgoCD), monitoring (Prometheus + Grafana), auto-retraining.")
                .price(3500.0).deliveryDays(21).category("MLOps")
                .imageUrl("https://images.unsplash.com/photo-1518770660439-4636190af475?w=600")
                .tags(List.of("mlops", "docker", "kubernetes", "mlflow", "cicd")).build());

        serviceRepo.save(Service.builder().expert(e2)
                .title("Model Monitoring & Drift Detection")
                .description("Setup real-time monitoring for deployed ML models: data drift, concept drift, feature importance shifts. Automated alerting and retraining triggers.")
                .price(1400.0).deliveryDays(10).category("MLOps")
                .imageUrl("https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600")
                .tags(List.of("monitoring", "drift", "evidently", "prometheus")).build());

        serviceRepo.save(Service.builder().expert(e3)
                .title("Custom Object Detection Model")
                .description("Train and deploy custom object detection using YOLOv8 or Detectron2. Includes data annotation guide, training, evaluation, and ONNX export for edge deployment.")
                .price(2800.0).deliveryDays(18).category("Computer Vision")
                .imageUrl("https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600")
                .tags(List.of("yolo", "object-detection", "pytorch", "onnx")).build());

        serviceRepo.save(Service.builder().expert(e3)
                .title("Medical Image Segmentation")
                .description("Semantic & instance segmentation for medical imaging (CT, MRI, X-ray) using U-Net variants and SAM. FDA-compliant pipeline documentation included.")
                .price(4000.0).deliveryDays(25).category("Computer Vision")
                .imageUrl("https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600")
                .tags(List.of("segmentation", "medical-ai", "unet", "pytorch")).build());

        serviceRepo.save(Service.builder().expert(e4)
                .title("Real-Time Data Pipeline (Kafka + Spark)")
                .description("Design and build a production-grade streaming data pipeline: Kafka ingestion, Spark Streaming processing, data lake storage, and dashboarding.")
                .price(4500.0).deliveryDays(28).category("Data Engineering")
                .imageUrl("https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600")
                .tags(List.of("kafka", "spark", "streaming", "data-lake")).build());

        serviceRepo.save(Service.builder().expert(e4)
                .title("Data Warehouse & dbt Modeling")
                .description("Architect and implement a modern data warehouse on Snowflake/BigQuery with dbt transformation models, data quality tests, and BI-ready semantic layer.")
                .price(2200.0).deliveryDays(14).category("Data Engineering")
                .imageUrl("https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600")
                .tags(List.of("snowflake", "dbt", "data-warehouse", "analytics")).build());

        serviceRepo.save(Service.builder().expert(e5)
                .title("LLM Fine-Tuning with LoRA/QLoRA")
                .description("Fine-tune any open-source LLM (LLaMA, Mistral, Qwen) on your custom dataset using LoRA/QLoRA. Includes dataset formatting, training, evaluation, and deployment via vLLM.")
                .price(5000.0).deliveryDays(21).category("NLP & LLMs")
                .imageUrl("https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600")
                .tags(List.of("llm", "lora", "finetuning", "llama", "mistral")).build());

        serviceRepo.save(Service.builder().expert(e5)
                .title("RLHF & DPO Alignment Training")
                .description("Align your LLM with human preferences using RLHF or Direct Preference Optimization (DPO). Includes reward model training and policy optimisation.")
                .price(7000.0).deliveryDays(30).category("NLP & LLMs")
                .imageUrl("https://images.unsplash.com/photo-1655720828018-edd2daec9349?w=600")
                .tags(List.of("rlhf", "dpo", "alignment", "llm")).build());

        serviceRepo.save(Service.builder().expert(e6)
                .title("Recommendation System (Collaborative + Content)")
                .description("Hybrid recommendation engine combining collaborative filtering and content-based methods. Includes A/B test framework and real-time serving API.")
                .price(2000.0).deliveryDays(16).category("MLOps")
                .imageUrl("https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600")
                .tags(List.of("recommender", "collaborative-filtering", "fastapi")).build());

        serviceRepo.save(Service.builder().expert(e6)
                .title("Data Analysis & Insight Dashboard")
                .description("End-to-end data analysis: EDA, statistical modelling, and interactive Tableau/Metabase dashboard. Deliverable includes full report and automated data refresh pipeline.")
                .price(1000.0).deliveryDays(7).category("Data Engineering")
                .imageUrl("https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600")
                .tags(List.of("data-analysis", "tableau", "statistics", "eda")).build());

        // ─── JOBS ─────────────────────────────────────────────────────────────
        JobPost job1 = jobRepo.save(JobPost.builder().client(c1)
                .title("Build NLP Chatbot for Customer Support")
                .description("Need an expert to build a chatbot using LangChain and OpenAI for our e-commerce platform. Bot should handle FAQs, order tracking, and escalate complex issues to human agents. Expected 10k+ daily queries.")
                .budget(3000.0).deadline(LocalDate.now().plusDays(30)).category("NLP & LLMs")
                .skills(List.of("NLP", "LangChain", "Python", "OpenAI")).build());

        JobPost job2 = jobRepo.save(JobPost.builder().client(c1)
                .title("Sentiment Analysis Model for Vietnamese Product Reviews")
                .description("Develop a sentiment analysis model classifying reviews as positive/negative/neutral in Vietnamese. Train on our internal dataset of 50k reviews. REST API endpoint required.")
                .budget(1500.0).deadline(LocalDate.now().plusDays(21)).category("NLP & LLMs")
                .skills(List.of("NLP", "Python", "TensorFlow", "Vietnamese")).build());

        JobPost job3 = jobRepo.save(JobPost.builder().client(c2)
                .title("Setup MLOps Pipeline with CI/CD & Monitoring")
                .description("Complete MLOps infrastructure: model versioning, automated testing, deployment pipeline using Docker + Kubernetes on AWS EKS. Include Prometheus monitoring and Grafana dashboards.")
                .budget(5000.0).deadline(LocalDate.now().plusDays(45)).category("MLOps")
                .skills(List.of("MLOps", "Docker", "Kubernetes", "MLflow", "AWS")).build());

        JobPost job4 = jobRepo.save(JobPost.builder().client(c2)
                .title("Defect Detection System for PCB Manufacturing")
                .description("Computer vision system to detect micro-defects in PCB boards using a high-resolution camera feed. Target accuracy > 99%. Need real-time inference < 200ms per frame.")
                .budget(4500.0).deadline(LocalDate.now().plusDays(60)).category("Computer Vision")
                .skills(List.of("Computer Vision", "YOLO", "PyTorch", "ONNX")).build());

        JobPost job5 = jobRepo.save(JobPost.builder().client(c1)
                .title("Fine-Tune LLM for Vietnamese Legal Document Analysis")
                .description("Fine-tune a Vietnamese LLM (PhoGPT or Vistral) on 50k legal documents for clause extraction, summarisation, and risk detection. Benchmark against current human review process.")
                .budget(8000.0).deadline(LocalDate.now().plusDays(90)).category("NLP & LLMs")
                .skills(List.of("LLM", "Fine-tuning", "Python", "HuggingFace")).build());

        JobPost job6 = jobRepo.save(JobPost.builder().client(c3)
                .title("Patient Risk Stratification ML Model")
                .description("Build a risk stratification model for early detection of high-risk patients using EHR data. Must comply with HIPAA and handle class imbalance in the dataset.")
                .budget(6000.0).deadline(LocalDate.now().plusDays(75)).category("Other")
                .skills(List.of("Machine Learning", "Python", "Healthcare AI", "HIPAA")).build());

        JobPost job7 = jobRepo.save(JobPost.builder().client(c3)
                .title("Medical Image Segmentation for Tumour Detection")
                .description("Segment and classify tumour regions in MRI scans using deep learning. Dataset: 5,000 annotated MRI images. Output should include model weights and evaluation report.")
                .budget(7500.0).deadline(LocalDate.now().plusDays(80)).category("Computer Vision")
                .skills(List.of("Computer Vision", "U-Net", "PyTorch", "Medical Imaging")).build());

        JobPost job8 = jobRepo.save(JobPost.builder().client(c4)
                .title("Real-Time Transaction Fraud Detection Pipeline")
                .description("Build a streaming fraud detection system processing 100k+ transactions/second. Feature engineering on Kafka stream + XGBoost/LightGBM model inference. P99 latency < 50ms.")
                .budget(9000.0).deadline(LocalDate.now().plusDays(50)).category("Data Engineering")
                .skills(List.of("Kafka", "Spark", "Python", "Feature Engineering", "XGBoost")).build());

        JobPost job9 = jobRepo.save(JobPost.builder().client(c4)
                .title("Modern Data Warehouse Migration to Snowflake")
                .description("Migrate legacy Oracle DWH to Snowflake. Build dbt transformation models for 200+ tables. Setup incremental loads, data quality tests, and BI dashboard in Metabase.")
                .budget(4000.0).deadline(LocalDate.now().plusDays(40)).category("Data Engineering")
                .skills(List.of("Snowflake", "dbt", "SQL", "Data Engineering")).build());

        JobPost job10 = jobRepo.save(JobPost.builder().client(c1)
                .title("Recommendation Engine for E-Commerce Platform")
                .description("Hybrid recommendation system (collaborative + content-based) for 2M+ products. Personalised homepage, similar items, and 'customers also viewed' sections. Real-time serving API.")
                .budget(3500.0).deadline(LocalDate.now().plusDays(35)).category("Other")
                .skills(List.of("Recommendation", "Python", "Spark", "FastAPI")).build());

        // ─── PROPOSALS ───────────────────────────────────────────────────────

        // job1 → e1 ACCEPTED (will become project)
        Proposal p1 = proposalRepo.save(Proposal.builder().job(job1).expert(e1)
                .coverLetter("I've built 10+ production chatbots for Vietnamese enterprises including VPBank and Vietcombank using LangChain + RAG. I can deliver a fully tested system in 2 weeks with 99.5% uptime guarantee. Propose a 3-milestone structure.")
                .bidAmount(2800.0).deliveryTime(14).status(ProposalStatus.ACCEPTED).build());

        // job1 → e6 REJECTED
        proposalRepo.save(Proposal.builder().job(job1).expert(e6)
                .coverLetter("I have strong NLP experience and can build a chatbot solution using Python and OpenAI API. Available to start immediately.")
                .bidAmount(2200.0).deliveryTime(21).status(ProposalStatus.REJECTED).build());

        // job2 → e1 PENDING
        proposalRepo.save(Proposal.builder().job(job2).expert(e1)
                .coverLetter("Vietnamese NLP is my core specialty. I trained PhoBERT-based models for 3 clients in retail. My sentiment model achieves 94% F1 on Vietnamese social media text.")
                .bidAmount(1400.0).deliveryTime(10).build());

        // job2 → e6 PENDING
        proposalRepo.save(Proposal.builder().job(job2).expert(e6)
                .coverLetter("I have extensive experience in text classification and sentiment analysis. I'll deliver a well-tested REST API with detailed model performance report.")
                .bidAmount(1200.0).deliveryTime(14).build());

        // job3 → e2 ACCEPTED (will become project)
        Proposal p3 = proposalRepo.save(Proposal.builder().job(job3).expert(e2)
                .coverLetter("I've set up complete MLOps stacks for 8 companies on AWS and GCP. My standard stack: MLflow + BentoML + ArgoCD + Prometheus. Timeline: 6 weeks with 3 clear phases.")
                .bidAmount(4800.0).deliveryTime(42).status(ProposalStatus.ACCEPTED).build());

        // job4 → e3 ACCEPTED (will become project)
        Proposal p4 = proposalRepo.save(Proposal.builder().job(job4).expert(e3)
                .coverLetter("PCB defect detection is a project I've done twice: once for Samsung SDI and once for a Taiwanese PCB manufacturer. I achieved 99.7% accuracy with YOLOv8 + custom post-processing. Will exceed your targets.")
                .bidAmount(4200.0).deliveryTime(50).status(ProposalStatus.ACCEPTED).build());

        // job4 → e1 REJECTED
        proposalRepo.save(Proposal.builder().job(job4).expert(e1)
                .coverLetter("I can apply transfer learning from my NLP experience to computer vision tasks. I'll use PyTorch and deliver within timeline.")
                .bidAmount(3800.0).deliveryTime(55).status(ProposalStatus.REJECTED).build());

        // job5 → e5 PENDING
        proposalRepo.save(Proposal.builder().job(job5).expert(e5)
                .coverLetter("I'm the right person for this. I've fine-tuned PhoGPT and Vistral on legal corpora for two Vietnamese law firms. My LoRA-based approach reduces training cost by 80% with no quality loss.")
                .bidAmount(7500.0).deliveryTime(85).build());

        // job6 → e6 PENDING
        proposalRepo.save(Proposal.builder().job(job6).expert(e6)
                .coverLetter("Clinical risk stratification is a domain I've worked in. I built a similar model for a regional hospital network achieving AUC 0.91 with proper HIPAA-compliant data handling.")
                .bidAmount(5500.0).deliveryTime(70).build());

        // job7 → e3 PENDING
        proposalRepo.save(Proposal.builder().job(job7).expert(e3)
                .coverLetter("I specialise in medical image segmentation. Using nnU-Net and SAM with transfer learning on your MRI dataset I expect Dice score > 0.88. Full evaluation report included.")
                .bidAmount(7000.0).deliveryTime(75).build());

        // job8 → e4 ACCEPTED (will become project)
        Proposal p8 = proposalRepo.save(Proposal.builder().job(job8).expert(e4)
                .coverLetter("Real-time fraud detection at scale is exactly what I built for a top-5 Vietnamese bank. Kafka → Spark Streaming → feature store → XGBoost serving via Triton. P99 latency achieved: 18ms.")
                .bidAmount(8500.0).deliveryTime(48).status(ProposalStatus.ACCEPTED).build());

        // job9 → e4 PENDING
        proposalRepo.save(Proposal.builder().job(job9).expert(e4)
                .coverLetter("I've led 4 DWH migrations to Snowflake. My dbt project template covers 200+ models with full test coverage and CI. Can deliver on time with Metabase dashboards as a bonus.")
                .bidAmount(3800.0).deliveryTime(38).build());

        // job10 → e6 PENDING
        proposalRepo.save(Proposal.builder().job(job10).expert(e6)
                .coverLetter("I've built recommendation engines for two mid-size Vietnamese e-commerce platforms. Hybrid approach using ALS + content embeddings. Resulted in 23% CTR uplift in A/B test.")
                .bidAmount(3200.0).deliveryTime(30).build());

        // ─── UPDATE JOB STATUSES ─────────────────────────────────────────────
        job1.setStatus(JobStatus.IN_PROGRESS); jobRepo.save(job1);
        job3.setStatus(JobStatus.IN_PROGRESS); jobRepo.save(job3);
        job4.setStatus(JobStatus.IN_PROGRESS); jobRepo.save(job4);
        job8.setStatus(JobStatus.IN_PROGRESS); jobRepo.save(job8);

        // ─── PROJECTS + MILESTONES ───────────────────────────────────────────

        // Project A: NLP Chatbot (ACTIVE, 33% done)
        Conversation convA = conversationService.findOrCreateDirect(c1.getId(), e1.getId());
        Project projA = projectRepo.save(Project.builder()
                .job(job1).client(c1).expert(e1).status(ProjectStatus.ACTIVE).conversation(convA).build());

        milestoneRepo.save(Milestone.builder().project(projA)
                .title("Requirements & Architecture")
                .description("Define conversation flows, integration points, and system architecture. Deliver architecture diagram and API spec.")
                .amount(600.0).dueDate(LocalDate.now().minusDays(10))
                .status(MilestoneStatus.APPROVED).build());

        milestoneRepo.save(Milestone.builder().project(projA)
                .title("Core LangChain + RAG Pipeline")
                .description("Implement the chatbot core: LangChain agent, Chroma vector DB ingestion, retrieval chain, and OpenAI completion. Unit tests required.")
                .amount(1400.0).dueDate(LocalDate.now().plusDays(4))
                .status(MilestoneStatus.SUBMITTED).build());

        milestoneRepo.save(Milestone.builder().project(projA)
                .title("Integration, Testing & Deployment")
                .description("Integrate chatbot into client e-commerce platform, end-to-end QA, load testing (10k concurrent users), and production deployment on AWS.")
                .amount(800.0).dueDate(LocalDate.now().plusDays(14))
                .status(MilestoneStatus.PENDING).build());

        // Project B: MLOps Pipeline (ACTIVE, 67% done)
        Conversation convB = conversationService.findOrCreateDirect(c2.getId(), e2.getId());
        Project projB = projectRepo.save(Project.builder()
                .job(job3).client(c2).expert(e2).status(ProjectStatus.ACTIVE).conversation(convB).build());

        milestoneRepo.save(Milestone.builder().project(projB)
                .title("Infrastructure Setup & IaC")
                .description("Provision AWS EKS cluster using Terraform. Configure IAM roles, VPC, and security groups. Deploy MLflow and MinIO on Kubernetes.")
                .amount(1200.0).dueDate(LocalDate.now().minusDays(20))
                .status(MilestoneStatus.APPROVED).build());

        milestoneRepo.save(Milestone.builder().project(projB)
                .title("CI/CD Pipeline & Model Registry")
                .description("GitHub Actions pipeline: linting → unit tests → model training → evaluation gate → BentoML packaging → ArgoCD deployment. MLflow model registry integration.")
                .amount(1800.0).dueDate(LocalDate.now().minusDays(5))
                .status(MilestoneStatus.APPROVED).build());

        milestoneRepo.save(Milestone.builder().project(projB)
                .title("Monitoring, Alerting & Runbook")
                .description("Prometheus metrics, Grafana dashboards for model performance and data drift. PagerDuty alerts. Operations runbook for the client team.")
                .amount(1800.0).dueDate(LocalDate.now().plusDays(10))
                .status(MilestoneStatus.PENDING).build());

        // Project C: PCB Defect Detection (COMPLETED)
        Conversation convC = conversationService.findOrCreateDirect(c2.getId(), e3.getId());
        Project projC = projectRepo.save(Project.builder()
                .job(job4).client(c2).expert(e3).status(ProjectStatus.COMPLETED).conversation(convC).build());

        job4.setStatus(JobStatus.COMPLETED); jobRepo.save(job4);

        milestoneRepo.save(Milestone.builder().project(projC)
                .title("Dataset Preparation & Annotation")
                .description("Curate and annotate 5,000 PCB images across 12 defect classes using LabelImg. 80/10/10 train/val/test split.")
                .amount(800.0).dueDate(LocalDate.now().minusDays(40))
                .status(MilestoneStatus.APPROVED).build());

        milestoneRepo.save(Milestone.builder().project(projC)
                .title("YOLOv8 Model Training & Optimisation")
                .description("Train YOLOv8-L on annotated dataset. Hyperparameter sweep with W&B. Export to ONNX. Achieved mAP@0.5: 0.994.")
                .amount(2000.0).dueDate(LocalDate.now().minusDays(20))
                .status(MilestoneStatus.APPROVED).build());

        milestoneRepo.save(Milestone.builder().project(projC)
                .title("Edge Deployment & Integration")
                .description("Deploy ONNX model on Jetson Orin NX. Camera feed integration. REST API for defect results. P99 latency: 45ms. Full documentation and operator training.")
                .amount(1400.0).dueDate(LocalDate.now().minusDays(5))
                .status(MilestoneStatus.APPROVED).build());

        // Project D: Fraud Detection Pipeline (ACTIVE, early stage)
        Conversation convD = conversationService.findOrCreateDirect(c4.getId(), e4.getId());
        Project projD = projectRepo.save(Project.builder()
                .job(job8).client(c4).expert(e4).status(ProjectStatus.ACTIVE).conversation(convD).build());

        milestoneRepo.save(Milestone.builder().project(projD)
                .title("Feature Engineering & Data Pipeline")
                .description("Design feature store schema, implement Kafka consumer, build Spark Streaming feature aggregation pipeline (1-min, 5-min, 1-hour windows). Deploy on AWS EMR.")
                .amount(2500.0).dueDate(LocalDate.now().plusDays(12))
                .status(MilestoneStatus.PENDING).build());

        milestoneRepo.save(Milestone.builder().project(projD)
                .title("Model Training & Serving")
                .description("Train XGBoost/LightGBM ensemble on historical transactions. Implement Triton Inference Server for < 50ms P99. Shadow mode testing alongside existing rule engine.")
                .amount(3500.0).dueDate(LocalDate.now().plusDays(30))
                .status(MilestoneStatus.PENDING).build());

        milestoneRepo.save(Milestone.builder().project(projD)
                .title("Cutover, Monitoring & Hardening")
                .description("Production cutover with rollback plan. Fraud dashboard in Grafana. Champion/challenger framework. Post-launch 2-week hypercare support.")
                .amount(2500.0).dueDate(LocalDate.now().plusDays(48))
                .status(MilestoneStatus.PENDING).build());

        // ─── REVIEWS ─────────────────────────────────────────────────────────
        reviewRepo.save(Review.builder()
                .giver(c2).receiver(e3).project(projC)
                .rating(5)
                .comment("Hoang delivered exceptional work. The PCB defect detection model exceeded all benchmarks — 99.7% accuracy vs our 99% target. Communication was excellent throughout. Will hire again for our next CV project.").build());

        reviewRepo.save(Review.builder()
                .giver(e3).receiver(c2).project(projC)
                .rating(5)
                .comment("Great client. Clear requirements, responsive feedback, and fair payment terms. The annotated dataset quality saved significant time. Highly recommended.").build());

        reviewRepo.save(Review.builder()
                .giver(c1).receiver(e1).project(projA)
                .rating(4)
                .comment("Le Van Khoa is knowledgeable and responsive. The first two milestones were delivered on time with clean code. Looking forward to the final deployment phase.").build());

        // ─── MESSAGES ────────────────────────────────────────────────────────
        messageRepo.save(Message.builder().conversation(convA).sender(c1)
                .content("Hi Khoa, just confirming the Architecture milestone is approved. Great work on the RAG design — exactly what we needed. Please proceed with milestone 2.").build());

        messageRepo.save(Message.builder().conversation(convA).sender(e1)
                .content("Thank you! I've already started on the LangChain pipeline. I'll have a demo-ready version for you to test by end of this week. I'll share the staging URL.").build());

        messageRepo.save(Message.builder().conversation(convA).sender(c1)
                .content("Sounds good. One question: can the chatbot handle both Vietnamese and English inputs? We have some expat customers.").build());

        messageRepo.save(Message.builder().conversation(convA).sender(e1)
                .content("Absolutely — I'm using multilingual embeddings (multilingual-e5-large) so Vietnamese and English are both supported out of the box. No extra cost.").build());

        messageRepo.save(Message.builder().conversation(convB).sender(e2)
                .content("Good news — the EKS cluster and MLflow are live. I've shared the Grafana dashboard URL and admin credentials in the shared Notion doc. Milestone 1 PR is ready for review.").build());

        messageRepo.save(Message.builder().conversation(convB).sender(c2)
                .content("Tested the MLflow UI — looks great. Approved Milestone 1. One request: can we also add model size and inference latency as tracked metrics?").build());

        messageRepo.save(Message.builder().conversation(convB).sender(e2)
                .content("Already planned for Milestone 2! I'll log model size, ONNX export size, and P99 latency as MLflow metrics. Will demo the full CI/CD run next week.").build());

        messageRepo.save(Message.builder().conversation(convD).sender(e4)
                .content("Kick-off notes sent to your email. Requesting access to the Kafka cluster and the last 6 months of transaction history (anonymised). I can sign an NDA if needed.").build());

        messageRepo.save(Message.builder().conversation(convD).sender(c4)
                .content("NDA signed and sent back. IT will provision Kafka read access by tomorrow. The transaction data will be on S3 — I'll share the bucket ARN shortly.").build());

        log.info("=== Database seeded successfully! ===");
        log.info("Clients  : client@aitasker.com / client2–4@aitasker.com  (password: 123456)");
        log.info("Experts  : expert@aitasker.com / expert2–6@aitasker.com  (password: 123456)");
        log.info("Admin    : admin@aitasker.com                             (password: 123456)");
        log.info("Data     : 6 users × 2 roles, 12 services, 10 jobs, 14 proposals, 4 projects, 12 milestones, 3 reviews, 9 messages");
    }
}