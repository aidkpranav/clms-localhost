import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  FileText, 
  Download, 
  Edit, 
  ArrowUpDown, 
  RotateCcw, 
  CheckCircle, 
  Eye,
  Move,
  RefreshCw,
  Plus,
  X
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { debugService } from '@/services/debugService';

interface Question {
  id: string;
  questionNumber: number;
  questionStem: string;
  questionType: string;
  bloomLevel: number;
  marks: number;
  chapter: string;
  topic: string;
  options?: string[];
  answer?: string;
}

interface ExtraField {
  label: string;
  value: string;
}

interface Theme {
  id: string;
  state_name: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  button_color: string;
}

interface PDFPreviewProps {
  title: string;
  questions: Question[];
  onDownload: () => void;
  onQuestionAction: (questionId: string, action: 'move-up' | 'move-down' | 'replace' | 'edit') => void;
  documentType?: 'assessment' | 'worksheet';
}

const PDFPreview: React.FC<PDFPreviewProps> = ({ 
  title, 
  questions, 
  onDownload, 
  onQuestionAction,
  documentType = 'assessment'
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showQuestionDialog, setShowQuestionDialog] = useState(false);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [extraFields, setExtraFields] = useState<ExtraField[]>([
    { label: 'Name', value: '' },
    { label: 'Roll No.', value: '' },
    { label: 'Class', value: '' },
    { label: 'Section', value: '' },
    { label: 'Date', value: '' },
    { label: 'Signature', value: '' }
  ]);
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [customInstructions, setCustomInstructions] = useState([
    'Please read the instructions carefully.',
    `This Question Paper consists of ${questions.length} questions in two sections – Section A & Section B.`,
    'Section A has Objective type questions whereas Section B contains Subjective type questions.',
    'Out of the given questions, a candidate has to answer all questions in the allotted (maximum) time of 3 hours.',
    'All questions of a particular section must be attempted in the correct order.'
  ]);
  const [editingInstructions, setEditingInstructions] = useState(false);

  // Debug logging for component initialization
  React.useEffect(() => {
    debugService.info('PDFPreview component mounted', 'PDFPreview', {
      title,
      questionCount: questions.length,
      documentType,
      showExtraFields
    });
    return () => {
      debugService.info('PDFPreview component unmounted', 'PDFPreview');
    };
  }, [title, questions.length, documentType, showExtraFields]);

  const handleQuestionSelect = (question: Question) => {
    debugService.debug('Question selected for action', 'PDFPreview', {
      questionId: question.id,
      questionNumber: question.questionNumber,
      questionType: question.questionType,
      questionStem: question.questionStem.substring(0, 50) + '...'
    });
    setSelectedQuestion(question);
    setShowQuestionDialog(true);
  };

  const handleQuestionAction = (action: 'move-up' | 'move-down' | 'replace' | 'edit') => {
    if (selectedQuestion) {
      debugService.info(`Question action performed: ${action}`, 'PDFPreview', {
        questionId: selectedQuestion.id,
        questionNumber: selectedQuestion.questionNumber,
        action,
        questionType: selectedQuestion.questionType
      });
      onQuestionAction(selectedQuestion.id, action);
      setShowQuestionDialog(false);
    }
  };

  const handleDirectAction = (e: React.MouseEvent, question: Question, action: 'move-up' | 'move-down' | 'replace' | 'edit') => {
    e.stopPropagation();
    onQuestionAction(question.id, action);
  };

  useEffect(() => {
    fetchTheme();
  }, []);

  const fetchTheme = async () => {
    try {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setTheme(data);
      }
    } catch (error) {
      console.log('No theme found, using defaults');
    }
  };

  const addExtraField = () => {
    setExtraFields([...extraFields, { label: '', value: '' }]);
  };

  const removeExtraField = (index: number) => {
    setExtraFields(extraFields.filter((_, i) => i !== index));
  };

  const updateExtraField = (index: number, field: 'label' | 'value', value: string) => {
    const updated = [...extraFields];
    updated[index][field] = value;
    setExtraFields(updated);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-blue-600" />
            <div>
              <CardTitle>Assessment Preview</CardTitle>
              <p className="text-sm text-muted-foreground">
                {title} • {questions.length} questions
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-green-600 border-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              Ready for Download
            </Badge>
            <Button onClick={onDownload} className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Instructions for Teachers - Outside PDF Preview */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Instructions for Teachers:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Click on any question to modify, move, or replace it</li>
            <li>• Questions can be edited, moved to different positions, or replaced with similar questions</li>
            <li>• All changes maintain the assessment structure and difficulty balance</li>
          </ul>
        </div>

        {/* Student Details Toggle - Moved below instructions */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-blue-800">Student Details</h3>
              <p className="text-sm text-blue-600">Add space for student information on the assessment</p>
            </div>
            <div className="flex items-center space-x-3">
              <Label htmlFor="student-details-toggle" className="text-sm text-blue-700 font-medium">
                {showExtraFields ? 'Enabled' : 'Disabled'}
              </Label>
              <Switch
                id="student-details-toggle"
                checked={showExtraFields}
                onCheckedChange={(checked) => setShowExtraFields(checked)}
              />
            </div>
          </div>
          
          {showExtraFields && (
            <div className="space-y-3">
              <div className="text-sm text-blue-700 mb-2">
                Customize what information students should fill in:
              </div>
              
              {extraFields.map((field, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder="e.g., Student Name, Class, Roll Number"
                    value={field.label}
                    onChange={(e) => updateExtraField(index, 'label', e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeExtraField(index)}
                    disabled={extraFields.length <= 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={addExtraField}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add More Fields
              </Button>
            </div>
          )}
        </div>

        {/* Edit Instructions Section */}
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-green-800">General Instructions</h3>
              <p className="text-sm text-green-600">Customize the instructions that appear on the assessment</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingInstructions(!editingInstructions)}
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              <Edit className="w-4 h-4 mr-2" />
              {editingInstructions ? 'Save Instructions' : 'Edit Instructions'}
            </Button>
          </div>
          
          {editingInstructions && (
            <div className="space-y-3">
              {customInstructions.map((instruction, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="font-semibold text-green-700 mt-2">{index + 1}.</span>
                  <Textarea
                    value={instruction}
                    onChange={(e) => {
                      const updated = [...customInstructions];
                      updated[index] = e.target.value;
                      setCustomInstructions(updated);
                    }}
                    className="flex-1 min-h-[60px]"
                    placeholder="Enter instruction..."
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const updated = customInstructions.filter((_, i) => i !== index);
                      setCustomInstructions(updated);
                    }}
                    disabled={customInstructions.length <= 1}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCustomInstructions([...customInstructions, ''])}
                className="mt-2"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Instruction
              </Button>
            </div>
          )}
        </div>

        {/* PDF Preview Area */}
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-6 min-h-[500px]">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto font-serif">
            {/* Header with State Branding */}
            <div className="border-b pb-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                {theme?.logo_url ? (
                  <img 
                    src={theme.logo_url} 
                    alt={`${theme.state_name} Logo`} 
                    className="h-16 w-auto"
                  />
                ) : (
                  <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                )}
                
                <div className="text-right">
                  <h2 className="text-lg font-semibold text-gray-700">
                    {theme?.state_name || 'Swift Chat CLMS'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {documentType === 'worksheet' ? 'Practice Worksheet' : 'Assessment Paper'}
                  </p>
                </div>
              </div>
            </div>

            {/* Title Section */}
            <div className="text-center border-b-2 border-black pb-6 mb-6">
              <h1 className="text-xl font-bold uppercase tracking-wider mb-2">
                {title} (SUBJECT CODE - XXX)
              </h1>
              <div className="bg-gray-200 py-2 px-4 mx-auto inline-block rounded">
                <h2 className="text-lg font-semibold">
                  SAMPLE PAPER FOR CLASS XII (SESSION 2024-2025)
                </h2>
              </div>
            </div>

            {/* Time and Marks */}
            <div className="flex justify-between mb-6 text-sm font-semibold">
              <div>
                <strong>Max. Time: 3 Hours</strong>
              </div>
              <div>
                <strong>Max. Marks: {questions.reduce((sum, q) => sum + q.marks, 0)}</strong>
              </div>
            </div>

            {/* Student Details - positioned at the top */}
            {showExtraFields && (
              <div className="mb-6 p-4 border border-gray-400">
                <h4 className="font-bold mb-3">Student Details:</h4>
                <div className="grid grid-cols-2 gap-4">
                  {extraFields.map((field, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm font-medium min-w-[80px]">{field.label}:</span>
                      <div className="border-b border-black flex-1 h-6"></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* General Instructions */}
            <div className="mb-6">
              <h3 className="font-bold text-base mb-3">General Instructions:</h3>
              <div className="space-y-2 text-sm">
                {customInstructions.map((instruction, index) => (
                  <div key={index} className="flex">
                    <span className="font-semibold mr-2">{index + 1}.</span>
                    <span>{instruction}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Headers and Questions */}
            <ScrollArea className="h-96">
              <div className="space-y-6">
                {/* Section A Header */}
                <div className="mb-4">
                  <h3 className="font-bold text-base text-center uppercase tracking-wider">
                    SECTION A: OBJECTIVE TYPE QUESTIONS
                  </h3>
                </div>

                {/* Questions Table */}
                <div className="border border-black">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-black p-2 text-center font-bold w-16">Q. No.</th>
                        <th className="border border-black p-2 text-center font-bold">QUESTION</th>
                        <th className="border border-black p-2 text-center font-bold w-20">Marks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {questions.map((question, index) => (
                        <tr 
                          key={question.id}
                          className="hover:bg-gray-50 cursor-pointer transition-colors group"
                          onClick={() => handleQuestionSelect(question)}
                        >
                          <td className="border border-black p-3 text-center font-semibold align-top">
                            Q.{question.questionNumber}
                          </td>
                          <td className="border border-black p-3 align-top relative">
                            <div className="mb-2">
                              <span className="font-medium">{question.questionStem}</span>
                              {question.questionType === 'MCQ' && question.options && (
                                <div className="mt-2 space-y-1">
                                  {question.options.map((option, idx) => (
                                    <div key={idx} className="ml-4">
                                      <span className="font-medium">
                                        {String.fromCharCode(97 + idx)}) 
                                      </span>
                                      <span className="ml-2">{option}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            
                            {/* Action buttons - only visible on hover */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="flex items-center space-x-1 bg-white border rounded shadow-sm p-1">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="p-1 h-6 w-6"
                                  onClick={(e) => handleDirectAction(e, question, 'move-up')}
                                  title="Move Up"
                                >
                                  <ArrowUpDown className="w-3 h-3 rotate-180" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="p-1 h-6 w-6"
                                  onClick={(e) => handleDirectAction(e, question, 'move-down')}
                                  title="Move Down"
                                >
                                  <ArrowUpDown className="w-3 h-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="p-1 h-6 w-6"
                                  onClick={(e) => handleDirectAction(e, question, 'replace')}
                                  title="Replace Question"
                                >
                                  <RefreshCw className="w-3 h-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="p-1 h-6 w-6"
                                  onClick={(e) => handleDirectAction(e, question, 'edit')}
                                  title="Edit Question"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </td>
                          <td className="border border-black p-3 text-center font-semibold align-top">
                            {question.marks}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>


        {/* Question Action Dialog */}
        <Dialog open={showQuestionDialog} onOpenChange={setShowQuestionDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Question Actions</DialogTitle>
            </DialogHeader>
            
            {selectedQuestion && (
              <div className="space-y-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium mb-1">
                    Question {selectedQuestion.questionNumber}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedQuestion.questionStem.substring(0, 100)}...
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={() => handleQuestionAction('edit')}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Question Content
                  </Button>
                  
                  <Button 
                    onClick={() => handleQuestionAction('move-up')}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <ArrowUpDown className="w-4 h-4 mr-2 rotate-180" />
                    Move Question Up
                  </Button>
                  
                  <Button 
                    onClick={() => handleQuestionAction('move-down')}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    Move Question Down
                  </Button>
                  
                  <Button 
                    onClick={() => handleQuestionAction('replace')}
                    className="w-full justify-start"
                    variant="outline"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Replace with Similar Question
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PDFPreview;