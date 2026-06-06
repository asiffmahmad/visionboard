package com.todo.service.impl;

import com.todo.dto.VisionDto;
import com.todo.dto.VisionRequest;
import com.todo.entity.User;
import com.todo.entity.Vision;
import com.todo.exception.ResourceNotFoundException;
import com.todo.mapper.VisionMapper;
import com.todo.repository.UserRepository;
import com.todo.repository.VisionRepository;
import com.todo.service.VisionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VisionServiceImpl implements VisionService {

    private final VisionRepository visionRepository;
    private final UserRepository userRepository;
    private final VisionMapper visionMapper;

    @Override
    @Transactional
    public VisionDto createVision(VisionRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Vision vision = new Vision();
        vision.setUser(user);
        vision.setTitle(request.title());
        vision.setDescription(request.description());
        vision.setVisionType(request.visionType());
        vision.setTargetDate(request.targetDate());
        vision.setAchieved(false);
        vision.setProgress(0.0);

        return visionMapper.toDto(visionRepository.save(vision));
    }

    @Override
    @Transactional
    public VisionDto updateVision(Long id, VisionRequest request, String username) {
        Vision vision = visionRepository.findByIdAndUserUsername(id, username)
                .orElseThrow(() -> new ResourceNotFoundException("Vision not found"));

        vision.setTitle(request.title());
        vision.setDescription(request.description());
        vision.setVisionType(request.visionType());
        vision.setTargetDate(request.targetDate());
        vision.setUpdatedAt(LocalDateTime.now());

        return visionMapper.toDto(visionRepository.save(vision));
    }

    @Override
    @Transactional
    public void deleteVision(Long id, String username) {
        Vision vision = visionRepository.findByIdAndUserUsername(id, username)
                .orElseThrow(() -> new ResourceNotFoundException("Vision not found"));
        visionRepository.delete(vision);
    }

    @Override
    public VisionDto getVision(Long id, String username) {
        Vision vision = visionRepository.findByIdAndUserUsername(id, username)
                .orElseThrow(() -> new ResourceNotFoundException("Vision not found"));
        return visionMapper.toDto(vision);
    }

    @Override
    public List<VisionDto> getAllVisions(String username) {
        return visionRepository.findByUserUsernameOrderByCreatedAtDesc(username).stream()
                .map(visionMapper::toDto)
                .collect(Collectors.toList());
    }
}
