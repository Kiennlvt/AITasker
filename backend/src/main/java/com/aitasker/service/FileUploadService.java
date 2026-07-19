package com.aitasker.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FileUploadService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public List<String> saveMilestoneFiles(String milestoneId, List<MultipartFile> files) throws IOException {
        List<String> urls = new ArrayList<>();
        Path dir = Paths.get(uploadDir, "milestones", milestoneId);
        Files.createDirectories(dir);
        for (MultipartFile file : files) {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            file.transferTo(dir.resolve(filename));
            urls.add("/files/milestones/" + milestoneId + "/" + filename);
        }
        return urls;
    }

    public List<String> saveDisputeFiles(String disputeId, List<MultipartFile> files) throws IOException {
        List<String> urls = new ArrayList<>();
        Path dir = Paths.get(uploadDir, "disputes", disputeId);
        Files.createDirectories(dir);
        for (MultipartFile file : files) {
            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            file.transferTo(dir.resolve(filename));
            urls.add("/files/disputes/" + disputeId + "/" + filename);
        }
        return urls;
    }
}
