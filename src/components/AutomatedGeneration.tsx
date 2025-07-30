import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { Zap, FileText, Download, Send, AlertCircle, ChevronRight, ChevronLeft, ChevronDown, BookOpen, Target, Info, CheckCircle, Search } from 'lucide-react';
import PDFPreview from './PDFPreview';
import ManualQuestionEntry from './ManualQuestionEntry';
import { Blueprint, QuestionShortage, QuestionType, AssessmentMode, ManualQuestion } from '@/types/assessment';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { debugService } from '@/services/debugService';

// Mock data for chapters and learning outcomes with cross-references
const mockChapters = [
  { 
    id: 'chapter1', 
    name: 'Algebra Basics', 
    description: 'Introduction to algebraic expressions and equations', 
    questionCount: 45,
    learningOutcomes: ['lo1', 'lo4']
  },
  { 
    id: 'chapter2', 
    name: 'Geometry Fundamentals', 
    description: 'Basic geometric shapes, properties, and theorems', 
    questionCount: 38,
    learningOutcomes: ['lo2', 'lo4']
  },
  { 
    id: 'chapter3', 
    name: 'Trigonometry', 
    description: 'Sine, cosine, tangent functions and applications', 
    questionCount: 32,
    learningOutcomes: ['lo1', 'lo4']
  },
  { 
    id: 'chapter4', 
    name: 'Statistics', 
    description: 'Data collection, analysis, and interpretation', 
    questionCount: 41,
    learningOutcomes: ['lo3', 'lo4']
  },
  { 
    id: 'chapter5', 
    name: 'Probability', 
    description: 'Basic probability concepts and calculations', 
    questionCount: 29,
    learningOutcomes: ['lo3', 'lo4']
  }
];

const mockLearningOutcomes = [
  { 
    id: 'lo1', 
    code: 'LO001', 
    title: 'Basic Arithmetic Operations', 
    description: 'Perform basic mathematical operations with accuracy', 
    questionCount: 52,
    chapters: ['chapter1', 'chapter3']
  },
  { 
    id: 'lo2', 
    code: 'LO002', 
    title: 'Geometric Shape Recognition', 
    description: 'Identify and classify various geometric shapes and their properties', 
    questionCount: 36,
    chapters: ['chapter2']
  },
  { 
    id: 'lo3', 
    code: 'LO003', 
    title: 'Data Analysis Skills', 
    description: 'Analyze and interpret data using statistical methods', 
    questionCount: 28,
    chapters: ['chapter4', 'chapter5']
  },
  { 
    id: 'lo4', 
    code: 'LO004', 
    title: 'Problem Solving Techniques', 
    description: 'Apply mathematical problem-solving strategies effectively', 
    questionCount: 44,
    chapters: ['chapter1', 'chapter2', 'chapter3', 'chapter4', 'chapter5']
  }
];

const AutomatedGeneration = () => {
  const { user } = useUser();
  const { toast } = useToast();
  
  // Debug log component initialization
  React.useEffect(() => {
    debugService.info('AutomatedGeneration component mounted', 'AutomatedGeneration', { 
      user: user?.name,
      role: user?.role 
    });
    return () => {
      debugService.info('AutomatedGeneration component unmounted', 'AutomatedGeneration');
    };
  }, [user]);

  const [currentStep, setCurrentStep] = useState(1);
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [selectedBlueprint, setSelectedBlueprint] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generatedPdf, setGeneratedPdf] = useState<string | null>(null);
  const [shortage, setShortage] = useState<QuestionShortage[]>([]);
  const [contentType, setContentType] = useState<'chapters' | 'learningOutcomes'>('chapters');
  const [chapterSearch, setChapterSearch] = useState('');
  const [loSearch, setLoSearch] = useState('');
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [expandedLOs, setExpandedLOs] = useState<Set<string>>(new Set());
  const [addedManualQuestions, setAddedManualQuestions] = useState<ManualQuestion[]>([]);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [blueprintPage, setBlueprintPage] = useState(1);
  const blueprintsPerPage = 6;

  const [formData, setFormData] = useState({
    title: '',
    grade: '',
    medium: 'English',
    subject: '',
    chapters: [] as string[],
    learningOutcomes: [] as string[],
    mode: 'FA' as AssessmentMode
  });

  const totalSteps = 3;
  const stepProgress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    fetchBlueprints();
  }, []);

  const fetchBlueprints = async () => {
    setLoading(true);
    try {
      // Add sample blueprints for mock flow
  const sampleBlueprints = [
        {
          id: 'sample-1',
          name: 'Quick Assessment Blueprint',
          total_questions: 15,
          total_marks: 75,
          duration: 45,
          allowed_question_types: ['MCQ', 'FITB', 'Match'] as QuestionType[],
          bloom_l1: 6,
          bloom_l2: 5,
          bloom_l3: 3,
          bloom_l4: 1,
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
          name: 'Comprehensive Test Blueprint',
          total_questions: 30,
          total_marks: undefined,
          duration: undefined,
          allowed_question_types: ['MCQ', 'FITB', 'Match', 'Arrange'] as QuestionType[],
          bloom_l1: 10,
          bloom_l2: 8,
          bloom_l3: 6,
          bloom_l4: 4,
          bloom_l5: 2,
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
        // Combine real data with sample blueprints (filter to only allowed question types)
        const filteredData = (data || []).map(bp => ({
          ...bp,
          allowed_question_types: bp.allowed_question_types.filter((type: string) => 
            ['MCQ', 'FITB', 'Match', 'Arrange'].includes(type)
          ) as QuestionType[]
        }));
        setBlueprints([...sampleBlueprints, ...filteredData]);
      }
    } catch (error) {
      console.error('Error fetching blueprints:', error);
      // Use sample blueprints as fallback
      setBlueprints([
        {
          id: 'sample-1',
          name: 'Quick Assessment Blueprint',
          total_questions: 15,
          total_marks: 75,
          duration: 45,
          allowed_question_types: ['MCQ', 'FITB', 'Match'] as QuestionType[],
          bloom_l1: 6,
          bloom_l2: 5,
          bloom_l3: 3,
          bloom_l4: 1,
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

  const handleGenerate = async () => {
    // Check for question shortages and handle manual additions
    const blueprint = blueprints.find(b => b.id === selectedBlueprint);
    if (blueprint) {
      const shortages = checkQuestionShortage(blueprint);
      if (shortages.length > 0) {
        setShortage(shortages);
        setShowManualEntry(true);
        return;
      }
    }

    await proceedWithGeneration();
  };

  const proceedWithGeneration = async () => {
    // Show success screen for mock flow
    setGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setGeneratedPdf('/generated-assessments/mock-assessment.pdf');
      setShowPDFPreview(true);
      setCurrentStep(3);
      
      const hasManualQuestions = addedManualQuestions.length > 0;
      toast({
        title: "Assessment Generated Successfully!",
        description: hasManualQuestions 
          ? `Your assessment has been created with ${addedManualQuestions.length} manually added questions. Manual questions won't be added to CLMS.`
          : "Your assessment has been created and is ready for download.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleManualQuestionsSave = (questions: ManualQuestion[]) => {
    setAddedManualQuestions(questions);
    setShortage([]);
    setShowManualEntry(false);
    
    // Proceed with generation including manual questions
    proceedWithGeneration();
  };

  const handleManualQuestionsCancel = () => {
    setShortage([]);
    setShowManualEntry(false);
    setAddedManualQuestions([]);
  };

  const checkQuestionShortage = (blueprint: Blueprint): QuestionShortage[] => {
    // Mock question counts available in the system for each question type
    // Reduced counts for "Less questions on CLMS test" blueprint to trigger shortage
    const availableQuestions = blueprint.name === 'Less questions on CLMS test' ? {
      'MCQ': 8,
      'FITB': 5,
      'Match': 2,
      'Arrange': 3
    } : {
      'MCQ': 25,
      'FITB': 15,
      'Match': 8,
      'Arrange': 10
    };

    const shortages: QuestionShortage[] = [];
    
    blueprint.allowed_question_types.forEach(type => {
      const required = Math.ceil(blueprint.total_questions / blueprint.allowed_question_types.length);
      const available = availableQuestions[type] || 0;
      
      if (required > available) {
        shortages.push({
          questionType: type,
          required,
          available,
          shortage: required - available
        });
      }
    });

    return shortages;
  };

  const handleDownload = () => {
    if (generatedPdf) {
      // Simulate PDF download
      toast({
        title: "Download Started",
        description: "Your assessment PDF is being downloaded",
      });
    }
  };

  const canProceedToStep2 = () => {
    return formData.title && formData.grade && formData.medium && formData.subject;
  };

  const canProceedToStep3 = () => {
    return (contentType === 'chapters' && formData.chapters.length > 0) ||
           (contentType === 'learningOutcomes' && formData.learningOutcomes.length > 0);
  };

  const canGenerate = () => {
    return selectedBlueprint && canProceedToStep2() && canProceedToStep3();
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleChapterExpand = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    const action = newExpanded.has(chapterId) ? 'collapsed' : 'expanded';
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
    
    const chapter = mockChapters.find(c => c.id === chapterId);
    debugService.debug(`Chapter ${action}: ${chapter?.name}`, 'AutomatedGeneration', {
      chapterId,
      chapterName: chapter?.name,
      action,
      relatedLOs: chapter?.learningOutcomes
    });
  };

  const handleLOExpand = (loId: string) => {
    const newExpanded = new Set(expandedLOs);
    const action = newExpanded.has(loId) ? 'collapsed' : 'expanded';
    if (newExpanded.has(loId)) {
      newExpanded.delete(loId);
    } else {
      newExpanded.add(loId);
    }
    setExpandedLOs(newExpanded);
    
    const lo = mockLearningOutcomes.find(l => l.id === loId);
    debugService.debug(`Learning Outcome ${action}: ${lo?.title}`, 'AutomatedGeneration', {
      loId,
      loTitle: lo?.title,
      loCode: lo?.code,
      action,
      relatedChapters: lo?.chapters
    });
  };

  // Generate mock questions for preview based on current form data and selected blueprint
  const mockQuestions = useMemo(() => {
    const questions = [];
    let questionNumber = 1;
    
    // Only generate questions if we have the minimum required data
    if (!formData.title || !selectedBlueprint) {
      return [];
    }
    
    const blueprint = blueprints.find(b => b.id === selectedBlueprint);
    if (!blueprint) return [];
    
    // Generate questions based on blueprint's Bloom's levels
    const bloomLevels = [
      { level: 'L1', count: blueprint.bloom_l1, name: 'Remember' },
      { level: 'L2', count: blueprint.bloom_l2, name: 'Understand' },
      { level: 'L3', count: blueprint.bloom_l3, name: 'Apply' },
      { level: 'L4', count: blueprint.bloom_l4, name: 'Analyze' },
      { level: 'L5', count: blueprint.bloom_l5, name: 'Evaluate' },
      { level: 'L6', count: blueprint.bloom_l6, name: 'Create' }
    ];
    
    bloomLevels.forEach(bloom => {
      for (let i = 0; i < bloom.count; i++) {
        const questionType = blueprint.allowed_question_types[i % blueprint.allowed_question_types.length] || 'MCQ';
        questions.push({
          id: `question-${questionNumber}`,
          questionNumber,
          questionStem: `Sample ${bloom.name} level question ${i + 1} - This is a placeholder question for ${questionType} type focusing on ${bloom.name} cognitive level.`,
          questionType,
          bloomLevel: parseInt(bloom.level.substring(1)),
          marks: blueprint.mode === 'SA' ? (bloom.level === 'L1' || bloom.level === 'L2' ? 1 : 2) : 1,
          chapter: formData.chapters[0] || 'Sample Chapter',
          topic: 'Sample Topic',
          options: questionType === 'MCQ' ? [
            'Option A - Sample answer choice',
            'Option B - Another choice',
            'Option C - Third option',
            'Option D - Fourth option'
          ] : undefined,
          answer: questionType === 'MCQ' ? 'Option A' : 'Sample Answer'
        });
        questionNumber++;
      }
    });
    
    return questions;
  }, [selectedBlueprint, blueprints, formData.title, formData.chapters]);

  const handleQuestionAction = (questionId: string, action: 'move-up' | 'move-down' | 'replace' | 'edit') => {
    // Handle question actions in preview
    console.log('Question action:', { questionId, action });
  };

  const selectedBlueprintData = blueprints.find(b => b.id === selectedBlueprint);
  const filteredBlueprints = blueprints.filter(blueprint => blueprint.mode === formData.mode);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
      {/* Left Panel - Form Steps */}
      <div className="space-y-6 overflow-y-auto">
        {/* Progress Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-xl">Quick Generation</CardTitle>
                <p className="text-muted-foreground text-sm">Create assessments quickly using pre-built blueprints</p>
              </div>
              <Badge variant="outline" className="text-sm">
                Step {currentStep} of {totalSteps}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className={currentStep >= 1 ? "text-primary font-medium" : "text-muted-foreground"}>Blueprint & Info</span>
                <span className={currentStep >= 2 ? "text-primary font-medium" : "text-muted-foreground"}>Content Selection</span>
                <span className={currentStep >= 3 ? "text-primary font-medium" : "text-muted-foreground"}>Generated</span>
              </div>
              <Progress value={stepProgress} className="h-2" />
            </div>
          </CardHeader>
        </Card>

      {/* Step 1: Assessment Information & Blueprint Selection */}
      {currentStep === 1 && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">1</div>
              <span>Assessment Information & Blueprint Selection</span>
            </CardTitle>
            <p className="text-muted-foreground">Provide basic assessment details and choose a pre-configured template</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Assessment Information Section - Moved to top */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <Label className="text-base font-medium">Assessment Information</Label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center space-x-1">
                    <span>Assessment Title</span>
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Science Unit Test"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade" className="flex items-center space-x-1">
                    <span>Grade</span>
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.grade} onValueChange={(value) => setFormData(prev => ({ ...prev, grade: value }))}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(grade => (
                        <SelectItem key={grade} value={grade.toString()}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medium" className="flex items-center space-x-1">
                    <span>Medium</span>
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.medium} onValueChange={(value) => setFormData(prev => ({ ...prev, medium: value }))}>
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Tamil">Tamil</SelectItem>
                      <SelectItem value="Telugu">Telugu</SelectItem>
                      <SelectItem value="Kannada">Kannada</SelectItem>
                      <SelectItem value="Malayalam">Malayalam</SelectItem>
                      <SelectItem value="Marathi">Marathi</SelectItem>
                      <SelectItem value="Gujarati">Gujarati</SelectItem>
                      <SelectItem value="Bengali">Bengali</SelectItem>
                      <SelectItem value="Punjabi">Punjabi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="flex items-center space-x-1">
                    <span>Subject</span>
                    <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.subject} onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Science">Science</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Social Science">Social Science</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Assessment Type Selection */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-primary" />
                <Label className="text-base font-medium">Assessment Type</Label>
              </div>
              <p className="text-sm text-muted-foreground">Configure the basic settings for your assessment including marks and duration</p>
              
              <RadioGroup 
                value={formData.mode} 
                onValueChange={(value: AssessmentMode) => {
                  setFormData(prev => ({ ...prev, mode: value }));
                  setSelectedBlueprint(''); // Reset blueprint selection when mode changes
                  setBlueprintPage(1); // Reset pagination when mode changes
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <Label htmlFor="fa-option" className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="FA" id="fa-option" />
                  <div>
                    <div className="font-medium">Formative Assessment (FA)/Practice Sheet</div>
                    <div className="text-sm text-muted-foreground">Regular classroom assessment for ongoing feedback</div>
                  </div>
                </Label>
                <Label htmlFor="sa-option" className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="SA" id="sa-option" />
                  <div>
                    <div className="font-medium">Summative Assessment (SA)/Evaluation Sheet</div>
                    <div className="text-sm text-muted-foreground">Formal evaluation with marks and duration</div>
                  </div>
                </Label>
              </RadioGroup>
            </div>

            <Separator className="my-6" />

            {/* Blueprint Selection Section */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Available Blueprints</Label>
              {filteredBlueprints.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredBlueprints
                      .slice((blueprintPage - 1) * blueprintsPerPage, blueprintPage * blueprintsPerPage)
                      .slice((blueprintPage - 1) * blueprintsPerPage, blueprintPage * blueprintsPerPage)
                      .map(blueprint => (
                        <div key={blueprint.id} className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50 ${
                          selectedBlueprint === blueprint.id ? 'border-primary bg-primary/5' : ''
                        }`} onClick={() => setSelectedBlueprint(blueprint.id)}>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <input
                                type="radio"
                                name="blueprint"
                                value={blueprint.id}
                                checked={selectedBlueprint === blueprint.id}
                                onChange={() => setSelectedBlueprint(blueprint.id)}
                                className="w-4 h-4"
                              />
                              <div className="font-medium">{blueprint.name}</div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {blueprint.total_questions} questions • {blueprint.allowed_question_types.join(', ')}
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <div className="flex flex-wrap gap-1">
                                {blueprint.total_marks && <span>{blueprint.total_marks} marks</span>}
                                {blueprint.duration && <span>{blueprint.duration} minutes</span>}
                              </div>
                              <Badge variant={blueprint.mode === 'SA' ? 'default' : 'secondary'} className="text-xs">
                                {blueprint.mode}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                  {blueprints.length > blueprintsPerPage && (
                    <div className="flex justify-center mt-6">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious 
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (blueprintPage > 1) setBlueprintPage(blueprintPage - 1);
                              }}
                              className={blueprintPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                            />
                          </PaginationItem>
                          {Array.from({ length: Math.ceil(filteredBlueprints.length / blueprintsPerPage) }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setBlueprintPage(page);
                                }}
                                isActive={page === blueprintPage}
                              >
                                {page}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                          <PaginationItem>
                            <PaginationNext 
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                if (blueprintPage < Math.ceil(filteredBlueprints.length / blueprintsPerPage)) setBlueprintPage(blueprintPage + 1);
                              }}
                              className={blueprintPage >= Math.ceil(filteredBlueprints.length / blueprintsPerPage) ? 'pointer-events-none opacity-50' : ''}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {blueprints.length > 0 
                    ? `No ${formData.mode} blueprints available`
                    : "No blueprints available"
                  }
                </div>
              )}
            </div>

            {selectedBlueprintData && (
              <div className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-sm">Selected: {selectedBlueprintData.name}</h4>
                  <Badge variant={selectedBlueprintData.mode === 'SA' ? 'default' : 'secondary'}>
                    {selectedBlueprintData.mode}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Questions:</span>
                    <span className="ml-1 font-medium">{selectedBlueprintData.total_questions}</span>
                  </div>
                  {selectedBlueprintData.mode === 'FA' && selectedBlueprintData.total_marks && (
                    <div>
                      <span className="text-muted-foreground">Marks:</span>
                      <span className="ml-1 font-medium">{selectedBlueprintData.total_marks}</span>
                    </div>
                  )}
                  {selectedBlueprintData.mode === 'FA' && selectedBlueprintData.duration && (
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="ml-1 font-medium">{selectedBlueprintData.duration}m</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Types:</span>
                    <span className="ml-1 font-medium text-xs">{selectedBlueprintData.allowed_question_types.join(', ')}</span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">Bloom's Levels: </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedBlueprintData.bloom_l1 > 0 && <Badge variant="outline" className="text-xs px-1 py-0">L1:{selectedBlueprintData.bloom_l1}</Badge>}
                    {selectedBlueprintData.bloom_l2 > 0 && <Badge variant="outline" className="text-xs px-1 py-0">L2:{selectedBlueprintData.bloom_l2}</Badge>}
                    {selectedBlueprintData.bloom_l3 > 0 && <Badge variant="outline" className="text-xs px-1 py-0">L3:{selectedBlueprintData.bloom_l3}</Badge>}
                    {selectedBlueprintData.bloom_l4 > 0 && <Badge variant="outline" className="text-xs px-1 py-0">L4:{selectedBlueprintData.bloom_l4}</Badge>}
                    {selectedBlueprintData.bloom_l5 > 0 && <Badge variant="outline" className="text-xs px-1 py-0">L5:{selectedBlueprintData.bloom_l5}</Badge>}
                    {selectedBlueprintData.bloom_l6 > 0 && <Badge variant="outline" className="text-xs px-1 py-0">L6:{selectedBlueprintData.bloom_l6}</Badge>}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button 
                onClick={nextStep}
                disabled={!selectedBlueprint || !canProceedToStep2()}
                className="flex items-center space-x-2"
              >
                <span>Next: Content Selection</span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Content Selection */}
      {currentStep === 2 && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">2</div>
              <span>Content Selection</span>
            </CardTitle>
            <p className="text-muted-foreground">Select the chapters or learning outcomes for your assessment</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">How would you like to choose content?</Label>
              <RadioGroup 
                value={contentType} 
                onValueChange={(value: 'chapters' | 'learningOutcomes') => {
                  setContentType(value);
                  setFormData(prev => ({ ...prev, chapters: [], learningOutcomes: [] }));
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <Label htmlFor="chapters-option" className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="chapters" id="chapters-option" />
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <div>
                      <div className="font-medium">By Chapters</div>
                      <div className="text-sm text-muted-foreground">Pick chapters from your syllabus</div>
                    </div>
                  </div>
                </Label>
                <Label htmlFor="los-option" className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="learningOutcomes" id="los-option" />
                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-medium">By Learning Outcomes</div>
                      <div className="text-sm text-muted-foreground">Pick specific learning outcomes to test</div>
                    </div>
                  </div>
                </Label>
              </RadioGroup>
            </div>

            {contentType === 'chapters' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <Label className="text-base font-medium">Select Chapters</Label>
                    <Badge variant="outline" className="text-xs">
                      {formData.chapters.length} selected
                    </Badge>
                  </div>
                  <Input
                    placeholder="Search chapters..."
                    value={chapterSearch}
                    onChange={(e) => setChapterSearch(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
                <div className="grid gap-3">
                  {mockChapters
                    .filter(chapter => chapter.name.toLowerCase().includes(chapterSearch.toLowerCase()) || 
                                     chapter.description.toLowerCase().includes(chapterSearch.toLowerCase()))
                    .map(chapter => (
                    <Collapsible key={chapter.id} open={expandedChapters.has(chapter.id)} onOpenChange={() => handleChapterExpand(chapter.id)}>
                      <div className="border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-3 p-3">
                          <CollapsibleTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-8 h-8 p-0 hover:bg-muted border-muted-foreground/20"
                            >
                              {expandedChapters.has(chapter.id) ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="sr-only">Toggle skills</span>
                            </Button>
                          </CollapsibleTrigger>
                          <div className="flex-1">
                            <div className="font-medium">{chapter.name}</div>
                            <div className="text-sm text-muted-foreground">{chapter.description}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {chapter.questionCount} questions
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {chapter.learningOutcomes.length} skills
                              </Badge>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            id={chapter.id}
                            checked={formData.chapters.includes(chapter.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                // Add chapter and all its related LOs
                                const newChapters = [...formData.chapters, chapter.id];
                                const newLOs = [...new Set([...formData.learningOutcomes, ...chapter.learningOutcomes])];
                                setFormData(prev => ({ 
                                  ...prev, 
                                  chapters: newChapters,
                                  learningOutcomes: newLOs
                                }));
                              } else {
                                // Remove chapter and check if any LOs should be removed
                                const newChapters = formData.chapters.filter(id => id !== chapter.id);
                                // Keep LOs that are still referenced by remaining selected chapters
                                const remainingLOs = new Set();
                                newChapters.forEach(chId => {
                                  const ch = mockChapters.find(c => c.id === chId);
                                  if (ch) ch.learningOutcomes.forEach(loId => remainingLOs.add(loId));
                                });
                                const newLOs = formData.learningOutcomes.filter(loId => remainingLOs.has(loId));
                                setFormData(prev => ({ 
                                  ...prev, 
                                  chapters: newChapters,
                                  learningOutcomes: newLOs
                                }));
                              }
                            }}
                            className="w-4 h-4"
                          />
                        </div>
                        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                          <div className="px-3 pb-3 border-t bg-muted/30">
                            <div className="text-xs font-medium text-muted-foreground mt-2 mb-1">
                              Related Skills:
                            </div>
                            {mockLearningOutcomes
                              .filter(lo => chapter.learningOutcomes.includes(lo.id))
                              .map(lo => (
                                <div key={lo.id} className="flex items-center justify-between text-xs mb-1 p-2 rounded hover:bg-muted/50">
                                  <div className="flex items-center space-x-2 flex-1">
                                    <input
                                      type="checkbox"
                                      id={`${chapter.id}-${lo.id}`}
                                      checked={formData.learningOutcomes.includes(lo.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setFormData(prev => ({ 
                                            ...prev, 
                                            learningOutcomes: [...prev.learningOutcomes, lo.id] 
                                          }));
                                        } else {
                                          setFormData(prev => ({ 
                                            ...prev, 
                                            learningOutcomes: prev.learningOutcomes.filter(id => id !== lo.id) 
                                          }));
                                        }
                                      }}
                                      className="w-3 h-3"
                                    />
                                    <span className={formData.learningOutcomes.includes(lo.id) ? "font-medium text-primary" : ""}>
                                      {lo.code}: {lo.title}
                                    </span>
                                  </div>
                                  <span className="text-muted-foreground">{lo.questionCount} questions</span>
                                </div>
                              ))
                            }
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ))}
                </div>
              </div>
            )}

            {contentType === 'learningOutcomes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-green-600" />
                    <Label className="text-base font-medium">Select Learning Outcomes</Label>
                    <Badge variant="outline" className="text-xs">
                      {formData.learningOutcomes.length} selected
                    </Badge>
                  </div>
                  <Input
                    placeholder="Search learning outcomes..."
                    value={loSearch}
                    onChange={(e) => setLoSearch(e.target.value)}
                    className="max-w-xs"
                  />
                </div>
                <div className="grid gap-3">
                  {mockLearningOutcomes
                    .filter(lo => lo.title.toLowerCase().includes(loSearch.toLowerCase()) || 
                                 lo.description.toLowerCase().includes(loSearch.toLowerCase()) ||
                                 lo.code.toLowerCase().includes(loSearch.toLowerCase()))
                    .map(lo => (
                    <Collapsible key={lo.id} open={expandedLOs.has(lo.id)} onOpenChange={() => handleLOExpand(lo.id)}>
                      <div className="border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-3 p-3">
                          <CollapsibleTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-8 h-8 p-0 hover:bg-muted border-muted-foreground/20"
                            >
                              {expandedLOs.has(lo.id) ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="sr-only">Toggle topics</span>
                            </Button>
                          </CollapsibleTrigger>
                          <div className="flex-1">
                            <div className="font-medium">{lo.code} - {lo.title}</div>
                            <div className="text-sm text-muted-foreground">{lo.description}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {lo.questionCount} questions
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {lo.chapters.length} topics
                              </Badge>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            id={lo.id}
                            checked={formData.learningOutcomes.includes(lo.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                // Add LO and all its related chapters
                                const newLOs = [...formData.learningOutcomes, lo.id];
                                const newChapters = [...new Set([...formData.chapters, ...lo.chapters])];
                                setFormData(prev => ({ 
                                  ...prev, 
                                  learningOutcomes: newLOs,
                                  chapters: newChapters
                                }));
                              } else {
                                // Remove LO and check if any chapters should be removed
                                const newLOs = formData.learningOutcomes.filter(id => id !== lo.id);
                                // Keep chapters that still have at least one selected LO
                                const remainingChapters = new Set();
                                newLOs.forEach(loId => {
                                  const learningOutcome = mockLearningOutcomes.find(l => l.id === loId);
                                  if (learningOutcome) learningOutcome.chapters.forEach(chId => remainingChapters.add(chId));
                                });
                                const newChapters = formData.chapters.filter(chId => remainingChapters.has(chId));
                                setFormData(prev => ({ 
                                  ...prev, 
                                  learningOutcomes: newLOs,
                                  chapters: newChapters
                                }));
                              }
                            }}
                            className="w-4 h-4"
                          />
                        </div>
                        <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                          <div className="px-3 pb-3 border-t bg-muted/30">
                            <div className="text-xs font-medium text-muted-foreground mt-2 mb-1">
                              Related Topics:
                            </div>
                            {mockChapters
                              .filter(ch => lo.chapters.includes(ch.id))
                              .map(ch => (
                                <div key={ch.id} className="flex items-center justify-between text-xs mb-1 p-2 rounded hover:bg-muted/50">
                                  <div className="flex items-center space-x-2 flex-1">
                                    <input
                                      type="checkbox"
                                      id={`${lo.id}-${ch.id}`}
                                      checked={formData.chapters.includes(ch.id)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setFormData(prev => ({ 
                                            ...prev, 
                                            chapters: [...prev.chapters, ch.id] 
                                          }));
                                        } else {
                                          setFormData(prev => ({ 
                                            ...prev, 
                                            chapters: prev.chapters.filter(id => id !== ch.id) 
                                          }));
                                        }
                                      }}
                                      className="w-3 h-3"
                                    />
                                    <span className={formData.chapters.includes(ch.id) ? "font-medium text-primary" : ""}>
                                      {ch.name}
                                    </span>
                                  </div>
                                  <span className="text-muted-foreground">{ch.questionCount} questions</span>
                                </div>
                              ))
                            }
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={prevStep} className="flex items-center space-x-2">
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>
              <Button 
                onClick={handleGenerate}
                disabled={!canGenerate() || generating}
                className="flex items-center space-x-2"
                size="lg"
              >
                <Zap className="w-4 h-4" />
                <span>{generating ? 'Generating...' : 'Generate Assessment'}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual Question Entry Modal */}
      {showManualEntry && shortage.length > 0 && (
        <ManualQuestionEntry 
          shortages={shortage}
          onSave={handleManualQuestionsSave}
          onCancel={handleManualQuestionsCancel}
        />
      )}

      {/* Step 3: Generated Assessment with PDF Preview */}
      {currentStep === 3 && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">3</div>
              <span>Assessment Generated</span>
            </CardTitle>
            <p className="text-muted-foreground">Your assessment has been generated and is ready for download</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Assessment Generated Successfully!</strong> Your assessment is ready for download. 
                Click on any question to edit, move, or replace it. No review required.
              </AlertDescription>
            </Alert>

            <PDFPreview
            title={formData.title}
            questions={[
              {
                id: '1',
                questionNumber: 1,
                questionStem: 'What is the square root of 144?',
                questionType: 'MCQ',
                bloomLevel: 1,
                marks: 1,
                chapter: 'Number Systems',
                topic: 'Square Roots',
                options: ['10', '12', '14', '16'],
                answer: '12'
              },
              {
                id: '2',
                questionNumber: 2,
                questionStem: 'If x + 5 = 12, what is the value of x?',
                questionType: 'FITB',
                bloomLevel: 2,
                marks: 2,
                chapter: 'Linear Equations',
                topic: 'Simple Equations'
              },
              {
                id: '3',
                questionNumber: 3,
                questionStem: 'Explain the concept of photosynthesis and its importance in the ecosystem.',
                questionType: 'Short-Answer',
                bloomLevel: 3,
                marks: 5,
                chapter: 'Plant Biology',
                topic: 'Photosynthesis'
              }
            ]}
            onDownload={handleDownload}
            onQuestionAction={(questionId, action) => {
              const actionLabels = {
                'move-up': 'moved up',
                'move-down': 'moved down', 
                'replace': 'replaced',
                'edit': 'edited'
              };
              toast({
                title: `Question ${actionLabels[action]}`,
                description: `Question ${questionId} ${actionLabels[action]} successfully`,
              });
            }}
            />

            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setCurrentStep(1);
                  setGeneratedPdf(null);
                  setShowPDFPreview(false);
                  setShortage([]);
                  setAddedManualQuestions([]);
                  setFormData({
                    title: '',
                    grade: '',
                    medium: 'English',
                    subject: '',
                    chapters: [],
                    learningOutcomes: [],
                    mode: 'FA' as AssessmentMode
                  });
                  setSelectedBlueprint('');
                }}
              >
                Create Another Assessment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      </div>

      {/* Right Panel - Real-time Preview */}
      <div className="overflow-y-auto">
        <PDFPreview
          title={formData.title || 'Assessment Preview'}
          questions={mockQuestions}
          onDownload={handleDownload}
          onQuestionAction={handleQuestionAction}
          documentType='assessment'
        />
      </div>
    </div>
  );
};

export default AutomatedGeneration;