package com.aitasker;

import com.aitasker.entity.*;
import com.aitasker.enums.*;
import com.aitasker.repository.*;
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
    private final ProposalRepository proposalRepo;
    private final ProjectRepository projectRepo;
    private final MilestoneRepository milestoneRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepo.count() > 0) {
            log.info("Database already seeded, skipping...");
            return;
        }
        log.info("Seeding database...");

        String pass = passwordEncoder.encode("123456");

        // Admin
        User admin = userRepo.save(User.builder()
                .email("admin@aitasker.com").password(pass)
                .fullName("Admin AITasker").role(UserRole.ADMIN).build());

        // Clients
        User client1 = userRepo.save(User.builder()
                .email("client@aitasker.com").password(pass)
                .fullName("Nguyen Van Client").role(UserRole.CLIENT)
                .location("Ho Chi Minh City").build());

        User client2 = userRepo.save(User.builder()
                .email("client2@aitasker.com").password(pass)
                .fullName("Tran Thi Business").role(UserRole.CLIENT)
                .location("Ha Noi").build());

        // Experts
        User expert1 = userRepo.save(User.builder()
                .email("expert@aitasker.com").password(pass)
                .fullName("Le Van Expert").role(UserRole.EXPERT)
                .bio("AI/ML specialist with 5 years experience in NLP and Computer Vision")
                .location("Da Nang").hourlyRate(50.0)
                .skills(List.of("Python", "NLP", "LangChain", "TensorFlow", "FastAPI")).build());

        User expert2 = userRepo.save(User.builder()
                .email("expert2@aitasker.com").password(pass)
                .fullName("Pham Thi MLOps").role(UserRole.EXPERT)
                .bio("MLOps engineer specialized in model deployment and monitoring")
                .location("Ho Chi Minh City").hourlyRate(60.0)
                .skills(List.of("Docker", "Kubernetes", "MLflow", "Python", "AWS")).build());

        User expert3 = userRepo.save(User.builder()
                .email("expert3@aitasker.com").password(pass)
                .fullName("Hoang Van Vision").role(UserRole.EXPERT)
                .bio("Computer Vision expert with deep learning expertise")
                .location("Ha Noi").hourlyRate(55.0)
                .skills(List.of("Python", "PyTorch", "OpenCV", "YOLO", "Computer Vision")).build());

        // Jobs
        JobPost job1 = jobRepo.save(JobPost.builder()
                .client(client1).title("Build NLP chatbot for customer support")
                .description("Need an expert to build a chatbot using LangChain and OpenAI API for our e-commerce platform. The bot should handle FAQs and order tracking.")
                .budget(3000.0).deadline(LocalDate.now().plusDays(30))
                .skills(List.of("NLP", "LangChain", "Python", "OpenAI")).build());

        JobPost job2 = jobRepo.save(JobPost.builder()
                .client(client1).title("Sentiment analysis model for product reviews")
                .description("Develop a sentiment analysis model that can classify product reviews as positive, negative, or neutral. Vietnamese language support required.")
                .budget(1500.0).deadline(LocalDate.now().plusDays(21))
                .skills(List.of("NLP", "Python", "TensorFlow", "Vietnamese")).build());

        JobPost job3 = jobRepo.save(JobPost.builder()
                .client(client2).title("Setup MLOps pipeline with CI/CD")
                .description("Need a complete MLOps setup including model versioning, automated testing, and deployment pipeline using Docker and Kubernetes.")
                .budget(5000.0).deadline(LocalDate.now().plusDays(45))
                .skills(List.of("MLOps", "Docker", "Kubernetes", "MLflow", "CI/CD")).build());

        JobPost job4 = jobRepo.save(JobPost.builder()
                .client(client2).title("Object detection for manufacturing quality control")
                .description("Build a computer vision system to detect defects in manufactured products using YOLO or similar object detection model.")
                .budget(4000.0).deadline(LocalDate.now().plusDays(60))
                .skills(List.of("Computer Vision", "YOLO", "PyTorch", "Python")).build());

        JobPost job5 = jobRepo.save(JobPost.builder()
                .client(client1).title("Fine-tune LLM for legal document analysis")
                .description("Fine-tune a large language model on Vietnamese legal documents for document summarization and key clause extraction.")
                .budget(8000.0).deadline(LocalDate.now().plusDays(90))
                .skills(List.of("LLM", "Fine-tuning", "Python", "Hugging Face")).build());

        // Services
        serviceRepo.save(Service.builder()
                .expert(expert1).title("NLP Chatbot Development")
                .description("I will build a production-ready chatbot using LangChain, OpenAI, or open-source LLMs. Includes RAG pipeline setup.")
                .price(1500.0).deliveryDays(14).category("NLP")
                .tags(List.of("chatbot", "langchain", "openai", "rag")).build());

        serviceRepo.save(Service.builder()
                .expert(expert1).title("Vietnamese Text Classification")
                .description("Custom NLP model for Vietnamese text classification including sentiment analysis, topic classification, and entity recognition.")
                .price(800.0).deliveryDays(7).category("NLP")
                .tags(List.of("vietnamese", "text-classification", "nlp")).build());

        serviceRepo.save(Service.builder()
                .expert(expert2).title("MLOps Pipeline Setup")
                .description("Complete MLOps infrastructure with model registry, experiment tracking, automated deployment, and monitoring dashboards.")
                .price(3000.0).deliveryDays(21).category("ML_OPS")
                .tags(List.of("mlops", "docker", "kubernetes", "mlflow")).build());

        serviceRepo.save(Service.builder()
                .expert(expert2).title("Model Monitoring & Drift Detection")
                .description("Setup monitoring for deployed ML models including data drift detection, performance tracking, and alerting.")
                .price(1200.0).deliveryDays(10).category("ML_OPS")
                .tags(List.of("monitoring", "drift-detection", "mlops")).build());

        serviceRepo.save(Service.builder()
                .expert(expert3).title("Object Detection Model Training")
                .description("Train custom object detection models using YOLO, Faster R-CNN, or SSD. Includes data annotation guidance and model optimization.")
                .price(2500.0).deliveryDays(18).category("COMPUTER_VISION")
                .tags(List.of("object-detection", "yolo", "pytorch")).build());

        serviceRepo.save(Service.builder()
                .expert(expert3).title("Image Segmentation Solution")
                .description("Semantic and instance segmentation using state-of-the-art models. Suitable for medical imaging, satellite imagery, and industrial applications.")
                .price(3500.0).deliveryDays(25).category("COMPUTER_VISION")
                .tags(List.of("segmentation", "computer-vision", "deep-learning")).build());

        // Proposal → accepted → Project with Milestones
        Proposal acceptedProposal = proposalRepo.save(Proposal.builder()
                .job(job1).expert(expert1)
                .coverLetter("I have extensive experience building NLP chatbots with LangChain and OpenAI. I built a similar system for a retail client that handled 10k+ queries/day. I can deliver this in 2 weeks.")
                .bidAmount(2800.0).deliveryTime(14)
                .status(ProposalStatus.ACCEPTED).build());

        job1.setStatus(JobStatus.IN_PROGRESS);
        jobRepo.save(job1);

        Project project = projectRepo.save(Project.builder()
                .job(job1).client(client1).expert(expert1)
                .status(ProjectStatus.ACTIVE).build());

        milestoneRepo.save(Milestone.builder()
                .project(project).title("Requirements & Architecture")
                .description("Define chatbot scope, conversation flows, and technical architecture")
                .amount(500.0).dueDate(LocalDate.now().plusDays(5))
                .status(MilestoneStatus.APPROVED).build());

        milestoneRepo.save(Milestone.builder()
                .project(project).title("Core Chatbot Implementation")
                .description("Build the LangChain pipeline with RAG and OpenAI integration")
                .amount(1500.0).dueDate(LocalDate.now().plusDays(10))
                .status(MilestoneStatus.SUBMITTED).build());

        milestoneRepo.save(Milestone.builder()
                .project(project).title("Testing & Deployment")
                .description("End-to-end testing and production deployment")
                .amount(800.0).dueDate(LocalDate.now().plusDays(14))
                .status(MilestoneStatus.PENDING).build());

        // Additional pending proposals
        proposalRepo.save(Proposal.builder()
                .job(job3).expert(expert2)
                .coverLetter("I specialize in MLOps infrastructure. I've set up similar pipelines for 5+ companies. My stack: Docker, K8s, MLflow, GitHub Actions, ArgoCD.")
                .bidAmount(4800.0).deliveryTime(45).build());

        proposalRepo.save(Proposal.builder()
                .job(job4).expert(expert3)
                .coverLetter("Computer vision is my specialty. I'll build a YOLO-based defect detection system with 99%+ accuracy. Previous work: PCB defect detection with 0.1mm precision.")
                .bidAmount(3800.0).deliveryTime(55).build());

        log.info("Database seeded successfully!");
        log.info("Accounts: client@aitasker.com, expert@aitasker.com, admin@aitasker.com (password: 123456)");
    }
}
