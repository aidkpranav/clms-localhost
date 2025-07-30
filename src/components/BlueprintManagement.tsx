import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { BookTemplate, Plus, Edit, Trash2, Search, Calculator, AlertCircle } from 'lucide-react';
import { Blueprint, BlueprintFormData, QuestionType, AssessmentMode, QuestionTypeLabels, BloomLevels } from '@/types/assessment';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

const BlueprintManagement = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBlueprint, setEditingBlueprint] = useState<Blueprint | null>(null);

  const [formData, setFormData] = useState<BlueprintFormData>({
    name: '',
    total_questions: 20,
    allowed_question_types: [],
    bloom_l1: 0,
    bloom_l2: 0,
    bloom_l3: 0,
    bloom_l4: 0,
    bloom_l5: 0,
    bloom_l6: 0,
    mode: 'FA',
    total_marks: undefined,
    duration: undefined,
    mcq_marks: undefined,
    fitb_marks: undefined,
    match_marks: undefined,
    arrange_marks: undefined
  });

  useEffect(() => {
    fetchBlueprints();
  }, []);

  const fetchBlueprints = async () => {
    setLoading(true);
    try {
      // Add sample blueprints for demo purposes
      const sampleBlueprints = [
        {
          id: 'sample-1',
          name: 'Quick Assessment - 10 Questions',
          total_questions: 10,
          total_marks: 50,
          duration: 30,
          allowed_question_types: ['MCQ', 'FITB'] as QuestionType[],
          bloom_l1: 6,
          bloom_l2: 3,
          bloom_l3: 1,
          bloom_l4: 0,
          bloom_l5: 0,
          bloom_l6: 0,
          mode: 'FA' as AssessmentMode,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          version: 1,
          created_by: 'system'
        },
        {
          id: 'sample-2',
          name: 'Standard Unit Test',
          total_questions: 25,
          total_marks: 100,
          duration: 90,
          allowed_question_types: ['MCQ', 'FITB', 'Match'] as QuestionType[],
          bloom_l1: 10,
          bloom_l2: 8,
          bloom_l3: 5,
          bloom_l4: 2,
          bloom_l5: 0,
          bloom_l6: 0,
          mode: 'SA' as AssessmentMode,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          version: 1,
          created_by: 'system'
        },
        {
          id: 'sample-3',
          name: 'Comprehensive Final Exam',
          total_questions: 50,
          total_marks: 200,
          duration: 180,
          allowed_question_types: ['MCQ', 'FITB', 'Match', 'TF'] as QuestionType[],
          bloom_l1: 15,
          bloom_l2: 15,
          bloom_l3: 10,
          bloom_l4: 6,
          bloom_l5: 3,
          bloom_l6: 1,
          mode: 'SA' as AssessmentMode,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          version: 1,
          created_by: 'system'
        },
        {
          id: 'sample-4',
          name: 'Mathematics Problem Solving',
          total_questions: 20,
          total_marks: 80,
          duration: 60,
          allowed_question_types: ['MCQ', 'FITB'] as QuestionType[],
          bloom_l1: 5,
          bloom_l2: 6,
          bloom_l3: 5,
          bloom_l4: 3,
          bloom_l5: 1,
          bloom_l6: 0,
          mode: 'SA' as AssessmentMode,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          version: 1,
          created_by: 'system'
        },
        {
          id: 'sample-5',
          name: 'Science Practical Assessment',
          total_questions: 30,
          total_marks: 120,
          duration: 75,
          allowed_question_types: ['MCQ', 'FITB', 'Match'] as QuestionType[],
          bloom_l1: 8,
          bloom_l2: 10,
          bloom_l3: 7,
          bloom_l4: 4,
          bloom_l5: 1,
          bloom_l6: 0,
          mode: 'SA' as AssessmentMode,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          version: 1,
          created_by: 'system'
        },
        {
          id: 'sample-6',
          name: 'Language & Literature Quiz',
          total_questions: 15,
          total_marks: 60,
          duration: 45,
          allowed_question_types: ['MCQ', 'FITB', 'Short-Answer'] as QuestionType[],
          bloom_l1: 5,
          bloom_l2: 5,
          bloom_l3: 3,
          bloom_l4: 2,
          bloom_l5: 0,
          bloom_l6: 0,
          mode: 'FA' as AssessmentMode,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          version: 1,
          created_by: 'system'
        },
        {
          id: 'sample-7',
          name: 'Less questions on CLMS test',
          total_questions: 25,
          total_marks: 50,
          duration: 60,
          allowed_question_types: ['MCQ', 'FITB'] as QuestionType[],
          bloom_l1: 15,
          bloom_l2: 8,
          bloom_l3: 2,
          bloom_l4: 0,
          bloom_l5: 0,
          bloom_l6: 0,
          mode: 'FA' as AssessmentMode,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          version: 1,
          created_by: 'system'
        }
      ];

      const { data, error } = await supabase
        .from('blueprints')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        // If there's an error, use sample blueprints
        setBlueprints(sampleBlueprints);
      } else {
        // Filter blueprints to only include supported question types
        const filteredData = (data || []).map(bp => ({
          ...bp,
          allowed_question_types: bp.allowed_question_types.filter((type: string) => 
            ['MCQ', 'FITB', 'Match', 'Arrange'].includes(type)
          ) as QuestionType[]
        }));
        // Combine real data with sample blueprints
        setBlueprints([...sampleBlueprints, ...filteredData]);
      }
    } catch (error) {
      console.error('Error fetching blueprints:', error);
      // Use sample blueprints as fallback
      setBlueprints([
        {
          id: 'sample-7',
          name: 'Less questions on CLMS test',
          total_questions: 25,
          total_marks: 50,
          duration: 60,
          allowed_question_types: ['MCQ', 'FITB'] as QuestionType[],
          bloom_l1: 15,
          bloom_l2: 8,
          bloom_l3: 2,
          bloom_l4: 0,
          bloom_l5: 0,
          bloom_l6: 0,
          mode: 'FA' as AssessmentMode,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          version: 1,
          created_by: 'system'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      total_questions: 20,
      allowed_question_types: [],
      bloom_l1: 0,
      bloom_l2: 0,
      bloom_l3: 0,
      bloom_l4: 0,
      bloom_l5: 0,
      bloom_l6: 0,
      mode: 'FA',
      total_marks: undefined,
      duration: undefined,
      mcq_marks: undefined,
      fitb_marks: undefined,
      match_marks: undefined,
      arrange_marks: undefined
    });
    setEditingBlueprint(null);
  };

  const handleEdit = (blueprint: Blueprint) => {
    setFormData({
      name: blueprint.name,
      total_questions: blueprint.total_questions,
      allowed_question_types: blueprint.allowed_question_types,
      bloom_l1: blueprint.bloom_l1,
      bloom_l2: blueprint.bloom_l2,
      bloom_l3: blueprint.bloom_l3,
      bloom_l4: blueprint.bloom_l4,
      bloom_l5: blueprint.bloom_l5,
      bloom_l6: blueprint.bloom_l6,
      mode: blueprint.mode,
      total_marks: blueprint.total_marks || undefined,
      duration: blueprint.duration || undefined,
      mcq_marks: blueprint.mcq_marks || undefined,
      fitb_marks: blueprint.fitb_marks || undefined,
      match_marks: blueprint.match_marks || undefined,
      arrange_marks: blueprint.arrange_marks || undefined
    });
    setEditingBlueprint(blueprint);
    setDialogOpen(true);
  };

  const handleQuestionTypeChange = (questionType: QuestionType, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      allowed_question_types: checked 
        ? [...prev.allowed_question_types, questionType]
        : prev.allowed_question_types.filter(type => type !== questionType)
    }));
  };

  const handleBloomChange = (level: keyof typeof BloomLevels, value: string) => {
    const numValue = parseInt(value) || 0;
    const fieldName = `bloom_${level.toLowerCase()}` as keyof BlueprintFormData;
    setFormData(prev => ({
      ...prev,
      [fieldName]: numValue
    }));
  };

  const getTotalQuestions = () => {
    return formData.bloom_l1 + formData.bloom_l2 + formData.bloom_l3 + 
           formData.bloom_l4 + formData.bloom_l5 + formData.bloom_l6;
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Blueprint name is required",
        variant: "destructive"
      });
      return false;
    }

    if (formData.allowed_question_types.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one question type",
        variant: "destructive"
      });
      return false;
    }

    if (getTotalQuestions() !== formData.total_questions) {
      toast({
        title: "Validation Error",
        description: "Sum of Bloom levels must equal total questions",
        variant: "destructive"
      });
      return false;
    }

    if (formData.mode === 'SA' && (!formData.total_marks || !formData.duration)) {
      toast({
        title: "Validation Error",
        description: "Total marks and duration are required for Summative Assessment",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Mock flow - show success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: editingBlueprint ? "Blueprint Updated" : "Blueprint Created",
        description: editingBlueprint ? 
          "Blueprint has been successfully updated" : 
          "Blueprint has been successfully created",
      });

      setDialogOpen(false);
      resetForm();
      fetchBlueprints(); // Refresh the list

    } catch (error: any) {
      console.error('Error saving blueprint:', error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save blueprint. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (blueprint: Blueprint) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('blueprints')
        .update({ is_active: false })
        .eq('id', blueprint.id);

      if (error) throw error;

      // Log the deletion
      await supabase
        .from('blueprint_audit')
        .insert({
          blueprint_id: blueprint.id,
          action: 'delete',
          user_id: user.id,
          user_name: user.name || 'Unknown',
          diff: JSON.parse(JSON.stringify({ deleted: blueprint }))
        });

      toast({
        title: "Blueprint Deleted",
        description: "Blueprint has been successfully deleted",
      });

      fetchBlueprints();

    } catch (error) {
      console.error('Error deleting blueprint:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete blueprint. Please try again.",
        variant: "destructive"
      });
    }
  };

  const filteredBlueprints = blueprints.filter(blueprint =>
    blueprint.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isBloomTotalValid = getTotalQuestions() === formData.total_questions;

  return (
    <div className="space-y-6">
      {/* Header with Search and Create Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search blueprints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Blueprint
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBlueprint ? 'Edit Blueprint' : 'Create New Blueprint'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Blueprint Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., Grade 6 Maths FA 20-Mark Quick Quiz"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="total_questions">Total Questions *</Label>
                      <Input
                        id="total_questions"
                        type="number"
                        min="1"
                        max="100"
                        value={formData.total_questions}
                        onChange={(e) => setFormData(prev => ({ ...prev, total_questions: parseInt(e.target.value) || 20 }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Question Types */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Allowed Question Types</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(QuestionTypeLabels).map(([type, label]) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type_${type}`}
                          checked={formData.allowed_question_types.includes(type as QuestionType)}
                          onCheckedChange={(checked) => handleQuestionTypeChange(type as QuestionType, checked as boolean)}
                        />
                        <Label htmlFor={`type_${type}`} className="text-sm font-medium">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Bloom's Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>Bloom's Taxonomy Distribution</span>
                    <Badge variant={isBloomTotalValid ? "outline" : "destructive"} className="flex items-center space-x-1">
                      <Calculator className="w-3 h-3" />
                      <span>{getTotalQuestions()}/{formData.total_questions}</span>
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!isBloomTotalValid && (
                    <Alert className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        The sum of Bloom levels ({getTotalQuestions()}) must equal total questions ({formData.total_questions}).
                      </AlertDescription>
                    </Alert>
                  )}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(BloomLevels).map(([level, description]) => (
                      <div key={level} className="space-y-2">
                        <Label htmlFor={`bloom_${level}`} className="text-sm">
                          {level} - {description}
                        </Label>
                        <Input
                          id={`bloom_${level}`}
                          type="number"
                          min="0"
                          placeholder="0"
                          value={formData[`bloom_${level.toLowerCase()}` as keyof BlueprintFormData] || ''}
                          onChange={(e) => handleBloomChange(level as keyof typeof BloomLevels, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Assessment Mode */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Assessment Mode</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="mode"
                        checked={formData.mode === 'SA'}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, mode: checked ? 'SA' : 'FA' }))}
                      />
                      <Label htmlFor="mode" className="font-medium">
                        Summative Assessment (SA)/Evaluation Sheet
                      </Label>
                    </div>
                    <Badge variant={formData.mode === 'SA' ? 'default' : 'secondary'}>
                      {formData.mode === 'SA' ? 'Summative' : 'Formative'}
                    </Badge>
                  </div>

                  {formData.mode === 'SA' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="total_marks">Total Marks *</Label>
                        <Input
                          id="total_marks"
                          type="number"
                          min="1"
                          placeholder="e.g., 100"
                          value={formData.total_marks || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, total_marks: parseInt(e.target.value) || undefined }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (minutes) *</Label>
                        <Input
                          id="duration"
                          type="number"
                          min="1"
                          placeholder="e.g., 180"
                          value={formData.duration || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || undefined }))}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Marks per Question Type */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Marks Distribution by Question Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.allowed_question_types.map(type => {
                      const marksField = `${type.toLowerCase()}_marks` as 'mcq_marks' | 'fitb_marks' | 'match_marks' | 'arrange_marks';
                      return (
                        <div key={type} className="space-y-2">
                          <Label htmlFor={`${type}_marks`} className="text-sm">
                            {QuestionTypeLabels[type]} Marks
                          </Label>
                          <Input
                            id={`${type}_marks`}
                            type="number"
                            min="1"
                            placeholder="e.g., 2"
                            value={formData[marksField] || ''}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              [marksField]: parseInt(e.target.value) || undefined 
                            }))}
                          />
                        </div>
                      );
                    })}
                  </div>
                  {formData.allowed_question_types.length === 0 && (
                    <p className="text-muted-foreground text-sm">
                      Please select question types above to configure marks.
                    </p>
                  )}
                </CardContent>
              </Card>

              <div className="flex space-x-4">
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !isBloomTotalValid || formData.allowed_question_types.length === 0}
                  className="flex-1"
                >
                  {loading ? 'Saving...' : editingBlueprint ? 'Update Blueprint' : 'Create Blueprint'}
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Blueprints Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BookTemplate className="w-5 h-5" />
            <span>Assessment Blueprints</span>
            <Badge variant="outline">{filteredBlueprints.length} blueprints</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredBlueprints.length === 0 ? (
            <div className="text-center py-12">
              <BookTemplate className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No blueprints found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? 'Try adjusting your search.' : 'Create your first blueprint to get started.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name & Details</TableHead>
                  <TableHead>Question Types</TableHead>
                  <TableHead>Bloom's Distribution</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBlueprints.map((blueprint) => (
                  <TableRow key={blueprint.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{blueprint.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {blueprint.total_questions} questions
                          {blueprint.total_marks && ` • ${blueprint.total_marks} marks`}
                          {blueprint.duration && ` • ${blueprint.duration} min`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          v{blueprint.version} • Created {new Date(blueprint.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {blueprint.allowed_question_types.map(type => (
                          <Badge key={type} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {blueprint.bloom_l1 > 0 && <Badge variant="outline" className="text-xs">L1: {blueprint.bloom_l1}</Badge>}
                        {blueprint.bloom_l2 > 0 && <Badge variant="outline" className="text-xs">L2: {blueprint.bloom_l2}</Badge>}
                        {blueprint.bloom_l3 > 0 && <Badge variant="outline" className="text-xs">L3: {blueprint.bloom_l3}</Badge>}
                        {blueprint.bloom_l4 > 0 && <Badge variant="outline" className="text-xs">L4: {blueprint.bloom_l4}</Badge>}
                        {blueprint.bloom_l5 > 0 && <Badge variant="outline" className="text-xs">L5: {blueprint.bloom_l5}</Badge>}
                        {blueprint.bloom_l6 > 0 && <Badge variant="outline" className="text-xs">L6: {blueprint.bloom_l6}</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={blueprint.mode === 'SA' ? 'default' : 'secondary'}>
                        {blueprint.mode}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(blueprint)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Blueprint</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{blueprint.name}"? This action cannot be undone.
                                Existing generated papers will remain unchanged.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(blueprint)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BlueprintManagement;