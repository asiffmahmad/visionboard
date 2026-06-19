import 'package:flutter/material.dart';
import '../../data/models/vision.dart';
import '../../data/repositories/vision_repository.dart';

class VisionViewModel extends ChangeNotifier {
  final VisionRepository _visionRepository;

  List<Vision> _visions = [];
  bool _isLoading = false;
  String? _errorMessage;

  VisionViewModel(this._visionRepository);

  List<Vision> get visions => _visions;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;

  Future<void> fetchVisions() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _visions = await _visionRepository.getAllVisions();
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createVision({
    required String title,
    required String description,
    required String visionType,
    required String targetDate,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final vision = Vision(
        title: title,
        description: description,
        visionType: visionType,
        targetDate: targetDate,
      );
      final created = await _visionRepository.createVision(vision);
      _visions.insert(0, created);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> updateVision(Vision vision) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final updated = await _visionRepository.updateVision(vision);
      final index = _visions.indexWhere((v) => v.id == vision.id);
      if (index != -1) {
        _visions[index] = updated;
      }
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<bool> deleteVision(int id) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      await _visionRepository.deleteVision(id);
      _visions.removeWhere((v) => v.id == id);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _errorMessage = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
}
