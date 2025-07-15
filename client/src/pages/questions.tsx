import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Trash2, Search, Plus, HelpCircle } from "lucide-react";
import QuestionForm from "@/components/question-form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Question } from "@shared/schema";

export default function Questions() {
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: questions = [], isLoading } = useQuery<Question[]>({
    queryKey: ["/api/questions"],
  });

  const createQuestionMutation = useMutation({
    mutationFn: async (data: { question: any; questionImage?: File; optionImages?: (File | null)[] }) => {
      let questionImageUrl = "";
      let optionImageUrls: string[] = [];

      // Upload question image if provided
      if (data.questionImage) {
        const formData = new FormData();
        formData.append("image", data.questionImage);
        const response = await apiRequest("POST", "/api/upload", formData);
        const result = await response.json();
        questionImageUrl = result.url;
      }

      // Upload option images if provided
      if (data.optionImages) {
        for (const image of data.optionImages) {
          if (image) {
            const formData = new FormData();
            formData.append("image", image);
            const response = await apiRequest("POST", "/api/upload", formData);
            const result = await response.json();
            optionImageUrls.push(result.url);
          } else {
            optionImageUrls.push("");
          }
        }
      }

      const questionData = {
        ...data.question,
        questionImage: questionImageUrl || undefined,
        optionImages: optionImageUrls.length > 0 ? optionImageUrls : undefined,
      };

      return apiRequest("POST", "/api/questions", questionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setShowForm(false);
      setEditingQuestion(null);
      toast({
        title: "Success",
        description: "Question created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create question",
        variant: "destructive",
      });
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/questions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Question deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete question",
        variant: "destructive",
      });
    },
  });

  const filteredQuestions = questions.filter((question) => {
    const matchesSearch = question.questionText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || question.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSubmit = (data: any, questionImage?: File, optionImages?: (File | null)[]) => {
    createQuestionMutation.mutate({ question: data, questionImage, optionImages });
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      deleteQuestionMutation.mutate(id);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Question Bank</h2>
          <p className="text-gray-600 mt-1">Create and manage your assessment questions</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Question
        </Button>
      </div>

      {showForm ? (
        <div className="mb-8">
          <QuestionForm
            question={editingQuestion || undefined}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingQuestion(null);
            }}
          />
        </div>
      ) : (
        <>
          {/* Filters */}
          <Card className="shadow-material mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search questions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                    <SelectItem value="descriptive">Descriptive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Questions List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="shadow-material">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredQuestions.length === 0 ? (
            <Card className="shadow-material">
              <CardContent className="p-12 text-center">
                <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm || filterType !== "all" 
                    ? "Try adjusting your search or filter criteria."
                    : "Get started by creating your first question."
                  }
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Question
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <Card key={question.id} className="shadow-material hover:shadow-material-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-lg font-medium text-gray-900 mb-3">
                          {question.questionText}
                        </p>
                        
                        {question.questionImage && (
                          <img
                            src={question.questionImage}
                            alt="Question"
                            className="w-32 h-20 object-cover rounded border mb-3"
                          />
                        )}

                        {question.type === "multiple-choice" && question.options && (
                          <div className="space-y-2 mb-4">
                            {question.options.map((option, index) => (
                              <div
                                key={index}
                                className={`p-2 rounded border text-sm ${
                                  index === question.correctAnswer
                                    ? "bg-success-50 border-success-300 text-success-800"
                                    : "bg-gray-50 border-gray-200"
                                }`}
                              >
                                <span className="font-medium">
                                  {String.fromCharCode(65 + index)}.
                                </span>{" "}
                                {option}
                                {index === question.correctAnswer && (
                                  <Badge className="ml-2 bg-success-500">Correct</Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center space-x-4">
                          <Badge 
                            variant={question.type === "multiple-choice" ? "default" : "secondary"}
                            className={question.type === "multiple-choice" ? "bg-primary-100 text-primary-800" : "bg-success-100 text-success-800"}
                          >
                            {question.type === "multiple-choice" ? "Multiple Choice" : "Descriptive"}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {question.points} {question.points === 1 ? "point" : "points"}
                          </span>
                          <span className="text-sm text-gray-500">
                            Created {new Date(question.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingQuestion(question);
                            setShowForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(question.id)}
                          disabled={deleteQuestionMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
