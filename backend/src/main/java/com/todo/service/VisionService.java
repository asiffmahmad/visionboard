package com.todo.service;

import com.todo.dto.VisionDto;
import com.todo.dto.VisionRequest;

import java.util.List;

public interface VisionService {
    VisionDto createVision(VisionRequest request, String username);
    VisionDto updateVision(Long id, VisionRequest request, String username);
    void deleteVision(Long id, String username);
    VisionDto getVision(Long id, String username);
    List<VisionDto> getAllVisions(String username);
}
