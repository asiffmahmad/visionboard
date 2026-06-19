import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../../viewmodels/goal_viewmodel.dart';
import '../../../core/theme/colors.dart';

class CreateGoalView extends StatefulWidget {
  final int visionId;

  const CreateGoalView({Key? key, required this.visionId}) : super(key: key);

  @override
  State<CreateGoalView> createState() => _CreateGoalViewState();
}

class _CreateGoalViewState extends State<CreateGoalView> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  String _selectedType = 'MONTHLY';
  DateTime _selectedDate = DateTime.now().add(const Duration(days: 90));

  @override
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    super.dispose();
  }

  void _save() async {
    if (_formKey.currentState!.validate()) {
      final success = await Provider.of<GoalViewModel>(context, listen: false).createGoal(
        title: _titleController.text.trim(),
        description: _descController.text.trim(),
        goalType: _selectedType,
        targetDate: DateFormat('yyyy-MM-dd').format(_selectedDate),
        visionId: widget.visionId,
      );

      if (success && mounted) {
        Navigator.pop(context);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final goalVm = Provider.of<GoalViewModel>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Add Goal Target'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(
                  labelText: 'Goal Title',
                  hintText: 'e.g. Complete AWS Developer Associate Course',
                ),
                validator: (val) {
                  if (val == null || val.isEmpty) return 'Title is required';
                  return null;
                },
              ),
              const SizedBox(height: 16),
              TextFormField(
                controller: _descController,
                decoration: const InputDecoration(
                  labelText: 'Description',
                  hintText: 'e.g. Cover IAM, EC2, S3, DynamoDB and serverless modules.',
                ),
                maxLines: 3,
              ),
              const SizedBox(height: 16),
              DropdownButtonFormField<String>(
                value: _selectedType,
                decoration: const InputDecoration(labelText: 'Goal Deadline Type'),
                items: const [
                  DropdownMenuItem(value: 'SHORT_TERM', child: Text('Short Term')),
                  DropdownMenuItem(value: 'LONG_TERM', child: Text('Long Term')),
                  DropdownMenuItem(value: 'DAILY', child: Text('Daily')),
                  DropdownMenuItem(value: 'WEEKLY', child: Text('Weekly')),
                  DropdownMenuItem(value: 'MONTHLY', child: Text('Monthly')),
                  DropdownMenuItem(value: 'YEARLY', child: Text('Yearly')),
                  DropdownMenuItem(value: 'LIFETIME', child: Text('Lifetime')),
                ],
                onChanged: (val) {
                  if (val != null) {
                    setState(() {
                      _selectedType = val;
                    });
                  }
                },
              ),
              const SizedBox(height: 16),
              ListTile(
                title: const Text('Target Completion Date'),
                subtitle: Text(DateFormat('yyyy-MM-dd').format(_selectedDate)),
                trailing: const Icon(Icons.calendar_today),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                  side: BorderSide(color: Theme.of(context).dividerColor),
                ),
                onTap: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: _selectedDate,
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 365 * 5)),
                  );
                  if (picked != null) {
                    setState(() {
                      _selectedDate = picked;
                    });
                  }
                },
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: goalVm.isLoading ? null : _save,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: goalVm.isLoading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(strokeWidth: 2, valueColor: AlwaysStoppedAnimation(Colors.white)),
                      )
                    : const Text('Save Goal', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
